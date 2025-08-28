import { Component, ElementRef, WritableSignal, computed, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { PlayerStateService } from '../shared/player-state.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { TestimonialCardComponent } from '../components/testimonial-card/testimonial-card';
import { DataService } from '../shared/data.service';
import { HeaderComponent } from '../header/header';  

type Lecture = { id: string; title: string; duration: string; type: 'video'|'pdf'|'text'; src?: string; pdfUrl?: string; textContent?: string; };
type Section = { title: string; summary: string; lectures: Lecture[] };
type LearnData = { courseId: string; title: string; sections: Section[] };

@Component({
  selector: 'app-learn-player',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, AsyncPipe, TestimonialCardComponent,HeaderComponent],
  templateUrl: './learn-player.html',
  styleUrls: ['./learn-player.scss']
})
export class LearnPlayerComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  private state = inject(PlayerStateService);
  private ds = inject(DataService);

  // route params
  courseId = this.route.snapshot.params['courseId'];
  lectureId = this.route.snapshot.params['lectureId'];

  // data
  data = signal<LearnData | null>(null);
  details$ = this.ds.getCourseBySlug(this.courseId);   // reuse Overview/Author/Testimonials

  // UI/tabs
  tab: WritableSignal<'overview'|'author'|'testimonials'> = signal('overview');

  // current playing lecture
  current: WritableSignal<Lecture | null> = signal(null);
  pdfSafeUrl: WritableSignal<SafeResourceUrl | null> = signal(null);

  // video element refs + state
  videoRef = viewChild<ElementRef<HTMLVideoElement>>('videoEl');
  playing = signal(false);
  duration = signal(0);
  currentTime = signal(0);
  volume = signal(0.9);
  rate = signal(1);

  // right panel expand state (section accordion)
  expanded = signal<Record<number, boolean>>({});

  constructor() {
    // load learn json (per course)
    this.http.get<LearnData>(`assets/data/learn-${this.courseId}.json`).subscribe(d => {
      this.data.set(d);

      // select the requested lecture, or fallback to first
      const first = d.sections[0]?.lectures[0];
      const found = d.sections.flatMap(s => s.lectures).find(l => l.id === this.lectureId) || first;
      this.setLecture(found!);

      // expand first section by default
      this.expanded.set({0: true});
    });
  }

  setLecture(lec: Lecture) {
    if (!lec) return;
    this.current.set(lec);

    // persist route
    this.router.navigate(['/learn', this.courseId, 'lecture', lec.id], { replaceUrl: true });

    // set viewers per type
    if (lec.type === 'pdf' && lec.pdfUrl) {
      this.pdfSafeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(lec.pdfUrl));
    } else {
      this.pdfSafeUrl.set(null);
    }

    // resume time if video
    if (lec.type === 'video' && lec.src) {
      // let the <video> load, then set currentTime
      setTimeout(() => {
        const v = this.videoRef()?.nativeElement;
        if (v) {
          v.pause();
          v.currentTime = this.state.lastTime(this.courseId, lec.id);
          v.playbackRate = this.rate();
          v.volume = this.volume();
          this.playing.set(false);
        }
      });
    }
  }

  /* ========== custom controls ========== */
  togglePlay() {
    const v = this.videoRef()?.nativeElement;
    if (!v) return;
    if (v.paused) { v.play(); this.playing.set(true); }
    else { v.pause(); this.playing.set(false); }
  }

  onLoadedMetadata() {
    const v = this.videoRef()?.nativeElement;
    if (!v) return;
    this.duration.set(v.duration || 0);
  }

  onTimeUpdate() {
    const v = this.videoRef()?.nativeElement;
    if (!v || !this.current()) return;
    this.currentTime.set(v.currentTime || 0);
    // persist
    this.state.set(this.courseId, this.current()!.id, { lastTime: v.currentTime });
  }

  onScrub(ev: Event) {
    const v = this.videoRef()?.nativeElement;
    const val = +(ev.target as HTMLInputElement).value;
    if (v) { v.currentTime = val; this.currentTime.set(val); }
  }

  setRate(r: number) {
    this.rate.set(r);
    const v = this.videoRef()?.nativeElement; if (v) v.playbackRate = r;
  }

  setVolume(vol: number) {
    this.volume.set(vol);
    const v = this.videoRef()?.nativeElement; if (v) v.volume = vol;
  }

  fullScreen() {
    const el = this.videoRef()?.nativeElement?.parentElement;
    if (el && el.requestFullscreen) el.requestFullscreen();
  }

  markCompleted(lec: Lecture) {
    this.state.set(this.courseId, lec.id, { completed: true });
  }

  isCompleted(lec: Lecture): boolean {
    return this.state.isCompleted(this.courseId, lec.id);
  }

  toggleSection(i: number) {
    const map = { ...this.expanded() }; map[i] = !map[i]; this.expanded.set(map);
  }

  fmt(t: number): string {
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2,'0')}`;
  }

  // convenience
  sections = computed(() => this.data()?.sections || []);
}

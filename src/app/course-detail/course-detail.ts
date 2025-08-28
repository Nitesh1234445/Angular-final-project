import { Component, WritableSignal, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../shared/data.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { TestimonialCardComponent } from '../components/testimonial-card/testimonial-card';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe, NgFor, NgIf, TestimonialCardComponent],
  templateUrl: './course-detail.html',
  styleUrls: ['./course-detail.scss']
})
export class CourseDetailComponent {
  private route = inject(ActivatedRoute);
  private ds = inject(DataService);

  course$ = this.ds.getCourseBySlug(this.route.snapshot.params['slug'] || 'google-data-analytics-course-1');
  related$ = this.ds.getRelatedCourses();

  // tabs
  tab: WritableSignal<'overview'|'content'|'author'|'testimonials'> = signal('overview');

  // accordion expand state per section index
  expanded = signal<Record<number, boolean>>({});

  toggleTab(t: 'overview'|'content'|'author'|'testimonials') { this.tab.set(t); }
  toggleSection(i: number) {
    const m = { ...this.expanded() }; m[i] = !m[i]; this.expanded.set(m);
  }
  expandAll(sections: any[]) {
    const all: Record<number, boolean> = {};
    sections.forEach((_, i) => all[i] = true);
    this.expanded.set(all);
  }
}

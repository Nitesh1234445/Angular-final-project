import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../shared/data.service';
import { debounceTime, distinctUntilChanged, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnDestroy {
  q = new FormControl('');
  suggestions: string[] = [];
  showDrop = false;
  private sub: Subscription;

  constructor(private ds: DataService) {
    this.sub = this.q.valueChanges!.pipe(
      debounceTime(150),
      distinctUntilChanged()
    ).subscribe(v => {
      const term = (v || '').toLowerCase().trim();
      this.ds.suggestions().subscribe(list => {
        this.suggestions = term ? list.filter(s => s.toLowerCase().includes(term)).slice(0, 6) : [];
      });
    });
  }

  clear() { this.q.setValue(''); this.suggestions = []; }
  toggleDrop() { this.showDrop = !this.showDrop; }
  pick(s: string) { this.q.setValue(s); this.suggestions = []; }

  ngOnDestroy() { this.sub?.unsubscribe(); }
}

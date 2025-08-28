import { Component, EventEmitter, Output, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

type GroupKey = 'duration' | 'rating' | 'published' | 'level' | 'author' | 'topics';

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filter-sidebar.html',
  styleUrls: ['./filter-sidebar.scss']
})
export class FilterSidebarComponent {
  @Output() filtersChange = new EventEmitter<any>();
  Math = Math;

  open: Record<GroupKey, WritableSignal<boolean>> = {
    duration: signal(true),
    rating: signal(true),
    published: signal(true),
    level: signal(true),
    author: signal(true),
    topics: signal(true)
  };

  durationOptions = [
    { id: 'all', label: 'All', count: 160, type: 'radio' },
    { id: '<1w', label: '< 1 week', count: 10, type: 'radio' },
    { id: '1-4w', label: '1 - 4 weeks', count: 20, type: 'radio' },
    { id: '1-3m', label: '1 - 3 Months', count: 30, type: 'radio' },
    { id: '3-6m', label: '3 - 6 Months', count: 50, type: 'radio' },
    { id: '6-12m', label: '6 - 12 Months', count: 50, type: 'radio' }
  ];
  ratingOptions = [
    { id: 'all', label: 'All', stars: 0, text: '', count: 120 },
    { id: '4.5', label: '4.5 & up', stars: 4.5, text: '4.5 & up', count: 20 },
    { id: '4.0', label: '4 & up', stars: 4.0, text: '4 & up', count: 30 },
    { id: '3.5', label: '3.5 & up', stars: 3.5, text: '3.5 & up', count: 20 },
    { id: '3.0', label: '3 & up', stars: 3.0, text: '3 & up', count: 50 }
  ];
  publishedOptions = [
    { id: 'all', label: 'All', count: 110, type: 'radio' },
    { id: 'week', label: 'This week', count: 10, type: 'radio' },
    { id: 'month', label: 'This Month', count: 20, type: 'radio' },
    { id: '6m', label: 'Last 6 Months', count: 30, type: 'radio' },
    { id: 'year', label: 'This year', count: 50, type: 'radio' }
  ];
  levelOptions = [
    { id: 'beginner', label: 'Beginner', count: 60 },
    { id: 'intermediate', label: 'Intermediate', count: 55 },
    { id: 'advanced', label: 'Advanced', count: 45 }
  ];
  authorOptions = [
    { id: 'harry', label: 'Harry Shimron', count: 12 },
    { id: 'anu', label: 'Anu Bhatt', count: 9 },
    { id: 'ritu', label: 'Ritu Malviya', count: 15 }
  ];
  topicOptions = [
    { id: 'python', label: 'Python', count: 40 },
    { id: 'bigdata', label: 'Big Data', count: 26 },
    { id: 'sql', label: 'SQL', count: 24 },
    { id: 'ml', label: 'Machine Learning', count: 30 }
  ];

  form!: FormGroup<{
    duration: FormControl<string>;
    rating: FormControl<string>;
    published: FormControl<string>;
    level: FormControl<string[]>;
    author: FormControl<string[]>;
    topics: FormControl<string[]>;
  }>;

  constructor(private fb: NonNullableFormBuilder) {
    this.form = this.fb.group({
      duration: this.fb.control('all'),
      rating: this.fb.control('all'),
      published: this.fb.control('all'),
      level: this.fb.control<string[]>([]),
      author: this.fb.control<string[]>([]),
      topics: this.fb.control<string[]>([])
    });

    this.form.valueChanges.subscribe(v => this.filtersChange.emit(v));
  }

  toggle(key: GroupKey) { this.open[key].set(!this.open[key]()); }

  isChecked(arrName: 'level' | 'author' | 'topics', id: string): boolean {
    const arr = this.form.controls[arrName].value || [];
    return Array.isArray(arr) && arr.includes(id);
  }
  onToggleArray(arrName: 'level' | 'author' | 'topics', id: string) {
    const set = new Set(this.form.controls[arrName].value || []);
    set.has(id) ? set.delete(id) : set.add(id);
    this.form.controls[arrName].setValue(Array.from(set));
  }

  clearAll() {
    this.form.reset({
      duration: 'all',
      rating: 'all',
      published: 'all',
      level: [],
      author: [],
      topics: []
    });
  }
}

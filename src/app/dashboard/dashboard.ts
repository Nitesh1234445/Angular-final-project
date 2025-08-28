
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';   
import { HeaderComponent } from '../header/header';
import { StatCardComponent } from '../components/stat-card/stat-card';
import { CourseCardComponent } from '../components/course-card/course-card';
import { BlogCardComponent } from '../components/blog-card/blog-card';
import { DataService } from '../shared/data.service';
import { AsyncPipe, NgFor } from '@angular/common';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

// 👇 NEW: filter sidebar
import { FilterSidebarComponent } from '../components/filter-sidebar/filter-sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, HeaderComponent, StatCardComponent,
    CourseCardComponent, BlogCardComponent, AsyncPipe, NgFor,
    FilterSidebarComponent,RouterModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  stats$!: Observable<any[]>;
  lastViewed$!: Observable<any[]>;
  newlyLaunched$!: Observable<any[]>;
  blogs$!: Observable<any[]>;

  // 👇 NEW: combined results for the right panel next to the filter
  results$!: Observable<any[]>;
  selectedFilters: any = {};

  constructor(private ds: DataService) {
    this.stats$ = this.ds.stats();
    this.lastViewed$ = this.ds.lastViewed();
    this.newlyLaunched$ = this.ds.newlyLaunched();
    this.blogs$ = this.ds.blogs();

    // 👇 simple mock results: concat lastViewed + newlyLaunched (twice to fill the grid nicely)
    this.results$ = combineLatest([this.lastViewed$, this.newlyLaunched$]).pipe(
      map(([a, b]) => [...a, ...b, ...a, ...b])
    );
  }

  // 👇 will be used later to actually filter results
  onFilters(f: any) {
    this.selectedFilters = f;
    // TODO: apply f to results$ (when you want real filtering)
  }
}

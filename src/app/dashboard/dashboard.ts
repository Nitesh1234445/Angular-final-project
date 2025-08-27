import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header';
import { StatCardComponent } from '../components/stat-card/stat-card';
import { CourseCardComponent } from '../components/course-card/course-card';
import { BlogCardComponent } from '../components/blog-card/blog-card';
import { DataService } from '../shared/data.service';
import { AsyncPipe, NgFor } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, HeaderComponent, StatCardComponent,
    CourseCardComponent, BlogCardComponent, AsyncPipe, NgFor
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  stats$!: Observable<any[]>;
  lastViewed$!: Observable<any[]>;
  newlyLaunched$!: Observable<any[]>;
  blogs$!: Observable<any[]>;

  constructor(private ds: DataService) {
    this.stats$ = this.ds.stats();
    this.lastViewed$ = this.ds.lastViewed();
    this.newlyLaunched$ = this.ds.newlyLaunched();
    this.blogs$ = this.ds.blogs();
  }
}

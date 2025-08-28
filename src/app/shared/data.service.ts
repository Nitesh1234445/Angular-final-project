import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private db$ = this.http.get<any>('assets/data/db.json').pipe(shareReplay(1));

  suggestions(): Observable<string[]> { return this.db$.pipe(map(d => d.suggestions)); }
  stats(): Observable<any[]> { return this.db$.pipe(map(d => d.stats)); }
  lastViewed(): Observable<any[]> { return this.db$.pipe(map(d => d.lastViewed)); }
  newlyLaunched(): Observable<any[]> { return this.db$.pipe(map(d => d.newlyLaunched)); }
  blogs(): Observable<any[]> { return this.db$.pipe(map(d => d.blogs)); }

  getCourseBySlug(slug: string) {
  // We have one sample file; in real app we'd fetch by slug.
  return this.http.get<any>('assets/data/course-details.json');
}

getRelatedCourses() {
  return this.http.get<any>('assets/data/course-details.json').pipe(map(d => d.related));
}

}

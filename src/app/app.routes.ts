import { Routes } from '@angular/router';

import { SignInComponent } from './auth/sign-in/sign-in';
import { SignUpComponent } from './auth/sign-up/sign-up';
import { DashboardComponent } from './dashboard/dashboard';
import { CourseDetailComponent } from './course-detail/course-detail';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  { path: 'auth/login', component: SignInComponent, title: 'Sign In' },
  { path: 'auth/register', component: SignUpComponent, title: 'Sign Up' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
  { path: 'course/:slug', component: CourseDetailComponent, title: 'Course Details' },
  { path: '**', redirectTo: 'auth/login' }
];

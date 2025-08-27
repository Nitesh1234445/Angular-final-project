import { Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in';
import { SignUpComponent } from './auth/sign-up/sign-up';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  { path: 'auth/login', component: SignInComponent, title: 'Sign In' },
  { path: 'auth/register', component: SignUpComponent, title: 'Sign Up' },
  { path: '**', redirectTo: 'auth/login' }
];

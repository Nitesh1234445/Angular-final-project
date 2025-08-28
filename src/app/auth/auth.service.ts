import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router) {}

  // very simple demo state
  currentUser = signal<{ username: string; email: string } | null>(null);

  register(dto: RegisterDto) {
    // simulate API by storing in localStorage
    const db = JSON.parse(localStorage.getItem('users-db') || '[]');
    const exists = db.some((u: any) => u.username === dto.username || u.email === dto.email);
    if (exists) throw new Error('User already exists');
    db.push({ username: dto.username, email: dto.email, password: dto.password });
    localStorage.setItem('users-db', JSON.stringify(db));
    return true;
  }

  login(usernameOrEmail: string, password: string, remember = false) {
    const db = JSON.parse(localStorage.getItem('users-db') || '[]');
    const user = db.find((u: any) =>
      (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
    );
    if (!user) throw new Error('Invalid credentials');

    this.currentUser.set({ username: user.username, email: user.email });
    const key = remember ? 'auth-remember' : 'auth-session';
    localStorage.setItem(key, JSON.stringify(this.currentUser()));
    return true;
  }

  logout() {
    // clear auth state
    this.currentUser.set(null);
    localStorage.removeItem('auth-session');
    localStorage.removeItem('auth-remember');

    // redirect to HOME page
    this.router.navigate(['/']); // if your root redirects to login, that's fine too
    // If you prefer explicitly: this.router.navigate(['/auth/login']);
  }
}

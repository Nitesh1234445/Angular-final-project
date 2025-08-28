import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlayerStateService {
  private key(courseId: string) { return `learn_progress:${courseId}`; }

  /** Returns a map of lectureId -> { completed: boolean, lastTime: number } */
  get(courseId: string): Record<string, { completed?: boolean; lastTime?: number }> {
    try {
      return JSON.parse(localStorage.getItem(this.key(courseId)) || '{}');
    } catch { return {}; }
  }

  set(courseId: string, lectureId: string, patch: Partial<{completed: boolean; lastTime: number}>) {
    const map = this.get(courseId);
    map[lectureId] = { ...(map[lectureId] || {}), ...patch };
    localStorage.setItem(this.key(courseId), JSON.stringify(map));
  }

  isCompleted(courseId: string, lectureId: string): boolean {
    return !!this.get(courseId)[lectureId]?.completed;
  }

  lastTime(courseId: string, lectureId: string): number {
    return this.get(courseId)[lectureId]?.lastTime || 0;
  }
}

import { Injectable, signal } from '@angular/core';
import { ConsultationRequest, MoodboardCanvasItem } from '../models/interior.models';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly FAVORITES_KEY = 'aura_interior_favorites';
  private readonly BOOKINGS_KEY = 'aura_interior_bookings';
  private readonly THEME_KEY = 'aura_interior_theme';
  private readonly MOODBOARD_KEY = 'aura_interior_moodboard';

  favorites = signal<string[]>(this.loadFavorites());
  theme = signal<'light' | 'dark'>(this.loadTheme());
  bookings = signal<ConsultationRequest[]>(this.loadBookings());

  constructor() {
    this.applyTheme(this.theme());
  }

  // --- Favorites Management ---
  private loadFavorites(): string[] {
    try {
      const data = localStorage.getItem(this.FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  isFavorite(projectId: string): boolean {
    return this.favorites().includes(projectId);
  }

  toggleFavorite(projectId: string): boolean {
    const current = this.favorites();
    let updated: string[];
    let added = false;

    if (current.includes(projectId)) {
      updated = current.filter(id => id !== projectId);
    } else {
      updated = [...current, projectId];
      added = true;
    }

    this.favorites.set(updated);
    try {
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
    return added;
  }

  clearFavorites(): void {
    this.favorites.set([]);
    localStorage.removeItem(this.FAVORITES_KEY);
  }

  // --- Bookings Management ---
  private loadBookings(): ConsultationRequest[] {
    try {
      const data = localStorage.getItem(this.BOOKINGS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveBooking(booking: ConsultationRequest): void {
    const current = this.bookings();
    const updated = [booking, ...current];
    this.bookings.set(updated);
    try {
      localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  // --- Theme Management ---
  private loadTheme(): 'light' | 'dark' {
    try {
      const saved = localStorage.getItem(this.THEME_KEY) as 'light' | 'dark' | null;
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }

  toggleTheme(): 'light' | 'dark' {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    this.applyTheme(next);
    try {
      localStorage.setItem(this.THEME_KEY, next);
    } catch (e) {
      console.warn('Theme storage failed:', e);
    }
    return next;
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  // --- Moodboard State ---
  saveMoodboard(items: MoodboardCanvasItem[]): void {
    try {
      localStorage.setItem(this.MOODBOARD_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Moodboard save failed:', e);
    }
  }

  loadMoodboard(): MoodboardCanvasItem[] | null {
    try {
      const data = localStorage.getItem(this.MOODBOARD_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}

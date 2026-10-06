import { Component, HostListener, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { InteriorService } from '../../services/interior.service';
import { RoomCategoryId } from '../../models/interior.models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header 
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [class.scrolled-header]="isScrolled()"
      [class.default-header]="!isScrolled()">
      
      <!-- 1. Top Enterprise Utility / Announcement Bar -->
      <div class="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-md hidden lg:block transition-all duration-300 py-1.5 px-6 text-xs text-[var(--text-muted)]">
        <div class="container-custom flex items-center justify-between">
          
          <!-- Global Presence & Live Metrics -->
          <div class="flex items-center gap-6">
            <span class="flex items-center gap-1.5 font-medium tracking-wider text-[var(--text-main)] uppercase text-[0.68rem]">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Studios: Mumbai • Delhi NCR • Bengaluru • Hyderabad • Pune
            </span>
            <span class="text-[var(--border-medium)]">|</span>
            <span class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <span>48+ Curated Architectural Spaces & HD Image Packs</span>
            </span>
            <span class="text-[var(--border-medium)]">|</span>
            <span class="text-[var(--color-secondary)] font-medium">Bespoke Architectural Execution & Precision Joinery</span>
          </div>

          <!-- Quick Access Tools & Theme -->
          <div class="flex items-center gap-5">
            <a href="#estimator" class="hover:text-[var(--color-secondary)] transition-colors flex items-center gap-1">
              <svg class="w-3 h-3 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <span>Scope & Material Planner</span>
            </a>
            
            <a [href]="'tel:' + contactNumber" class="hover:text-[var(--color-secondary)] transition-colors flex items-center gap-1 font-medium text-[var(--text-main)]" [title]="'Call ' + contactNumber">
              <svg class="w-3 h-3 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span>{{ contactNumber }}</span>
            </a>

            <a [href]="whatsappUrl" target="_blank" rel="noopener noreferrer" class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors flex items-center gap-1 font-medium" title="Chat on WhatsApp">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.52 3.48A11.84 11.84 0 0012.08 0C5.53 0 .2 5.33.2 11.88c0 2.09.55 4.13 1.59 5.92L.1 24l6.34-1.66a11.86 11.86 0 005.64 1.43h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.18-1.24-6.16-3.45-8.41zM12.09 21.77h-.01a9.85 9.85 0 01-5.02-1.38l-.36-.21-3.76.99 1-3.67-.23-.38a9.87 9.87 0 01-1.51-5.24C2.2 6.98 6.63 2.55 12.08 2.55c2.64 0 5.12 1.03 6.99 2.91a9.82 9.82 0 012.9 7c0 5.45-4.43 9.88-9.88 9.88zm5.42-7.4c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-1.77-.89-2.93-1.58-4.1-3.58-.31-.54.31-.5.89-1.67.1-.2.05-.37-.03-.52-.08-.15-.68-1.64-.93-2.25-.25-.59-.5-.51-.68-.52h-.58c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.09 4.49 1.89.82 2.63.89 3.57.75.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/>
              </svg>
              <span>WhatsApp</span>
            </a>

            <!-- Theme Toggle -->
            <button 
              (click)="storageService.toggleTheme()" 
              class="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors focus:outline-none"
              [title]="storageService.theme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
              aria-label="Toggle theme">
              <svg *ngIf="storageService.theme() === 'dark'" class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <svg *ngIf="storageService.theme() === 'light'" class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
              <span class="text-[0.7rem] uppercase tracking-wider font-semibold">{{ storageService.theme() === 'dark' ? 'Light' : 'Dark' }}</span>
            </button>
          </div>

        </div>
      </div>

      <!-- 2. Master Navigation Bar -->
      <div class="glass-nav border-b border-[var(--border-subtle)] px-4 sm:px-6 lg:px-8">
        <div class="container-custom flex items-center justify-between h-20 transition-all duration-300" [class.h-16]="isScrolled()">
          
          <!-- Left: Brand Identity & Logo -->
          <div class="flex items-center gap-8">
            <a href="#hero" class="flex items-center gap-3.5 group text-decoration-none">
              <img src="js-logo.svg" alt="" aria-hidden="true" class="w-11 h-11 rounded-xl shadow-lg ring-1 ring-[var(--border-gold)] group-hover:scale-105 transition-all duration-300">
              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <span class="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)] leading-none">
                    JS ENTERPRICES
                  </span>
                  <span class="inline-block px-1.5 py-0.5 rounded text-[0.6rem] font-bold tracking-widest uppercase bg-[var(--color-secondary)]/15 text-[var(--color-secondary)] border border-[var(--color-secondary)]/30">
                    STUDIO
                  </span>
                </div>
                <span class="text-[0.65rem] tracking-[0.2em] font-semibold text-[var(--text-muted)] uppercase block mt-1">
                  ARCHITECTURAL INTERIORS
                </span>
              </div>
            </a>
          </div>

          <!-- Center: Enterprise Navigation Dropdowns -->
          <nav class="hidden lg:flex items-center gap-1 xl:gap-2">
            
            <!-- Dropdown 1: Spaces & Categories (Mega Menu) -->
            <div class="relative" (mouseenter)="openMegaMenu('spaces')" (mouseleave)="closeMegaMenu('spaces')">
              <button 
                type="button"
                (click)="toggleMegaMenu('spaces')"
                class="px-3.5 py-2 rounded-lg text-sm font-medium text-[var(--text-main)] hover:bg-[var(--border-subtle)]/50 transition-all flex items-center gap-1.5 group focus:outline-none">
                <span class="group-hover:text-[var(--color-secondary)] transition-colors">Spaces & Sectors</span>
                <span class="px-1.5 py-0.2 rounded-full text-[0.65rem] bg-[var(--color-secondary)]/15 text-[var(--color-secondary)] font-bold">9</span>
                <svg class="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-transform duration-200" [class.rotate-180]="activeMegaMenu() === 'spaces'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- Spaces Mega Menu Dropdown -->
              <div 
                *ngIf="activeMegaMenu() === 'spaces'"
                class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[820px] glass-panel rounded-2xl shadow-2xl border border-[var(--border-subtle)] p-6 animate-fade-in z-50">
                
                <div class="grid grid-cols-12 gap-6">
                  
                  <!-- Left 8 cols: Category Links Grid -->
                  <div class="col-span-8">
                    <div class="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)]">
                      <span class="text-xs font-bold uppercase tracking-widest text-[var(--color-secondary)]">Architectural Spaces Directory</span>
                      <a href="#categories" (click)="closeAll()" class="text-xs font-semibold text-[var(--text-main)] hover:text-[var(--color-secondary)] transition-colors">
                        View All Showcase →
                      </a>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-2.5">
                      <div 
                        *ngFor="let cat of interiorService.categories"
                        (click)="onCategoryClick(cat.id)"
                        class="p-2.5 rounded-xl hover:bg-[var(--border-subtle)]/60 transition-all cursor-pointer group flex items-start gap-3">
                        <div class="w-8 h-8 rounded-lg bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-secondary)] group-hover:text-[var(--color-primary)] transition-all">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                          </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--color-secondary)] transition-colors truncate">
                              {{ cat.name }}
                            </span>
                            <span class="text-[0.65rem] text-[var(--text-muted)]">{{ cat.projectCount }} designs</span>
                          </div>
                          <p class="text-[0.68rem] text-[var(--text-muted)] line-clamp-1 mt-0.5 leading-snug">
                            {{ cat.shortDesc }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right 4 cols: Feature Card & Direct HD Download Action -->
                  <div class="col-span-4 bg-[var(--bg-surface-subtle)] rounded-xl p-4 flex flex-col justify-between border border-[var(--border-subtle)]">
                    <div>
                      <div class="inline-block px-2 py-0.5 rounded text-[0.65rem] font-bold uppercase bg-[var(--color-secondary)]/15 text-[var(--color-secondary)] mb-2">
                        1-Click HD Packs
                      </div>
                      <h4 class="font-serif text-sm font-bold text-[var(--text-main)] mb-1">
                        High-Resolution Design Packs
                      </h4>
                      <p class="text-xs text-[var(--text-muted)] leading-relaxed mb-3">
                        Download curated asset packages for all 9 categories with blueprints & turnkey budget quotes.
                      </p>
                    </div>

                    <div class="space-y-2">
                      <a 
                        href="#categories" 
                        (click)="closeAll()" 
                        class="w-full btn-secondary text-center text-xs py-2 block font-medium">
                        Download Category Packs
                      </a>
                      <a 
                        href="#gallery" 
                        (click)="closeAll()" 
                        class="w-full text-center text-[0.72rem] text-[var(--text-muted)] hover:text-[var(--text-main)] block transition-colors py-1">
                        Browse Full 48+ Project Index →
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <!-- Dropdown 2: Interactive Design Studios & Tools -->
            <div class="relative" (mouseenter)="openMegaMenu('studios')" (mouseleave)="closeMegaMenu('studios')">
              <button 
                type="button"
                (click)="toggleMegaMenu('studios')"
                class="px-3.5 py-2 rounded-lg text-sm font-medium text-[var(--text-main)] hover:bg-[var(--border-subtle)]/50 transition-all flex items-center gap-1.5 group focus:outline-none">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="group-hover:text-[var(--color-secondary)] transition-colors">Design Studios & Tools</span>
                <svg class="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-transform duration-200" [class.rotate-180]="activeMegaMenu() === 'studios'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- Studios Dropdown Menu -->
              <div 
                *ngIf="activeMegaMenu() === 'studios'"
                class="absolute top-full left-0 mt-2 w-96 glass-panel rounded-2xl shadow-2xl border border-[var(--border-subtle)] p-3 animate-fade-in z-50">
                
                <div class="p-2 border-b border-[var(--border-subtle)] mb-1 flex items-center justify-between">
                  <span class="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--color-secondary)]">Client Interactive Suite</span>
                  <span class="text-[0.65rem] text-[var(--text-muted)]">5 Real-Time Modules</span>
                </div>

                <div class="space-y-1">
                  
                  <!-- Tool 1: Room Visualizer -->
                  <a 
                    href="#visualizer" 
                    (click)="closeAll()"
                    class="p-3 rounded-xl hover:bg-[var(--border-subtle)]/60 transition-all flex items-start gap-3.5 group">
                    <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--color-secondary)] transition-colors">
                          Room Material Visualizer
                        </span>
                        <span class="px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">Live Studio</span>
                      </div>
                      <p class="text-[0.7rem] text-[var(--text-muted)] mt-0.5">
                        Interactive wall paint tinting, 5 floor textures & circadian lighting snapshot exporter.
                      </p>
                    </div>
                  </a>

                  <!-- Tool 2: Scope Planner -->
                  <a 
                    href="#estimator" 
                    (click)="closeAll()"
                    class="p-3 rounded-xl hover:bg-[var(--border-subtle)]/60 transition-all flex items-start gap-3.5 group">
                    <div class="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--color-secondary)] transition-colors">
                          Turnkey Scope & Material Planner
                        </span>
                        <span class="px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase bg-blue-500/15 text-blue-600 dark:text-blue-400">Planner</span>
                      </div>
                      <p class="text-[0.7rem] text-[var(--text-muted)] mt-0.5">
                        Area slider, 3 material tiers, turnkey checklist & formal specification export.
                      </p>
                    </div>
                  </a>

                  <!-- Tool 3: Moodboard Studio -->
                  <a 
                    href="#moodboard" 
                    (click)="closeAll()"
                    class="p-3 rounded-xl hover:bg-[var(--border-subtle)]/60 transition-all flex items-start gap-3.5 group">
                    <div class="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--color-secondary)] transition-colors">
                          Moodboard Canvas Studio
                        </span>
                        <span class="px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase bg-purple-500/15 text-purple-600 dark:text-purple-400">Canvas</span>
                      </div>
                      <p class="text-[0.7rem] text-[var(--text-muted)] mt-0.5">
                        Pin tactile materials, color swatches & export composite board snapshot.
                      </p>
                    </div>
                  </a>

                  <!-- Tool 4: Before / After Transformations -->
                  <a 
                    href="#transformations" 
                    (click)="closeAll()"
                    class="p-3 rounded-xl hover:bg-[var(--border-subtle)]/60 transition-all flex items-start gap-3.5 group">
                    <div class="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--color-secondary)] transition-colors">
                          Renovation Split Slider
                        </span>
                        <span class="px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase bg-teal-500/15 text-teal-600 dark:text-teal-400">Before & After</span>
                      </div>
                      <p class="text-[0.7rem] text-[var(--text-muted)] mt-0.5">
                        Interactive split comparison slider for living, kitchen, and terrace spaces.
                      </p>
                    </div>
                  </a>

                  <!-- Tool 5: Style Quiz -->
                  <a 
                    href="#quiz" 
                    (click)="closeAll()"
                    class="p-3 rounded-xl hover:bg-[var(--border-subtle)]/60 transition-all flex items-start gap-3.5 group">
                    <div class="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--color-secondary)] transition-colors">
                          Aesthetic Diagnostic Quiz
                        </span>
                        <span class="px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase bg-rose-500/15 text-rose-600 dark:text-rose-400">Quiz</span>
                      </div>
                      <p class="text-[0.7rem] text-[var(--text-muted)] mt-0.5">
                        3-step visual style diagnostic with downloadable personalized lookbook.
                      </p>
                    </div>
                  </a>

                </div>
              </div>
            </div>

            <!-- Single Link 1: Portfolio Gallery -->
            <a 
              href="#gallery" 
              class="px-3.5 py-2 rounded-lg text-sm font-medium text-[var(--text-main)] hover:bg-[var(--border-subtle)]/50 hover:text-[var(--color-secondary)] transition-all">
              Portfolio Gallery
            </a>

            <!-- Single Link 2: Categories Showcase -->
            <a 
              href="#categories" 
              class="px-3.5 py-2 rounded-lg text-sm font-medium text-[var(--text-main)] hover:bg-[var(--border-subtle)]/50 hover:text-[var(--color-secondary)] transition-all">
              Category Packs
            </a>
          </nav>

          <!-- Right: Enterprise Search, Saved Vault & Consultation CTA -->
          <div class="flex items-center gap-2.5 sm:gap-3">
            
            <!-- Quick Search Pill Button -->
            <a 
              href="#gallery" 
              class="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--color-secondary)]/50 transition-all group">
              <svg class="w-3.5 h-3.5 text-[var(--color-secondary)] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <span class="hidden xl:inline">Search spaces & styles...</span>
              <span class="xl:hidden">Search</span>
              <kbd class="px-1.5 py-0.5 text-[0.65rem] font-mono bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded shadow-sm text-[var(--text-muted)]">⌘K</kbd>
            </a>

            <!-- Saved Projects Vault Trigger -->
            <button 
              (click)="openFavorites.emit()"
              class="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-main)] hover:border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10 transition-all focus:outline-none"
              title="Open Saved Projects Vault"
              aria-label="View Saved Favorites">
              <svg class="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span class="hidden sm:inline">Saved Vault</span>
              <span 
                *ngIf="storageService.favorites().length > 0"
                class="px-1.5 py-0.5 rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)] text-[0.65rem] font-bold animate-scale-in">
                {{ storageService.favorites().length }}
              </span>
            </button>

            <!-- Book Consultation Enterprise CTA Button -->
            <button 
              (click)="openConsultation.emit()"
              class="desktop-consultation-cta btn-primary text-xs uppercase tracking-wider py-2.5 px-4 sm:px-5 items-center gap-2 shadow-md hover:shadow-lg transition-all">
              <span>Book Consultation</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>

            <!-- Mobile Menu Toggle Button -->
            <button 
              (click)="isMobileMenuOpen = !isMobileMenuOpen"
              class="mobile-menu-toggle btn-icon text-base"
              aria-label="Toggle mobile menu">
              <svg *ngIf="!isMobileMenuOpen" class="w-6 h-6 text-[var(--text-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
              <svg *ngIf="isMobileMenuOpen" class="w-6 h-6 text-[var(--text-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

          </div>
        </div>
      </div>

      <!-- 3. Enterprise Mobile Slide-Over Menu -->
      <div 
        *ngIf="isMobileMenuOpen" 
        class="lg:hidden glass-panel border-b border-[var(--border-subtle)] py-6 px-6 animate-fade-in max-h-[85vh] overflow-y-auto shadow-2xl">
        
        <!-- Mobile Search Bar -->
        <div class="mb-5">
          <a 
            href="#gallery" 
            (click)="isMobileMenuOpen = false"
            class="flex items-center gap-2.5 w-full p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
            <svg class="w-4 h-4 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span>Search 48+ projects, styles & spaces...</span>
          </a>
        </div>

        <!-- Section 1: Spaces (9 Categories) -->
        <div class="mb-6">
          <span class="text-[0.68rem] font-bold uppercase tracking-widest text-[var(--color-secondary)] block mb-2.5">
            Spaces & Categories (9)
          </span>
          <div class="grid grid-cols-2 gap-2">
            <div 
              *ngFor="let cat of interiorService.categories"
              (click)="onCategoryClick(cat.id)"
              class="p-2.5 rounded-xl bg-[var(--bg-surface-subtle)]/70 hover:bg-[var(--border-subtle)] transition-all cursor-pointer flex items-center gap-2">
              <span class="text-xs font-semibold text-[var(--text-main)] truncate">{{ cat.name }}</span>
            </div>
          </div>
        </div>

        <!-- Section 2: Interactive Studios -->
        <div class="mb-6">
          <span class="text-[0.68rem] font-bold uppercase tracking-widest text-[var(--color-secondary)] block mb-2.5">
            Design Studios & Tools
          </span>
          <div class="space-y-2">
            <a 
              (click)="isMobileMenuOpen = false" 
              href="#visualizer" 
              class="p-3 rounded-xl bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] transition-all flex items-center justify-between">
              <span class="text-xs font-bold text-[var(--text-main)]">Room Visualizer Studio</span>
              <span class="px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase bg-emerald-500/15 text-emerald-600">Live</span>
            </a>
            <a 
              (click)="isMobileMenuOpen = false" 
              href="#estimator" 
              class="p-3 rounded-xl bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] transition-all flex items-center justify-between">
              <span class="text-xs font-bold text-[var(--text-main)]">Turnkey Scope Planner</span>
              <span class="px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase bg-blue-500/15 text-blue-600">Planner</span>
            </a>
            <a 
              (click)="isMobileMenuOpen = false" 
              href="#moodboard" 
              class="p-3 rounded-xl bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] transition-all flex items-center justify-between">
              <span class="text-xs font-bold text-[var(--text-main)]">Moodboard Canvas</span>
              <span class="px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase bg-purple-500/15 text-purple-600">Studio</span>
            </a>
            <a 
              (click)="isMobileMenuOpen = false" 
              href="#transformations" 
              class="p-3 rounded-xl bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] transition-all flex items-center justify-between">
              <span class="text-xs font-bold text-[var(--text-main)]">Before & After Slider</span>
              <span class="px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase bg-teal-500/15 text-teal-600">Renovations</span>
            </a>
            <a 
              (click)="isMobileMenuOpen = false" 
              href="#quiz" 
              class="p-3 rounded-xl bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] transition-all flex items-center justify-between">
              <span class="text-xs font-bold text-[var(--text-main)]">Style Finder Diagnostic</span>
              <span class="px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase bg-rose-500/15 text-rose-600">Quiz</span>
            </a>
          </div>
        </div>

        <!-- Section 3: Actions & Consultation -->
        <div class="pt-4 border-t border-[var(--border-subtle)] space-y-3">
          <div class="grid grid-cols-2 gap-2">
            <a [href]="'tel:' + contactNumber" class="flex items-center justify-center gap-2 p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-main)] hover:border-[var(--color-secondary)] transition-colors" [title]="'Call ' + contactNumber">
              <svg class="w-4 h-4 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span>Call {{ contactNumber }}</span>
            </a>
            <a [href]="whatsappUrl" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors" title="Chat on WhatsApp">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.52 3.48A11.84 11.84 0 0012.08 0C5.53 0 .2 5.33.2 11.88c0 2.09.55 4.13 1.59 5.92L.1 24l6.34-1.66a11.86 11.86 0 005.64 1.43h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.18-1.24-6.16-3.45-8.41zM12.09 21.77h-.01a9.85 9.85 0 01-5.02-1.38l-.36-.21-3.76.99 1-3.67-.23-.38a9.87 9.87 0 01-1.51-5.24C2.2 6.98 6.63 2.55 12.08 2.55c2.64 0 5.12 1.03 6.99 2.91a9.82 9.82 0 012.9 7c0 5.45-4.43 9.88-9.88 9.88zm5.42-7.4c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-1.77-.89-2.93-1.58-4.1-3.58-.31-.54.31-.5.89-1.67.1-.2.05-.37-.03-.52-.08-.15-.68-1.64-.93-2.25-.25-.59-.5-.51-.68-.52h-.58c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.09 4.49 1.89.82 2.63.89 3.57.75.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xs text-[var(--text-muted)]">Interface Theme</span>
            <button 
              (click)="storageService.toggleTheme()" 
              class="px-3 py-1.5 rounded-lg bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-main)] flex items-center gap-2">
              <span>{{ storageService.theme() === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode' }}</span>
            </button>
          </div>

          <button 
            (click)="isMobileMenuOpen = false; openFavorites.emit()"
            class="w-full p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-main)] flex items-center justify-center gap-2">
            <svg class="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>Saved Projects Vault ({{ storageService.favorites().length }})</span>
          </button>

          <button 
            (click)="isMobileMenuOpen = false; openConsultation.emit()"
            class="btn-primary w-full text-xs uppercase tracking-wider py-3.5 flex items-center justify-center gap-2 shadow-lg">
            <span>Schedule Studio Consultation</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </div>

      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
    .scrolled-header {
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08);
    }
    .default-header {
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    .desktop-consultation-cta {
      display: none;
    }
    .mobile-menu-toggle {
      display: inline-flex;
    }
    @media (min-width: 1024px) {
      .desktop-consultation-cta {
        display: inline-flex;
      }
      .mobile-menu-toggle {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  storageService = inject(StorageService);
  interiorService = inject(InteriorService);

  readonly contactNumber = '9555131344';
  readonly whatsappUrl = 'https://wa.me/919555131344?text=' + encodeURIComponent('Hello JS Enterprices, I would like to discuss my interior design requirements.');

  openFavorites = output<void>();
  openConsultation = output<void>();
  selectCategory = output<RoomCategoryId>();

  isMobileMenuOpen = false;
  activeMegaMenu = signal<'spaces' | 'studios' | null>(null);
  isScrolled = signal<boolean>(false);

  private menuTimeout: any = null;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('app-header')) {
      this.closeAll();
    }
  }

  openMegaMenu(menu: 'spaces' | 'studios') {
    if (this.menuTimeout) {
      clearTimeout(this.menuTimeout);
      this.menuTimeout = null;
    }
    this.activeMegaMenu.set(menu);
  }

  closeMegaMenu(menu: 'spaces' | 'studios') {
    this.menuTimeout = setTimeout(() => {
      if (this.activeMegaMenu() === menu) {
        this.activeMegaMenu.set(null);
      }
    }, 200);
  }

  toggleMegaMenu(menu: 'spaces' | 'studios') {
    if (this.activeMegaMenu() === menu) {
      this.activeMegaMenu.set(null);
    } else {
      this.activeMegaMenu.set(menu);
    }
  }

  closeAll() {
    this.activeMegaMenu.set(null);
    this.isMobileMenuOpen = false;
  }

  onCategoryClick(catId: RoomCategoryId) {
    this.selectCategory.emit(catId);
    this.closeAll();
    const element = document.getElementById('gallery');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}


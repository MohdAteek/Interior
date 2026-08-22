import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InteriorService } from '../../services/interior.service';
import { RoomCategoryId } from '../../models/interior.models';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="hero" class="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <!-- Background Ambient Glows -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-secondary)]/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div class="absolute top-1/3 right-10 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Left Column: Content & Controls -->
          <div class="lg:col-span-7 space-y-8 animate-fade-in">
            
            <!-- Category Badge -->
            <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
              <span class="w-2 h-2 rounded-full bg-[var(--color-secondary)]"></span>
              <span class="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-secondary)]">
                Architectural Studio & Interior Catalog
              </span>
            </div>

            <!-- Main Editorial Headline -->
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-main)] leading-[1.15]">
              Harmonizing Form, Space &
              <span class="font-serif italic font-normal text-[var(--color-secondary)] block">
                Timeless Materiality.
              </span>
            </h1>

            <!-- Description -->
            <p class="text-lg md:text-xl text-[var(--text-muted)] font-normal max-w-2xl leading-relaxed">
              Explore bespoke architectural designs across <strong class="text-[var(--text-main)]">9 curated categories</strong>. 
              Customize color palettes, plan comprehensive turnkey scopes, and download high-resolution photography directly to your device.
            </p>

            <!-- Search Bar with Live Filter -->
            <div class="glass-panel p-2 rounded-2xl shadow-lg border border-[var(--border-medium)] max-w-xl flex items-center gap-2">
              <div class="pl-3 text-[var(--text-muted)] text-lg">
                🔍
              </div>
              <input 
                type="text" 
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearchChange($event)"
                placeholder="Search styles (Japandi, Marble, Loft, Walnut, Terrazzo)..."
                class="w-full bg-transparent border-none outline-none text-[var(--text-main)] text-sm md:text-base placeholder:text-[var(--text-light)] py-2"
              />
              <button 
                (click)="triggerSearch()" 
                class="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider whitespace-nowrap">
                Explore Gallery
              </button>
            </div>

            <!-- Quick Category Navigation Pill Links -->
            <div class="space-y-2.5 pt-2">
              <div class="text-xs uppercase tracking-[0.15em] font-semibold text-[var(--text-light)]">
                Jump to Category:
              </div>
              <div class="flex flex-wrap gap-2">
                <button 
                  *ngFor="let cat of interiorService.categories"
                  (click)="selectCategory.emit(cat.id)"
                  class="text-xs font-medium px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--color-secondary)] hover:text-[#121316] border border-[var(--border-subtle)] text-[var(--text-main)] transition-all duration-200">
                  {{ cat.name }}
                </button>
              </div>
            </div>

            <!-- Key Metric Counters -->
            <div class="grid grid-cols-3 gap-6 pt-6 border-t border-[var(--border-subtle)]">
              <div>
                <div class="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">9</div>
                <div class="text-xs uppercase tracking-wider text-[var(--text-muted)] mt-0.5">Space Categories</div>
              </div>
              <div>
                <div class="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)]">48+</div>
                <div class="text-xs uppercase tracking-wider text-[var(--text-muted)] mt-0.5">Curated Designs</div>
              </div>
              <div>
                <div class="font-serif text-2xl sm:text-3xl font-bold text-[var(--color-secondary)]">100%</div>
                <div class="text-xs uppercase tracking-wider text-[var(--text-muted)] mt-0.5">Direct HD Download</div>
              </div>
            </div>

          </div>

          <!-- Right Column: Interactive Featured Showcase Card -->
          <div class="lg:col-span-5 relative">
            <div class="relative rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-medium)] group bg-[var(--bg-surface-card)]">
              
              <!-- Featured Image with Soft Zoom -->
              <div class="relative aspect-[4/5] overflow-hidden bg-zinc-900">
                <img 
                  [src]="activeHeroProject.image" 
                  [alt]="activeHeroProject.title"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                <!-- Dark Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>

                <!-- Category Badge Pill Overlay -->
                <div class="absolute top-4 left-4 flex gap-2">
                  <span class="badge-pill bg-black/60 text-white backdrop-blur-md border border-white/20">
                    {{ activeHeroProject.categoryName }}
                  </span>
                  <span class="badge-pill badge-gold">
                    {{ activeHeroProject.style }}
                  </span>
                </div>

                <!-- Bottom Project Information & Action -->
                <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white space-y-3">
                  <div class="flex items-center gap-2 text-xs font-mono text-amber-300">
                    <span>★ {{ activeHeroProject.rating }} ({{ activeHeroProject.views }} views)</span>
                    <span>•</span>
                    <span>{{ activeHeroProject.areaSqFt }} sq.ft</span>
                  </div>

                  <h3 class="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                    {{ activeHeroProject.title }}
                  </h3>

                  <p class="text-xs sm:text-sm text-zinc-300 line-clamp-2">
                    {{ activeHeroProject.description }}
                  </p>

                  <div class="pt-2 flex items-center justify-between gap-4">
                    <div>
                      <div class="text-[0.7rem] uppercase tracking-wider text-zinc-400">Execution Scope</div>
                      <div class="font-bold text-sm sm:text-base text-amber-300">{{ activeHeroProject.scopeTier }} • {{ activeHeroProject.executionTimeline }}</div>
                    </div>
                    
                    <button 
                      (click)="viewProject.emit(activeHeroProject.id)"
                      class="btn-gold text-xs py-2 px-4 shadow-lg">
                      View Space Specs →
                    </button>
                  </div>
                </div>

              </div>

              <!-- Hero Project Switcher Carousel Indicator Dots -->
              <div class="p-3 bg-[var(--bg-surface-card)] flex items-center justify-between border-t border-[var(--border-subtle)]">
                <span class="text-xs font-medium text-[var(--text-muted)]">Featured Inspiration</span>
                <div class="flex items-center gap-1.5">
                  <button 
                    *ngFor="let prj of featuredProjects; let idx = index"
                    (click)="activeHeroIndex = idx"
                    [class.bg-[var(--color-secondary)]]="activeHeroIndex === idx"
                    [class.w-6]="activeHeroIndex === idx"
                    [class.bg-zinc-400]="activeHeroIndex !== idx"
                    class="h-2 w-2 rounded-full transition-all duration-300"
                    [attr.aria-label]="'Select featured slide ' + (idx + 1)">
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HeroComponent {
  interiorService = inject(InteriorService);
  selectCategory = output<RoomCategoryId>();
  searchEvent = output<string>();
  viewProject = output<string>();

  searchQuery = '';
  activeHeroIndex = 0;

  get featuredProjects() {
    return this.interiorService.getFeaturedProjects();
  }

  get activeHeroProject() {
    return this.featuredProjects[this.activeHeroIndex] || this.interiorService.projects[0];
  }

  onSearchChange(val: string) {
    this.searchEvent.emit(val);
  }

  triggerSearch() {
    this.searchEvent.emit(this.searchQuery);
    const element = document.getElementById('gallery');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }
}

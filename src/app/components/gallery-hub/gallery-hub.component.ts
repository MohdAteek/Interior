import { Component, inject, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InteriorService } from '../../services/interior.service';
import { StorageService } from '../../services/storage.service';
import { DownloadService } from '../../services/download.service';
import { DesignProject, RoomCategoryId, DesignStyle } from '../../models/interior.models';

@Component({
  selector: 'app-gallery-hub',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="gallery" class="py-20 md:py-28">
      <div class="container-custom space-y-10">
        
        <!-- Section Header -->
        <div class="space-y-4 text-center max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--color-secondary)] text-xs font-semibold uppercase tracking-widest">
            <span>✨</span> Master Portfolio & Concept Archive
          </div>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-main)]">
            Explore Architectural Designs
          </h2>
          <p class="text-base sm:text-lg text-[var(--text-muted)]">
            Filter through all 9 categories, styles, and budget tiers. Download high-resolution photography or save to your custom moodboard.
          </p>
        </div>

        <!-- Filter & Search Control Center -->
        <div class="glass-panel p-6 rounded-3xl space-y-6 shadow-md border border-[var(--border-subtle)]">
          
          <!-- Category Tabs (Horizontal Scroll on mobile) -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button 
              (click)="selectedCategory.set('all')"
              [class.bg-[var(--color-primary)]]="selectedCategory() === 'all'"
              [class.text-white]="selectedCategory() === 'all'"
              [class.bg-[var(--bg-surface)]]="selectedCategory() !== 'all'"
              [class.text-[var(--text-muted)]]="selectedCategory() !== 'all'"
              class="px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border border-[var(--border-subtle)] hover:border-[var(--color-secondary)]">
              All Spaces ({{ interiorService.projects.length }})
            </button>

            <button 
              *ngFor="let cat of interiorService.categories"
              (click)="selectedCategory.set(cat.id)"
              [class.bg-[var(--color-primary)]]="selectedCategory() === cat.id"
              [class.text-white]="selectedCategory() === cat.id"
              [class.bg-[var(--bg-surface)]]="selectedCategory() !== cat.id"
              [class.text-[var(--text-muted)]]="selectedCategory() !== cat.id"
              class="px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border border-[var(--border-subtle)] hover:border-[var(--color-secondary)]">
              {{ cat.name }} ({{ getCategoryCount(cat.id) }})
            </button>
          </div>

          <!-- Secondary Filters Row (Style, Budget, Sort, Search) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-[var(--border-subtle)]">
            
            <!-- Style Filter Dropdown -->
            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)]">Design Style</label>
              <select 
                [(ngModel)]="selectedStyle"
                class="w-full bg-[var(--bg-surface)] text-[var(--text-main)] text-sm rounded-xl px-3.5 py-2.5 border border-[var(--border-subtle)] outline-none focus:border-[var(--color-secondary)]">
                <option value="all">All Styles</option>
                <option value="Japandi">Japandi</option>
                <option value="Modern Luxury">Modern Luxury</option>
                <option value="Scandinavian">Scandinavian</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Industrial Loft">Industrial Loft</option>
                <option value="Mid-Century Modern">Mid-Century Modern</option>
                <option value="Bohemian Luxe">Bohemian Luxe</option>
                <option value="Biophilic Nature">Biophilic Nature</option>
                <option value="Classic Contemporary">Classic Contemporary</option>
              </select>
            </div>

            <!-- Scope Tier Filter -->
            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)]">Project Scope</label>
              <select 
                [(ngModel)]="selectedScope"
                class="w-full bg-[var(--bg-surface)] text-[var(--text-main)] text-sm rounded-xl px-3.5 py-2.5 border border-[var(--border-subtle)] outline-none focus:border-[var(--color-secondary)]">
                <option value="all">All Scope Tiers</option>
                <option value="Essential">Essential Luxury</option>
                <option value="Premium">Premium Bespoke</option>
                <option value="Bespoke">Architectural Masterpiece</option>
                <option value="Grand Estate">Grand Estate / Commercial</option>
              </select>
            </div>

            <!-- Sort By -->
            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)]">Sort By</label>
              <select 
                [(ngModel)]="sortBy"
                class="w-full bg-[var(--bg-surface)] text-[var(--text-main)] text-sm rounded-xl px-3.5 py-2.5 border border-[var(--border-subtle)] outline-none focus:border-[var(--color-secondary)]">
                <option value="popular">Most Popular (Likes)</option>
                <option value="rating">Highest Rated (★ 5.0)</option>
                <option value="area-desc">Largest Area (sq.ft)</option>
                <option value="area-asc">Compact Area (sq.ft)</option>
                <option value="newest">Recently Completed</option>
              </select>
            </div>

            <!-- Search Field -->
            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)]">Keyword Search</label>
              <div class="relative">
                <input 
                  type="text" 
                  [(ngModel)]="searchFilter"
                  placeholder="e.g. marble, oak, terrace, loft..."
                  class="w-full bg-[var(--bg-surface)] text-[var(--text-main)] text-sm rounded-xl px-3.5 py-2.5 pl-9 border border-[var(--border-subtle)] outline-none focus:border-[var(--color-secondary)]"
                />
                <span class="absolute left-3 top-2.5 text-xs text-[var(--text-muted)]">🔍</span>
                <button 
                  *ngIf="searchFilter"
                  (click)="searchFilter = ''"
                  class="absolute right-3 top-2.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]">
                  ✕
                </button>
              </div>
            </div>

          </div>

          <!-- Active Filter Stats & Reset -->
          <div class="flex items-center justify-between text-xs text-[var(--text-muted)] pt-2">
            <div>
              Showing <strong class="text-[var(--text-main)]">{{ filteredProjects.length }}</strong> of {{ interiorService.projects.length }} designs
            </div>
            <button 
              *ngIf="hasActiveFilters"
              (click)="resetFilters()"
              class="text-[var(--color-secondary)] hover:underline font-semibold">
              Reset Filters
            </button>
          </div>

        </div>

        <!-- Design Gallery Grid -->
        <div *ngIf="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            *ngFor="let project of filteredProjects"
            class="luxury-card overflow-hidden group flex flex-col justify-between border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--color-secondary)] shadow-sm hover:shadow-xl transition-all duration-300">
            
            <!-- Card Image Box -->
            <div class="relative aspect-[4/3] overflow-hidden bg-zinc-900">
              <img 
                [src]="project.image" 
                [alt]="project.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              <!-- Top Floating Controls: Category & Wishlist Button -->
              <div class="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span class="badge-pill bg-black/70 text-white backdrop-blur-md border border-white/20">
                  {{ project.categoryName }}
                </span>

                <button 
                  (click)="toggleFavorite(project.id); $event.stopPropagation()"
                  class="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-sm transition-transform duration-200 hover:scale-115"
                  [title]="storageService.isFavorite(project.id) ? 'Remove from Saved' : 'Save to Favorites'">
                  <span>{{ storageService.isFavorite(project.id) ? '❤️' : '🤍' }}</span>
                </button>
              </div>

              <!-- Bottom Overlay on Image: Style & Dimensions -->
              <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
                <span class="badge-pill badge-gold backdrop-blur-md py-0.5">
                  {{ project.style }}
                </span>
                <span class="bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                  {{ project.areaSqFt }} sq.ft • {{ project.scopeTier }}
                </span>
              </div>
            </div>

            <!-- Card Content Body -->
            <div class="p-6 space-y-4 flex-1 flex flex-col justify-between">
              
              <div class="space-y-2">
                <div class="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span>{{ project.location }}</span>
                  <span class="text-amber-500 font-medium">★ {{ project.rating }} ({{ project.likes }} likes)</span>
                </div>

                <h3 
                  (click)="openProjectModal(project)"
                  class="font-serif text-lg font-bold text-[var(--text-main)] group-hover:text-[var(--color-secondary)] transition-colors cursor-pointer line-clamp-1">
                  {{ project.title }}
                </h3>

                <p class="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                  {{ project.description }}
                </p>
              </div>

              <!-- Color Palette Swatches -->
              <div class="space-y-1.5 pt-2">
                <div class="text-[0.7rem] uppercase tracking-wider text-[var(--text-light)]">Color Palette</div>
                <div class="flex items-center gap-1.5">
                  <div 
                    *ngFor="let swatch of project.colorPalette"
                    [style.background-color]="swatch.hex"
                    class="w-5 h-5 rounded-full border border-black/10 shadow-inner"
                    [title]="swatch.name + ' (' + swatch.hex + ')'">
                  </div>
                </div>
              </div>

              <!-- Action Buttons Row: View Lightbox & Instant HD Download -->
              <div class="pt-4 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-2">
                <button 
                  (click)="openProjectModal(project)"
                  class="btn-secondary text-xs py-2 px-3 justify-center w-full">
                  Specs & Details
                </button>

                <button 
                  (click)="downloadImage(project)"
                  class="btn-primary text-xs py-2 px-3 justify-center w-full"
                  [title]="'Download high-resolution image for ' + project.title">
                  📥 Download HD
                </button>
              </div>

            </div>

          </div>
        </div>

        <!-- No Results Fallback -->
        <div *ngIf="filteredProjects.length === 0" class="text-center py-16 space-y-4 glass-panel rounded-3xl p-8">
          <div class="text-4xl">🔍</div>
          <h3 class="text-xl font-bold text-[var(--text-main)]">No matching designs found</h3>
          <p class="text-sm text-[var(--text-muted)] max-w-md mx-auto">
            Try adjusting your style or budget filters, or search for different keywords like "marble", "oak", "terrace", or "minimalist".
          </p>
          <button (click)="resetFilters()" class="btn-primary text-xs py-2 px-5">
            Clear All Filters
          </button>
        </div>

      </div>

      <!-- Lightbox & Specification Modal -->
      <div 
        *ngIf="selectedProjectModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        (click)="closeProjectModal()">
        
        <div 
          class="bg-[var(--bg-surface)] text-[var(--text-main)] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[var(--border-medium)] p-6 sm:p-8 space-y-6"
          (click)="$event.stopPropagation()">
          
          <!-- Modal Header -->
          <div class="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="badge-pill bg-[var(--color-primary)] text-white text-[0.7rem]">
                  {{ selectedProjectModal.categoryName }}
                </span>
                <span class="badge-pill badge-gold text-[0.7rem]">
                  {{ selectedProjectModal.style }}
                </span>
              </div>
              <h3 class="font-serif text-2xl sm:text-3xl font-bold">
                {{ selectedProjectModal.title }}
              </h3>
              <p class="text-xs text-[var(--text-muted)]">
                {{ selectedProjectModal.location }} • Completed {{ selectedProjectModal.completedYear }} • Designed by {{ selectedProjectModal.designer.name }}
              </p>
            </div>

            <button 
              (click)="closeProjectModal()"
              class="btn-icon text-lg"
              aria-label="Close modal">
              ✕
            </button>
          </div>

          <!-- Main Image & Thumbnails -->
          <div class="space-y-3">
            <div class="relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-900 border border-[var(--border-subtle)]">
              <img 
                [src]="activeModalImage" 
                [alt]="selectedProjectModal.title"
                class="w-full h-full object-cover"
              />
              <button 
                (click)="downloadImage(selectedProjectModal)"
                class="absolute bottom-4 right-4 btn-gold text-xs py-2 px-4 shadow-xl">
                📥 Download Original HD Image
              </button>
            </div>

            <!-- Thumbnail Carousel if multiple images -->
            <div *ngIf="selectedProjectModal.galleryImages.length > 1" class="flex gap-2 overflow-x-auto pb-1">
              <img 
                *ngFor="let img of selectedProjectModal.galleryImages"
                [src]="img" 
                (click)="activeModalImage = img"
                [class.ring-2]="activeModalImage === img"
                class="w-20 h-14 object-cover rounded-lg cursor-pointer ring-[var(--color-secondary)] hover:opacity-80 transition-opacity"
              />
            </div>
          </div>

          <!-- Detailed Specifications Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            <div class="space-y-4">
              <h4 class="font-serif text-lg font-bold">Design Narrative</h4>
              <p class="text-sm text-[var(--text-muted)] leading-relaxed">
                {{ selectedProjectModal.description }}
              </p>

              <div class="space-y-2">
                <div class="text-xs uppercase tracking-wider font-semibold text-[var(--text-light)]">Key Materials</div>
                <div class="flex flex-wrap gap-1.5">
                  <span 
                    *ngFor="let mat of selectedProjectModal.materials"
                    class="px-2.5 py-1 rounded-md bg-[var(--bg-surface-subtle)] text-xs text-[var(--text-main)] border border-[var(--border-subtle)]">
                    {{ mat }}
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-4 bg-[var(--bg-surface-subtle)] p-5 rounded-2xl border border-[var(--border-subtle)]">
              <h4 class="font-serif text-lg font-bold">Spatial Specifications</h4>
              
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span class="text-[var(--text-light)] block">Floor Area</span>
                  <strong class="font-mono text-sm text-[var(--text-main)]">{{ selectedProjectModal.areaSqFt }} sq.ft</strong>
                </div>
                <div>
                  <span class="text-[var(--text-light)] block">Project Scope</span>
                  <strong class="font-mono text-sm text-[var(--color-secondary)]">{{ selectedProjectModal.scopeTier }} • {{ selectedProjectModal.executionTimeline }}</strong>
                </div>
                <div>
                  <span class="text-[var(--text-light)] block">Rating</span>
                  <strong class="text-sm text-amber-500">★ {{ selectedProjectModal.rating }} / 5.0</strong>
                </div>
                <div>
                  <span class="text-[var(--text-light)] block">Community Views</span>
                  <strong class="font-mono text-sm text-[var(--text-main)]">{{ selectedProjectModal.views }}</strong>
                </div>
              </div>

              <!-- Color Palette -->
              <div class="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                <span class="text-xs uppercase tracking-wider font-semibold text-[var(--text-light)] block">Color Scheme</span>
                <div class="grid grid-cols-2 gap-2">
                  <div 
                    *ngFor="let swatch of selectedProjectModal.colorPalette"
                    class="flex items-center gap-2 p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <div [style.background-color]="swatch.hex" class="w-5 h-5 rounded-md border border-black/10"></div>
                    <span class="text-xs font-medium">{{ swatch.name }}</span>
                  </div>
                </div>
              </div>

              <!-- Features Checklist -->
              <div class="space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
                <span class="text-xs uppercase tracking-wider font-semibold text-[var(--text-light)] block">Architectural Inclusions</span>
                <ul class="space-y-1 text-xs text-[var(--text-muted)]">
                  <li *ngFor="let feat of selectedProjectModal.features" class="flex items-center gap-1.5">
                    <span class="text-emerald-500">✓</span> {{ feat }}
                  </li>
                </ul>
              </div>

            </div>

          </div>

          <!-- Modal Action Bar -->
          <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)]">
            <button 
              (click)="toggleFavorite(selectedProjectModal.id)"
              class="btn-secondary text-xs py-2.5 px-4">
              {{ storageService.isFavorite(selectedProjectModal.id) ? '❤️ Saved in Favorites' : '🤍 Save to Favorites' }}
            </button>

            <div class="flex items-center gap-3">
              <button 
                (click)="downloadImage(selectedProjectModal)"
                class="btn-primary text-xs py-2.5 px-5">
                📥 Download High-Res Image
              </button>
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
export class GalleryHubComponent {
  interiorService = inject(InteriorService);
  storageService = inject(StorageService);
  downloadService = inject(DownloadService);

  // Category Input from parent
  categoryInput = input<RoomCategoryId | 'all'>('all');
  selectedCategory = signal<RoomCategoryId | 'all'>('all');

  selectedStyle = 'all';
  selectedScope = 'all';
  sortBy = 'popular';
  searchFilter = '';

  selectedProjectModal: DesignProject | null = null;
  activeModalImage = '';

  constructor() {
    effect(() => {
      const parentCat = this.categoryInput();
      if (parentCat) {
        this.selectedCategory.set(parentCat);
      }
    });
  }

  getCategoryCount(catId: RoomCategoryId): number {
    return this.interiorService.projects.filter(p => p.category === catId).length;
  }

  get hasActiveFilters(): boolean {
    return this.selectedCategory() !== 'all' || this.selectedStyle !== 'all' || this.selectedScope !== 'all' || this.searchFilter !== '';
  }

  resetFilters(): void {
    this.selectedCategory.set('all');
    this.selectedStyle = 'all';
    this.selectedScope = 'all';
    this.searchFilter = '';
    this.sortBy = 'popular';
  }

  get filteredProjects(): DesignProject[] {
    let list = this.interiorService.projects;

    // Category filter
    if (this.selectedCategory() !== 'all') {
      list = list.filter(p => p.category === this.selectedCategory());
    }

    // Style filter
    if (this.selectedStyle !== 'all') {
      list = list.filter(p => p.style === this.selectedStyle);
    }

    // Scope tier filter
    if (this.selectedScope !== 'all') {
      list = list.filter(p => p.scopeTier === this.selectedScope);
    }

    // Search query
    if (this.searchFilter.trim()) {
      const q = this.searchFilter.toLowerCase().trim();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.style.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.materials.some(m => m.toLowerCase().includes(q)) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    return [...list].sort((a, b) => {
      if (this.sortBy === 'popular') return b.likes - a.likes;
      if (this.sortBy === 'rating') return b.rating - a.rating;
      if (this.sortBy === 'area-desc') return b.areaSqFt - a.areaSqFt;
      if (this.sortBy === 'area-asc') return a.areaSqFt - b.areaSqFt;
      if (this.sortBy === 'newest') return b.completedYear - a.completedYear;
      return 0;
    });
  }

  toggleFavorite(id: string): void {
    const added = this.storageService.toggleFavorite(id);
    this.downloadService.showToast(added ? 'Added to Saved Favorites' : 'Removed from Favorites');
  }

  async downloadImage(project: DesignProject): Promise<void> {
    const filename = `JS_${project.category}_${project.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.jpg`;
    await this.downloadService.downloadImage(project.image, filename);
  }

  openProjectModal(project: DesignProject): void {
    this.selectedProjectModal = project;
    this.activeModalImage = project.image;
  }

  closeProjectModal(): void {
    this.selectedProjectModal = null;
  }
}

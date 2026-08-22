import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteriorService } from '../../services/interior.service';
import { DownloadService } from '../../services/download.service';
import { RoomCategoryId } from '../../models/interior.models';

@Component({
  selector: 'app-categories-showcase',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="categories" class="py-20 md:py-28 bg-[var(--bg-surface-subtle)] border-y border-[var(--border-subtle)]">
      <div class="container-custom space-y-12">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="space-y-3 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--color-secondary)] text-xs font-semibold uppercase tracking-wider">
              <span>🏛️</span> Spatial Taxonomy
            </div>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-main)]">
              Nine Curated Space Categories
            </h2>
            <p class="text-base sm:text-lg text-[var(--text-muted)]">
              Explore bespoke layouts, specialized joinery, and tailored lighting environments for every residential & commercial domain.
            </p>
          </div>

          <div class="text-xs uppercase tracking-widest text-[var(--text-light)] font-mono">
            ALL 9 CATEGORIES AVAILABLE
          </div>
        </div>

        <!-- 9 Categories Responsive Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            *ngFor="let cat of interiorService.categories"
            class="luxury-card overflow-hidden group flex flex-col justify-between border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--color-secondary)] shadow-sm hover:shadow-xl transition-all duration-300">
            
            <!-- Category Image Header -->
            <div class="relative aspect-[16/10] overflow-hidden bg-zinc-900">
              <img 
                [src]="cat.coverImage" 
                [alt]="cat.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <!-- Category Badge & Design Count -->
              <div class="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span class="badge-pill bg-black/70 text-white backdrop-blur-md border border-white/20">
                  {{ cat.name }}
                </span>
                <span class="badge-pill badge-gold backdrop-blur-md">
                  {{ cat.projectCount }} Concepts
                </span>
              </div>

              <!-- Bottom Trend Tag on Image -->
              <div class="absolute bottom-3 left-4 right-4 text-white">
                <div class="text-[0.7rem] uppercase tracking-wider text-amber-200 font-mono">
                  Trending: {{ cat.trendingStyle }}
                </div>
              </div>
            </div>

            <!-- Category Description & Metadata Body -->
            <div class="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div class="space-y-2">
                <h3 class="font-serif text-xl font-bold text-[var(--text-main)] group-hover:text-[var(--color-secondary)] transition-colors">
                  {{ cat.name }}
                </h3>
                <p class="text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                  {{ cat.shortDesc }}
                </p>
              </div>

              <div class="pt-4 border-t border-[var(--border-subtle)] space-y-3">
                <div class="flex items-center justify-between text-xs text-[var(--text-light)]">
                  <span>Turnkey Timeline:</span>
                  <span class="font-bold text-[var(--text-main)] font-mono">{{ cat.executionWeeks }}</span>
                </div>

                <!-- Action Buttons: Explore & Download Category Photos -->
                <div class="grid grid-cols-2 gap-2 pt-1">
                  <button 
                    (click)="filterCategory(cat.id)"
                    class="btn-secondary text-xs py-2 px-3 justify-center w-full">
                    View Gallery →
                  </button>
                  <button 
                    (click)="downloadCategoryPack(cat)"
                    class="btn-primary text-xs py-2 px-3 justify-center w-full"
                    [title]="'Download all HD images for ' + cat.name">
                    📥 Download Pack
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
export class CategoriesShowcaseComponent {
  interiorService = inject(InteriorService);
  downloadService = inject(DownloadService);
  selectCategory = output<RoomCategoryId>();

  filterCategory(id: RoomCategoryId) {
    this.selectCategory.emit(id);
    const element = document.getElementById('gallery');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }

  async downloadCategoryPack(cat: any) {
    const projects = this.interiorService.getProjectsByCategory(cat.id);
    const downloadItems = projects.map(p => ({
      url: p.image,
      name: `${cat.id}_${p.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.jpg`
    }));
    await this.downloadService.downloadBatch(downloadItems, cat.name);
  }
}

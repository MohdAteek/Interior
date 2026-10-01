import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DownloadService } from '../../services/download.service';

interface TransformationPair {
  id: string;
  title: string;
  category: string;
  location: string;
  timeline: string;
  scope: string;
  description: string;
  beforeImg: string;
  afterImg: string;
}

@Component({
  selector: 'app-before-after-slider',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="transformations" class="py-20 md:py-28 bg-[var(--bg-surface-subtle)] border-y border-[var(--border-subtle)]">
      <div class="container-custom space-y-12">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="space-y-3 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--color-secondary)] text-xs font-semibold uppercase tracking-wider">
              <span>🔄</span> Spatial Transformations
            </div>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-main)]">
              Before & After Renovations
            </h2>
            <p class="text-base sm:text-lg text-[var(--text-muted)]">
              Drag the interactive split-slider to reveal how raw shell spaces transform into bespoke luxury environments.
            </p>
          </div>

          <!-- Space Switcher Buttons -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1">
            <button 
              *ngFor="let item of transformations; let i = index"
              (click)="activeTransformationIndex.set(i); sliderPos = 50"
              [class.bg-[var(--color-primary)]]="activeTransformationIndex() === i"
              [class.text-white]="activeTransformationIndex() === i"
              [class.bg-[var(--bg-surface)]]="activeTransformationIndex() !== i"
              [class.text-[var(--text-muted)]]="activeTransformationIndex() !== i"
              class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border border-[var(--border-subtle)] transition-all">
              {{ item.title.split(' ')[0] }}
            </button>
          </div>
        </div>

        <!-- Interactive Split Slider Component -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <!-- Slider Viewport (8 cols) -->
          <div class="lg:col-span-8 relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-medium)] select-none bg-zinc-950">
            
            <!-- 1. AFTER Image (Full Background) -->
            <img 
              [src]="currentPair.afterImg" 
              [alt]="currentPair.title + ' (After)'"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div class="absolute top-4 right-4 badge-pill bg-black/70 text-white backdrop-blur-md border border-white/20 text-xs">
              COMPLETED AFTER
            </div>

            <!-- 2. BEFORE Image (Clipped with clip-path or width) -->
            <div 
              class="absolute inset-0 overflow-hidden"
              [style.width.%]="sliderPos">
              <img 
                [src]="currentPair.beforeImg" 
                [alt]="currentPair.title + ' (Before)'"
                class="absolute inset-0 w-full h-full object-cover max-w-none"
                [style.width]="'100%'"
                style="min-width: 100%; height: 100%; object-fit: cover;"
              />
              <div class="absolute top-4 left-4 badge-pill bg-black/70 text-amber-300 backdrop-blur-md border border-white/20 text-xs">
                BEFORE RENOVATION
              </div>
            </div>

            <!-- 3. Vertical Divider Line & Draggable Handle -->
            <div 
              class="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 pointer-events-none"
              [style.left.%]="sliderPos">
              <div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[var(--color-secondary)] text-[#121316] font-bold shadow-2xl flex items-center justify-center text-sm border-2 border-white">
                ↔
              </div>
            </div>

            <!-- 4. Hidden Native Range Input Overlay for Seamless Dragging / Touch -->
            <input 
              type="range" 
              min="0" 
              max="100" 
              [(ngModel)]="sliderPos"
              class="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 m-0"
              aria-label="Drag to compare before and after"
            />

            <!-- Bottom Caption -->
            <div class="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 text-white flex items-center justify-between pointer-events-none">
              <div>
                <span class="text-xs uppercase tracking-wider text-amber-300 font-mono">{{ currentPair.category }}</span>
                <div class="font-bold text-sm sm:text-base">{{ currentPair.title }}</div>
              </div>
              <div class="text-xs text-zinc-300 hidden sm:block font-mono">
                Drag slider ↔ to compare
              </div>
            </div>

          </div>

          <!-- Renovation Narrative & Data Card (4 cols) -->
          <div class="lg:col-span-4 space-y-6">
            <div class="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 shadow-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              
              <div class="space-y-2">
                <span class="badge-pill badge-gold text-[0.7rem]">Case Study</span>
                <h3 class="font-serif text-2xl font-bold text-[var(--text-main)]">
                  {{ currentPair.title }}
                </h3>
                <p class="text-xs text-[var(--text-muted)]">
                  {{ currentPair.location }} • Turnkey Duration: {{ currentPair.timeline }}
                </p>
              </div>

              <p class="text-sm text-[var(--text-muted)] leading-relaxed">
                {{ currentPair.description }}
              </p>

              <!-- Turnkey Stats -->
              <div class="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border-subtle)] text-xs">
                <div>
                  <span class="text-[var(--text-light)] block">Project Scope</span>
                  <strong class="font-mono text-sm text-[var(--color-secondary)]">{{ currentPair.scope }}</strong>
                </div>
                <div>
                  <span class="text-[var(--text-light)] block">Turnkey Timeline</span>
                  <strong class="font-mono text-sm text-[var(--text-main)]">{{ currentPair.timeline }}</strong>
                </div>
              </div>

              <!-- Download Transformed Image Action -->
              <div class="pt-2">
                <button 
                  (click)="downloadAfterImage()"
                  class="btn-gold w-full py-3 text-xs uppercase tracking-wider shadow-lg">
                  📥 Download Transformed HD Design
                </button>
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
export class BeforeAfterSliderComponent {
  downloadService = inject(DownloadService);

  readonly transformations: TransformationPair[] = [
    {
      id: 'tf-01',
      title: 'Living Room Architectural Revival',
      category: 'Living Room',
      location: 'Copenhagen, Denmark',
      timeline: '6 Weeks',
      scope: 'Full Turnkey Civil & Joinery',
      description: 'Transformed an outdated, partitioned concrete apartment into a luminous open-concept Japandi sanctuary with acoustic white oak slat walls, floating millwork, and curved bouclé seating.',
      beforeImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
      afterImg: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'tf-02',
      title: 'Culinary Monolith Kitchen Remodel',
      category: 'Kitchen',
      location: 'Zurich, Switzerland',
      timeline: '8 Weeks',
      scope: 'Complete Modular Island & Appliances',
      description: 'Demolished dark cramped partitions to install a 12-foot quartz waterfall island, concealed pocket appliance garages, flush handleless smoked oak cabinets, and induction downdraft ventilation.',
      beforeImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
      afterImg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'tf-03',
      title: 'Rooftop Biophilic Penthouse Terrace',
      category: 'Outdoor / Terraces',
      location: 'Barcelona, Spain',
      timeline: '5 Weeks',
      scope: 'Weatherproof Decking & Louvered Pergola',
      description: 'Replaced weathering gravel roof with durable Ipe hardwood decking, motorized bioclimatic pergola louvers, a linear basalt gas fire table, and automated planter irrigation.',
      beforeImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
      afterImg: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85'
    }
  ];

  activeTransformationIndex = signal(0);
  sliderPos = 50;

  get currentPair(): TransformationPair {
    return this.transformations[this.activeTransformationIndex()];
  }

  async downloadAfterImage(): Promise<void> {
    const item = this.currentPair;
    const filename = `JS_Transformation_${item.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Completed.jpg`;
    await this.downloadService.downloadImage(item.afterImg, filename);
  }
}

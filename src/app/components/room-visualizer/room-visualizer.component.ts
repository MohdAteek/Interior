import { Component, inject, signal, computed, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InteriorService } from '../../services/interior.service';
import { DownloadService } from '../../services/download.service';
import { RoomCategoryId, RoomVisualizerOption } from '../../models/interior.models';

@Component({
  selector: 'app-room-visualizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="visualizer" class="py-20 md:py-28 bg-[var(--bg-surface-subtle)] border-y border-[var(--border-subtle)]">
      <div class="container-custom space-y-12">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="space-y-3 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--color-secondary)] text-xs font-semibold uppercase tracking-wider">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Interactive Spatial Studio
            </div>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-main)]">
              Room Color & Material Visualizer
            </h2>
            <p class="text-base sm:text-lg text-[var(--text-muted)]">
              Test bespoke architectural wall paints, herringbone oak or marble flooring, and circadian lighting moods in real-time.
            </p>
          </div>

          <!-- Download Custom Render Button -->
          <button 
            (click)="downloadSnapshot()"
            class="btn-gold py-3 px-6 text-xs uppercase tracking-wider whitespace-nowrap shadow-xl">
            📸 Download Studio Snapshot
          </button>
        </div>

        <!-- Visualizer Interactive Studio Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Left: Canvas / Live Interactive Render Viewport -->
          <div class="lg:col-span-8 space-y-4">
            
            <!-- Room Space Category Switcher Pills -->
            <div class="flex items-center gap-2 overflow-x-auto pb-2">
              <button 
                *ngFor="let room of roomPresets"
                (click)="activeRoom.set(room)"
                [class.bg-[var(--color-primary)]]="activeRoom().id === room.id"
                [class.text-white]="activeRoom().id === room.id"
                [class.bg-[var(--bg-surface)]]="activeRoom().id !== room.id"
                [class.text-[var(--text-muted)]]="activeRoom().id !== room.id"
                class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border border-[var(--border-subtle)] transition-all">
                {{ room.name }}
              </button>
            </div>

            <!-- Viewport Container with Dynamic Overlays -->
            <div 
              #viewportContainer
              class="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-medium)] bg-zinc-900 select-none">
              
              <!-- Base Room Image -->
              <img 
                [src]="activeRoom().baseImage" 
                [alt]="activeRoom().name"
                class="w-full h-full object-cover transition-all duration-700"
              />

              <!-- Dynamic Wall Color Tint Overlay (Mix Blend Multiply) -->
              <div 
                class="absolute inset-0 pointer-events-none transition-colors duration-500"
                [style.background-color]="selectedWallColor().hex"
                style="mix-blend-mode: multiply; opacity: 0.38;">
              </div>

              <!-- Secondary Color Lightness Wash -->
              <div 
                class="absolute inset-0 pointer-events-none transition-colors duration-500"
                [style.background-color]="selectedWallColor().hex"
                style="mix-blend-mode: color; opacity: 0.45;">
              </div>

              <!-- Lighting Mood Atmosphere Overlay -->
              <div 
                class="absolute inset-0 pointer-events-none transition-all duration-500"
                [style.background]="getLightingGradient()">
              </div>

              <!-- Flooring Material Overlay Banner at bottom -->
              <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="badge-pill bg-white/20 text-white backdrop-blur-md border border-white/20 text-[0.7rem]">
                      {{ activeRoom().name }}
                    </span>
                    <span class="badge-pill badge-gold text-[0.7rem]">
                      {{ selectedLighting().name }}
                    </span>
                  </div>
                  <h3 class="font-serif text-lg sm:text-xl font-bold">
                    {{ selectedWallColor().name }} Wall Paint & {{ selectedFlooring().name }}
                  </h3>
                </div>

                <div class="flex items-center gap-3">
                  <!-- Color Swatch Indicator Circle -->
                  <div class="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    <span [style.background-color]="selectedWallColor().hex" class="w-4 h-4 rounded-full border border-white/40"></span>
                    <span class="text-xs font-mono font-medium">{{ selectedWallColor().hex }}</span>
                  </div>
                </div>

              </div>

            </div>

            <div class="text-xs text-[var(--text-light)] flex items-center justify-between">
              <span>* Real-time spatial render engine with ambient lighting simulation</span>
              <span class="font-mono">Resolution: 1920x1080 Full HD</span>
            </div>

          </div>

          <!-- Right: Interactive Control Studio Sidebar -->
          <div class="lg:col-span-4 space-y-6">
            
            <!-- 1. Wall Color Palette Selector -->
            <div class="glass-panel p-6 rounded-3xl space-y-4 shadow-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <div class="flex items-center justify-between">
                <h4 class="font-serif text-base font-bold text-[var(--text-main)]">
                  1. Wall Paint Swatch
                </h4>
                <span class="text-xs font-semibold text-[var(--color-secondary)]">
                  {{ selectedWallColor().name }}
                </span>
              </div>

              <!-- Color Grid Swatches -->
              <div class="grid grid-cols-4 gap-3">
                <button 
                  *ngFor="let color of interiorService.visualizerWallColors"
                  (click)="selectedWallColor.set(color)"
                  [class.ring-4]="selectedWallColor().id === color.id"
                  [class.ring-[var(--color-secondary)]]="selectedWallColor().id === color.id"
                  [style.background-color]="color.hex"
                  class="aspect-square rounded-2xl border border-black/10 shadow-sm transition-all duration-200 hover:scale-108 relative group"
                  [title]="color.name + ' (' + color.hex + ')'">
                  <span *ngIf="selectedWallColor().id === color.id" class="absolute inset-0 flex items-center justify-center text-xs font-bold shadow-inner">
                    ✓
                  </span>
                </button>
              </div>

              <p class="text-xs text-[var(--text-muted)] italic">
                {{ selectedWallColor().description }}
              </p>
            </div>

            <!-- 2. Flooring Material Selector -->
            <div class="glass-panel p-6 rounded-3xl space-y-4 shadow-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <div class="flex items-center justify-between">
                <h4 class="font-serif text-base font-bold text-[var(--text-main)]">
                  2. Flooring Material
                </h4>
                <span class="text-xs font-semibold text-[var(--color-secondary)]">
                  {{ selectedFlooring().name }}
                </span>
              </div>

              <div class="space-y-2">
                <button 
                  *ngFor="let floor of interiorService.visualizerFlooring"
                  (click)="selectedFlooring.set(floor)"
                  [class.border-[var(--color-secondary)]]="selectedFlooring().id === floor.id"
                  [class.bg-[var(--color-secondary-light)]]="selectedFlooring().id === floor.id"
                  class="w-full flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--color-secondary)] transition-colors text-left">
                  <div class="flex items-center gap-3">
                    <div [style.background-color]="floor.hex" class="w-8 h-8 rounded-lg border border-black/10 shadow-sm"></div>
                    <div>
                      <div class="text-xs font-bold text-[var(--text-main)]">{{ floor.name }}</div>
                      <div class="text-[0.7rem] text-[var(--text-muted)]">{{ floor.description }}</div>
                    </div>
                  </div>
                  <span *ngIf="selectedFlooring().id === floor.id" class="text-xs text-[var(--color-secondary)] font-bold">✓</span>
                </button>
              </div>
            </div>

            <!-- 3. Ambient Lighting Modes -->
            <div class="glass-panel p-6 rounded-3xl space-y-4 shadow-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <div class="flex items-center justify-between">
                <h4 class="font-serif text-base font-bold text-[var(--text-main)]">
                  3. Circadian Lighting Mode
                </h4>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <button 
                  *ngFor="let light of interiorService.visualizerLightingModes"
                  (click)="selectedLighting.set(light)"
                  [class.bg-[var(--color-primary)]]="selectedLighting().id === light.id"
                  [class.text-white]="selectedLighting().id === light.id"
                  [class.bg-[var(--bg-surface-subtle)]]="selectedLighting().id !== light.id"
                  [class.text-[var(--text-muted)]]="selectedLighting().id !== light.id"
                  class="p-3 rounded-xl text-left border border-[var(--border-subtle)] transition-all">
                  <div class="text-xs font-bold">{{ light.name.split(' ')[0] }}</div>
                  <div class="text-[0.7rem] opacity-75">{{ (light.name.split('(')[1] || '').replace(')', '') }}</div>
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
export class RoomVisualizerComponent {
  interiorService = inject(InteriorService);
  downloadService = inject(DownloadService);

  @ViewChild('viewportContainer') viewportContainer!: ElementRef<HTMLDivElement>;

  readonly roomPresets = [
    {
      id: 'living-room',
      name: 'Living Room',
      baseImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=90'
    },
    {
      id: 'bedroom',
      name: 'Master Bedroom',
      baseImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=90'
    },
    {
      id: 'kitchen',
      name: 'Culinary Kitchen',
      baseImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=90'
    },
    {
      id: 'home-office',
      name: 'Executive Office',
      baseImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=90'
    },
    {
      id: 'outdoor-terraces',
      name: 'Rooftop Terrace',
      baseImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=90'
    },
    {
      id: 'bathroom',
      name: 'Luxury Spa Bath',
      baseImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=90'
    }
  ];

  activeRoom = signal(this.roomPresets[0]);
  selectedWallColor = signal<RoomVisualizerOption>(this.interiorService.visualizerWallColors[0]);
  selectedFlooring = signal<RoomVisualizerOption>(this.interiorService.visualizerFlooring[0]);
  selectedLighting = signal(this.interiorService.visualizerLightingModes[0]);

  getLightingGradient(): string {
    const lightId = this.selectedLighting().id;
    if (lightId === 'golden-hour') {
      return 'linear-gradient(135deg, rgba(255, 170, 70, 0.28) 0%, rgba(200, 100, 30, 0.15) 100%)';
    } else if (lightId === 'warm-amber') {
      return 'linear-gradient(180deg, rgba(255, 150, 50, 0.32) 0%, rgba(180, 90, 20, 0.25) 100%)';
    } else if (lightId === 'moody-evening') {
      return 'linear-gradient(180deg, rgba(20, 30, 60, 0.45) 0%, rgba(10, 15, 30, 0.65) 100%)';
    }
    return 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)';
  }

  async downloadSnapshot(): Promise<void> {
    const filename = `JS_Visualizer_${this.activeRoom().id}_${this.selectedWallColor().name.replace(/\s+/g, '_')}_${this.selectedFlooring().name.replace(/\s+/g, '_')}.jpg`;

    // Render composite on HTML5 Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      await this.downloadService.downloadImage(this.activeRoom().baseImage, filename);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // 1. Draw base room image
      ctx.drawImage(img, 0, 0, 1920, 1080);

      // 2. Tint with wall color
      ctx.fillStyle = this.selectedWallColor().hex || '#ffffff';
      ctx.globalAlpha = 0.35;
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillRect(0, 0, 1920, 1080);

      // 3. Lighting atmosphere
      ctx.globalAlpha = 0.25;
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = this.selectedLighting().glowColor;
      ctx.fillRect(0, 0, 1920, 1080);

      // 4. Reset & Draw Watermark specifications bar
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(18, 19, 22, 0.85)';
      ctx.fillRect(0, 1000, 1920, 80);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(`JS ENTERPRICES STUDIO — ${this.activeRoom().name.toUpperCase()}`, 40, 1048);

      ctx.fillStyle = '#C5A880';
      ctx.font = '18px monospace';
      ctx.fillText(`WALL: ${this.selectedWallColor().name} | FLOOR: ${this.selectedFlooring().name} | LIGHT: ${this.selectedLighting().name}`, 780, 1048);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      this.downloadService.showToast(`✓ Downloaded ${filename}!`);
    };

    img.onerror = () => {
      this.downloadService.downloadImage(this.activeRoom().baseImage, filename);
    };

    img.src = this.activeRoom().baseImage;
  }
}

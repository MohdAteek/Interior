import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { DownloadService } from '../../services/download.service';
import { MoodboardCanvasItem } from '../../models/interior.models';

interface LibraryElement {
  id: string;
  title: string;
  type: 'image' | 'color' | 'texture' | 'furniture' | 'material';
  value: string;
  subtitle: string;
}

@Component({
  selector: 'app-moodboard-studio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="moodboard" class="py-20 md:py-28 bg-[var(--bg-surface-subtle)] border-y border-[var(--border-subtle)]">
      <div class="container-custom space-y-12">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="space-y-3 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--color-secondary)] text-xs font-semibold uppercase tracking-wider">
              <span>🎨</span> Creative Studio
            </div>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-main)]">
              Interactive Moodboard Studio
            </h2>
            <p class="text-base sm:text-lg text-[var(--text-muted)]">
              Curate materials, textures, color swatches, and bespoke furniture to visualize your dream space.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <button 
              (click)="clearCanvas()"
              class="btn-secondary text-xs py-2.5 px-4">
              Clear Canvas
            </button>
            <button 
              (click)="downloadMoodboard()"
              class="btn-gold text-xs py-2.5 px-5 shadow-lg">
              📸 Export Moodboard (.jpg)
            </button>
          </div>
        </div>

        <!-- Studio Grid Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Left: Moodboard Canvas Area (8 cols) -->
          <div class="lg:col-span-8 space-y-3">
            
            <div 
              id="moodboard-canvas-box"
              class="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border-2 border-dashed border-[var(--border-gold)] bg-[var(--bg-surface)] p-6 select-none flex flex-wrap content-start gap-4">
              
              <!-- Empty State Placeholder -->
              <div 
                *ngIf="canvasItems.length === 0" 
                class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-3 pointer-events-none">
                <div class="text-4xl">🎨</div>
                <h4 class="font-serif text-xl font-bold text-[var(--text-main)]">Your Moodboard is Empty</h4>
                <p class="text-xs text-[var(--text-muted)] max-w-sm">
                  Click any material, color chip, or furniture inspiration from the right library to pin it here.
                </p>
              </div>

              <!-- Pinned Canvas Items -->
              <div 
                *ngFor="let item of canvasItems"
                class="group relative luxury-card p-3 rounded-2xl shadow-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-card)] animate-scale-in flex flex-col items-center gap-2 max-w-[140px] sm:max-w-[170px] transition-all hover:scale-105">
                
                <!-- Remove item button -->
                <button 
                  (click)="removeItem(item.id)"
                  class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md z-10"
                  title="Remove from canvas">
                  ✕
                </button>

                <!-- Color Swatch Item -->
                <div *ngIf="item.type === 'color'" class="w-full aspect-[4/3] rounded-xl border border-black/10 flex items-center justify-center shadow-inner" [style.background-color]="item.value">
                  <span class="text-[0.65rem] font-mono font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm">
                    {{ item.value }}
                  </span>
                </div>

                <!-- Texture or Furniture Image Item -->
                <div *ngIf="item.type === 'texture' || item.type === 'furniture' || item.type === 'image'" class="w-full aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900 border border-black/10">
                  <img [src]="item.value" [alt]="item.title" class="w-full h-full object-cover" />
                </div>

                <!-- Item Caption -->
                <div class="text-center w-full">
                  <div class="font-bold text-xs text-[var(--text-main)] truncate">{{ item.title }}</div>
                  <div class="text-[0.65rem] text-[var(--text-muted)] truncate">{{ item.subtitle }}</div>
                </div>

              </div>

            </div>

            <div class="text-xs text-[var(--text-light)] flex items-center justify-between">
              <span>* Pinned items are saved in your local studio collection</span>
              <span>Total Pinned: {{ canvasItems.length }} elements</span>
            </div>

          </div>

          <!-- Right: Material & Inspiration Palette Library (4 cols) -->
          <div class="lg:col-span-4 glass-panel p-6 rounded-3xl space-y-5 shadow-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            
            <div class="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h4 class="font-serif text-base font-bold text-[var(--text-main)]">
                Element Library
              </h4>
              <span class="text-xs text-[var(--text-light)]">Click to add</span>
            </div>

            <!-- Tab Switcher (Colors, Materials, Furniture) -->
            <div class="flex gap-1.5 p-1 bg-[var(--bg-surface-subtle)] rounded-xl">
              <button 
                (click)="activeLibraryTab = 'all'"
                [class.bg-[var(--bg-surface)]]="activeLibraryTab === 'all'"
                [class.font-bold]="activeLibraryTab === 'all'"
                class="flex-1 py-1.5 rounded-lg text-xs transition-all">
                All
              </button>
              <button 
                (click)="activeLibraryTab = 'color'"
                [class.bg-[var(--bg-surface)]]="activeLibraryTab === 'color'"
                [class.font-bold]="activeLibraryTab === 'color'"
                class="flex-1 py-1.5 rounded-lg text-xs transition-all">
                Colors
              </button>
              <button 
                (click)="activeLibraryTab = 'material'"
                [class.bg-[var(--bg-surface)]]="activeLibraryTab === 'material'"
                [class.font-bold]="activeLibraryTab === 'material'"
                class="flex-1 py-1.5 rounded-lg text-xs transition-all">
                Materials
              </button>
            </div>

            <!-- Library Items List -->
            <div class="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              <button 
                *ngFor="let item of filteredLibraryItems"
                (click)="addItemToCanvas(item)"
                class="w-full flex items-center justify-between p-2 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--color-secondary)] hover:bg-[var(--bg-surface-subtle)] transition-all text-left group">
                
                <div class="flex items-center gap-3">
                  <!-- Thumbnail -->
                  <div *ngIf="item.type === 'color'" [style.background-color]="item.value" class="w-9 h-9 rounded-lg border border-black/10 shadow-sm flex-shrink-0"></div>
                  <img *ngIf="item.type !== 'color'" [src]="item.value" [alt]="item.title" class="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                  
                  <div>
                    <div class="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--color-secondary)] transition-colors">{{ item.title }}</div>
                    <div class="text-[0.65rem] text-[var(--text-muted)]">{{ item.subtitle }}</div>
                  </div>
                </div>

                <span class="text-xs font-bold text-[var(--color-secondary)] opacity-0 group-hover:opacity-100 transition-opacity">+ Add</span>
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
export class MoodboardStudioComponent {
  storageService = inject(StorageService);
  downloadService = inject(DownloadService);

  activeLibraryTab = 'all';

  readonly libraryItems: LibraryElement[] = [
    { id: 'lib-01', title: 'Warm Alabaster', type: 'color', value: '#F7F5F0', subtitle: 'Base Wall Paint' },
    { id: 'lib-02', title: 'Italian Calacatta Marble', type: 'material', value: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80', subtitle: 'Waterfall Island' },
    { id: 'lib-03', title: 'Bleached White Oak', type: 'material', value: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80', subtitle: 'Acoustic Slat Panel' },
    { id: 'lib-04', title: 'Sage Leaf Green', type: 'color', value: '#9BA997', subtitle: 'Accent Tone' },
    { id: 'lib-05', title: 'Brushed Champagne Brass', type: 'material', value: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=400&q=80', subtitle: 'Chandelier Accent' },
    { id: 'lib-06', title: 'Terracotta Dune', type: 'color', value: '#C9775B', subtitle: 'Earthy Accent' },
    { id: 'lib-07', title: 'Venetian Terrazzo Stone', type: 'material', value: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80', subtitle: 'Flooring & Counter' },
    { id: 'lib-08', title: 'Obsidian Slate Charcoal', type: 'color', value: '#262930', subtitle: 'Deep Accent' },
    { id: 'lib-09', title: 'Ipe Hardwood Decking', type: 'material', value: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80', subtitle: 'Terrace Deck' },
    { id: 'lib-10', title: 'Smoked American Walnut', type: 'material', value: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80', subtitle: 'Executive Desk' }
  ];

  canvasItems: MoodboardCanvasItem[] = [
    { id: 'item-1', title: 'Italian Calacatta', type: 'material', value: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80', subtitle: 'Countertop', x: 0, y: 0, rotation: 0, scale: 1, zIndex: 1 },
    { id: 'item-2', title: 'Warm Alabaster', type: 'color', value: '#F7F5F0', subtitle: 'Wall Paint', x: 0, y: 0, rotation: 0, scale: 1, zIndex: 2 },
    { id: 'item-3', title: 'White Oak Slats', type: 'material', value: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80', subtitle: 'Acoustic Millwork', x: 0, y: 0, rotation: 0, scale: 1, zIndex: 3 }
  ];

  get filteredLibraryItems(): LibraryElement[] {
    if (this.activeLibraryTab === 'color') {
      return this.libraryItems.filter(i => i.type === 'color');
    }
    if (this.activeLibraryTab === 'material') {
      return this.libraryItems.filter(i => i.type === 'material' || i.type === 'texture');
    }
    return this.libraryItems;
  }

  addItemToCanvas(item: LibraryElement): void {
    const newItem: MoodboardCanvasItem = {
      id: 'mb-' + Date.now() + Math.random().toString(36).substr(2, 4),
      title: item.title,
      type: item.type === 'color' ? 'color' : 'material',
      value: item.value,
      subtitle: item.subtitle,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      zIndex: this.canvasItems.length + 1
    };
    this.canvasItems.push(newItem);
    this.storageService.saveMoodboard(this.canvasItems);
    this.downloadService.showToast(`Pinned ${item.title} to moodboard`);
  }

  removeItem(id: string): void {
    this.canvasItems = this.canvasItems.filter(i => i.id !== id);
    this.storageService.saveMoodboard(this.canvasItems);
  }

  clearCanvas(): void {
    this.canvasItems = [];
    this.storageService.saveMoodboard([]);
  }

  async downloadMoodboard(): Promise<void> {
    if (this.canvasItems.length === 0) {
      this.downloadService.showToast('Please add items to your moodboard first.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Background
    ctx.fillStyle = '#F5F4F0';
    ctx.fillRect(0, 0, 1920, 1080);

    // 2. Header
    ctx.fillStyle = '#121316';
    ctx.font = 'bold 36px serif';
    ctx.fillText('AURA INTERIORS STUDIO — CURATED MOODBOARD', 60, 90);

    ctx.fillStyle = '#C5A880';
    ctx.font = '20px sans-serif';
    ctx.fillText(`MATERIALITY & COLOR PALETTE SPECIFICATION (${this.canvasItems.length} ELEMENTS)`, 60, 130);

    // 3. Draw cards grid
    const cols = 4;
    const cardWidth = 380;
    const cardHeight = 360;
    const startX = 60;
    const startY = 180;
    const gap = 40;

    let loadedImages = 0;
    const totalImageItems = this.canvasItems.filter(i => i.type !== 'color').length;

    const renderTextAndFinish = () => {
      // Watermark footer
      ctx.fillStyle = '#121316';
      ctx.fillRect(0, 1020, 1920, 60);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px monospace';
      ctx.fillText('https://aurainteriors.design — Turnkey Architectural & Interior Studio', 60, 1055);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Aura_Moodboard_Collection_${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.downloadService.showToast('✓ Downloaded custom moodboard snapshot!');
    };

    if (totalImageItems === 0) {
      // Draw colors only
      this.canvasItems.forEach((item, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = startX + col * (cardWidth + gap);
        const y = startY + row * (cardHeight + gap);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x, y, cardWidth, cardHeight);
        ctx.fillStyle = item.value;
        ctx.fillRect(x + 20, y + 20, cardWidth - 40, 240);

        ctx.fillStyle = '#121316';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(item.title, x + 20, y + 295);

        ctx.fillStyle = '#6E7178';
        ctx.font = '16px sans-serif';
        ctx.fillText(item.subtitle || item.value, x + 20, y + 330);
      });
      renderTextAndFinish();
      return;
    }

    this.canvasItems.forEach((item, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cardWidth + gap);
      const y = startY + row * (cardHeight + gap);

      // Card Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x, y, cardWidth, cardHeight);

      if (item.type === 'color') {
        ctx.fillStyle = item.value;
        ctx.fillRect(x + 20, y + 20, cardWidth - 40, 240);
        ctx.fillStyle = '#121316';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(item.title, x + 20, y + 295);
        ctx.fillStyle = '#6E7178';
        ctx.font = '16px monospace';
        ctx.fillText(item.value, x + 20, y + 330);
      } else {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, x + 20, y + 20, cardWidth - 40, 240);
          ctx.fillStyle = '#121316';
          ctx.font = 'bold 20px sans-serif';
          ctx.fillText(item.title, x + 20, y + 295);
          ctx.fillStyle = '#6E7178';
          ctx.font = '16px sans-serif';
          ctx.fillText(item.subtitle || 'Material Spec', x + 20, y + 330);
          loadedImages++;
          if (loadedImages >= totalImageItems) {
            renderTextAndFinish();
          }
        };
        img.onerror = () => {
          loadedImages++;
          if (loadedImages >= totalImageItems) {
            renderTextAndFinish();
          }
        };
        img.src = item.value;
      }
    });
  }
}

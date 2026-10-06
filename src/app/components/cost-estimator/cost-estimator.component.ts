import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InteriorService } from '../../services/interior.service';
import { DownloadService } from '../../services/download.service';
import { RoomCategoryId } from '../../models/interior.models';

@Component({
  selector: 'app-cost-estimator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="estimator" class="py-20 md:py-28">
      <div class="container-custom space-y-12">
        
        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto space-y-4">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--color-secondary)] text-xs font-semibold uppercase tracking-wider">
            <span>📐</span> Architectural Scope Engine
          </div>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-main)]">
            Turnkey Scope & Material Planner
          </h2>
          <p class="text-base sm:text-lg text-[var(--text-muted)]">
            Configure your space dimensions, finish tiers, and scope inclusions to calculate turnkey execution timelines, craftsman allocation, and material specifications.
          </p>
        </div>

        <!-- Interactive Calculator Card -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Left: Input Controls (7 cols) -->
          <div class="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl space-y-8 shadow-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            
            <!-- 1. Room Category -->
            <div class="space-y-3">
              <label class="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)] block">
                1. Select Room Category
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <button 
                  *ngFor="let cat of interiorService.categories"
                  (click)="selectedCategory = cat.id; recalculate()"
                  [class.bg-[var(--color-primary)]]="selectedCategory === cat.id"
                  [class.text-white]="selectedCategory === cat.id"
                  [class.border-[var(--color-secondary)]]="selectedCategory === cat.id"
                  [class.bg-[var(--bg-surface-subtle)]]="selectedCategory !== cat.id"
                  [class.text-[var(--text-main)]]="selectedCategory !== cat.id"
                  class="p-3 rounded-2xl border border-[var(--border-subtle)] text-xs font-bold text-left transition-all hover:scale-102 flex flex-col justify-between">
                  <span>{{ cat.name }}</span>
                  <span class="text-[0.65rem] opacity-75 font-normal mt-1 font-mono">{{ cat.executionWeeks }}</span>
                </button>
              </div>
            </div>

            <!-- 2. Carpet Area Slider -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)]">
                  2. Floor Carpet Area
                </label>
                <div class="flex items-center gap-1.5 bg-[var(--bg-surface-subtle)] px-3 py-1.5 rounded-xl border border-[var(--border-subtle)]">
                  <input 
                    type="number" 
                    [(ngModel)]="areaSqFt" 
                    (ngModelChange)="recalculate()"
                    min="80" 
                    max="5000" 
                    class="w-20 bg-transparent text-right font-mono font-bold text-[var(--text-main)] text-base outline-none"
                  />
                  <span class="text-xs text-[var(--text-muted)] font-mono">sq.ft</span>
                </div>
              </div>

              <input 
                type="range" 
                [(ngModel)]="areaSqFt" 
                (ngModelChange)="recalculate()"
                min="100" 
                max="3000" 
                step="25"
                class="w-full cursor-pointer"
              />

              <div class="flex items-center justify-between text-[0.7rem] font-mono text-[var(--text-light)]">
                <span>100 sq.ft (Compact)</span>
                <span>1,500 sq.ft (Large Residence)</span>
                <span>3,000 sq.ft (Grand Estate)</span>
              </div>
            </div>

            <!-- 3. Quality / Design Tier -->
            <div class="space-y-3">
              <label class="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)] block">
                3. Material & Design Finish Tier
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button 
                  (click)="tier = 'essential'; recalculate()"
                  [class.border-[var(--color-secondary)]]="tier === 'essential'"
                  [class.bg-[var(--color-secondary-light)]]="tier === 'essential'"
                  class="p-4 rounded-2xl border border-[var(--border-subtle)] text-left transition-all">
                  <div class="font-bold text-xs text-[var(--text-main)]">Essential Studio</div>
                  <div class="text-[0.7rem] text-[var(--text-muted)] mt-1">HDHMR boards, 1mm laminates & Ebco joinery</div>
                </button>

                <button 
                  (click)="tier = 'premium'; recalculate()"
                  [class.border-[var(--color-secondary)]]="tier === 'premium'"
                  [class.bg-[var(--color-secondary-light)]]="tier === 'premium'"
                  class="p-4 rounded-2xl border border-[var(--border-subtle)] text-left transition-all">
                  <div class="font-bold text-xs text-[var(--color-secondary)]">★ Premium Bespoke</div>
                  <div class="text-[0.7rem] text-[var(--text-muted)] mt-1">IS-710 BWP Ply, fluted veneer & Hettich fittings</div>
                </button>

                <button 
                  (click)="tier = 'bespoke'; recalculate()"
                  [class.border-[var(--color-secondary)]]="tier === 'bespoke'"
                  [class.bg-[var(--color-secondary-light)]]="tier === 'bespoke'"
                  class="p-4 rounded-2xl border border-[var(--border-subtle)] text-left transition-all">
                  <div class="font-bold text-xs text-[var(--text-main)]">Architectural Luxury</div>
                  <div class="text-[0.7rem] text-[var(--text-muted)] mt-1">Italian marble, Blum fittings & high-gloss PU</div>
                </button>
              </div>
            </div>

            <!-- 4. Scope Checklist Inclusions -->
            <div class="space-y-3">
              <label class="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)] block">
                4. Included Turnkey Scope of Work
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label class="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] cursor-pointer text-xs">
                  <input type="checkbox" [(ngModel)]="includeCivil" (ngModelChange)="recalculate()" class="w-4 h-4 accent-[var(--color-secondary)]">
                  <span>Civil, Tiling & Flooring Works</span>
                </label>
                <label class="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] cursor-pointer text-xs">
                  <input type="checkbox" [(ngModel)]="includeWoodwork" (ngModelChange)="recalculate()" class="w-4 h-4 accent-[var(--color-secondary)]">
                  <span>Custom Millwork & Modular Storage</span>
                </label>
                <label class="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] cursor-pointer text-xs">
                  <input type="checkbox" [(ngModel)]="includeCeiling" (ngModelChange)="recalculate()" class="w-4 h-4 accent-[var(--color-secondary)]">
                  <span>False Ceiling & Architectural Lighting</span>
                </label>
                <label class="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] cursor-pointer text-xs">
                  <input type="checkbox" [(ngModel)]="includeFurnishing" (ngModelChange)="recalculate()" class="w-4 h-4 accent-[var(--color-secondary)]">
                  <span>Furniture, Curtains & Soft Decor</span>
                </label>
                <label class="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] cursor-pointer text-xs">
                  <input type="checkbox" [(ngModel)]="includeAutomation" (ngModelChange)="recalculate()" class="w-4 h-4 accent-[var(--color-secondary)]">
                  <span>Smart Home Automation & Sensor Lighting</span>
                </label>
                <label class="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] cursor-pointer text-xs">
                  <input type="checkbox" [(ngModel)]="includeFinishing" (ngModelChange)="recalculate()" class="w-4 h-4 accent-[var(--color-secondary)]">
                  <span>Italian PU, Texture Paints & Microcement</span>
                </label>
              </div>
            </div>

          </div>

          <!-- Right: Scope Summary Breakdown (5 cols) -->
          <div class="lg:col-span-5 space-y-6">
            
            <div class="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl border border-[var(--border-gold)] bg-[var(--bg-surface-card)]">
              
              <!-- Total Estimated Timeline -->
              <div class="space-y-1 text-center pb-6 border-b border-[var(--border-subtle)]">
                <span class="text-xs uppercase tracking-widest text-[var(--text-light)] font-semibold">
                  Estimated Turnkey Timeline
                </span>
                <div class="font-serif text-3xl sm:text-4xl font-bold text-[var(--color-secondary)]">
                  {{ result.estimatedWeeks }} Weeks Turnkey
                </div>
                <div class="text-xs text-[var(--text-muted)] font-mono mt-1">
                  Dedicated Craftsman Effort: <strong>{{ result.manpowerHours }} Hours</strong>
                </div>
              </div>

              <!-- Quality & Warranty Badges -->
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
                  <span class="text-[var(--text-light)] block text-[0.68rem] uppercase font-bold">Warranty</span>
                  <strong class="text-[var(--text-main)] font-semibold">{{ result.warrantyYears }} Years Warranty</strong>
                </div>
                <div class="p-3 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)]">
                  <span class="text-[var(--text-light)] block text-[0.68rem] uppercase font-bold">Quality Checks</span>
                  <strong class="text-[var(--text-main)] font-semibold">{{ result.qualityAudits }} Quality Audits</strong>
                </div>
              </div>

              <!-- Itemized Material Specifications -->
              <div class="space-y-3 text-xs">
                <div class="space-y-1">
                  <span class="text-[var(--text-light)] font-semibold uppercase text-[0.68rem] block">Material Grade Specification:</span>
                  <p class="text-[var(--text-main)] font-medium leading-relaxed bg-[var(--bg-surface-subtle)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                    {{ result.materialGrade }}
                  </p>
                </div>

                <div class="space-y-1">
                  <span class="text-[var(--text-light)] font-semibold uppercase text-[0.68rem] block">Hardware & Joinery Standard:</span>
                  <p class="text-[var(--text-main)] font-medium leading-relaxed bg-[var(--bg-surface-subtle)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                    {{ result.hardwareSpec }}
                  </p>
                </div>
              </div>

              <!-- Scope Distribution Breakdown -->
              <div class="space-y-2 text-xs pt-2 border-t border-[var(--border-subtle)]">
                <span class="text-xs uppercase tracking-wider font-semibold text-[var(--text-light)] block">Scope Distribution</span>
                
                <div class="space-y-1.5">
                  <div class="flex justify-between" *ngIf="includeCivil">
                    <span class="text-[var(--text-muted)]">Civil, Demolition & Flooring</span>
                    <strong class="font-mono text-[var(--text-main)]">{{ result.civilPercent }}%</strong>
                  </div>
                  <div class="flex justify-between" *ngIf="includeWoodwork">
                    <span class="text-[var(--text-muted)]">Modular Joinery & Storage</span>
                    <strong class="font-mono text-[var(--text-main)]">{{ result.woodworkPercent }}%</strong>
                  </div>
                  <div class="flex justify-between" *ngIf="includeCeiling">
                    <span class="text-[var(--text-muted)]">False Ceiling & Lighting</span>
                    <strong class="font-mono text-[var(--text-main)]">{{ result.ceilingLightingPercent }}%</strong>
                  </div>
                  <div class="flex justify-between" *ngIf="includeFurnishing">
                    <span class="text-[var(--text-muted)]">Soft Furnishing & Decor</span>
                    <strong class="font-mono text-[var(--text-main)]">{{ result.furnishingPercent }}%</strong>
                  </div>
                  <div class="flex justify-between" *ngIf="includeAutomation">
                    <span class="text-[var(--text-muted)]">Smart Home Automation</span>
                    <strong class="font-mono text-[var(--text-main)]">{{ result.automationPercent }}%</strong>
                  </div>
                  <div class="flex justify-between" *ngIf="includeFinishing">
                    <span class="text-[var(--text-muted)]">Italian PU & Surface Finishes</span>
                    <strong class="font-mono text-[var(--text-main)]">{{ result.finishingPercent }}%</strong>
                  </div>
                </div>
              </div>

              <!-- Action Buttons: Download Specification Document & Book Consultation -->
              <div class="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
                <button 
                  (click)="downloadQuotation()"
                  class="btn-gold w-full py-3 text-xs uppercase tracking-wider shadow-lg">
                  📄 Download Scope of Work & Specs (.txt)
                </button>

                <button 
                  (click)="openConsultation.emit()"
                  class="btn-secondary w-full py-3 text-xs uppercase tracking-wider">
                  📅 Schedule Studio Visit & Consultation
                </button>
              </div>

              <div class="text-[0.65rem] text-center text-[var(--text-light)]">
                * Turnkey specifications are executed as per BIS / ISO architectural standards.
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
export class CostEstimatorComponent {
  interiorService = inject(InteriorService);
  downloadService = inject(DownloadService);
  openConsultation = output<void>();

  selectedCategory: RoomCategoryId = 'living-room';
  areaSqFt = 450;
  tier: 'essential' | 'premium' | 'bespoke' = 'premium';

  includeCivil = true;
  includeWoodwork = true;
  includeCeiling = true;
  includeFurnishing = true;
  includeAutomation = false;
  includeFinishing = true;

  result = this.interiorService.calculateScope({
    category: this.selectedCategory,
    areaSqFt: this.areaSqFt,
    tier: this.tier,
    includeCivilFlooring: this.includeCivil,
    includeModularWoodwork: this.includeWoodwork,
    includeCeilingLighting: this.includeCeiling,
    includeFurnishingDecor: this.includeFurnishing,
    includeSmartAutomation: this.includeAutomation,
    includeWallFinishing: this.includeFinishing
  });

  recalculate() {
    this.result = this.interiorService.calculateScope({
      category: this.selectedCategory,
      areaSqFt: this.areaSqFt,
      tier: this.tier,
      includeCivilFlooring: this.includeCivil,
      includeModularWoodwork: this.includeWoodwork,
      includeCeilingLighting: this.includeCeiling,
      includeFurnishingDecor: this.includeFurnishing,
      includeSmartAutomation: this.includeAutomation,
      includeWallFinishing: this.includeFinishing
    });
  }

  downloadQuotation() {
    const cat = this.interiorService.getCategoryById(this.selectedCategory);
    const categoryName = cat ? cat.name : this.selectedCategory;
    const dateStr = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const quoteId = 'JS-SPEC-' + Math.floor(100000 + Math.random() * 900000);

    const quoteContent = `
================================================================================
          JS ENTERPRICES STUDIO — PROJECT SPECIFICATION & SCOPE OF WORK
================================================================================
Project Reference : ${quoteId}
Issue Date        : ${dateStr}
Space Category    : ${categoryName}
Floor Carpet Area : ${this.areaSqFt} sq.ft
Specification Tier: ${this.tier.toUpperCase()}
Execution Timeline: ${this.result.estimatedWeeks} Weeks Turnkey
Craftsman Hours   : ${this.result.manpowerHours} Dedicated Hours
Warranty Support  : ${this.result.warrantyYears} Years Comprehensive Warranty
Quality Audits    : ${this.result.qualityAudits} Stage Architectural Audits

--------------------------------------------------------------------------------
TECHNICAL SPECIFICATIONS & MATERIAL GRADES:
--------------------------------------------------------------------------------
- Material Standard : ${this.result.materialGrade}
- Joinery Hardware  : ${this.result.hardwareSpec}

--------------------------------------------------------------------------------
ITEMIZED TURNKEY SCOPE OF WORK:
--------------------------------------------------------------------------------
1. Civil & Flooring Works      : ${this.includeCivil ? 'INCLUDED (' + this.result.civilPercent + '% allocation)' : 'EXCLUDED'}
2. Modular Joinery & Storage   : ${this.includeWoodwork ? 'INCLUDED (' + this.result.woodworkPercent + '% allocation)' : 'EXCLUDED'}
3. False Ceiling & Lighting    : ${this.includeCeiling ? 'INCLUDED (' + this.result.ceilingLightingPercent + '% allocation)' : 'EXCLUDED'}
4. Soft Furnishing & Curtains  : ${this.includeFurnishing ? 'INCLUDED (' + this.result.furnishingPercent + '% allocation)' : 'EXCLUDED'}
5. Smart Home Automation       : ${this.includeAutomation ? 'INCLUDED (' + this.result.automationPercent + '% allocation)' : 'EXCLUDED'}
6. Surface Paints & Textures   : ${this.includeFinishing ? 'INCLUDED (' + this.result.finishingPercent + '% allocation)' : 'EXCLUDED'}

================================================================================
EXECUTION STANDARDS & SITE PROTOCOLS:
================================================================================
- Precise 3D Laser site measurements prior to factory fabrication.
- Zero-gap precision CNC cutting and edge-banding with PUR adhesives.
- Anti-termite & anti-fungal treatment on all structural framing.
- Complete on-site supervision by licensed architectural project managers.
- Book an on-site consultation at https://jsenterprices.in or call +91 9555131344.
================================================================================
`;

    this.downloadService.downloadTextFile(quoteContent, `${quoteId}_${categoryName.replace(/\s+/g, '_')}_Scope_Specs.txt`);
  }
}


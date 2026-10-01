import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InteriorService } from '../../services/interior.service';
import { DownloadService } from '../../services/download.service';
import { RoomCategoryId } from '../../models/interior.models';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <footer class="bg-[var(--color-primary)] text-white pt-20 pb-12 border-t border-white/10">
      <div class="container-custom space-y-16">
        
        <!-- Top Row: Brand & Newsletter -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div class="lg:col-span-5 space-y-6">
            <div class="flex items-center gap-3">
              <img src="js-logo.svg" alt="" aria-hidden="true" class="w-11 h-11 rounded-xl border border-[var(--border-gold)] shadow-md">
              <div>
                <span class="font-serif text-2xl font-bold tracking-tight text-white block leading-none">
                  JS ENTERPRICES
                </span>
                <span class="text-[0.65rem] tracking-[0.25em] font-semibold text-amber-300 uppercase block mt-1">
                  INTERIORS STUDIO
                </span>
              </div>
            </div>

            <p class="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Pioneering architectural interior design, custom millwork, and bespoke spatial experiences across residential sanctuaries and commercial flagship environments.
            </p>

            <div class="text-xs font-mono text-zinc-500 space-y-1">
              <div>Experience Studios: Mumbai • Delhi NCR • Bengaluru • Hyderabad • Pune • Chennai</div>
              <div>Inquiries: concierge&#64;jsenterprices.in | +91 8076224170</div>
            </div>
          </div>

          <!-- Newsletter Box -->
          <div class="lg:col-span-7 bg-white/5 p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
            <div class="space-y-1">
              <span class="badge-pill bg-[var(--color-secondary)]/20 text-amber-300 text-[0.7rem]">
                Architectural Journal
              </span>
              <h4 class="font-serif text-xl sm:text-2xl font-bold text-white">
                Receive Monthly Spatial Trend Reports
              </h4>
              <p class="text-xs text-zinc-400">
                Curated material breakdowns, color forecast palettes, and private invitations to showroom launches.
              </p>
            </div>

            <form (ngSubmit)="subscribeNewsletter()" class="flex flex-col sm:flex-row gap-2.5">
              <input 
                type="email" 
                [(ngModel)]="emailInput" 
                name="email" 
                required 
                placeholder="Enter your architectural email..."
                class="bg-white/10 text-white placeholder:text-zinc-500 text-sm rounded-xl px-4 py-3 border border-white/15 outline-none focus:border-[var(--color-secondary)] flex-1"
              />
              <button 
                type="submit" 
                class="btn-gold text-xs py-3 px-6 uppercase tracking-wider whitespace-nowrap shadow-lg">
                Subscribe Journal
              </button>
            </form>
          </div>

        </div>

        <!-- Middle Row: 9 Space Categories Links & Features -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 pt-12 border-t border-white/10 text-xs text-zinc-400">
          
          <!-- Column 1: Categories 1-5 -->
          <div class="space-y-3">
            <div class="font-serif font-bold text-sm text-white uppercase tracking-wider">Living & Rest</div>
            <ul class="space-y-2">
              <li><button (click)="selectCategory.emit('living-room')" class="hover:text-white transition-colors">Living Room</button></li>
              <li><button (click)="selectCategory.emit('bedroom')" class="hover:text-white transition-colors">Bedroom</button></li>
              <li><button (click)="selectCategory.emit('kitchen')" class="hover:text-white transition-colors">Kitchen</button></li>
              <li><button (click)="selectCategory.emit('bathroom')" class="hover:text-white transition-colors">Bathroom</button></li>
              <li><button (click)="selectCategory.emit('dining-room')" class="hover:text-white transition-colors">Dining Room</button></li>
            </ul>
          </div>

          <!-- Column 2: Categories 6-9 -->
          <div class="space-y-3">
            <div class="font-serif font-bold text-sm text-white uppercase tracking-wider">Work & Outdoor</div>
            <ul class="space-y-2">
              <li><button (click)="selectCategory.emit('home-office')" class="hover:text-white transition-colors">Home Office</button></li>
              <li><button (click)="selectCategory.emit('study')" class="hover:text-white transition-colors">Study & Library</button></li>
              <li><button (click)="selectCategory.emit('commercial-retail')" class="hover:text-white transition-colors">Commercial / Retail</button></li>
              <li><button (click)="selectCategory.emit('outdoor-terraces')" class="hover:text-white transition-colors">Outdoor / Terraces</button></li>
            </ul>
          </div>

          <!-- Column 3: Interactive Tools -->
          <div class="space-y-3">
            <div class="font-serif font-bold text-sm text-white uppercase tracking-wider">Design Tools</div>
            <ul class="space-y-2">
              <li><a href="#visualizer" class="hover:text-white transition-colors">Room Visualizer</a></li>
              <li><a href="#estimator" class="hover:text-white transition-colors">Scope & Material Planner</a></li>
              <li><a href="#transformations" class="hover:text-white transition-colors">Before & After Slider</a></li>
              <li><a href="#quiz" class="hover:text-white transition-colors">Style Diagnostic Quiz</a></li>
              <li><a href="#moodboard" class="hover:text-white transition-colors">Moodboard Canvas</a></li>
            </ul>
          </div>

          <!-- Column 4: Design Aesthetics -->
          <div class="space-y-3">
            <div class="font-serif font-bold text-sm text-white uppercase tracking-wider">Aesthetics</div>
            <ul class="space-y-2">
              <li><span>Japandi Serenity</span></li>
              <li><span>Modern Luxury Penthouse</span></li>
              <li><span>Scandinavian Minimal</span></li>
              <li><span>Industrial Loft & Concrete</span></li>
              <li><span>Biophilic Architecture</span></li>
            </ul>
          </div>

          <!-- Column 5: Downloads & Studio -->
          <div class="space-y-3">
            <div class="font-serif font-bold text-sm text-white uppercase tracking-wider">Studio Assets</div>
            <ul class="space-y-2">
              <li><span class="text-emerald-400">✓ 100% Client-Side Engine</span></li>
              <li><span>Full HD Image Downloads</span></li>
              <li><span>Turnkey Scope Specification Export</span></li>
              <li><span>Bespoke Materiality Specs</span></li>
            </ul>
          </div>

        </div>

        <!-- Bottom Copyright Row -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10 text-xs text-zinc-500">
          <div>
            © {{ currentYear }} JS ENTERPRICES STUDIO. All rights reserved. Architectural spatial design.
          </div>

          <div class="flex items-center gap-6">
            <a href="#hero" class="hover:text-white transition-colors">Back to Top ↑</a>
          </div>
        </div>

      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FooterComponent {
  downloadService = inject(DownloadService);
  selectCategory = output<RoomCategoryId>();

  emailInput = '';
  currentYear = new Date().getFullYear();

  subscribeNewsletter() {
    if (!this.emailInput) return;
    this.downloadService.showToast(`✓ Subscribed ${this.emailInput} to Spatial Journal!`);
    this.emailInput = '';
  }
}

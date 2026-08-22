import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadService } from '../../services/download.service';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="downloadService.toastMessage()"
      class="fixed bottom-6 right-6 z-50 animate-scale-in max-w-sm">
      
      <div class="glass-panel p-4 rounded-2xl shadow-2xl border border-[var(--border-gold)] bg-[var(--bg-surface)] text-[var(--text-main)] flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-[var(--color-secondary)] text-[#121316] font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-md">
          ✨
        </div>
        
        <div class="flex-1 text-xs font-semibold leading-snug">
          {{ downloadService.toastMessage() }}
        </div>

        <button 
          (click)="downloadService.toastMessage.set(null)"
          class="text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] p-1">
          ✕
        </button>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ToastNotificationComponent {
  downloadService = inject(DownloadService);
}

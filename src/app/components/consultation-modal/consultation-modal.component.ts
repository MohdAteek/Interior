import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { InteriorService } from '../../services/interior.service';
import { DownloadService } from '../../services/download.service';
import { RoomCategoryId, ConsultationRequest } from '../../models/interior.models';

@Component({
  selector: 'app-consultation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      (click)="close.emit()">
      
      <div 
        class="bg-[var(--bg-surface)] text-[var(--text-main)] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[var(--border-medium)] p-6 sm:p-8 space-y-6"
        (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div class="space-y-1">
            <span class="badge-pill badge-gold text-[0.7rem]">Complimentary Studio Discovery</span>
            <h3 class="font-serif text-2xl sm:text-3xl font-bold">
              Book Architectural Consultation
            </h3>
            <p class="text-xs text-[var(--text-muted)]">
              Meet our principal architects to review floorplans, spatial concepts, and turnkey timelines.
            </p>
          </div>

          <button 
            (click)="close.emit()"
            class="btn-icon text-lg"
            aria-label="Close modal">
            ✕
          </button>
        </div>

        <!-- State 1: Booking Form -->
        <form *ngIf="!submittedRequest" (ngSubmit)="submitBooking()" class="space-y-5">
          
          <!-- Name & Email -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)]">Full Name *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.name" 
                name="name" 
                required 
                placeholder="e.g. Eleanor Vance"
                class="w-full bg-[var(--bg-surface-subtle)] text-[var(--text-main)] text-sm rounded-xl px-4 py-2.5 border border-[var(--border-subtle)] outline-none focus:border-[var(--color-secondary)]"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)]">Email Address *</label>
              <input 
                type="email" 
                [(ngModel)]="formData.email" 
                name="email" 
                required 
                placeholder="eleanor@example.com"
                class="w-full bg-[var(--bg-surface-subtle)] text-[var(--text-main)] text-sm rounded-xl px-4 py-2.5 border border-[var(--border-subtle)] outline-none focus:border-[var(--color-secondary)]"
              />
            </div>
          </div>

          <!-- Phone & Category -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)]">Phone Number</label>
              <input 
                type="tel" 
                [(ngModel)]="formData.phone" 
                name="phone" 
                placeholder="+1 (555) 019-2834"
                class="w-full bg-[var(--bg-surface-subtle)] text-[var(--text-main)] text-sm rounded-xl px-4 py-2.5 border border-[var(--border-subtle)] outline-none focus:border-[var(--color-secondary)]"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)]">Primary Space Category *</label>
              <select 
                [(ngModel)]="formData.category" 
                name="category" 
                required
                class="w-full bg-[var(--bg-surface-subtle)] text-[var(--text-main)] text-sm rounded-xl px-4 py-2.5 border border-[var(--border-subtle)] outline-none focus:border-[var(--color-secondary)]">
                <option *ngFor="let cat of interiorService.categories" [value]="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Project Scope & Preferred Timeline -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)]">Project Scope</label>
              <select 
                [(ngModel)]="formData.projectScope" 
                name="projectScope"
                class="w-full bg-[var(--bg-surface-subtle)] text-[var(--text-main)] text-sm rounded-xl px-4 py-2.5 border border-[var(--border-subtle)] outline-none focus:border-[var(--color-secondary)]">
                <option value="Complete Home Interior (3BHK / 4BHK / Villa)">Complete Home Interior (3BHK / 4BHK / Villa)</option>
                <option value="Modular Kitchen & Custom Wardrobes">Modular Kitchen & Custom Wardrobes</option>
                <option value="Living & Dining Architectural Revamp">Living & Dining Architectural Revamp</option>
                <option value="Commercial Office / Retail Boutique">Commercial Office / Retail Boutique</option>
                <option value="Full Architectural Turnkey Construction">Full Architectural Turnkey Construction</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)]">Target Completion</label>
              <select 
                [(ngModel)]="formData.timeline" 
                name="timeline"
                class="w-full bg-[var(--bg-surface-subtle)] text-[var(--text-main)] text-sm rounded-xl px-4 py-2.5 border border-[var(--border-subtle)] outline-none focus:border-[var(--color-secondary)]">
                <option value="Immediate (1-2 months)">Immediate (1 - 2 months)</option>
                <option value="Standard (3-4 months)">Standard (3 - 4 months)</option>
                <option value="Planning for next year">Planning for next year</option>
              </select>
            </div>
          </div>

          <!-- Date & Time Slot -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)]">Preferred Date</label>
              <input 
                type="date" 
                [(ngModel)]="formData.preferredDate" 
                name="preferredDate"
                class="w-full bg-[var(--bg-surface-subtle)] text-[var(--text-main)] text-sm rounded-xl px-4 py-2.5 border border-[var(--border-subtle)] outline-none focus:border-[var(--color-secondary)]"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)]">Preferred Time Slot</label>
              <select 
                [(ngModel)]="formData.timeSlot" 
                name="timeSlot"
                class="w-full bg-[var(--bg-surface-subtle)] text-[var(--text-main)] text-sm rounded-xl px-4 py-2.5 border border-[var(--border-subtle)] outline-none focus:border-[var(--color-secondary)]">
                <option value="Morning (10:00 AM - 12:00 PM)">Morning (10:00 AM - 12:00 PM)</option>
                <option value="Afternoon (02:00 PM - 04:00 PM)">Afternoon (02:00 PM - 04:00 PM)</option>
                <option value="Evening (05:30 PM - 07:30 PM)">Evening (05:30 PM - 07:30 PM)</option>
              </select>
            </div>
          </div>

          <!-- Project Notes -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-[var(--text-light)]">Project Vision & Specific Requirements</label>
            <textarea 
              [(ngModel)]="formData.projectScopeNotes" 
              name="projectScopeNotes" 
              rows="3" 
              placeholder="Describe your design aspirations, preferred materials (e.g. walnut slats, quartz waterfall), or existing floorplan quirks..."
              class="w-full bg-[var(--bg-surface-subtle)] text-[var(--text-main)] text-sm rounded-xl px-4 py-2.5 border border-[var(--border-subtle)] outline-none focus:border-[var(--color-secondary)]"></textarea>
          </div>

          <!-- Submit Action -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
            <button 
              type="button" 
              (click)="close.emit()"
              class="btn-secondary text-xs py-2.5 px-5">
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn-primary text-xs py-2.5 px-6 uppercase tracking-wider">
              Confirm Consultation Booking →
            </button>
          </div>

        </form>

        <!-- State 2: Booking Confirmation Receipt -->
        <div *ngIf="submittedRequest" class="space-y-6 text-center py-4 animate-scale-in">
          
          <div class="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 text-3xl font-bold flex items-center justify-center mx-auto">
            ✓
          </div>

          <div class="space-y-2">
            <span class="badge-pill bg-emerald-500/20 text-emerald-600 text-xs">Booking Confirmed</span>
            <h4 class="font-serif text-2xl sm:text-3xl font-bold">
              We Look Forward to Designing With You
            </h4>
            <p class="text-sm text-[var(--text-muted)] max-w-md mx-auto">
              Your appointment request has been scheduled in our studio queue. A confirmation has been stored in your session.
            </p>
          </div>

          <!-- Receipt Details Box -->
          <div class="bg-[var(--bg-surface-subtle)] p-6 rounded-2xl border border-[var(--border-subtle)] text-xs text-left space-y-2 max-w-md mx-auto">
            <div class="flex justify-between py-1 border-b border-[var(--border-subtle)]">
              <span class="text-[var(--text-muted)]">Booking Reference:</span>
              <strong class="font-mono text-[var(--color-secondary)]">{{ submittedRequest.id }}</strong>
            </div>
            <div class="flex justify-between py-1 border-b border-[var(--border-subtle)]">
              <span class="text-[var(--text-muted)]">Client Name:</span>
              <strong class="text-[var(--text-main)]">{{ submittedRequest.name }}</strong>
            </div>
            <div class="flex justify-between py-1 border-b border-[var(--border-subtle)]">
              <span class="text-[var(--text-muted)]">Category Space:</span>
              <strong class="text-[var(--text-main)]">{{ submittedRequest.category }}</strong>
            </div>
            <div class="flex justify-between py-1 border-b border-[var(--border-subtle)]">
              <span class="text-[var(--text-muted)]">Target Timeline:</span>
              <strong class="text-[var(--text-main)]">{{ submittedRequest.timeline }}</strong>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-[var(--text-muted)]">Slot Time:</span>
              <strong class="text-[var(--text-main)]">{{ submittedRequest.timeSlot }}</strong>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button 
              (click)="downloadReceipt()"
              class="btn-gold text-xs py-2.5 px-5 shadow-md">
              📄 Download Booking Receipt (.txt)
            </button>
            <button 
              (click)="close.emit()"
              class="btn-primary text-xs py-2.5 px-6">
              Return to Gallery
            </button>
          </div>

        </div>

      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ConsultationModalComponent {
  storageService = inject(StorageService);
  interiorService = inject(InteriorService);
  downloadService = inject(DownloadService);

  close = output<void>();

  formData = {
    name: '',
    email: '',
    phone: '',
    category: 'living-room' as RoomCategoryId,
    projectScope: 'Complete Home Interior (3BHK / 4BHK / Villa)',
    timeline: 'Standard (3-4 months)',
    preferredDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    timeSlot: 'Morning (10:00 AM - 12:00 PM)',
    projectScopeNotes: ''
  };

  submittedRequest: ConsultationRequest | null = null;

  submitBooking(): void {
    if (!this.formData.name || !this.formData.email) {
      this.downloadService.showToast('Please provide your name and email address.');
      return;
    }

    const booking: ConsultationRequest = {
      id: 'JS-BK-' + Math.floor(100000 + Math.random() * 900000),
      name: this.formData.name,
      email: this.formData.email,
      phone: this.formData.phone,
      category: this.formData.category,
      projectScope: this.formData.projectScope,
      timeline: this.formData.timeline,
      preferredDate: this.formData.preferredDate,
      timeSlot: this.formData.timeSlot,
      projectScopeNotes: this.formData.projectScopeNotes,
      createdAt: new Date().toISOString()
    };

    this.storageService.saveBooking(booking);
    this.submittedRequest = booking;
    this.downloadService.showToast(`✓ Appointment confirmed! Ref: ${booking.id}`);
  }

  downloadReceipt(): void {
    if (!this.submittedRequest) return;
    const b = this.submittedRequest;

    const receiptContent = `
================================================================================
           JS ENTERPRICES STUDIO — CONSULTATION BOOKING CONFIRMATION
================================================================================
Appointment Ref    : ${b.id}
Client Name        : ${b.name}
Email              : ${b.email}
Phone              : ${b.phone || 'N/A'}
Space Category     : ${b.category.toUpperCase()}
Project Scope      : ${b.projectScope}
Target Timeline    : ${b.timeline}
Preferred Date     : ${b.preferredDate}
Session Slot       : ${b.timeSlot}

PROJECT SCOPE NOTES:
${b.projectScopeNotes || 'No specific notes provided.'}

================================================================================
STUDIO CONTACT:
JS ENTERPRICES ARCHITECTURAL STUDIO
Experience Studios: Mumbai • Delhi NCR • Bengaluru • Hyderabad • Pune • Chennai
Direct Concierge: +91 8076224170
Website: https://jsenterprices.in
================================================================================
`;

    this.downloadService.downloadTextFile(receiptContent, `${b.id}_Appointment_Receipt.txt`);
  }
}

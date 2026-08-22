import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  isDownloading = signal<boolean>(false);
  downloadProgressMessage = signal<string>('');
  toastMessage = signal<string | null>(null);

  /**
   * Downloads a single image file to the user's computer with a clean descriptive name.
   */
  async downloadImage(imageUrl: string, filename: string): Promise<boolean> {
    this.isDownloading.set(true);
    this.downloadProgressMessage.set(`Preparing ${filename}...`);
    this.showToast(`Starting download: ${filename}`);

    try {
      // Clean filename
      const safeFilename = filename.endsWith('.jpg') || filename.endsWith('.png') 
        ? filename 
        : `${filename.replace(/[^a-zA-Z0-9_-]/g, '_')}.jpg`;

      // Try fetching as blob (Unsplash URLs support CORS)
      try {
        const response = await fetch(imageUrl, {
          mode: 'cors',
          cache: 'no-cache'
        });

        if (!response.ok) throw new Error('Fetch failed');

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        this.triggerNativeDownload(blobUrl, safeFilename);
        window.URL.revokeObjectURL(blobUrl);

        this.showToast(`✓ Downloaded ${safeFilename} successfully!`);
        this.isDownloading.set(false);
        return true;
      } catch (corsErr) {
        // Fallback: draw image to HTML5 canvas and export data URL
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'anonymous';

        await new Promise((resolve, reject) => {
          img.onload = () => {
            canvas.width = img.naturalWidth || 1920;
            canvas.height = img.naturalHeight || 1080;
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              // Add subtle watermark
              ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
              ctx.font = 'bold 24px sans-serif';
              ctx.fillText('AURA INTERIORS', 32, canvas.height - 32);
            }
            try {
              const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
              this.triggerNativeDownload(dataUrl, safeFilename);
              this.showToast(`✓ Downloaded ${safeFilename}!`);
              resolve(true);
            } catch (canvasErr) {
              // Direct anchor tag fallback
              this.triggerNativeDownload(imageUrl, safeFilename);
              this.showToast(`Opened high-res image for download`);
              resolve(true);
            }
          };
          img.onerror = () => {
            // Direct anchor fallback
            this.triggerNativeDownload(imageUrl, safeFilename);
            this.showToast(`Opened image download link`);
            resolve(true);
          };
          img.src = imageUrl;
        });

        this.isDownloading.set(false);
        return true;
      }
    } catch (error) {
      console.error('Download error:', error);
      this.showToast(`Download started in new tab`);
      this.triggerNativeDownload(imageUrl, filename);
      this.isDownloading.set(false);
      return false;
    }
  }

  /**
   * Downloads multiple images in batch with staggered delays
   */
  async downloadBatch(items: { url: string; name: string }[], categoryName: string): Promise<void> {
    if (!items.length) return;

    this.isDownloading.set(true);
    this.showToast(`Downloading ${items.length} images from ${categoryName}...`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      this.downloadProgressMessage.set(`Downloading (${i + 1}/${items.length}): ${item.name}`);
      await this.downloadImage(item.url, item.name);
      // Brief pause between downloads to prevent browser throttling
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    this.showToast(`✓ Completed downloading all ${items.length} ${categoryName} photos!`);
    this.isDownloading.set(false);
  }

  /**
   * Exports a structured text / printable quotation receipt
   */
  downloadTextFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    this.triggerNativeDownload(url, filename);
    URL.revokeObjectURL(url);
    this.showToast(`✓ Downloaded ${filename}`);
  }

  private triggerNativeDownload(url: string, filename: string): void {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  showToast(message: string): void {
    this.toastMessage.set(message);
    setTimeout(() => {
      if (this.toastMessage() === message) {
        this.toastMessage.set(null);
      }
    }, 4000);
  }
}

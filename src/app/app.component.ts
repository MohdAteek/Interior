import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { CategoriesShowcaseComponent } from './components/categories-showcase/categories-showcase.component';
import { GalleryHubComponent } from './components/gallery-hub/gallery-hub.component';
import { RoomVisualizerComponent } from './components/room-visualizer/room-visualizer.component';
import { CostEstimatorComponent } from './components/cost-estimator/cost-estimator.component';
import { BeforeAfterSliderComponent } from './components/before-after-slider/before-after-slider.component';
import { StyleQuizComponent } from './components/style-quiz/style-quiz.component';
import { MoodboardStudioComponent } from './components/moodboard-studio/moodboard-studio.component';
import { FavoritesDrawerComponent } from './components/favorites-drawer/favorites-drawer.component';
import { ConsultationModalComponent } from './components/consultation-modal/consultation-modal.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToastNotificationComponent } from './components/toast-notification/toast-notification.component';
import { RoomCategoryId, DesignStyle } from './models/interior.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    CategoriesShowcaseComponent,
    GalleryHubComponent,
    RoomVisualizerComponent,
    CostEstimatorComponent,
    BeforeAfterSliderComponent,
    StyleQuizComponent,
    MoodboardStudioComponent,
    FavoritesDrawerComponent,
    ConsultationModalComponent,
    FooterComponent,
    ToastNotificationComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'JS ENTERPRICES STUDIO';
  readonly contactNumber = '9555131344';
  readonly whatsappUrl = 'https://wa.me/919555131344?text=' + encodeURIComponent('Hello JS Enterprices, I would like to discuss my interior design requirements.');

  selectedCategory = signal<RoomCategoryId | 'all'>('all');
  isFavoritesDrawerOpen = signal<boolean>(false);
  isConsultationModalOpen = signal<boolean>(false);

  onCategorySelect(catId: RoomCategoryId) {
    this.selectedCategory.set(catId);
    const element = document.getElementById('gallery');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onSearchFromHero(query: string) {
    const element = document.getElementById('gallery');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onViewProjectFromHero(projectId: string) {
    const element = document.getElementById('gallery');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

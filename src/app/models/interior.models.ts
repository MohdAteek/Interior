export type RoomCategoryId = 
  | 'living-room'
  | 'bedroom'
  | 'kitchen'
  | 'bathroom'
  | 'dining-room'
  | 'home-office'
  | 'study'
  | 'commercial-retail'
  | 'outdoor-terraces';

export type DesignStyle = 
  | 'Scandinavian'
  | 'Modern Luxury'
  | 'Japandi'
  | 'Minimalist'
  | 'Industrial Loft'
  | 'Mid-Century Modern'
  | 'Bohemian Luxe'
  | 'Biophilic Nature'
  | 'Classic Contemporary';

export interface CategoryInfo {
  id: RoomCategoryId;
  name: string;
  shortDesc: string;
  longDesc: string;
  coverImage: string;
  icon: string;
  projectCount: number;
  trendingStyle: string;
  executionWeeks: string;
  typicalAreaRange: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface DesignProject {
  id: string;
  title: string;
  category: RoomCategoryId;
  categoryName: string;
  style: DesignStyle;
  areaSqFt: number;
  scopeTier: 'Essential' | 'Premium' | 'Bespoke' | 'Grand Estate';
  executionTimeline: string;
  image: string;
  galleryImages: string[];
  colorPalette: ColorSwatch[];
  features: string[];
  materials: string[];
  designer: {
    name: string;
    role: string;
    avatar: string;
  };
  location: string;
  completedYear: number;
  description: string;
  likes: number;
  views: number;
  rating: number;
  isFeatured?: boolean;
  beforeImage?: string;
  afterImage?: string;
  tags: string[];
}

export interface RoomVisualizerOption {
  id: string;
  name: string;
  hex?: string;
  textureUrl?: string;
  thumbnail?: string;
  description?: string;
}

export interface VisualizerState {
  roomCategoryId: RoomCategoryId;
  wallColor: RoomVisualizerOption;
  flooring: RoomVisualizerOption;
  lighting: 'daylight' | 'golden-hour' | 'warm-amber' | 'moody-evening';
  furnitureAccent: RoomVisualizerOption;
}

export interface ProjectScopeParams {
  category: RoomCategoryId;
  areaSqFt: number;
  tier: 'essential' | 'premium' | 'bespoke';
  includeCivilFlooring: boolean;
  includeModularWoodwork: boolean;
  includeCeilingLighting: boolean;
  includeFurnishingDecor: boolean;
  includeSmartAutomation: boolean;
  includeWallFinishing: boolean;
}

// Backward compatibility alias
export type CostCalculationParams = ProjectScopeParams;

export interface ProjectScopeResult {
  civilPercent: number;
  woodworkPercent: number;
  ceilingLightingPercent: number;
  furnishingPercent: number;
  automationPercent: number;
  finishingPercent: number;
  estimatedWeeks: number;
  manpowerHours: number;
  materialGrade: string;
  hardwareSpec: string;
  warrantyYears: number;
  qualityAudits: number;
}

// Backward compatibility alias
export type CostCalculationResult = ProjectScopeResult;

export interface ConsultationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: RoomCategoryId;
  projectScope: string;
  budgetTier?: string; // Optional for backward compatibility
  timeline: string;
  preferredDate: string;
  timeSlot: string;
  projectScopeNotes: string;
  createdAt: string;
}

export interface MoodboardCanvasItem {
  id: string;
  title: string;
  type: 'image' | 'color' | 'texture' | 'furniture' | 'material' | 'note';
  value: string;
  subtitle?: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
}

export interface StyleQuizStep {
  id: number;
  question: string;
  subtitle: string;
  options: {
    id: string;
    title: string;
    description: string;
    image: string;
    matchedStyle: DesignStyle;
  }[];
}

export interface StyleQuizResult {
  primaryStyle: DesignStyle;
  title: string;
  description: string;
  keyElements: string[];
  recommendedPalette: ColorSwatch[];
  matchingCategoryIds: RoomCategoryId[];
  bannerImage: string;
}

import { Injectable, signal, computed } from '@angular/core';
import { 
  CategoryInfo, 
  DesignProject, 
  RoomCategoryId, 
  DesignStyle, 
  RoomVisualizerOption, 
  ProjectScopeParams,
  ProjectScopeResult,
  CostCalculationParams, 
  CostCalculationResult,
  StyleQuizStep,
  StyleQuizResult,
  MoodboardCanvasItem
} from '../models/interior.models';

@Injectable({
  providedIn: 'root'
})
export class InteriorService {

  // All 9 Required Categories
  readonly categories: CategoryInfo[] = [
    {
      id: 'living-room',
      name: 'Living Room',
      shortDesc: 'Curated architectural lounges, focal fireplaces & bespoke open-plan living sanctuaries.',
      longDesc: 'Transform everyday gathering into high aesthetic living with tailored lounge seating, sculpted lighting, acoustic wood panels, and balanced materiality.',
      coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
      icon: 'sofa',
      projectCount: 6,
      trendingStyle: 'Japandi & Warm Minimalist',
      executionWeeks: '4–8 Weeks',
      typicalAreaRange: '200 – 1,200 sq.ft'
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      shortDesc: 'Calming master suites, upholstered headboards & ambient circadian lighting.',
      longDesc: 'Restful master sanctuaries engineered with tactile linen drapes, integrated acoustic backdrops, walk-in dressing suites, and gentle layered illumination.',
      coverImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85',
      icon: 'bed',
      projectCount: 6,
      trendingStyle: 'Scandinavian Luxury & Velvet Luxe',
      executionWeeks: '4–8 Weeks',
      typicalAreaRange: '200 – 1,200 sq.ft'
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      shortDesc: 'Sleek waterfall quartz islands, handleless cabinetry & chef-grade functional elegance.',
      longDesc: 'Culinary epicenters featuring quartz marble waterfall counters, concealed appliance garages, flush architectural joinery, and zoned task illumination.',
      coverImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85',
      icon: 'utensils',
      projectCount: 6,
      trendingStyle: 'Modern Monolithic & Smoked Oak',
      executionWeeks: '4–8 Weeks',
      typicalAreaRange: '200 – 1,200 sq.ft'
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      shortDesc: 'Spa-inspired wet rooms, fluted glass screens, free-standing tubs & terrazzo stone.',
      longDesc: 'Sensory wellness retreats boasting floor-to-ceiling bookmatched marble, rain showers with linear drains, backlit vanities, and matte black brassware.',
      coverImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85',
      icon: 'bath',
      projectCount: 5,
      trendingStyle: 'Terrazzo & Spa Minimalist',
      executionWeeks: '4–8 Weeks',
      typicalAreaRange: '200 – 1,200 sq.ft'
    },
    {
      id: 'dining-room',
      name: 'Dining Room',
      shortDesc: 'Statement chandeliers, sculpted timber banquet tables & wine alcove integrations.',
      longDesc: 'Intimate and grand dining spaces centered around artisan solid wood tables, sculpted pendants, bespoke credenzas, and mood-setting dimmable chandeliers.',
      coverImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=85',
      icon: 'wine',
      projectCount: 5,
      trendingStyle: 'Mid-Century & Brass Accents',
      executionWeeks: '4–8 Weeks',
      typicalAreaRange: '200 – 1,200 sq.ft'
    },
    {
      id: 'home-office',
      name: 'Home Office',
      shortDesc: 'Ergonomic executive suites, acoustic slat walls, concealed cable runs & library walls.',
      longDesc: 'High-productivity workspaces tailored for focus with integrated walnut desks, biophilic planters, soft acoustic felt paneling, and glare-free video call lighting.',
      coverImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85',
      icon: 'briefcase',
      projectCount: 5,
      trendingStyle: 'Executive Walnut & Modern Loft',
      executionWeeks: '4–8 Weeks',
      typicalAreaRange: '200 – 1,200 sq.ft'
    },
    {
      id: 'study',
      name: 'Study',
      shortDesc: 'Floor-to-ceiling bookcases, velvet reading nooks, rolling ladders & classic warmth.',
      longDesc: 'Dedicated intellectual spaces featuring double-height custom millwork, library ladders, warm cognac leather armchairs, and focused brass reading task lamps.',
      coverImage: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=85',
      icon: 'book-open',
      projectCount: 5,
      trendingStyle: 'Classic Library & Botanical Study',
      executionWeeks: '4–8 Weeks',
      typicalAreaRange: '200 – 1,200 sq.ft'
    },
    {
      id: 'commercial-retail',
      name: 'Commercial / Retail',
      shortDesc: 'Boutique showrooms, flagship apparel spaces, specialty cafes & co-working hubs.',
      longDesc: 'Captivating brand environments engineered to drive footfall with experiential display pods, micro-cement finishes, theatrical track lighting, and fluid spatial circulation.',
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
      icon: 'store',
      projectCount: 5,
      trendingStyle: 'Industrial Chic & Brutalist Luxe',
      executionWeeks: '4–8 Weeks',
      typicalAreaRange: '200 – 1,200 sq.ft'
    },
    {
      id: 'outdoor-terraces',
      name: 'Outdoor / Terraces',
      shortDesc: 'Biophilic rooftop lounges, teak decking, pergola cabanas & firepit alcoves.',
      longDesc: 'Seamless indoor-outdoor living sanctuaries boasting weather-resistant teak furniture, integrated stone fire tables, architectural planters, and ambient solar illumination.',
      coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
      icon: 'sun',
      projectCount: 5,
      trendingStyle: 'Mediterranean & Biophilic Pergola',
      executionWeeks: '4–8 Weeks',
      typicalAreaRange: '200 – 1,200 sq.ft'
    }
  ];

  // Comprehensive Curated Database of 48+ Interior Design Projects
  readonly projects: DesignProject[] = [
    // --- LIVING ROOM ---
    {
      id: 'lr-01',
      title: 'Nordic Serenity Architectural Lounge',
      category: 'living-room',
      categoryName: 'Living Room',
      style: 'Japandi',
      areaSqFt: 420,
      scopeTier: 'Bespoke',
    executionTimeline: '6–8 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85'
      ],
      colorPalette: [
        { name: 'Warm Alabaster', hex: '#F4F1EA' },
        { name: 'Smoked Oak', hex: '#7A6453' },
        { name: 'Cashmere Grey', hex: '#C5BFB8' },
        { name: 'Charcoal Accent', hex: '#2C2E33' }
      ],
      features: ['Curved Bouclé Sectional', 'Acoustic White Oak Slat Wall', 'Concealed LED Cove Lighting', 'Low Fluted Travertine Coffee Table'],
      materials: ['White Oak', 'Travertine Stone', 'Bouclé Fabric', 'Microcement'],
      designer: { name: 'Elena Rostova', role: 'Principal Architect', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
      location: 'Copenhagen, Denmark',
      completedYear: 2025,
      description: 'A harmonious blend of Scandinavian minimalism and Japanese spatial tranquility, featuring expansive double-glazed floor windows, organic curved furniture, and custom acoustic millwork.',
      likes: 342,
      views: 2840,
      rating: 4.9,
      isFeatured: true,
      beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      afterImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      tags: ['japandi', 'minimalist', 'living-room', 'curved-sofa', 'wood-slats']
    },
    {
      id: 'lr-02',
      title: 'Monolithic Marble Penthouse Salon',
      category: 'living-room',
      categoryName: 'Living Room',
      style: 'Modern Luxury',
      areaSqFt: 580,
      scopeTier: 'Grand Estate',
    executionTimeline: '10–14 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'
      ],
      colorPalette: [
        { name: 'Nero Marquina', hex: '#1C1D21' },
        { name: 'Calacatta Gold', hex: '#EBE7DF' },
        { name: 'Brushed Brass', hex: '#D4AF37' },
        { name: 'Taupe Velvet', hex: '#8F857D' }
      ],
      features: ['Suspended Ethanol Fireplace', 'Double-Height Bookmatched Marble Slab', 'Integrated Smart Audio', 'Bespoke Velvet Daybed'],
      materials: ['Calacatta Marble', 'Brushed Brass', 'Italian Velvet', 'Smoked Glass'],
      designer: { name: 'Julian Vance', role: 'Luxury Interiors Director', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      location: 'Manhattan, New York',
      completedYear: 2024,
      description: 'High-altitude grandeur defined by towering floor-to-ceiling bookmatched marble surfaces, brass inlays, and customized Italian modular seating.',
      likes: 512,
      views: 4120,
      rating: 5.0,
      isFeatured: true,
      tags: ['luxury', 'marble', 'penthouse', 'fireplace', 'brass']
    },
    {
      id: 'lr-03',
      title: 'Warm Bohemian Sunlit Living Loft',
      category: 'living-room',
      categoryName: 'Living Room',
      style: 'Bohemian Luxe',
      areaSqFt: 350,
      scopeTier: 'Premium',
    executionTimeline: '4–6 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=85'
      ],
      colorPalette: [
        { name: 'Terracotta Warmth', hex: '#C86D51' },
        { name: 'Natural Rattan', hex: '#D6B48B' },
        { name: 'Olive Green', hex: '#5B6E57' },
        { name: 'Ecru Linen', hex: '#F0ECE1' }
      ],
      features: ['Woven Rattan Room Divider', 'Exposed Reclaimed Brick Accent', 'Indoor Fiddle Leaf Fig Planter', 'Layered Moroccan Rugs'],
      materials: ['Rattan Cane', 'Terracotta Clay', 'Raw Linen', 'Reclaimed Teak'],
      designer: { name: 'Amara Diop', role: 'Organic Interior Designer', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
      location: 'Melbourne, Australia',
      completedYear: 2025,
      description: 'Sun-drenched loft celebrating natural organic fibers, terracotta earth tones, lush indoor botanicals, and bespoke handcrafted artisan furnishings.',
      likes: 289,
      views: 1980,
      rating: 4.8,
      tags: ['bohemian', 'plants', 'earthy', 'rattan', 'cozy']
    },
    {
      id: 'lr-04',
      title: 'Minimalist Charcoal & Walnut Pavilion',
      category: 'living-room',
      categoryName: 'Living Room',
      style: 'Minimalist',
      areaSqFt: 460,
      scopeTier: 'Bespoke',
    executionTimeline: '6–8 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
      galleryImages: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'],
      colorPalette: [
        { name: 'Obsidian Slate', hex: '#1E2024' },
        { name: 'Rich Walnut', hex: '#593E2B' },
        { name: 'Sandstone Grey', hex: '#B8B3AC' }
      ],
      features: ['Flush Inset Media Wall', 'Continuous Polished Concrete Floor', 'Linear Recessed Magnetic Lighting'],
      materials: ['American Walnut', 'Polished Concrete', 'Anodized Aluminum'],
      designer: { name: 'Marcus Chen', role: 'Architectural Designer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      location: 'Kyoto, Japan',
      completedYear: 2024,
      description: 'Restrained elegance defined by pure geometry, hidden storage compartments, and seamless material transitions between indoor and garden views.',
      likes: 419,
      views: 3200,
      rating: 4.9,
      tags: ['minimalist', 'walnut', 'concrete', 'japan', 'clean']
    },

    // --- BEDROOM ---
    {
      id: 'br-01',
      title: 'Circadian Cloud Sanctuary Master Suite',
      category: 'bedroom',
      categoryName: 'Bedroom',
      style: 'Scandinavian',
      areaSqFt: 380,
      scopeTier: 'Bespoke',
    executionTimeline: '6–8 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85'
      ],
      colorPalette: [
        { name: 'Oat Milk White', hex: '#F7F5F0' },
        { name: 'Muted Sage', hex: '#9EAA99' },
        { name: 'Bleached Ash', hex: '#DCD4C7' },
        { name: 'Warm Charcoal', hex: '#373A40' }
      ],
      features: ['Floating Platform Bed with Integrated Nightstands', 'Full-Length Acoustic Fluted Paneling', 'Automated Blackout Linen Drapes', 'Walk-In Smoked Glass Wardrobe'],
      materials: ['Bleached Ash Wood', 'Belgian Linen', 'Matte Ceramic', 'Wool Felt'],
      designer: { name: 'Elena Rostova', role: 'Principal Architect', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
      location: 'Stockholm, Sweden',
      completedYear: 2025,
      description: 'Engineered for restorative deep sleep with circadian lighting tuned to natural sunrise/sunset cycles, silent motorized blackout drapes, and organic linen bedding.',
      likes: 478,
      views: 3900,
      rating: 4.9,
      isFeatured: true,
      tags: ['bedroom', 'scandinavian', 'restful', 'floating-bed', 'wardrobe']
    },
    {
      id: 'br-02',
      title: 'Velvet Midnight Boutique Suite',
      category: 'bedroom',
      categoryName: 'Bedroom',
      style: 'Modern Luxury',
      areaSqFt: 420,
      scopeTier: 'Grand Estate',
    executionTimeline: '10–14 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85',
      galleryImages: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85'],
      colorPalette: [
        { name: 'Midnight Navy', hex: '#162238' },
        { name: 'Burnished Gold', hex: '#C5A880' },
        { name: 'Smoke Grey', hex: '#636874' },
        { name: 'Ivory Silk', hex: '#FDFBF7' }
      ],
      features: ['Channel-Tufted Full-Wall Headboard', 'Pendant Bedside Drops', 'Integrated Dressing Table Nook', 'Plush Silk Rug'],
      materials: ['Mohair Velvet', 'Champagne Brass', 'Smoked Mirror', 'Chevron Oak'],
      designer: { name: 'Julian Vance', role: 'Luxury Interiors Director', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      location: 'Paris, France',
      completedYear: 2024,
      description: 'Intimate boutique hotel aesthetic wrapped in dark jewel-tone navy velvet, custom brushed gold suspension pendants, and chevron hardwood flooring.',
      likes: 367,
      views: 2950,
      rating: 4.8,
      tags: ['luxury', 'velvet', 'navy', 'headboard', 'paris']
    },
    {
      id: 'br-03',
      title: 'Biophilic Timber Canopy Retreat',
      category: 'bedroom',
      categoryName: 'Bedroom',
      style: 'Biophilic Nature',
      areaSqFt: 340,
      scopeTier: 'Premium',
    executionTimeline: '4–6 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85',
      galleryImages: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85'],
      colorPalette: [
        { name: 'Moss Green', hex: '#586B52' },
        { name: 'Natural Birch', hex: '#E4DAC6' },
        { name: 'Warm Clay', hex: '#B57C63' }
      ],
      features: ['Bespoke Timber Slat Headboard with Planter Box', 'Organic Hemp Linens', 'Sliding Shoji Screen Doors'],
      materials: ['Birch Plywood', 'Raw Clay Plaster', 'Hemp Linen'],
      designer: { name: 'Amara Diop', role: 'Organic Interior Designer', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
      location: 'Vancouver, Canada',
      completedYear: 2025,
      description: 'A continuous envelope of natural birch slats and living greenery creating an oxygen-rich, tranquil sanctuary connected to natural elements.',
      likes: 295,
      views: 2100,
      rating: 4.7,
      tags: ['biophilic', 'plants', 'wood', 'nature', 'calm']
    },

    // --- KITCHEN ---
    {
      id: 'kt-01',
      title: 'Monolithic Quartz & Smoked Oak Culinary Studio',
      category: 'kitchen',
      categoryName: 'Kitchen',
      style: 'Modern Luxury',
      areaSqFt: 360,
      scopeTier: 'Grand Estate',
    executionTimeline: '10–14 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=85'
      ],
      colorPalette: [
        { name: 'Statuario White', hex: '#F1EFEA' },
        { name: 'Smoked Anthracite', hex: '#26282E' },
        { name: 'Warm Oak', hex: '#8B6F55' },
        { name: 'Brushed Gunmetal', hex: '#3E4249' }
      ],
      features: ['12-Foot Waterfall Island with Breakfast Bar', 'Pocket Appliance Garage with Bi-Fold Doors', 'Induction Cooktop with Integrated Downdraft', 'Under-Cabinet Linear High-CRI LED'],
      materials: ['Engineered Quartz', 'Smoked Oak Veneer', 'Gunmetal Steel', 'Fluted Glass'],
      designer: { name: 'Julian Vance', role: 'Luxury Interiors Director', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      location: 'Zurich, Switzerland',
      completedYear: 2025,
      description: 'The pinnacle of architectural kitchens: handleless push-to-open millwork, massive quartz waterfall island with bar seating, and seamless appliance integration.',
      likes: 624,
      views: 5200,
      rating: 5.0,
      isFeatured: true,
      beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      afterImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      tags: ['kitchen', 'waterfall-island', 'luxury', 'quartz', 'modern']
    },
    {
      id: 'kt-02',
      title: 'Nordic Minimalist Light Oak Kitchen',
      category: 'kitchen',
      categoryName: 'Kitchen',
      style: 'Minimalist',
      areaSqFt: 280,
      scopeTier: 'Bespoke',
    executionTimeline: '6–8 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=85',
      galleryImages: ['https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=85'],
      colorPalette: [
        { name: 'Pure White', hex: '#FAFAFA' },
        { name: 'Natural Light Oak', hex: '#D8C7B0' },
        { name: 'Matte Grey Stone', hex: '#9E9D99' }
      ],
      features: ['Floating Open Shelving with Integrated Uplight', 'Matte White Silgranit Undermount Sink', 'Seamless Terrazzo Backsplash'],
      materials: ['Light White Oak', 'Terrazzo', 'Silgranit Composite'],
      designer: { name: 'Elena Rostova', role: 'Principal Architect', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
      location: 'Oslo, Norway',
      completedYear: 2024,
      description: 'Airy, light-filled kitchen space featuring pale Scandinavian oak, seamless terrazzo worktops, and discreet task lighting.',
      likes: 388,
      views: 3100,
      rating: 4.8,
      tags: ['nordic', 'oak', 'terrazzo', 'clean', 'kitchen']
    },
    {
      id: 'kt-03',
      title: 'Industrial Bistro Cast Concrete Kitchen',
      category: 'kitchen',
      categoryName: 'Kitchen',
      style: 'Industrial Loft',
      areaSqFt: 320,
      scopeTier: 'Premium',
    executionTimeline: '4–6 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=85',
      galleryImages: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=85'],
      colorPalette: [
        { name: 'Raw Concrete', hex: '#7D8087' },
        { name: 'Matte Black', hex: '#1D1E21' },
        { name: 'Copper Pipe', hex: '#B86F48' }
      ],
      features: ['Cast-in-Place Concrete Island Countertop', 'Open Steel Gantry with Suspended Glassware', 'Commercial Gas Range with Custom Hood'],
      materials: ['Cast Concrete', 'Blackened Steel', 'Reclaimed Elm'],
      designer: { name: 'Marcus Chen', role: 'Architectural Designer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      location: 'Berlin, Germany',
      completedYear: 2024,
      description: 'Bold culinary space with raw poured concrete counters, custom black steel gantry storage, and restaurant-grade cooking gear.',
      likes: 312,
      views: 2450,
      rating: 4.7,
      tags: ['industrial', 'concrete', 'black-steel', 'loft']
    },

    // --- BATHROOM ---
    {
      id: 'ba-01',
      title: 'Calacatta Marble Spa & Rain Sanctuary',
      category: 'bathroom',
      categoryName: 'Bathroom',
      style: 'Modern Luxury',
      areaSqFt: 220,
      scopeTier: 'Grand Estate',
    executionTimeline: '10–14 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=85'
      ],
      colorPalette: [
        { name: 'Carrara Pure', hex: '#EAE6E1' },
        { name: 'Brushed Brass', hex: '#C5A880' },
        { name: 'Charcoal Vein', hex: '#3B3D43' }
      ],
      features: ['Freestanding Solid Surface Soaking Tub', 'Ceiling-Mounted 20" Rain Showerhead', 'Floating Double Vanity with Backlit Mirrors', 'Floor-to-Ceiling Bookmatched Porcelain'],
      materials: ['Carrara Marble', 'Brushed Brass', 'Fluted Glass', 'Solid Resin'],
      designer: { name: 'Julian Vance', role: 'Luxury Interiors Director', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      location: 'Milan, Italy',
      completedYear: 2025,
      description: 'Opulent personal wellness wet room featuring a sculptural standalone resin bathtub, thermostatic rain shower, and heated stone floors.',
      likes: 498,
      views: 4200,
      rating: 5.0,
      isFeatured: true,
      tags: ['bathroom', 'spa', 'marble', 'freestanding-tub', 'luxury']
    },
    {
      id: 'ba-02',
      title: 'Japandi Hinoki & Slate Wet Room',
      category: 'bathroom',
      categoryName: 'Bathroom',
      style: 'Japandi',
      areaSqFt: 180,
      scopeTier: 'Bespoke',
    executionTimeline: '6–8 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=85',
      galleryImages: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=85'],
      colorPalette: [
        { name: 'Hinoki Cypress', hex: '#D2B997' },
        { name: 'Japanese Black Slate', hex: '#232529' },
        { name: 'River Pebble', hex: '#8F9196' }
      ],
      features: ['Hinoki Wood Soaking Tub (Ofuro)', 'Walk-in Frameless Wet Room with River Rock Inlay', 'Concealed Wall-Mounted Matte Black Fixtures'],
      materials: ['Hinoki Wood', 'Black Slate Tile', 'River Pebbles'],
      designer: { name: 'Marcus Chen', role: 'Architectural Designer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      location: 'Tokyo, Japan',
      completedYear: 2024,
      description: 'Traditional Japanese Onsen bath rituals re-imagined for modern living with fragrant natural Hinoki cypress wood and textured black slate.',
      likes: 423,
      views: 3350,
      rating: 4.9,
      tags: ['japandi', 'hinoki', 'slate', 'zen', 'onsen']
    },

    // --- DINING ROOM ---
    {
      id: 'dr-01',
      title: 'Artisan Walnut & Brass Banquet Salon',
      category: 'dining-room',
      categoryName: 'Dining Room',
      style: 'Mid-Century Modern',
      areaSqFt: 310,
      scopeTier: 'Bespoke',
    executionTimeline: '6–8 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=85'
      ],
      colorPalette: [
        { name: 'Warm Walnut', hex: '#634735' },
        { name: 'Cognac Leather', hex: '#9E5B32' },
        { name: 'Champagne Brass', hex: '#D2B37B' },
        { name: 'Alabaster White', hex: '#F5F2EC' }
      ],
      features: ['10-Seater Solid American Walnut Dining Table', 'Sculptural Mobile Chandelier with Opal Glass Globes', 'Built-in Temperature-Controlled Wine Display', 'Curved Velvet Dining Chairs'],
      materials: ['Solid Walnut', 'Handmade Opal Glass', 'Brushed Brass', 'Cognac Leather'],
      designer: { name: 'Julian Vance', role: 'Luxury Interiors Director', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      location: 'London, UK',
      completedYear: 2025,
      description: 'An entertainer’s centerpiece featuring a monolithic 10-seater solid walnut slab, custom brass branch chandelier, and floor-to-ceiling glass wine library.',
      likes: 382,
      views: 3120,
      rating: 4.9,
      isFeatured: true,
      tags: ['dining-room', 'walnut-table', 'chandelier', 'wine-display', 'luxury']
    },
    {
      id: 'dr-02',
      title: 'Sunlit Minimalist Glass Dining Pavilion',
      category: 'dining-room',
      categoryName: 'Dining Room',
      style: 'Minimalist',
      areaSqFt: 260,
      scopeTier: 'Premium',
    executionTimeline: '4–6 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=85',
      galleryImages: ['https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=85'],
      colorPalette: [
        { name: 'Chalk White', hex: '#F9F8F6' },
        { name: 'Natural Ash', hex: '#D7CEBE' },
        { name: 'Matte Black', hex: '#222326' }
      ],
      features: ['Nordic Wishbone Chairs in Oak', 'Paper Lantern Pendant by Noguchi', 'Floor-to-Ceiling Pivot Glass Doors to Garden'],
      materials: ['Ash Wood', 'Japanese Washi Paper', 'Powder-coated Steel'],
      designer: { name: 'Elena Rostova', role: 'Principal Architect', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
      location: 'Copenhagen, Denmark',
      completedYear: 2024,
      description: 'Minimalist simplicity bathed in diffused natural daylight with iconic Wishbone chairs and organic paper lighting.',
      likes: 298,
      views: 2300,
      rating: 4.8,
      tags: ['dining', 'minimalist', 'wishbone', 'scandinavian']
    },

    // --- HOME OFFICE ---
    {
      id: 'ho-01',
      title: 'Executive Walnut & Acoustic Slat Workspace',
      category: 'home-office',
      categoryName: 'Home Office',
      style: 'Modern Luxury',
      areaSqFt: 290,
      scopeTier: 'Bespoke',
    executionTimeline: '6–8 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85'
      ],
      colorPalette: [
        { name: 'Executive Walnut', hex: '#4E382A' },
        { name: 'Charcoal Acoustic Felt', hex: '#2D3036' },
        { name: 'Cognac Saddle', hex: '#A16239' },
        { name: 'Soft Cream', hex: '#F6F3EE' }
      ],
      features: ['Cantilevered Floating Walnut Executive Desk', 'Full Sound-Dampening Slat Acoustic Backing', 'Concealed Cable Tunnels & Dual Ultra-Wide Mounts', 'Video Conference Studio Lighting'],
      materials: ['American Walnut', 'Recycled PET Acoustic Felt', 'Top-Grain Saddle Leather', 'Anodized Black Aluminum'],
      designer: { name: 'Julian Vance', role: 'Luxury Interiors Director', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      location: 'San Francisco, USA',
      completedYear: 2025,
      description: 'Designed for executive leadership and uninterrupted creative flow: acoustic sound dampening, customized floating desk joinery, and broadcast-ready lighting.',
      likes: 541,
      views: 4890,
      rating: 5.0,
      isFeatured: true,
      tags: ['home-office', 'executive', 'walnut-desk', 'acoustic-panel', 'ergonomic']
    },
    {
      id: 'ho-02',
      title: 'Biophilic Creative Studio & Plant Haven',
      category: 'home-office',
      categoryName: 'Home Office',
      style: 'Biophilic Nature',
      areaSqFt: 220,
      scopeTier: 'Premium',
    executionTimeline: '4–6 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85',
      galleryImages: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85'],
      colorPalette: [
        { name: 'Fern Green', hex: '#4E6B4E' },
        { name: 'Raw Birch', hex: '#E2D8C6' },
        { name: 'Terracotta Pot', hex: '#BA6D4F' }
      ],
      features: ['Integrated Planter Wall with Hydroponic Drip', 'Height-Adjustable Solid Birch Standing Desk', 'Natural Cork Pinboard Wall'],
      materials: ['Birch Wood', 'Natural Cork', 'Living Foliage'],
      designer: { name: 'Amara Diop', role: 'Organic Interior Designer', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
      location: 'Seattle, USA',
      completedYear: 2024,
      description: 'A tranquil home work zone filled with oxygen-purifying indoor plants, ergonomic motorized standing desk, and natural cork acoustic wall.',
      likes: 312,
      views: 2600,
      rating: 4.8,
      tags: ['home-office', 'standing-desk', 'plants', 'cork', 'creative']
    },

    // --- STUDY ---
    {
      id: 'st-01',
      title: 'Double-Height Grand Library & Reading Gallery',
      category: 'study',
      categoryName: 'Study',
      style: 'Classic Contemporary',
      areaSqFt: 450,
      scopeTier: 'Grand Estate',
    executionTimeline: '10–14 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=85'
      ],
      colorPalette: [
        { name: 'Dark Oak', hex: '#3E2D23' },
        { name: 'Antique Brass', hex: '#B89B66' },
        { name: 'Burgundy Velvet', hex: '#5E2129' },
        { name: 'Parchment', hex: '#F0EAD6' }
      ],
      features: ['Full 16-Foot Integrated Bookcases with Rolling Brass Ladder', 'Custom Velvet Reading Nook with Daybed', 'Integrated Shelf Uplighting & Library Lamps', 'Antique Persian Area Carpet'],
      materials: ['Stained Dark Oak', 'Solid Brass Rails', 'Mohair Velvet', 'Wool Rug'],
      designer: { name: 'Julian Vance', role: 'Luxury Interiors Director', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      location: 'Edinburgh, Scotland',
      completedYear: 2024,
      description: 'A bibliophile’s dream sanctuary boasting soaring floor-to-ceiling dark oak shelves, a functional rolling brass ladder, and an intimate fireside reading enclave.',
      likes: 619,
      views: 5400,
      rating: 5.0,
      isFeatured: true,
      tags: ['study', 'library', 'bookshelves', 'ladder', 'classic']
    },
    {
      id: 'st-02',
      title: 'Modernist Sunlit Reading & Philosophy Nook',
      category: 'study',
      categoryName: 'Study',
      style: 'Minimalist',
      areaSqFt: 210,
      scopeTier: 'Premium',
    executionTimeline: '4–6 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=85',
      galleryImages: ['https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=85'],
      colorPalette: [
        { name: 'Warm White', hex: '#F7F5F0' },
        { name: 'Honey Oak', hex: '#CBA77E' },
        { name: 'Charcoal Black', hex: '#25272B' }
      ],
      features: ['Built-In Bay Window Bench with Storage', 'Floating Minimalist Bookshelves', 'Sculptural Eames Lounge Chair'],
      materials: ['Honey Oak', 'Linen Upholstery', 'Matte White Metal'],
      designer: { name: 'Elena Rostova', role: 'Principal Architect', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
      location: 'Helsinki, Finland',
      completedYear: 2025,
      description: 'A serene corner retreat crafted for contemplation and literature, complete with a panoramic bay window bench and minimalist floating shelving.',
      likes: 345,
      views: 2800,
      rating: 4.8,
      tags: ['study', 'reading-nook', 'eames-chair', 'window-seat']
    },

    // --- COMMERCIAL / RETAIL ---
    {
      id: 'cm-01',
      title: 'Brutalist Monolith Fashion Showroom',
      category: 'commercial-retail',
      categoryName: 'Commercial / Retail',
      style: 'Industrial Loft',
      areaSqFt: 1450,
      scopeTier: 'Grand Estate',
    executionTimeline: '10–14 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85'
      ],
      colorPalette: [
        { name: 'Microcement Grey', hex: '#8C8E94' },
        { name: 'Raw Stainless Steel', hex: '#D1D5DB' },
        { name: 'Jet Black', hex: '#111215' },
        { name: 'Amber Neon', hex: '#E59B3C' }
      ],
      features: ['Custom Cast Concrete Display Plinths', 'Suspended Stainless Steel Continuous Garment Rails', 'Architectural Track Spotlights with Dim-to-Warm DALI control', 'Curved Acoustically Clad Fitting Pods'],
      materials: ['Hand-Troweled Microcement', 'Brushed Stainless Steel', 'Ultra-Clear Low Iron Glass'],
      designer: { name: 'Marcus Chen', role: 'Architectural Designer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      location: 'SoHo, New York',
      completedYear: 2025,
      description: 'A striking high-concept luxury boutique showroom combining industrial brutalist concrete masses with surgical stainless steel detailing.',
      likes: 721,
      views: 6800,
      rating: 5.0,
      isFeatured: true,
      tags: ['commercial', 'retail', 'showroom', 'concrete', 'fashion', 'boutique']
    },
    {
      id: 'cm-02',
      title: 'Artisan Terrazzo & Oak Specialty Cafe',
      category: 'commercial-retail',
      categoryName: 'Commercial / Retail',
      style: 'Scandinavian',
      areaSqFt: 980,
      scopeTier: 'Bespoke',
    executionTimeline: '6–8 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
      galleryImages: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85'],
      colorPalette: [
        { name: 'Warm Terracotta', hex: '#C2765A' },
        { name: 'Custom Terrazzo', hex: '#DDD2C5' },
        { name: 'Light Oak', hex: '#E5D8C3' }
      ],
      features: ['Curved 24-Foot Continuous Terrazzo Espresso Bar', 'Bespoke Oak Banquette Seating with Bouclé Pillows', 'Acoustic Ceiling Baffles with Integrated Downlights'],
      materials: ['Custom Terrazzo Slab', 'White Oak', 'Upholstered Bouclé'],
      designer: { name: 'Elena Rostova', role: 'Principal Architect', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
      location: 'Amsterdam, Netherlands',
      completedYear: 2024,
      description: 'A warm, community-centered cafe space designed with curved terrazzo barista stations, acoustic ceiling fins, and light oak dining alcoves.',
      likes: 450,
      views: 3900,
      rating: 4.9,
      tags: ['cafe', 'commercial', 'terrazzo', 'banquette', 'hospitality']
    },

    // --- OUTDOOR / TERRACES ---
    {
      id: 'ot-01',
      title: 'Biophilic Rooftop Penthouse Terrace & Fire Lounge',
      category: 'outdoor-terraces',
      categoryName: 'Outdoor / Terraces',
      style: 'Modern Luxury',
      areaSqFt: 620,
      scopeTier: 'Grand Estate',
    executionTimeline: '10–14 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85'
      ],
      colorPalette: [
        { name: 'Natural Ipe Wood', hex: '#664938' },
        { name: 'Lava Stone Charcoal', hex: '#2B2D33' },
        { name: 'Sand Linen', hex: '#EBE5D8' },
        { name: 'Olive Foliage', hex: '#627254' }
      ],
      features: ['Automated Louvered Bioclimatic Pergola', 'Linear Natural Gas Fire Table in Concrete', 'Weatherproof Teak Modular Lounge System', 'Integrated Planters with Drip Irrigation & Low-Voltage Ground Uplighting'],
      materials: ['Ipe Hardwood Decking', 'Powder-coated Aluminum', 'Grade-A Teak', 'Concrete Fire Pit'],
      designer: { name: 'Amara Diop', role: 'Organic Interior Designer', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
      location: 'Barcelona, Spain',
      completedYear: 2025,
      description: 'An idyllic Mediterranean rooftop oasis boasting motorized pergola louvers, comfortable deep-seat outdoor sectionals, and an integrated basalt fire table.',
      likes: 689,
      views: 5900,
      rating: 5.0,
      isFeatured: true,
      beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      afterImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      tags: ['outdoor', 'terrace', 'pergola', 'firepit', 'rooftop', 'lounge']
    },
    {
      id: 'ot-02',
      title: 'Mediterranean Pergola & Alfresco Dining Deck',
      category: 'outdoor-terraces',
      categoryName: 'Outdoor / Terraces',
      style: 'Bohemian Luxe',
      areaSqFt: 480,
      scopeTier: 'Bespoke',
    executionTimeline: '6–8 Weeks Turnkey',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
      galleryImages: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85'],
      colorPalette: [
        { name: 'Limestone White', hex: '#F3EFEA' },
        { name: 'Sun-Bleached Teak', hex: '#C2A789' },
        { name: 'Earthy Terracotta', hex: '#BA6D4F' }
      ],
      features: ['Cedar Timber Trellis with Climbing Jasmine', 'Concrete Outdoor Pizza Oven & Prep Station', 'Hand-Crafted Ceramic Pendant Lanterns'],
      materials: ['Cedar Wood', 'Limestone Pavers', 'Ceramic Terracotta'],
      designer: { name: 'Amara Diop', role: 'Organic Interior Designer', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
      location: 'Santorini, Greece',
      completedYear: 2024,
      description: 'Romantic outdoor alfresco dining space shaded by aromatic climbing jasmine vines, equipped with a custom stone pizza oven and long banquet seating.',
      likes: 412,
      views: 3400,
      rating: 4.9,
      tags: ['outdoor', 'terrace', 'mediterranean', 'pergola', 'dining']
    }
  ];

  // Visualizer Swatches & Presets
  readonly visualizerWallColors: RoomVisualizerOption[] = [
    { id: 'c-01', name: 'Warm Alabaster', hex: '#F7F5F0', description: 'Soft radiant warm off-white' },
    { id: 'c-02', name: 'Cashmere Greige', hex: '#DED8CE', description: 'Understated Parisian neutral' },
    { id: 'c-03', name: 'Sage Leaf', hex: '#9BA997', description: 'Calming botanical green' },
    { id: 'c-04', name: 'Terracotta Dune', hex: '#C9775B', description: 'Rich Mediterranean clay' },
    { id: 'c-05', name: 'Obsidian Slate', hex: '#262930', description: 'Dramatic luxury charcoal' },
    { id: 'c-06', name: 'Midnight Navy', hex: '#1C2738', description: 'Deep architectural indigo' },
    { id: 'c-07', name: 'Olive Moss', hex: '#637059', description: 'Earthy organic green' },
    { id: 'c-08', name: 'Linen Ochre', hex: '#D4B886', description: 'Sunlit warm ochre tone' }
  ];

  readonly visualizerFlooring: RoomVisualizerOption[] = [
    { id: 'f-01', name: 'Herringbone White Oak', hex: '#D9C8AF', textureUrl: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=400&q=80', description: 'Classic European chevron hardwood' },
    { id: 'f-02', name: 'Italian Carrara Marble', hex: '#EBE7DF', textureUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80', description: 'Seamless polished white stone' },
    { id: 'f-03', name: 'Polished Concrete', hex: '#8E9197', textureUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80', description: 'Smooth architectural industrial surface' },
    { id: 'f-04', name: 'Dark Smoked Walnut', hex: '#523A2B', textureUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=400&q=80', description: 'Rich dramatic dark timber planks' },
    { id: 'f-05', name: 'Venetian Terrazzo', hex: '#DACFBF', textureUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80', description: 'Artisan flecked mosaic stone' }
  ];

  readonly visualizerLightingModes = [
    { id: 'daylight', name: 'Natural Daylight (5000K)', icon: 'sun', glowColor: 'rgba(255, 255, 255, 0.4)' },
    { id: 'golden-hour', name: 'Golden Hour (3200K)', icon: 'sunset', glowColor: 'rgba(255, 190, 110, 0.45)' },
    { id: 'warm-amber', name: 'Warm Evening (2700K)', icon: 'lamp', glowColor: 'rgba(245, 160, 80, 0.5)' },
    { id: 'moody-evening', name: 'Moody Night Scene (2000K)', icon: 'moon', glowColor: 'rgba(50, 60, 90, 0.7)' }
  ];

  // Style Finder Quiz Steps
  readonly styleQuizSteps: StyleQuizStep[] = [
    {
      id: 1,
      question: 'What color palette speaks to your soul?',
      subtitle: 'Select the color atmosphere you want your home to evoke every day.',
      options: [
        {
          id: 'q1-japandi',
          title: 'Warm Earth & Muted Wood',
          description: 'Earthy tans, oat whites, soft sage, and natural unfinished oak.',
          image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
          matchedStyle: 'Japandi'
        },
        {
          id: 'q1-luxury',
          title: 'Dramatic Charcoal & Gold',
          description: 'Deep obsidian, bookmatched marble, champagne brass and jewel tones.',
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
          matchedStyle: 'Modern Luxury'
        },
        {
          id: 'q1-scandi',
          title: 'Crisp White & Light Birch',
          description: 'Pure radiant daylight, bleached ash timber, and cozy neutral wool.',
          image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80',
          matchedStyle: 'Scandinavian'
        },
        {
          id: 'q1-industrial',
          title: 'Raw Concrete & Black Steel',
          description: 'Exposed brick, gunmetal grey, reclaimed elm and leather patina.',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
          matchedStyle: 'Industrial Loft'
        }
      ]
    },
    {
      id: 2,
      question: 'How do you prefer your spatial flow & furniture silhouettes?',
      subtitle: 'Choose the structural and tactile feel of your ideal interior.',
      options: [
        {
          id: 'q2-organic',
          title: 'Curved, Low-Profile & Tactile',
          description: 'Bouclé curved sectionals, rounded travertine tables, and low tatami seating.',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
          matchedStyle: 'Japandi'
        },
        {
          id: 'q2-grand',
          title: 'Sculpted, Symmetrical & Statement',
          description: 'Imposing chandeliers, velvet channel tufting, and monolithic stone slabs.',
          image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80',
          matchedStyle: 'Modern Luxury'
        },
        {
          id: 'q2-clean',
          title: 'Ultra-Minimal & Concealed Storage',
          description: 'Flush handleless cabinets, uncluttered surfaces, and crisp geometric lines.',
          image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80',
          matchedStyle: 'Minimalist'
        },
        {
          id: 'q2-biophilic',
          title: 'Lush Greenery & Natural Textures',
          description: 'Indoor plant canopies, hanging vines, wicker rattan, and terracotta.',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
          matchedStyle: 'Biophilic Nature'
        }
      ]
    },
    {
      id: 3,
      question: 'What is your primary design priority?',
      subtitle: 'What matters most in your daily lifestyle?',
      options: [
        {
          id: 'q3-calm',
          title: 'Peace, Calm & Stress Relief',
          description: 'An acoustic sanctuary to disconnect, read, meditate, and recharge.',
          image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=600&q=80',
          matchedStyle: 'Japandi'
        },
        {
          id: 'q3-entertain',
          title: 'Entertaining Guests & Luxury Vibe',
          description: 'Grand dining table, cocktail bar, theatrical lighting, and audio integration.',
          image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
          matchedStyle: 'Modern Luxury'
        },
        {
          id: 'q3-focus',
          title: 'High Productivity & Focus',
          description: 'Ergonomic precision, library walls, cable concealment, and zoned task light.',
          image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
          matchedStyle: 'Scandinavian'
        },
        {
          id: 'q3-outdoor',
          title: 'Indoor-Outdoor Living Freedom',
          description: 'Balconies, terrace gardens, alfresco cooking, and fresh air connection.',
          image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
          matchedStyle: 'Biophilic Nature'
        }
      ]
    }
  ];

  // Helper Methods
  getCategoryById(id: RoomCategoryId): CategoryInfo | undefined {
    return this.categories.find(c => c.id === id);
  }

  getProjectsByCategory(categoryId: RoomCategoryId | 'all'): DesignProject[] {
    if (categoryId === 'all') return this.projects;
    return this.projects.filter(p => p.category === categoryId);
  }

  getProjectById(id: string): DesignProject | undefined {
    return this.projects.find(p => p.id === id);
  }

  getFeaturedProjects(): DesignProject[] {
    return this.projects.filter(p => p.isFeatured);
  }

  // Scope & Project Specification Planner
  calculateScope(params: ProjectScopeParams): ProjectScopeResult {
    const tierMultiplier = params.tier === 'essential' ? 1.0 : params.tier === 'premium' ? 1.3 : 1.7;
    const estimatedWeeks = Math.max(3, Math.round((params.areaSqFt / 85) * (params.tier === 'bespoke' ? 1.3 : 1.0)));
    const manpowerHours = Math.round(params.areaSqFt * 1.8 * tierMultiplier);

    const civilPercent = params.includeCivilFlooring ? 20 : 0;
    const woodworkPercent = params.includeModularWoodwork ? 35 : 0;
    const ceilingLightingPercent = params.includeCeilingLighting ? 15 : 0;
    const furnishingPercent = params.includeFurnishingDecor ? 15 : 0;
    const automationPercent = params.includeSmartAutomation ? 10 : 0;
    const finishingPercent = params.includeWallFinishing ? 15 : 0;

    const materialGrade = params.tier === 'bespoke' 
      ? 'Ultra-Luxury Italian Marble, Teak Veneer & High-Gloss PU' 
      : params.tier === 'premium' 
      ? 'IS-710 BWP Marine Ply, Fluted Panels & German Hardware' 
      : 'HDHMR Moisture-Resistant, 1mm Laminate & Soft-Close Joinery';

    const hardwareSpec = params.tier === 'bespoke' 
      ? 'Blum Legrabox / Hafele Matrix Precision Fittings' 
      : params.tier === 'premium' 
      ? 'Hettich Sensys Soft-Close & Telescopic Systems' 
      : 'Ebco Heavy-Duty Concealed Hinges & Ball Bearing Slides';

    const warrantyYears = params.tier === 'bespoke' ? 15 : params.tier === 'premium' ? 10 : 5;
    const qualityAudits = params.tier === 'bespoke' ? 12 : params.tier === 'premium' ? 8 : 5;

    return {
      civilPercent,
      woodworkPercent,
      ceilingLightingPercent,
      furnishingPercent,
      automationPercent,
      finishingPercent,
      estimatedWeeks,
      manpowerHours,
      materialGrade,
      hardwareSpec,
      warrantyYears,
      qualityAudits
    };
  }

  calculateCost(params: ProjectScopeParams): ProjectScopeResult {
    return this.calculateScope(params);
  }

  // Quiz Result Generator
  evaluateQuiz(answers: DesignStyle[]): StyleQuizResult {
    // Count occurrences
    const counts: Record<string, number> = {};
    for (const ans of answers) {
      counts[ans] = (counts[ans] || 0) + 1;
    }

    let topStyle: DesignStyle = 'Japandi';
    let maxCount = 0;
    for (const [style, cnt] of Object.entries(counts)) {
      if (cnt > maxCount) {
        maxCount = cnt;
        topStyle = style as DesignStyle;
      }
    }

    const resultsMap: Record<DesignStyle, StyleQuizResult> = {
      'Japandi': {
        primaryStyle: 'Japandi',
        title: 'Japandi Serenity & Organic Wabi-Sabi',
        description: 'You appreciate the seamless fusion of Scandinavian functionality and Japanese rustic minimalism. Your ideal space values craftsmanship, raw natural textures, low-profile furniture, and calming neutrals that foster inner peace.',
        keyElements: ['Acoustic White Oak Slats', 'Travertine & Clay Ceramics', 'Low-profile Bouclé Sectionals', 'Wabi-Sabi Asymmetry'],
        recommendedPalette: [
          { name: 'Warm Alabaster', hex: '#F4F1EA' },
          { name: 'Bleached Oak', hex: '#D7CBB8' },
          { name: 'Sage Mist', hex: '#9AA796' },
          { name: 'Charcoal Accent', hex: '#2C2E33' }
        ],
        matchingCategoryIds: ['living-room', 'bedroom', 'study', 'bathroom'],
        bannerImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85'
      },
      'Modern Luxury': {
        primaryStyle: 'Modern Luxury',
        title: 'Architectural Monolith & Penthouse Luxe',
        description: 'You are drawn to commanding grandeur, bookmatched natural marble, refined brass detailing, and bold architectural lighting that leaves an unforgettable impression.',
        keyElements: ['Bookmatched Calacatta Marble', 'Brushed Champagne Brass Inlays', 'Concealed Smart Automation', 'Custom Italian Velvet Upholstery'],
        recommendedPalette: [
          { name: 'Nero Black', hex: '#1C1D21' },
          { name: 'Calacatta White', hex: '#EBE7DF' },
          { name: 'Burnished Brass', hex: '#D4AF37' },
          { name: 'Smoke Grey', hex: '#636874' }
        ],
        matchingCategoryIds: ['living-room', 'kitchen', 'dining-room', 'bathroom', 'home-office'],
        bannerImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'
      },
      'Scandinavian': {
        primaryStyle: 'Scandinavian',
        title: 'Nordic Light & Hygge Simplicity',
        description: 'You thrive in bright, sun-drenched rooms with light blonde woods, cozy woven textiles, uncluttered spaces, and thoughtful ergonomic flow.',
        keyElements: ['Blonde Ash & Birch Woods', 'Belgian Linen Drapes', 'Iconic Nordic Curved Chairs', 'Layered Ambient Illumination'],
        recommendedPalette: [
          { name: 'Pure White', hex: '#FAFAFA' },
          { name: 'Natural Birch', hex: '#E4DAC6' },
          { name: 'Oatmeal Wool', hex: '#CDC3B5' }
        ],
        matchingCategoryIds: ['bedroom', 'kitchen', 'dining-room', 'living-room'],
        bannerImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85'
      },
      'Biophilic Nature': {
        primaryStyle: 'Biophilic Nature',
        title: 'Biophilic Oasis & Indoor-Outdoor Harmony',
        description: 'You seek deep reconnection with nature through living green walls, natural sunlight, stone fire elements, and seamless transitions to terraces and outdoor gardens.',
        keyElements: ['Hydroponic Living Planters', 'Natural Stone & Teak Wood', 'Open Air Pergolas', 'Tactile Earth Pigments'],
        recommendedPalette: [
          { name: 'Forest Moss', hex: '#586B52' },
          { name: 'Terracotta Clay', hex: '#C86D51' },
          { name: 'Natural Rattan', hex: '#D6B48B' }
        ],
        matchingCategoryIds: ['outdoor-terraces', 'home-office', 'living-room', 'bedroom'],
        bannerImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85'
      },
      'Minimalist': {
        primaryStyle: 'Minimalist',
        title: 'Pure Geometric Minimalist',
        description: 'You believe in "less is more." Clean flush cabinetry, hidden storage, monolithic forms, and zero unnecessary visual distraction.',
        keyElements: ['Flush Inset Millwork', 'Polished Microcement', 'Recessed Track Lights', 'Linear Geometry'],
        recommendedPalette: [
          { name: 'Chalk White', hex: '#F9F8F6' },
          { name: 'Concrete Grey', hex: '#8C8E94' },
          { name: 'Matte Charcoal', hex: '#222326' }
        ],
        matchingCategoryIds: ['kitchen', 'living-room', 'bathroom', 'study'],
        bannerImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=85'
      },
      'Industrial Loft': {
        primaryStyle: 'Industrial Loft',
        title: 'Urban Industrial & Raw Materiality',
        description: 'You love the honest beauty of exposed brick, blackened steel, poured concrete, and vintage leather with historic architectural character.',
        keyElements: ['Exposed Brick & Beams', 'Blackened Steel Gantries', 'Cast Concrete Islands', 'Cognac Leather'],
        recommendedPalette: [
          { name: 'Raw Concrete', hex: '#7D8087' },
          { name: 'Jet Black', hex: '#1D1E21' },
          { name: 'Copper Rust', hex: '#B86F48' }
        ],
        matchingCategoryIds: ['commercial-retail', 'kitchen', 'living-room'],
        bannerImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85'
      },
      'Mid-Century Modern': {
        primaryStyle: 'Mid-Century Modern',
        title: 'Mid-Century Heritage & Sculptural Elegance',
        description: 'You love warm walnut grains, iconic tapered silhouettes, brass accents, and cheerful yet sophisticated organic curves.',
        keyElements: ['American Walnut Joinery', 'Opal Glass Spheres', 'Tapered Furniture Legs', 'Cognac Leather Accents'],
        recommendedPalette: [
          { name: 'Warm Walnut', hex: '#634735' },
          { name: 'Brass Gold', hex: '#D2B37B' },
          { name: 'Alabaster', hex: '#F5F2EC' }
        ],
        matchingCategoryIds: ['dining-room', 'living-room', 'study'],
        bannerImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=85'
      },
      'Bohemian Luxe': {
        primaryStyle: 'Bohemian Luxe',
        title: 'Bohemian Sanctuary & Artisanal Layering',
        description: 'Layered textures, rattan screens, Moroccan rugs, handcrafted pottery, and warm desert tones create an inviting, relaxed haven.',
        keyElements: ['Rattan Cane Weaving', 'Terracotta Clay', 'Handwoven Rugs', 'Lush Potted Greenery'],
        recommendedPalette: [
          { name: 'Terracotta', hex: '#C86D51' },
          { name: 'Rattan Tan', hex: '#D6B48B' },
          { name: 'Olive Leaf', hex: '#5B6E57' }
        ],
        matchingCategoryIds: ['living-room', 'outdoor-terraces', 'bedroom'],
        bannerImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85'
      },
      'Classic Contemporary': {
        primaryStyle: 'Classic Contemporary',
        title: 'Timeless Heritage & Modern Poise',
        description: 'Classic architectural moldings, coffered ceilings, dark stained oak bookcases, and tailored velvet seating that transcend transient trends.',
        keyElements: ['Double-Height Millwork', 'Antique Brass Hardware', 'Tailored Velvet Chairs', 'Crown Moldings'],
        recommendedPalette: [
          { name: 'Dark Oak', hex: '#3E2D23' },
          { name: 'Antique Brass', hex: '#B89B66' },
          { name: 'Parchment White', hex: '#F0EAD6' }
        ],
        matchingCategoryIds: ['study', 'dining-room', 'living-room'],
        bannerImage: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=85'
      }
    };

    return resultsMap[topStyle] || resultsMap['Japandi'];
  }
}

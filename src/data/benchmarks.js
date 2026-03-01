// Industry benchmarks for GBP optimization
// Sources: BrightLocal Local Consumer Review Survey 2025, Whitespark Local Search Ranking Factors,
// SOCi State of Google Business Profiles Report, and aggregated industry data.
// These are median values for "well-performing" local businesses in each category.

export const industryBenchmarks = {
  restaurant: {
    'review-count': { median: 85, top: 200, label: 'Restaurant avg: 85 reviews, top performers: 200+' },
    'average-rating': { median: 4.2, top: 4.6, label: 'Restaurant avg: 4.2 stars, top: 4.6+' },
    'exterior-photos': { median: 5, top: 12, label: 'Top restaurants: 12+ exterior photos' },
    'interior-photos': { median: 8, top: 20, label: 'Top restaurants: 20+ interior/ambiance photos' },
    'team-photos': { median: 3, top: 6, label: 'Top restaurants: 6+ staff/chef photos' },
    'product-photos': { median: 15, top: 40, label: 'Top restaurants: 40+ food/menu photos' },
  },
  dentist: {
    'review-count': { median: 45, top: 120, label: 'Dental avg: 45 reviews, top performers: 120+' },
    'average-rating': { median: 4.6, top: 4.9, label: 'Dental avg: 4.6 stars, top: 4.9+' },
    'exterior-photos': { median: 3, top: 6, label: 'Top dental offices: 6+ exterior photos' },
    'interior-photos': { median: 5, top: 10, label: 'Top dental offices: 10+ interior photos' },
    'team-photos': { median: 4, top: 8, label: 'Top dental offices: 8+ team photos' },
    'product-photos': { median: 5, top: 12, label: 'Top dental offices: 12+ treatment/equipment photos' },
  },
  plumber: {
    'review-count': { median: 35, top: 100, label: 'Plumber avg: 35 reviews, top performers: 100+' },
    'average-rating': { median: 4.5, top: 4.8, label: 'Plumber avg: 4.5 stars, top: 4.8+' },
    'exterior-photos': { median: 2, top: 5, label: 'Top plumbers: 5+ vehicle/branding photos' },
    'interior-photos': { median: 2, top: 4, label: 'Plumber interior photos are less critical' },
    'team-photos': { median: 2, top: 5, label: 'Top plumbers: 5+ team/technician photos' },
    'product-photos': { median: 8, top: 20, label: 'Top plumbers: 20+ before/after project photos' },
  },
  salon: {
    'review-count': { median: 55, top: 150, label: 'Salon avg: 55 reviews, top performers: 150+' },
    'average-rating': { median: 4.5, top: 4.9, label: 'Salon avg: 4.5 stars, top: 4.9+' },
    'exterior-photos': { median: 3, top: 6, label: 'Top salons: 6+ storefront photos' },
    'interior-photos': { median: 5, top: 12, label: 'Top salons: 12+ interior/station photos' },
    'team-photos': { median: 5, top: 10, label: 'Top salons: 10+ stylist portfolio photos' },
    'product-photos': { median: 15, top: 40, label: 'Top salons: 40+ before/after style photos' },
  },
  'auto-repair': {
    'review-count': { median: 40, top: 110, label: 'Auto repair avg: 40 reviews, top performers: 110+' },
    'average-rating': { median: 4.4, top: 4.8, label: 'Auto repair avg: 4.4 stars, top: 4.8+' },
    'exterior-photos': { median: 3, top: 6, label: 'Top shops: 6+ exterior/signage photos' },
    'interior-photos': { median: 3, top: 8, label: 'Top shops: 8+ bay/equipment photos' },
    'team-photos': { median: 3, top: 6, label: 'Top shops: 6+ mechanic/team photos' },
    'product-photos': { median: 5, top: 15, label: 'Top shops: 15+ completed repair photos' },
  },
  lawyer: {
    'review-count': { median: 25, top: 80, label: 'Law firm avg: 25 reviews, top performers: 80+' },
    'average-rating': { median: 4.6, top: 4.9, label: 'Law firm avg: 4.6 stars, top: 4.9+' },
    'exterior-photos': { median: 2, top: 4, label: 'Top firms: 4+ office exterior photos' },
    'interior-photos': { median: 3, top: 6, label: 'Top firms: 6+ professional office photos' },
    'team-photos': { median: 4, top: 8, label: 'Top firms: 8+ attorney headshots' },
    'product-photos': { median: 2, top: 5, label: 'Firms: 5+ community/event photos' },
  },
  hvac: {
    'review-count': { median: 40, top: 120, label: 'HVAC avg: 40 reviews, top performers: 120+' },
    'average-rating': { median: 4.5, top: 4.8, label: 'HVAC avg: 4.5 stars, top: 4.8+' },
    'exterior-photos': { median: 2, top: 5, label: 'Top HVAC: 5+ vehicle/branding photos' },
    'interior-photos': { median: 2, top: 4, label: 'HVAC interior photos are less critical' },
    'team-photos': { median: 3, top: 6, label: 'Top HVAC: 6+ technician photos' },
    'product-photos': { median: 6, top: 15, label: 'Top HVAC: 15+ installation/repair photos' },
  },
  landscaper: {
    'review-count': { median: 30, top: 90, label: 'Landscaper avg: 30 reviews, top performers: 90+' },
    'average-rating': { median: 4.5, top: 4.8, label: 'Landscaper avg: 4.5 stars, top: 4.8+' },
    'exterior-photos': { median: 2, top: 4, label: 'Top landscapers: 4+ truck/equipment photos' },
    'interior-photos': { median: 1, top: 2, label: 'Interior photos less relevant for landscapers' },
    'team-photos': { median: 2, top: 5, label: 'Top landscapers: 5+ crew photos' },
    'product-photos': { median: 12, top: 30, label: 'Top landscapers: 30+ project before/after photos' },
  },
  electrician: {
    'review-count': { median: 30, top: 90, label: 'Electrician avg: 30 reviews, top performers: 90+' },
    'average-rating': { median: 4.5, top: 4.8, label: 'Electrician avg: 4.5 stars, top: 4.8+' },
    'exterior-photos': { median: 2, top: 5, label: 'Top electricians: 5+ vehicle/branding photos' },
    'interior-photos': { median: 2, top: 4, label: 'Electrician interior photos less critical' },
    'team-photos': { median: 2, top: 5, label: 'Top electricians: 5+ team photos' },
    'product-photos': { median: 6, top: 15, label: 'Top electricians: 15+ completed work photos' },
  },
  roofer: {
    'review-count': { median: 35, top: 100, label: 'Roofer avg: 35 reviews, top performers: 100+' },
    'average-rating': { median: 4.5, top: 4.8, label: 'Roofer avg: 4.5 stars, top: 4.8+' },
    'exterior-photos': { median: 3, top: 6, label: 'Top roofers: 6+ project exterior photos' },
    'interior-photos': { median: 1, top: 3, label: 'Interior photos less relevant for roofers' },
    'team-photos': { median: 2, top: 5, label: 'Top roofers: 5+ crew photos' },
    'product-photos': { median: 10, top: 25, label: 'Top roofers: 25+ before/after project photos' },
  },
  'real-estate': {
    'review-count': { median: 20, top: 60, label: 'Agent avg: 20 reviews, top performers: 60+' },
    'average-rating': { median: 4.7, top: 5.0, label: 'Agent avg: 4.7 stars, top: 5.0' },
    'exterior-photos': { median: 3, top: 8, label: 'Top agents: 8+ property/office photos' },
    'interior-photos': { median: 2, top: 5, label: 'Top agents: 5+ office photos' },
    'team-photos': { median: 3, top: 6, label: 'Top agents: 6+ professional headshots' },
    'product-photos': { median: 8, top: 20, label: 'Top agents: 20+ property/listing photos' },
  },
  accountant: {
    'review-count': { median: 20, top: 60, label: 'CPA avg: 20 reviews, top performers: 60+' },
    'average-rating': { median: 4.7, top: 5.0, label: 'CPA avg: 4.7 stars, top: 5.0' },
    'exterior-photos': { median: 2, top: 4, label: 'Top CPAs: 4+ office exterior photos' },
    'interior-photos': { median: 2, top: 5, label: 'Top CPAs: 5+ office interior photos' },
    'team-photos': { median: 3, top: 6, label: 'Top CPAs: 6+ team headshots' },
    'product-photos': { median: 1, top: 3, label: 'CPAs: 3+ event/community photos' },
  },
  veterinarian: {
    'review-count': { median: 50, top: 150, label: 'Vet avg: 50 reviews, top performers: 150+' },
    'average-rating': { median: 4.5, top: 4.8, label: 'Vet avg: 4.5 stars, top: 4.8+' },
    'exterior-photos': { median: 3, top: 6, label: 'Top vets: 6+ facility exterior photos' },
    'interior-photos': { median: 4, top: 8, label: 'Top vets: 8+ exam room/facility photos' },
    'team-photos': { median: 5, top: 10, label: 'Top vets: 10+ staff/doctor photos' },
    'product-photos': { median: 8, top: 20, label: 'Top vets: 20+ patient/treatment photos' },
  },
  gym: {
    'review-count': { median: 50, top: 150, label: 'Gym avg: 50 reviews, top performers: 150+' },
    'average-rating': { median: 4.3, top: 4.7, label: 'Gym avg: 4.3 stars, top: 4.7+' },
    'exterior-photos': { median: 3, top: 6, label: 'Top gyms: 6+ building/signage photos' },
    'interior-photos': { median: 6, top: 15, label: 'Top gyms: 15+ equipment/floor photos' },
    'team-photos': { median: 4, top: 8, label: 'Top gyms: 8+ trainer/staff photos' },
    'product-photos': { median: 8, top: 20, label: 'Top gyms: 20+ class/equipment photos' },
  },
  retail: {
    'review-count': { median: 40, top: 120, label: 'Retail avg: 40 reviews, top performers: 120+' },
    'average-rating': { median: 4.3, top: 4.7, label: 'Retail avg: 4.3 stars, top: 4.7+' },
    'exterior-photos': { median: 3, top: 6, label: 'Top retail: 6+ storefront photos' },
    'interior-photos': { median: 5, top: 12, label: 'Top retail: 12+ store interior photos' },
    'team-photos': { median: 2, top: 5, label: 'Top retail: 5+ staff photos' },
    'product-photos': { median: 12, top: 30, label: 'Top retail: 30+ product photos' },
  },
  cleaning: {
    'review-count': { median: 30, top: 80, label: 'Cleaning avg: 30 reviews, top performers: 80+' },
    'average-rating': { median: 4.5, top: 4.8, label: 'Cleaning avg: 4.5 stars, top: 4.8+' },
    'exterior-photos': { median: 2, top: 4, label: 'Top cleaning: 4+ vehicle/branding photos' },
    'interior-photos': { median: 1, top: 3, label: 'Interior photos less critical for cleaning' },
    'team-photos': { median: 3, top: 6, label: 'Top cleaning: 6+ team photos' },
    'product-photos': { median: 8, top: 20, label: 'Top cleaning: 20+ before/after photos' },
  },
};

// Generic benchmarks for when no industry is selected
export const genericBenchmarks = {
  'review-count': { median: 40, top: 100, label: 'Local business avg: 40 reviews, top performers: 100+' },
  'average-rating': { median: 4.4, top: 4.8, label: 'Local business avg: 4.4 stars, top: 4.8+' },
  'exterior-photos': { median: 3, top: 6, label: 'Top businesses: 6+ exterior photos' },
  'interior-photos': { median: 3, top: 8, label: 'Top businesses: 8+ interior photos' },
  'team-photos': { median: 3, top: 6, label: 'Top businesses: 6+ team photos' },
  'product-photos': { median: 8, top: 20, label: 'Top businesses: 20+ product/service photos' },
};

export function getBenchmark(industryId, itemId) {
  if (industryId && industryBenchmarks[industryId]?.[itemId]) {
    return industryBenchmarks[industryId][itemId];
  }
  if (genericBenchmarks[itemId]) {
    return genericBenchmarks[itemId];
  }
  return null;
}

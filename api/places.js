// Vercel serverless function — proxies Google Places API (New)
// API key stays server-side, never exposed to the browser

const API_KEY = 'REDACTED_KEY';

const FIELD_MASK = [
  // Basic info
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.internationalPhoneNumber',
  'places.websiteUri',
  'places.rating',
  'places.userRatingCount',
  'places.regularOpeningHours',
  'places.photos',
  'places.primaryTypeDisplayName',
  'places.types',
  'places.businessStatus',
  // Accessibility
  'places.accessibilityOptions',
  // Amenities & attributes
  'places.delivery',
  'places.takeout',
  'places.dineIn',
  'places.curbsidePickup',
  'places.reservable',
  'places.outdoorSeating',
  'places.restroom',
  'places.paymentOptions',
  'places.parkingOptions',
  'places.goodForGroups',
  'places.goodForChildren',
  'places.allowsDogs',
  'places.servesBeer',
  'places.servesWine',
  'places.servesCocktails',
  'places.servesCoffee',
  'places.servesBreakfast',
  'places.servesLunch',
  'places.servesDinner',
  'places.servesVegetarianFood',
  // Secondary hours
  'places.currentSecondaryOpeningHours',
  // Reviews (for keyword analysis)
  'places.reviews',
  // Editorial summary (signals description quality)
  'places.editorialSummary',
].join(',');

// Generic Google types that don't count as meaningful business categories
const GENERIC_TYPES = new Set([
  'establishment', 'point_of_interest', 'food', 'service', 'store',
  'restaurant', 'health', 'general_contractor', 'finance',
]);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const query = req.query.q;
  if (!query || query.trim().length < 2) {
    return res.status(400).json({ error: 'Query parameter "q" is required (min 2 characters)' });
  }

  try {
    // Google Places API (New) — Text Search
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: 'en',
        maxResultCount: 5,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Google Places API error:', response.status, errorBody);
      return res.status(502).json({
        error: 'Google Places API request failed',
        status: response.status,
      });
    }

    const data = await response.json();

    if (!data.places || data.places.length === 0) {
      return res.status(200).json({ results: [] });
    }

    // Parse results into a clean format
    const results = data.places.map((place) => {
      // Count meaningful business types (excluding generic Google types and primary)
      const primaryType = place.primaryTypeDisplayName?.text || '';
      const allTypes = place.types || [];
      const meaningfulTypes = allTypes.filter((t) => !GENERIC_TYPES.has(t));
      const secondaryCategoryCount = Math.max(0, meaningfulTypes.length - 1); // subtract primary

      // Parse accessibility options
      const accessibility = place.accessibilityOptions || {};
      const accessibilitySet = Object.values(accessibility).some((v) => v === true);

      // Collect amenities that are present
      const amenities = [];
      if (place.takeout) amenities.push('Takeout');
      if (place.delivery) amenities.push('Delivery');
      if (place.dineIn) amenities.push('Dine-in');
      if (place.curbsidePickup) amenities.push('Curbside pickup');
      if (place.reservable) amenities.push('Reservable');
      if (place.outdoorSeating) amenities.push('Outdoor seating');
      if (place.restroom) amenities.push('Restroom');
      if (place.goodForGroups) amenities.push('Good for groups');
      if (place.goodForChildren) amenities.push('Good for children');
      if (place.allowsDogs) amenities.push('Dog-friendly');
      if (place.servesBeer) amenities.push('Beer');
      if (place.servesWine) amenities.push('Wine');
      if (place.servesCocktails) amenities.push('Cocktails');
      if (place.servesCoffee) amenities.push('Coffee');
      if (place.servesBreakfast) amenities.push('Breakfast');
      if (place.servesLunch) amenities.push('Lunch');
      if (place.servesDinner) amenities.push('Dinner');
      if (place.servesVegetarianFood) amenities.push('Vegetarian');
      if (place.paymentOptions) {
        const po = place.paymentOptions;
        if (po.acceptsCreditCards) amenities.push('Credit cards');
        if (po.acceptsDebitCards) amenities.push('Debit cards');
        if (po.acceptsNfc) amenities.push('NFC/contactless');
      }
      if (place.parkingOptions) {
        const pk = place.parkingOptions;
        if (pk.freeParkingLot || pk.freeStreetParking) amenities.push('Free parking');
        if (pk.paidParkingLot || pk.paidStreetParking) amenities.push('Paid parking');
        if (pk.valetParking) amenities.push('Valet parking');
      }

      // Check secondary opening hours
      const hasSecondaryHours = !!(place.currentSecondaryOpeningHours?.length);

      // Analyze reviews for service/location keyword mentions
      const reviews = place.reviews || [];
      const reviewTexts = reviews
        .map((r) => (r.text?.text || '').toLowerCase())
        .filter((t) => t.length > 0);

      // Extract location keywords from address
      const addressParts = (place.formattedAddress || '').split(',').map((p) => p.trim().toLowerCase());
      const city = addressParts.length >= 2 ? addressParts[addressParts.length - 3] || '' : '';
      const neighborhood = addressParts[0] || '';

      // Check if reviews mention the business type or location
      const categoryKeywords = meaningfulTypes
        .map((t) => t.replace(/_/g, ' '))
        .concat([primaryType.toLowerCase()]);
      let reviewsMentionKeywords = false;
      if (reviewTexts.length > 0) {
        const mentionCount = reviewTexts.filter((text) =>
          categoryKeywords.some((kw) => text.includes(kw)) ||
          (city && text.includes(city))
        ).length;
        reviewsMentionKeywords = mentionCount >= Math.ceil(reviewTexts.length * 0.4); // 40%+ mention keywords
      }

      // Editorial summary suggests Google has enough info about the business
      const hasEditorialSummary = !!(place.editorialSummary?.text);

      return {
        id: place.id,
        name: place.displayName?.text || '',
        address: place.formattedAddress || '',
        phone: place.internationalPhoneNumber || '',
        website: place.websiteUri || '',
        rating: place.rating || null,
        reviewCount: place.userRatingCount || 0,
        photoCount: place.photos?.length || 0,
        primaryCategory: place.primaryTypeDisplayName?.text || '',
        types: allTypes,
        businessStatus: place.businessStatus || '',
        hasRegularHours: !!(place.regularOpeningHours?.periods?.length),
        regularHours: place.regularOpeningHours?.weekdayDescriptions || [],
        // New expanded fields
        secondaryCategoryCount,
        hasAccessibility: accessibilitySet,
        accessibilityDetails: accessibility,
        amenities,
        amenityCount: amenities.length,
        hasSecondaryHours,
        reviewsMentionKeywords,
        hasEditorialSummary,
        recentReviewCount: reviews.length,
      };
    });

    return res.status(200).json({ results });
  } catch (err) {
    console.error('Serverless function error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

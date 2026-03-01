// Vercel serverless function — proxies Google Places API (New)
// API key stays server-side, never exposed to the browser

const API_KEY = 'REDACTED_KEY';

const FIELD_MASK = [
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
].join(',');

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
    const results = data.places.map((place) => ({
      id: place.id,
      name: place.displayName?.text || '',
      address: place.formattedAddress || '',
      phone: place.internationalPhoneNumber || '',
      website: place.websiteUri || '',
      rating: place.rating || null,
      reviewCount: place.userRatingCount || 0,
      photoCount: place.photos?.length || 0,
      primaryCategory: place.primaryTypeDisplayName?.text || '',
      types: place.types || [],
      businessStatus: place.businessStatus || '',
      hasRegularHours: !!(place.regularOpeningHours?.periods?.length),
      regularHours: place.regularOpeningHours?.weekdayDescriptions || [],
    }));

    return res.status(200).json({ results });
  } catch (err) {
    console.error('Serverless function error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

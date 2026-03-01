import { useState, useRef } from 'react';

function BusinessSearch({ onAutoFill }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [filled, setFilled] = useState(false);
  const inputRef = useRef(null);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setError('Enter a business name and city (e.g., Joe\'s Pizza Chicago)');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);
    setSelectedBusiness(null);
    setFilled(false);

    try {
      const res = await fetch(`/api/places?q=${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Search failed (${res.status})`);
      }

      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        setError('No businesses found. Try a more specific search with your city name.');
        setResults([]);
      } else {
        setResults(data.results);
      }
    } catch (err) {
      setError(err.message || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSelect = (business) => {
    setSelectedBusiness(business);
    setFilled(false);
  };

  const handleAutoFill = () => {
    if (!selectedBusiness) return;
    onAutoFill(selectedBusiness);
    setFilled(true);
  };

  const handleClear = () => {
    setQuery('');
    setResults(null);
    setSelectedBusiness(null);
    setFilled(false);
    setError('');
    inputRef.current?.focus();
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    const full = Math.floor(rating);
    const half = rating - full >= 0.25;
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < full) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-tangerine" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === full && half) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-tangerine" viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`half-star-${i}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#434F58" />
              </linearGradient>
            </defs>
            <path fill={`url(#half-star-${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-4 h-4 text-metal" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
  };

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-5 sm:p-6 mb-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-turtle/10 border border-turtle/20">
          <svg className="w-5 h-5 text-turtle" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white">Search for Your Business</h2>
          <p className="text-xs sm:text-sm text-galactic">Auto-fill your checklist with live data from Google</p>
        </div>
      </div>

      {/* Search input */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={"e.g., Joe's Pizza Chicago or Smith Dental Portland"}
            className="w-full bg-midnight/50 border border-metal/30 rounded-lg px-4 py-3 text-sm text-white placeholder-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:border-transparent transition-colors"
            disabled={loading}
          />
          {query && !loading && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-galactic hover:text-white transition-colors cursor-pointer p-1"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || query.trim().length < 2}
          className="flex items-center justify-center gap-2 bg-azure text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-azure-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss min-h-[44px] shrink-0"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Searching...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Search
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-coral animate-fadeIn">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {/* Results list */}
      {results && results.length > 0 && !selectedBusiness && (
        <div className="mt-4 space-y-2 animate-fadeIn">
          <p className="text-xs text-galactic mb-2">
            {results.length} result{results.length !== 1 ? 's' : ''} found — select your business:
          </p>
          {results.map((biz) => (
            <button
              key={biz.id}
              onClick={() => handleSelect(biz)}
              className="w-full text-left p-3 sm:p-4 bg-midnight/30 border border-metal/20 rounded-xl hover:border-azure/40 hover:bg-midnight/50 transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-oblivion"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white group-hover:text-azure transition-colors truncate">
                    {biz.name}
                  </p>
                  <p className="text-xs text-galactic mt-0.5 truncate">{biz.address}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    {biz.rating && (
                      <div className="flex items-center gap-1.5">
                        {renderStars(biz.rating)}
                        <span className="text-xs text-cloudy font-medium">{biz.rating}</span>
                        <span className="text-xs text-galactic">({biz.reviewCount})</span>
                      </div>
                    )}
                    {biz.primaryCategory && (
                      <span className="text-xs text-galactic border border-metal/30 rounded px-1.5 py-0.5">
                        {biz.primaryCategory}
                      </span>
                    )}
                  </div>
                </div>
                <svg className="w-5 h-5 text-metal group-hover:text-azure transition-colors shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected business detail */}
      {selectedBusiness && (
        <div className="mt-4 animate-fadeIn">
          <div className="p-4 sm:p-5 bg-midnight/40 border border-turtle/20 rounded-xl">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-base font-bold text-white">{selectedBusiness.name}</p>
                <p className="text-sm text-galactic mt-0.5">{selectedBusiness.address}</p>
              </div>
              <button
                onClick={() => { setSelectedBusiness(null); setFilled(false); }}
                className="text-xs text-galactic hover:text-white transition-colors cursor-pointer shrink-0 p-1"
                aria-label="Change selection"
              >
                Change
              </button>
            </div>

            {/* Data pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedBusiness.rating && (
                <div className="flex items-center gap-1.5 bg-abyss/50 border border-metal/20 rounded-lg px-3 py-1.5">
                  {renderStars(selectedBusiness.rating)}
                  <span className="text-sm font-medium text-white ml-1">{selectedBusiness.rating}</span>
                </div>
              )}
              {selectedBusiness.reviewCount > 0 && (
                <div className="flex items-center gap-1.5 bg-abyss/50 border border-metal/20 rounded-lg px-3 py-1.5">
                  <svg className="w-3.5 h-3.5 text-cloudy" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                  <span className="text-sm text-cloudy">{selectedBusiness.reviewCount} reviews</span>
                </div>
              )}
              {selectedBusiness.photoCount > 0 && (
                <div className="flex items-center gap-1.5 bg-abyss/50 border border-metal/20 rounded-lg px-3 py-1.5">
                  <svg className="w-3.5 h-3.5 text-cloudy" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                  <span className="text-sm text-cloudy">{selectedBusiness.photoCount} photos</span>
                </div>
              )}
              {selectedBusiness.phone && (
                <div className="flex items-center gap-1.5 bg-abyss/50 border border-metal/20 rounded-lg px-3 py-1.5">
                  <svg className="w-3.5 h-3.5 text-cloudy" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span className="text-sm text-cloudy">{selectedBusiness.phone}</span>
                </div>
              )}
              {selectedBusiness.primaryCategory && (
                <div className="flex items-center gap-1.5 bg-abyss/50 border border-metal/20 rounded-lg px-3 py-1.5">
                  <svg className="w-3.5 h-3.5 text-cloudy" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                  <span className="text-sm text-cloudy">{selectedBusiness.primaryCategory}</span>
                </div>
              )}
              {selectedBusiness.hasRegularHours && (
                <div className="flex items-center gap-1.5 bg-abyss/50 border border-metal/20 rounded-lg px-3 py-1.5">
                  <svg className="w-3.5 h-3.5 text-turtle" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-turtle">Hours set</span>
                </div>
              )}
              {selectedBusiness.website && (
                <div className="flex items-center gap-1.5 bg-abyss/50 border border-metal/20 rounded-lg px-3 py-1.5">
                  <svg className="w-3.5 h-3.5 text-cloudy" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                  <span className="text-sm text-cloudy truncate max-w-[180px]">
                    {selectedBusiness.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </span>
                </div>
              )}
              {selectedBusiness.amenityCount > 0 && (
                <div className="flex items-center gap-1.5 bg-abyss/50 border border-metal/20 rounded-lg px-3 py-1.5">
                  <svg className="w-3.5 h-3.5 text-cloudy" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                  <span className="text-sm text-cloudy">{selectedBusiness.amenityCount} attributes</span>
                </div>
              )}
              {selectedBusiness.hasAccessibility && (
                <div className="flex items-center gap-1.5 bg-abyss/50 border border-metal/20 rounded-lg px-3 py-1.5">
                  <svg className="w-3.5 h-3.5 text-turtle" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-turtle">Accessibility</span>
                </div>
              )}
            </div>

            {/* What will be auto-filled */}
            {!filled && (
              <div className="mb-4 p-3 bg-abyss/40 border border-metal/15 rounded-lg">
                <p className="text-xs font-medium text-cloudy mb-2">Will auto-fill these checklist items:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBusiness.name && (
                    <span className="text-xs bg-turtle/10 text-turtle border border-turtle/20 rounded px-2 py-0.5">Business name</span>
                  )}
                  {selectedBusiness.address && (
                    <span className="text-xs bg-turtle/10 text-turtle border border-turtle/20 rounded px-2 py-0.5">Address</span>
                  )}
                  {selectedBusiness.phone && (
                    <span className="text-xs bg-turtle/10 text-turtle border border-turtle/20 rounded px-2 py-0.5">Phone</span>
                  )}
                  {selectedBusiness.website && (
                    <span className="text-xs bg-turtle/10 text-turtle border border-turtle/20 rounded px-2 py-0.5">Website</span>
                  )}
                  {selectedBusiness.primaryCategory && (
                    <span className="text-xs bg-turtle/10 text-turtle border border-turtle/20 rounded px-2 py-0.5">Primary category</span>
                  )}
                  {selectedBusiness.secondaryCategoryCount >= 2 && (
                    <span className="text-xs bg-turtle/10 text-turtle border border-turtle/20 rounded px-2 py-0.5">Secondary categories</span>
                  )}
                  {selectedBusiness.hasEditorialSummary && (
                    <span className="text-xs bg-turtle/10 text-turtle border border-turtle/20 rounded px-2 py-0.5">Description</span>
                  )}
                  {selectedBusiness.hasRegularHours && (
                    <span className="text-xs bg-turtle/10 text-turtle border border-turtle/20 rounded px-2 py-0.5">Regular hours</span>
                  )}
                  {selectedBusiness.hasSecondaryHours && (
                    <span className="text-xs bg-turtle/10 text-turtle border border-turtle/20 rounded px-2 py-0.5">Additional hours</span>
                  )}
                  {selectedBusiness.hasAccessibility && (
                    <span className="text-xs bg-turtle/10 text-turtle border border-turtle/20 rounded px-2 py-0.5">Accessibility</span>
                  )}
                  {selectedBusiness.amenityCount >= 3 && (
                    <span className="text-xs bg-turtle/10 text-turtle border border-turtle/20 rounded px-2 py-0.5">Amenities</span>
                  )}
                  {selectedBusiness.reviewCount > 0 && (
                    <span className="text-xs bg-turtle/10 text-turtle border border-turtle/20 rounded px-2 py-0.5">Review count</span>
                  )}
                  {selectedBusiness.rating && (
                    <span className="text-xs bg-turtle/10 text-turtle border border-turtle/20 rounded px-2 py-0.5">Star rating</span>
                  )}
                  {selectedBusiness.reviewsMentionKeywords && (
                    <span className="text-xs bg-turtle/10 text-turtle border border-turtle/20 rounded px-2 py-0.5">Review keywords</span>
                  )}
                </div>
                {selectedBusiness.photoCount > 0 && (
                  <p className="text-xs text-galactic mt-2">
                    Photos detected on your listing. Categorize them by type (exterior, interior, team, product) in the checklist below.
                  </p>
                )}
              </div>
            )}

            {/* Auto-fill button */}
            {!filled ? (
              <button
                onClick={handleAutoFill}
                className="w-full flex items-center justify-center gap-2 bg-turtle text-abyss px-6 py-3 rounded-lg font-semibold text-sm hover:bg-turtle/90 transition-colors cursor-pointer focus:ring-2 focus:ring-turtle focus:ring-offset-2 focus:ring-offset-abyss min-h-[44px]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                Auto-Fill Checklist
              </button>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-turtle/10 border border-turtle/20 rounded-lg animate-fadeIn">
                <svg className="w-5 h-5 text-turtle shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-turtle font-medium">Checklist auto-filled! Review the items below and complete the rest manually.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BusinessSearch;

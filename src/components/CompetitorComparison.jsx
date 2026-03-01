import { useState } from 'react';
import { getBenchmark } from '../data/benchmarks';

const EMPTY_COMPETITOR = { name: '', reviews: '', rating: '', photos: '' };

export default function CompetitorComparison({ values, selectedIndustry }) {
  const [competitors, setCompetitors] = useState([{ ...EMPTY_COMPETITOR }]);
  const [showComparison, setShowComparison] = useState(false);

  const addCompetitor = () => {
    if (competitors.length < 3) {
      setCompetitors([...competitors, { ...EMPTY_COMPETITOR }]);
    }
  };

  const removeCompetitor = (idx) => {
    setCompetitors(competitors.filter((_, i) => i !== idx));
  };

  const updateCompetitor = (idx, field, val) => {
    const updated = [...competitors];
    updated[idx] = { ...updated[idx], [field]: val };
    setCompetitors(updated);
  };

  const hasAnyData = competitors.some(c => c.name || c.reviews || c.rating || c.photos);

  // Build comparison data
  const myReviews = parseFloat(values['review-count']) || 0;
  const myRating = parseFloat(values['average-rating']) || 0;
  const myPhotos =
    (parseFloat(values['exterior-photos']) || 0) +
    (parseFloat(values['interior-photos']) || 0) +
    (parseFloat(values['team-photos']) || 0) +
    (parseFloat(values['product-photos']) || 0);

  const benchmark = getBenchmark(selectedIndustry, 'review-count');

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-5 sm:p-6 animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-prince/10">
          <svg className="w-5 h-5 text-prince" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Competitor Comparison</h3>
          <p className="text-sm text-galactic">
            Enter competitor stats from their Google listing to see how you stack up
          </p>
        </div>
      </div>

      <p className="text-xs text-galactic mb-4 bg-midnight/50 p-3 rounded-lg">
        <strong className="text-cloudy">How to find competitor stats:</strong> Search for a competitor on Google Maps, then note their review count, star rating, and approximate photo count from their listing.
      </p>

      {/* Competitor entry forms */}
      <div className="space-y-4">
        {competitors.map((comp, idx) => (
          <div key={idx} className="bg-metal/5 border border-metal/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-cloudy">Competitor {idx + 1}</span>
              {competitors.length > 1 && (
                <button
                  onClick={() => removeCompetitor(idx)}
                  className="text-xs text-galactic hover:text-coral transition-colors cursor-pointer p-1 rounded focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs text-galactic block mb-1">Business Name</label>
                <input
                  type="text"
                  value={comp.name}
                  onChange={(e) => updateCompetitor(idx, 'name', e.target.value)}
                  placeholder="e.g., Joe's Plumbing"
                  className="w-full bg-midnight border border-metal/30 rounded-md px-3 py-2 text-sm text-white placeholder-galactic/50 focus:border-azure focus:ring-1 focus:ring-azure focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-galactic block mb-1">Google Reviews</label>
                <input
                  type="number"
                  min="0"
                  value={comp.reviews}
                  onChange={(e) => updateCompetitor(idx, 'reviews', e.target.value)}
                  placeholder="0"
                  className="w-full bg-midnight border border-metal/30 rounded-md px-3 py-2 text-sm text-white placeholder-galactic/50 focus:border-azure focus:ring-1 focus:ring-azure focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-galactic block mb-1">Star Rating</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={comp.rating}
                  onChange={(e) => updateCompetitor(idx, 'rating', e.target.value)}
                  placeholder="4.5"
                  className="w-full bg-midnight border border-metal/30 rounded-md px-3 py-2 text-sm text-white placeholder-galactic/50 focus:border-azure focus:ring-1 focus:ring-azure focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-galactic block mb-1">Approximate Photo Count</label>
                <input
                  type="number"
                  min="0"
                  value={comp.photos}
                  onChange={(e) => updateCompetitor(idx, 'photos', e.target.value)}
                  placeholder="0"
                  className="w-full bg-midnight border border-metal/30 rounded-md px-3 py-2 text-sm text-white placeholder-galactic/50 focus:border-azure focus:ring-1 focus:ring-azure focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add competitor button */}
      {competitors.length < 3 && (
        <button
          onClick={addCompetitor}
          className="mt-3 flex items-center gap-1.5 text-sm text-azure hover:text-white transition-colors cursor-pointer py-1 focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss rounded"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Competitor ({competitors.length}/3)
        </button>
      )}

      {/* Compare button */}
      {hasAnyData && (
        <button
          onClick={() => setShowComparison(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-prince/20 text-prince border border-prince/30 px-4 py-3 rounded-lg font-semibold text-sm hover:bg-prince/30 transition-colors cursor-pointer focus:ring-2 focus:ring-prince focus:ring-offset-2 focus:ring-offset-abyss"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          Compare
        </button>
      )}

      {/* Comparison results */}
      {showComparison && hasAnyData && (
        <div className="mt-6 animate-fadeIn">
          <h4 className="text-sm font-bold text-white mb-4">How You Compare</h4>

          {/* Comparison table */}
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-metal/20">
                  <th className="text-left text-xs text-galactic font-medium py-2 px-2">Metric</th>
                  <th className="text-center text-xs text-azure font-medium py-2 px-2">You</th>
                  {competitors.filter(c => c.name).map((comp, idx) => (
                    <th key={idx} className="text-center text-xs text-cloudy font-medium py-2 px-2 max-w-[100px] truncate">
                      {comp.name}
                    </th>
                  ))}
                  {benchmark && (
                    <th className="text-center text-xs text-prince font-medium py-2 px-2">Industry Avg</th>
                  )}
                </tr>
              </thead>
              <tbody>
                <ComparisonRow
                  label="Reviews"
                  myValue={myReviews}
                  competitors={competitors.filter(c => c.name)}
                  getCompValue={(c) => parseFloat(c.reviews) || 0}
                  benchmarkValue={benchmark?.median}
                  format={(v) => Math.round(v).toString()}
                />
                <ComparisonRow
                  label="Rating"
                  myValue={myRating}
                  competitors={competitors.filter(c => c.name)}
                  getCompValue={(c) => parseFloat(c.rating) || 0}
                  benchmarkValue={getBenchmark(selectedIndustry, 'average-rating')?.median}
                  format={(v) => v.toFixed(1)}
                  higherIsBetter={true}
                />
                <ComparisonRow
                  label="Photos"
                  myValue={myPhotos}
                  competitors={competitors.filter(c => c.name)}
                  getCompValue={(c) => parseFloat(c.photos) || 0}
                  benchmarkValue={null}
                  format={(v) => Math.round(v).toString()}
                />
              </tbody>
            </table>
          </div>

          {/* Gap analysis */}
          <div className="mt-4 space-y-2">
            {competitors.filter(c => c.name).map((comp, idx) => {
              const gaps = [];
              const compReviews = parseFloat(comp.reviews) || 0;
              const compRating = parseFloat(comp.rating) || 0;
              const compPhotos = parseFloat(comp.photos) || 0;

              if (compReviews > myReviews) {
                gaps.push({
                  metric: 'reviews',
                  diff: compReviews - myReviews,
                  text: `You need ${Math.round(compReviews - myReviews)} more reviews to match ${comp.name}`,
                });
              }
              if (compRating > myRating && myRating > 0) {
                gaps.push({
                  metric: 'rating',
                  diff: compRating - myRating,
                  text: `Your rating is ${(compRating - myRating).toFixed(1)} stars below ${comp.name}`,
                });
              }
              if (compPhotos > myPhotos) {
                gaps.push({
                  metric: 'photos',
                  diff: compPhotos - myPhotos,
                  text: `You need ${Math.round(compPhotos - myPhotos)} more photos to match ${comp.name}`,
                });
              }

              if (gaps.length === 0) return null;

              return (
                <div key={idx} className="bg-coral/5 border border-coral/10 rounded-lg p-3">
                  <h5 className="text-xs font-semibold text-coral mb-2">Gaps vs. {comp.name}</h5>
                  <ul className="space-y-1">
                    {gaps.map((gap, gIdx) => (
                      <li key={gIdx} className="flex items-start gap-2 text-xs text-cloudy">
                        <svg className="w-3 h-3 mt-0.5 shrink-0 text-coral" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m-15 0v15h15" />
                        </svg>
                        {gap.text}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* Wins */}
            {competitors.filter(c => c.name).map((comp, idx) => {
              const wins = [];
              const compReviews = parseFloat(comp.reviews) || 0;
              const compRating = parseFloat(comp.rating) || 0;
              const compPhotos = parseFloat(comp.photos) || 0;

              if (myReviews > compReviews && compReviews > 0) {
                wins.push(`${Math.round(myReviews - compReviews)} more reviews than ${comp.name}`);
              }
              if (myRating > compRating && compRating > 0) {
                wins.push(`${(myRating - compRating).toFixed(1)} stars higher than ${comp.name}`);
              }
              if (myPhotos > compPhotos && compPhotos > 0) {
                wins.push(`${Math.round(myPhotos - compPhotos)} more photos than ${comp.name}`);
              }

              if (wins.length === 0) return null;

              return (
                <div key={`win-${idx}`} className="bg-turtle/5 border border-turtle/10 rounded-lg p-3">
                  <h5 className="text-xs font-semibold text-turtle mb-2">Your Advantages</h5>
                  <ul className="space-y-1">
                    {wins.map((win, wIdx) => (
                      <li key={wIdx} className="flex items-start gap-2 text-xs text-cloudy">
                        <svg className="w-3 h-3 mt-0.5 shrink-0 text-turtle" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {win}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ComparisonRow({ label, myValue, competitors, getCompValue, benchmarkValue, format, higherIsBetter = true }) {
  const compValues = competitors.map(getCompValue);
  const maxComp = Math.max(...compValues, 0);
  const isWinning = higherIsBetter ? myValue >= maxComp : myValue <= maxComp;
  const allValues = [myValue, ...compValues, benchmarkValue].filter(v => v != null && v > 0);
  const maxVal = Math.max(...allValues, 1);

  return (
    <tr className="border-b border-metal/10">
      <td className="text-xs text-galactic py-3 px-2">{label}</td>
      <td className="text-center py-3 px-2">
        <div className="flex flex-col items-center gap-1">
          <span className={`text-sm font-bold ${myValue > 0 ? (isWinning ? 'text-turtle' : 'text-tangerine') : 'text-galactic'}`}>
            {myValue > 0 ? format(myValue) : '—'}
          </span>
          {myValue > 0 && (
            <div className="w-full h-1 bg-metal/20 rounded-full overflow-hidden max-w-[60px]">
              <div className={`h-full rounded-full ${isWinning ? 'bg-turtle' : 'bg-tangerine'}`} style={{ width: `${(myValue / maxVal) * 100}%` }} />
            </div>
          )}
        </div>
      </td>
      {competitors.map((comp, idx) => {
        const val = getCompValue(comp);
        return (
          <td key={idx} className="text-center py-3 px-2">
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-medium text-cloudy">
                {val > 0 ? format(val) : '—'}
              </span>
              {val > 0 && (
                <div className="w-full h-1 bg-metal/20 rounded-full overflow-hidden max-w-[60px]">
                  <div className="h-full rounded-full bg-cloudy/50" style={{ width: `${(val / maxVal) * 100}%` }} />
                </div>
              )}
            </div>
          </td>
        );
      })}
      {benchmarkValue != null && (
        <td className="text-center py-3 px-2">
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-prince">
              {format(benchmarkValue)}
            </span>
            <div className="w-full h-1 bg-metal/20 rounded-full overflow-hidden max-w-[60px]">
              <div className="h-full rounded-full bg-prince/50" style={{ width: `${(benchmarkValue / maxVal) * 100}%` }} />
            </div>
          </div>
        </td>
      )}
    </tr>
  );
}

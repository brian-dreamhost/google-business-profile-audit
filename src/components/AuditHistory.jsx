import { useState } from 'react';

export default function AuditHistory({ history, onLoadAudit, onClearHistory }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!history || history.length === 0) return null;

  const latest = history[history.length - 1];
  const previous = history.length > 1 ? history[history.length - 2] : null;
  const scoreDiff = previous ? latest.score - previous.score : null;

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-5 mt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between cursor-pointer"
      >
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <svg className="w-4 h-4 text-prince" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Audit History
          <span className="text-xs font-normal text-galactic">({history.length})</span>
        </h4>
        <svg
          className={`w-4 h-4 text-galactic transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Latest summary always visible */}
      <div className="mt-3 flex items-center gap-3 text-sm">
        <span className="text-galactic">Last audit:</span>
        <span className={`font-bold ${latest.score >= 80 ? 'text-turtle' : latest.score >= 50 ? 'text-tangerine' : 'text-coral'}`}>
          {latest.score}/100
        </span>
        {scoreDiff !== null && (
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
            scoreDiff > 0 ? 'bg-turtle/10 text-turtle' : scoreDiff < 0 ? 'bg-coral/10 text-coral' : 'bg-metal/10 text-galactic'
          }`}>
            {scoreDiff > 0 ? '+' : ''}{scoreDiff} pts
          </span>
        )}
        <span className="text-xs text-galactic ml-auto">
          {formatDate(latest.date)}
        </span>
      </div>

      {/* Expanded history list */}
      {isExpanded && (
        <div className="mt-4 space-y-2 animate-fadeIn">
          {[...history].reverse().map((audit, idx) => (
            <div
              key={audit.date}
              className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
                idx === 0 ? 'bg-azure/5 border border-azure/10' : 'bg-metal/5 border border-metal/10'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                audit.score >= 80 ? 'bg-turtle/10 text-turtle' : audit.score >= 50 ? 'bg-tangerine/10 text-tangerine' : 'bg-coral/10 text-coral'
              }`}>
                {audit.score}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-cloudy">
                  {formatDate(audit.date)}
                  {audit.industry && <span className="text-galactic"> &middot; {audit.industry}</span>}
                </div>
                <div className="text-xs text-galactic">
                  {audit.completedItems}/{audit.totalItems} items complete
                </div>
              </div>
              <button
                onClick={() => onLoadAudit(audit)}
                className="text-xs text-azure hover:text-white transition-colors px-2 py-1 rounded cursor-pointer focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss"
                title="Load this audit"
              >
                Load
              </button>
            </div>
          ))}

          <button
            onClick={() => {
              if (window.confirm('Clear all audit history? This cannot be undone.')) {
                onClearHistory();
              }
            }}
            className="w-full text-xs text-galactic hover:text-coral transition-colors py-2 cursor-pointer"
          >
            Clear History
          </button>
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import BusinessSearch from './components/BusinessSearch';
import IndustrySelector from './components/IndustrySelector';
import ChecklistSection from './components/ChecklistSection';
import ScoreDisplay from './components/ScoreDisplay';
import ActionPlan from './components/ActionPlan';
import ExportButton from './components/ExportButton';
import AuditHistory from './components/AuditHistory';
import CompetitorComparison from './components/CompetitorComparison';
import { checklistSections } from './data/checklist';
import { industries } from './data/industries';
import { getBenchmark } from './data/benchmarks';

const STORAGE_KEY_DRAFT = 'gbp-audit-draft';
const STORAGE_KEY_HISTORY = 'gbp-audit-history';

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

function App() {
  // Load draft from localStorage on mount
  const draft = useMemo(() => loadFromStorage(STORAGE_KEY_DRAFT, null), []);
  const [selectedIndustry, setSelectedIndustry] = useState(draft?.industry || '');
  const [values, setValues] = useState(draft?.values || {});
  const [showActionPlan, setShowActionPlan] = useState(false);
  const [auditHistory, setAuditHistory] = useState(() => loadFromStorage(STORAGE_KEY_HISTORY, []));
  const [savedMessage, setSavedMessage] = useState('');
  const [autoFilledItems, setAutoFilledItems] = useState(new Set());
  const [fetchedBusiness, setFetchedBusiness] = useState(null);
  const actionPlanRef = useRef(null);

  // Auto-save draft to localStorage on every change
  useEffect(() => {
    if (Object.keys(values).length > 0 || selectedIndustry) {
      saveToStorage(STORAGE_KEY_DRAFT, { values, industry: selectedIndustry });
    }
  }, [values, selectedIndustry]);

  const handleItemChange = useCallback((itemId, value) => {
    setValues((prev) => ({ ...prev, [itemId]: value }));
  }, []);

  const handleIndustryChange = useCallback((industryId) => {
    setSelectedIndustry(industryId);
  }, []);

  // Auto-fill checklist from Google Places API data
  const handleAutoFill = useCallback((placeData) => {
    setFetchedBusiness(placeData);
    const newValues = { ...values };
    const filled = new Set();

    // --- Basic Information ---
    if (placeData.name) {
      newValues['business-name'] = true;
      filled.add('business-name');
    }
    if (placeData.address) {
      newValues['address'] = true;
      filled.add('address');
    }
    if (placeData.phone) {
      newValues['phone'] = true;
      filled.add('phone');
    }
    if (placeData.website) {
      newValues['website'] = true;
      filled.add('website');
    }
    if (placeData.primaryCategory) {
      newValues['primary-category'] = true;
      filled.add('primary-category');
    }
    if (placeData.secondaryCategoryCount >= 2) {
      newValues['secondary-categories'] = true;
      filled.add('secondary-categories');
    }
    if (placeData.hasEditorialSummary) {
      newValues['description'] = true;
      filled.add('description');
    }

    // --- Hours & Attributes ---
    if (placeData.hasRegularHours) {
      newValues['regular-hours'] = true;
      filled.add('regular-hours');
    }
    if (placeData.hasSecondaryHours) {
      newValues['more-hours'] = true;
      filled.add('more-hours');
    }
    if (placeData.hasAccessibility) {
      newValues['attributes-accessibility'] = true;
      filled.add('attributes-accessibility');
    }
    if (placeData.amenityCount >= 3) {
      newValues['attributes-amenities'] = true;
      filled.add('attributes-amenities');
    }

    // --- Reviews & Reputation ---
    if (placeData.reviewCount > 0) {
      newValues['review-count'] = placeData.reviewCount;
      filled.add('review-count');
    }
    if (placeData.rating) {
      newValues['average-rating'] = placeData.rating;
      filled.add('average-rating');
    }
    if (placeData.reviewsMentionKeywords) {
      newValues['review-keywords'] = true;
      filled.add('review-keywords');
    }

    setValues(newValues);
    setAutoFilledItems(filled);
  }, [values]);

  // Calculate section scores
  const sectionScores = useMemo(() => {
    const scores = {};
    checklistSections.forEach((section) => {
      let sectionTotal = 0;
      section.items.forEach((item) => {
        const val = values[item.id];
        if (item.type === 'checkbox' && val) {
          sectionTotal += item.points;
        } else if (item.type === 'number' && val > 0) {
          if (val >= item.target) {
            sectionTotal += item.points;
          } else {
            sectionTotal += Math.round(item.points * (val / item.target));
          }
        }
      });
      scores[section.id] = sectionTotal;
    });
    return scores;
  }, [values]);

  // Calculate overall score
  const overallScore = useMemo(() => {
    const totalPoints = checklistSections.reduce((sum, s) => sum + s.maxPoints, 0);
    const earnedPoints = Object.values(sectionScores).reduce((sum, s) => sum + s, 0);
    return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  }, [sectionScores]);

  // Count total completed items
  const totalItems = checklistSections.reduce((sum, s) => sum + s.items.length, 0);
  const completedItems = checklistSections.reduce((sum, section) => {
    return sum + section.items.filter((item) => {
      const val = values[item.id];
      if (item.type === 'checkbox') return !!val;
      if (item.type === 'number') return val >= item.target;
      return false;
    }).length;
  }, 0);

  // Get benchmark for an item based on selected industry
  const getBenchmarkForItem = useCallback((itemId) => {
    return getBenchmark(selectedIndustry, itemId);
  }, [selectedIndustry]);

  const handleShowActionPlan = () => {
    setShowActionPlan(true);
    setTimeout(() => {
      actionPlanRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    if (window.confirm('Reset all checklist items? This cannot be undone.')) {
      setValues({});
      setShowActionPlan(false);
      setAutoFilledItems(new Set());
      setFetchedBusiness(null);
      try { localStorage.removeItem(STORAGE_KEY_DRAFT); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveAudit = () => {
    const industryObj = industries.find((i) => i.id === selectedIndustry);
    const auditEntry = {
      date: new Date().toISOString(),
      score: overallScore,
      industry: industryObj?.name || '',
      industryId: selectedIndustry,
      completedItems,
      totalItems,
      values: { ...values },
    };
    const updated = [...auditHistory, auditEntry];
    setAuditHistory(updated);
    saveToStorage(STORAGE_KEY_HISTORY, updated);
    setSavedMessage('Audit saved!');
    setTimeout(() => setSavedMessage(''), 2500);
  };

  const handleLoadAudit = (audit) => {
    if (window.confirm('Load this previous audit? Your current progress will be replaced.')) {
      setValues(audit.values || {});
      if (audit.industryId) setSelectedIndustry(audit.industryId);
      setShowActionPlan(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearHistory = () => {
    setAuditHistory([]);
    try { localStorage.removeItem(STORAGE_KEY_HISTORY); } catch {}
  };

  // Check if there's a restored draft
  const hasDraft = draft && Object.keys(draft.values || {}).length > 0;

  return (
    <div className="min-h-screen bg-abyss bg-glow bg-grid">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-galactic">
          <a
            href="https://seo-tools-tau.vercel.app/"
            className="text-azure hover:text-white transition-colors"
          >
            Free Tools
          </a>
          <span className="mx-2 text-metal">/</span>
          <a
            href="https://seo-tools-tau.vercel.app/local-business/"
            className="text-azure hover:text-white transition-colors"
          >
            Local Business Tools
          </a>
          <span className="mx-2 text-metal">/</span>
          <span className="text-cloudy">GBP Optimization Checklist</span>
        </nav>

        {/* Header */}
        <header className="mb-8 sm:mb-10 animate-fadeIn">
          <div className="flex items-start gap-4 mb-4">
            <div className="shrink-0 p-3 rounded-xl bg-azure/10 border border-azure/20">
              <svg className="w-8 h-8 text-azure" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Google Business Profile<br className="sm:hidden" /> Optimization Checklist
              </h1>
              <p className="text-cloudy mt-2 text-sm sm:text-base max-w-2xl">
                Walk through this industry-specific checklist to audit your Google Business Profile.
                Get a scored assessment with industry benchmarks and a prioritized action plan.
              </p>
            </div>
          </div>

          {/* Restored draft notice */}
          {hasDraft && Object.keys(values).length > 0 && (
            <div className="flex items-center gap-2 mt-3 p-3 bg-azure/5 border border-azure/10 rounded-lg text-sm text-azure animate-fadeIn">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              Your previous progress was restored automatically.
            </div>
          )}

          {/* Quick stats bar */}
          {Object.keys(values).length > 0 && (
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 p-3 sm:p-4 bg-midnight/50 border border-metal/20 rounded-xl animate-fadeIn">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${overallScore >= 80 ? 'bg-turtle' : overallScore >= 50 ? 'bg-tangerine' : 'bg-coral'}`} />
                <span className="text-sm text-cloudy">
                  Score: <span className={`font-bold ${overallScore >= 80 ? 'text-turtle' : overallScore >= 50 ? 'text-tangerine' : 'text-coral'}`}>{overallScore}/100</span>
                </span>
              </div>
              <div className="w-px h-4 bg-metal/30 hidden sm:block" />
              <span className="text-sm text-galactic">
                {completedItems}/{totalItems} items complete
              </span>
              <div className="w-px h-4 bg-metal/30 hidden sm:block" />
              <div className="flex items-center gap-2 ml-auto">
                {savedMessage && (
                  <span className="text-sm text-turtle font-medium animate-fadeIn">{savedMessage}</span>
                )}
                <button
                  onClick={handleSaveAudit}
                  className="text-sm text-azure hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-lg border border-azure/20 hover:border-azure/40 focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss min-h-[44px] flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                  Save Audit
                </button>
                <button
                  onClick={handleReset}
                  className="text-sm text-galactic hover:text-coral transition-colors cursor-pointer py-1.5 px-2 rounded focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss min-h-[44px] flex items-center"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Business search — auto-fill from Google Places */}
        <BusinessSearch onAutoFill={handleAutoFill} />

        {/* Industry selector */}
        <IndustrySelector
          industries={industries}
          selectedIndustry={selectedIndustry}
          onSelect={handleIndustryChange}
        />

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Checklist sections */}
          <div className="flex-1 min-w-0 space-y-6">
            {checklistSections.map((section) => (
              <ChecklistSection
                key={section.id}
                section={section}
                values={values}
                onItemChange={handleItemChange}
                sectionScore={sectionScores[section.id] || 0}
                getBenchmarkForItem={getBenchmarkForItem}
                autoFilledItems={autoFilledItems}
              />
            ))}

            {/* Competitor Comparison */}
            <CompetitorComparison
              values={values}
              selectedIndustry={selectedIndustry}
            />

            {/* Generate action plan button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 py-6">
              <button
                onClick={handleShowActionPlan}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-azure text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-azure-hover transition-colors cursor-pointer focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
                Generate Action Plan
              </button>
              {Object.keys(values).length > 0 && (
                <ExportButton
                  sections={checklistSections}
                  values={values}
                  selectedIndustry={selectedIndustry}
                  industries={industries}
                  overallScore={overallScore}
                />
              )}
            </div>

            {/* Action plan output */}
            {showActionPlan && (
              <div ref={actionPlanRef}>
                <ActionPlan
                  sections={checklistSections}
                  values={values}
                  selectedIndustry={selectedIndustry}
                  industries={industries}
                />
              </div>
            )}
          </div>

          {/* Sticky sidebar - score display */}
          <aside className="lg:w-80 shrink-0 order-first lg:order-last">
            <div className="lg:sticky lg:top-6">
              <ScoreDisplay
                overallScore={overallScore}
                sectionScores={sectionScores}
                sections={checklistSections}
              />

              {/* Audit History */}
              <AuditHistory
                history={auditHistory}
                onLoadAudit={handleLoadAudit}
                onClearHistory={handleClearHistory}
              />

              {/* Quick links to GBP */}
              <div className="card-gradient border border-metal/20 rounded-2xl p-5 mt-6">
                <h4 className="text-sm font-bold text-white mb-3">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://business.google.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-azure hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      GBP Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://business.google.com/edit/info"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-azure hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      Edit Business Info
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://business.google.com/edit/photos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-azure hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      Manage Photos
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://business.google.com/reviews"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-azure hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      Manage Reviews
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://business.google.com/posts"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-azure hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      Create Posts
                    </a>
                  </li>
                </ul>
              </div>

              {/* How scoring works */}
              <div className="card-gradient border border-metal/20 rounded-2xl p-5 mt-6">
                <h4 className="text-sm font-bold text-white mb-3">How Scoring Works</h4>
                <div className="space-y-2 text-xs text-galactic">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-turtle" />
                    <span>80-100: Fully optimized</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-tangerine" />
                    <span>50-79: Good start, keep going</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-coral" />
                    <span>0-49: Needs attention</span>
                  </div>
                </div>
                <p className="text-xs text-galactic mt-3 leading-relaxed">
                  Each section has weighted points based on impact. Number fields give partial credit. Benchmarks show how you compare to industry averages.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-metal/30 no-print">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-galactic text-center sm:text-left">
              This tool audits your Google Business Profile using live data from Google. Your progress is saved locally in your browser.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://seo-tools-tau.vercel.app/local-business/"
                className="text-sm text-azure hover:text-white transition-colors"
              >
                More Local Business Tools
              </a>
              <a
                href="https://seo-tools-tau.vercel.app/"
                className="text-sm text-azure hover:text-white transition-colors"
              >
                All Free Tools
              </a>
            </div>
          </div>
          <p className="text-xs text-galactic/60 text-center mt-4">
            Google Business Profile is a trademark of Google LLC. This tool is not affiliated with or endorsed by Google.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

import { useState, useMemo, useCallback, useRef } from 'react';
import IndustrySelector from './components/IndustrySelector';
import ChecklistSection from './components/ChecklistSection';
import ScoreDisplay from './components/ScoreDisplay';
import ActionPlan from './components/ActionPlan';
import ExportButton from './components/ExportButton';
import { checklistSections } from './data/checklist';
import { industries } from './data/industries';

function App() {
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [values, setValues] = useState({});
  const [showActionPlan, setShowActionPlan] = useState(false);
  const actionPlanRef = useRef(null);

  const handleItemChange = useCallback((itemId, value) => {
    setValues((prev) => ({ ...prev, [itemId]: value }));
  }, []);

  const handleIndustryChange = useCallback((industryId) => {
    setSelectedIndustry(industryId);
  }, []);

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
            // Partial credit for number items
            sectionTotal += Math.round(item.points * (val / item.target));
          }
        }
      });
      scores[section.id] = sectionTotal;
    });
    return scores;
  }, [values]);

  // Calculate overall score (weighted by section max points)
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
                Get a scored assessment and a prioritized action plan with direct links to fix each item.
              </p>
            </div>
          </div>

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
              <button
                onClick={handleReset}
                className="text-sm text-galactic hover:text-coral transition-colors cursor-pointer ml-auto py-1.5 px-2 -mr-2 rounded focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss min-h-[44px] flex items-center"
              >
                Reset
              </button>
            </div>
          )}
        </header>

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
              />
            ))}

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
                  Each section has weighted points based on impact. Number fields give partial credit. Focus on high-impact items first.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-metal/30 no-print">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-galactic text-center sm:text-left">
              This tool helps you self-assess your Google Business Profile. It does not access your actual GBP data.
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

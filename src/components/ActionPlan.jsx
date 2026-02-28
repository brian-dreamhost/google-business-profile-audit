export default function ActionPlan({ sections, values, selectedIndustry, industries }) {
  const industry = industries.find((i) => i.id === selectedIndustry);

  // Build action items from uncompleted checklist items
  const actionItems = [];
  sections.forEach((section) => {
    section.items.forEach((item) => {
      const val = values[item.id];
      let isComplete = false;

      if (item.type === 'checkbox') {
        isComplete = !!val;
      } else if (item.type === 'number') {
        isComplete = val >= item.target;
      }

      if (!isComplete) {
        actionItems.push({
          ...item,
          sectionTitle: section.title,
          sectionId: section.id,
        });
      }
    });
  });

  // Sort by impact (highest first), then by points (highest first)
  actionItems.sort((a, b) => {
    if (b.impact !== a.impact) return b.impact - a.impact;
    return b.points - a.points;
  });

  if (actionItems.length === 0) {
    return (
      <div className="card-gradient border border-turtle/30 rounded-2xl p-6 sm:p-8 text-center animate-fadeIn">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-turtle/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-turtle" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-turtle mb-2">Perfect Score!</h3>
        <p className="text-cloudy">
          Your Google Business Profile is fully optimized. Keep it maintained by posting weekly and responding to reviews.
        </p>
      </div>
    );
  }

  const highImpact = actionItems.filter((a) => a.impact === 3);
  const medImpact = actionItems.filter((a) => a.impact === 2);
  const lowImpact = actionItems.filter((a) => a.impact === 1);

  return (
    <div id="action-plan" className="animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-azure/10">
          <svg className="w-6 h-6 text-azure" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Your Action Plan</h3>
          <p className="text-sm text-galactic">
            {actionItems.length} item{actionItems.length !== 1 ? 's' : ''} to improve, sorted by impact
          </p>
        </div>
      </div>

      {/* High Impact */}
      {highImpact.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-coral" />
            <h4 className="text-sm font-bold text-coral uppercase tracking-wider">
              High Impact ({highImpact.length})
            </h4>
          </div>
          <div className="space-y-3">
            {highImpact.map((item, idx) => (
              <ActionCard key={item.id} item={item} priority={idx + 1} />
            ))}
          </div>
        </div>
      )}

      {/* Medium Impact */}
      {medImpact.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-tangerine" />
            <h4 className="text-sm font-bold text-tangerine uppercase tracking-wider">
              Medium Impact ({medImpact.length})
            </h4>
          </div>
          <div className="space-y-3">
            {medImpact.map((item, idx) => (
              <ActionCard key={item.id} item={item} priority={highImpact.length + idx + 1} />
            ))}
          </div>
        </div>
      )}

      {/* Low Impact */}
      {lowImpact.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-azure" />
            <h4 className="text-sm font-bold text-azure uppercase tracking-wider">
              Low Impact ({lowImpact.length})
            </h4>
          </div>
          <div className="space-y-3">
            {lowImpact.map((item, idx) => (
              <ActionCard key={item.id} item={item} priority={highImpact.length + medImpact.length + idx + 1} />
            ))}
          </div>
        </div>
      )}

      {/* Industry tips */}
      {industry && (
        <div className="card-gradient border border-prince/20 rounded-2xl p-5 sm:p-6 mt-6">
          <h4 className="text-sm font-bold text-prince mb-3 flex items-center gap-2">
            <span className="text-lg" role="img" aria-hidden="true">{industry.icon}</span>
            Industry Tips for {industry.name}
          </h4>
          <ul className="space-y-2">
            {industry.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-cloudy">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-prince" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ActionCard({ item, priority }) {
  return (
    <div className="card-gradient border border-metal/20 rounded-xl p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-7 h-7 rounded-full bg-metal/20 flex items-center justify-center">
          <span className="text-xs font-bold text-galactic">#{priority}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs text-galactic">{item.sectionTitle}</span>
              <h5 className="text-sm font-semibold text-white mt-0.5">{item.label}</h5>
            </div>
            <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
              item.impact === 3
                ? 'bg-coral/10 text-coral border border-coral/20'
                : item.impact === 2
                ? 'bg-tangerine/10 text-tangerine border border-tangerine/20'
                : 'bg-azure/10 text-azure border border-azure/20'
            }`}>
              +{item.points} pts
            </span>
          </div>

          {/* What to do */}
          <div className="mt-3 p-3 bg-midnight/50 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-azure" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
              </svg>
              <div>
                <span className="text-xs font-semibold text-azure">What to do:</span>
                <p className="text-sm text-cloudy mt-0.5">{item.actionText}</p>
              </div>
            </div>
          </div>

          {/* Why it matters */}
          <div className="mt-2 p-3 bg-midnight/50 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-tangerine" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div>
                <span className="text-xs font-semibold text-tangerine">Why it matters:</span>
                <p className="text-sm text-cloudy mt-0.5">{item.whyItMatters}</p>
              </div>
            </div>
          </div>

          {/* GBP Link */}
          <a
            href={item.gbpLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-sm text-azure hover:text-white transition-colors font-medium"
          >
            Fix this in Google Business Profile
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

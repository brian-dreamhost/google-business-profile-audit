export default function ScoreDisplay({ overallScore, sectionScores, sections }) {
  const scoreColor =
    overallScore >= 80 ? 'text-turtle' : overallScore >= 50 ? 'text-tangerine' : 'text-coral';
  const scoreLabel =
    overallScore >= 90
      ? 'Excellent'
      : overallScore >= 80
      ? 'Great'
      : overallScore >= 60
      ? 'Good Start'
      : overallScore >= 40
      ? 'Needs Work'
      : overallScore > 0
      ? 'Getting Started'
      : 'Not Started';
  const ringColor =
    overallScore >= 80 ? 'stroke-turtle' : overallScore >= 50 ? 'stroke-tangerine' : 'stroke-coral';

  // SVG circle math
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-6 animate-fadeIn">
      <h3 className="text-lg font-bold text-white mb-4">GBP Optimization Score</h3>

      {/* Overall score circle */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-36 h-36">
          <svg className="w-36 h-36 -rotate-90" viewBox="0 0 128 128">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-metal/20"
              strokeWidth="8"
            />
            {/* Score circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              className={ringColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${scoreColor}`}>{overallScore}</span>
            <span className="text-xs text-galactic">/100</span>
          </div>
        </div>
        <span className={`mt-2 text-sm font-semibold ${scoreColor}`}>{scoreLabel}</span>
      </div>

      {/* Section breakdowns */}
      <div className="space-y-3">
        {sections.map((section) => {
          const sectionScore = sectionScores[section.id] || 0;
          const percent = section.maxPoints > 0 ? Math.round((sectionScore / section.maxPoints) * 100) : 0;
          const barColor =
            percent >= 80 ? 'bg-turtle' : percent >= 50 ? 'bg-tangerine' : percent > 0 ? 'bg-coral' : 'bg-metal/30';
          const textColor =
            percent >= 80 ? 'text-turtle' : percent >= 50 ? 'text-tangerine' : 'text-coral';

          return (
            <div key={section.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-cloudy truncate mr-2">{section.title}</span>
                <span className={`text-xs font-semibold ${textColor} shrink-0`}>
                  {sectionScore}/{section.maxPoints} pts
                </span>
              </div>
              <div className="w-full h-2 bg-metal/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-metal/20">
        <div className="text-center">
          <div className="text-lg font-bold text-turtle">
            {sections.reduce((acc, s) => {
              const percent = s.maxPoints > 0 ? Math.round(((sectionScores[s.id] || 0) / s.maxPoints) * 100) : 0;
              return acc + (percent >= 80 ? 1 : 0);
            }, 0)}
          </div>
          <div className="text-[10px] text-galactic">Sections Done</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-tangerine">
            {sections.reduce((acc, s) => {
              const percent = s.maxPoints > 0 ? Math.round(((sectionScores[s.id] || 0) / s.maxPoints) * 100) : 0;
              return acc + (percent >= 50 && percent < 80 ? 1 : 0);
            }, 0)}
          </div>
          <div className="text-[10px] text-galactic">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-coral">
            {sections.reduce((acc, s) => {
              const percent = s.maxPoints > 0 ? Math.round(((sectionScores[s.id] || 0) / s.maxPoints) * 100) : 0;
              return acc + (percent < 50 ? 1 : 0);
            }, 0)}
          </div>
          <div className="text-[10px] text-galactic">Need Work</div>
        </div>
      </div>
    </div>
  );
}

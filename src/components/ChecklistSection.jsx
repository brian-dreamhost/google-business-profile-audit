import { useState } from 'react';
import ChecklistItem from './ChecklistItem';

const sectionIcons = {
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
  camera: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
    </svg>
  ),
  clock: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  star: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ),
  megaphone: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
    </svg>
  ),
  tag: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  ),
  question: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  ),
};

export default function ChecklistSection({ section, values, onItemChange, sectionScore }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const scorePercent = section.maxPoints > 0 ? Math.round((sectionScore / section.maxPoints) * 100) : 0;
  const scoreColor =
    scorePercent >= 80 ? 'text-turtle' : scorePercent >= 50 ? 'text-tangerine' : 'text-coral';
  const scoreBg =
    scorePercent >= 80 ? 'bg-turtle/10' : scorePercent >= 50 ? 'bg-tangerine/10' : 'bg-coral/10';
  const scoreBorder =
    scorePercent >= 80 ? 'border-turtle/30' : scorePercent >= 50 ? 'border-tangerine/30' : 'border-coral/30';

  // Count completed items
  const completedItems = section.items.filter((item) => {
    const val = values[item.id];
    if (item.type === 'checkbox') return !!val;
    if (item.type === 'number') return val >= item.target;
    return false;
  }).length;

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl overflow-hidden animate-fadeIn">
      {/* Section header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-6 text-left hover:bg-metal/5 transition-colors cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className={`shrink-0 p-2 rounded-lg ${scoreBg} ${scoreColor}`}>
          {sectionIcons[section.icon]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <h3 className="text-base sm:text-lg font-bold text-white truncate">{section.title}</h3>
            <span className="text-xs text-galactic whitespace-nowrap">
              {completedItems}/{section.items.length} items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-galactic mt-0.5 line-clamp-1">{section.description}</p>
        </div>

        {/* Score badge */}
        <div className={`shrink-0 flex flex-col items-center px-3 py-1.5 rounded-lg border ${scoreBg} ${scoreBorder}`}>
          <span className={`text-lg sm:text-xl font-bold ${scoreColor}`}>{scorePercent}</span>
          <span className="text-[10px] text-galactic">/ 100</span>
        </div>

        {/* Chevron */}
        <svg
          className={`w-5 h-5 shrink-0 text-galactic transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Section items */}
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3">
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-metal/20 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                scorePercent >= 80
                  ? 'bg-turtle'
                  : scorePercent >= 50
                  ? 'bg-tangerine'
                  : scorePercent > 0
                  ? 'bg-coral'
                  : 'bg-metal/30'
              }`}
              style={{ width: `${scorePercent}%` }}
            />
          </div>

          {section.items.map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              value={values[item.id]}
              onChange={(val) => onItemChange(item.id, val)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

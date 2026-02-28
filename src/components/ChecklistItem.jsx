export default function ChecklistItem({ item, value, onChange }) {
  const isCheckbox = item.type === 'checkbox';
  const isNumber = item.type === 'number';

  // For number items, calculate if target is met
  const targetMet = isNumber && value >= item.target;
  const partialMet = isNumber && value > 0 && value < item.target;

  return (
    <div
      className={`group flex items-start gap-3 p-3 sm:p-4 rounded-xl transition-colors ${
        (isCheckbox && value) || targetMet
          ? 'bg-turtle/5 border border-turtle/20'
          : partialMet
          ? 'bg-tangerine/5 border border-tangerine/20'
          : 'bg-metal/5 border border-metal/10 hover:border-metal/30'
      }`}
    >
      {/* Checkbox or Number input */}
      {isCheckbox ? (
        <div className="pt-0.5 shrink-0">
          <button
            onClick={() => onChange(!value)}
            className={`w-7 h-7 min-w-[28px] min-h-[28px] rounded-md border-2 flex items-center justify-center transition-all cursor-pointer focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss ${
              value
                ? 'bg-turtle border-turtle text-white'
                : 'border-metal/40 hover:border-azure/60'
            }`}
            role="checkbox"
            aria-checked={value}
            aria-label={item.label}
          >
            {value && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
          </button>
        </div>
      ) : (
        <div className="pt-0.5 shrink-0">
          <div
            className={`w-6 h-6 min-w-[24px] rounded-md flex items-center justify-center ${
              targetMet
                ? 'bg-turtle text-white'
                : partialMet
                ? 'bg-tangerine text-white'
                : 'bg-metal/20 text-galactic'
            }`}
          >
            {targetMet ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <span className="text-xs font-bold">#</span>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <label
            className={`text-sm font-medium cursor-pointer select-none ${
              (isCheckbox && value) || targetMet ? 'text-white' : 'text-cloudy'
            }`}
            onClick={() => isCheckbox && onChange(!value)}
          >
            {item.label}
          </label>

          {isNumber && (
            <div className="flex items-center gap-2 shrink-0">
              <input
                type="number"
                min={item.min ?? 0}
                max={item.max ?? 999}
                step={item.step ?? 1}
                value={value || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  onChange(Math.max(item.min ?? 0, Math.min(item.max ?? 999, val)));
                }}
                placeholder="0"
                className="w-20 bg-midnight border border-metal/30 rounded-md px-2 py-1 text-sm text-white text-center focus:border-azure focus:ring-1 focus:ring-azure focus:outline-none"
                aria-label={`Number of ${item.unit}`}
              />
              <span className="text-xs text-galactic whitespace-nowrap">
                / {item.target} {item.unit}
              </span>
            </div>
          )}
        </div>

        {/* Help text - always visible */}
        <p className="text-xs text-galactic mt-1 leading-relaxed">
          {item.helpText}
        </p>

        {/* Impact indicator */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-galactic">Impact:</span>
          <div className="flex gap-0.5">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={`w-2 h-2 rounded-full ${
                  level <= item.impact
                    ? item.impact === 3
                      ? 'bg-coral'
                      : item.impact === 2
                      ? 'bg-tangerine'
                      : 'bg-azure'
                    : 'bg-metal/30'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-galactic">
            {item.impact === 3 ? 'High' : item.impact === 2 ? 'Medium' : 'Low'}
          </span>

          {/* GBP Link */}
          <a
            href={item.gbpLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-azure hover:text-white transition-colors flex items-center gap-1 py-1 px-1.5 -mr-1.5 rounded focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss"
          >
            Edit in GBP
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

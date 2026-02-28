import { useState, useRef, useEffect } from 'react';

export default function IndustrySelector({ industries, selectedIndustry, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = industries.find((i) => i.id === selectedIndustry);

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-6 mb-8 animate-fadeIn">
      <label className="block text-sm font-semibold text-cloudy mb-2">
        Select Your Industry
      </label>
      <p className="text-galactic text-sm mb-4">
        Choose your business type to get industry-specific checklist items and recommendations.
      </p>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-left text-white hover:border-azure/50 focus:border-azure focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss transition-colors cursor-pointer"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-3">
            {selected ? (
              <>
                <span className="text-xl" role="img" aria-hidden="true">{selected.icon}</span>
                <span className="font-medium">{selected.name}</span>
              </>
            ) : (
              <span className="text-galactic">Choose your business type...</span>
            )}
          </span>
          <svg
            className={`w-5 h-5 text-galactic transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {isOpen && (
          <ul
            className="absolute z-50 w-full mt-2 bg-midnight border border-metal/30 rounded-lg shadow-2xl max-h-72 overflow-y-auto animate-fadeIn"
            role="listbox"
          >
            {industries.map((industry) => (
              <li key={industry.id}>
                <button
                  onClick={() => {
                    onSelect(industry.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                    selectedIndustry === industry.id
                      ? 'bg-azure/10 text-azure'
                      : 'text-cloudy hover:bg-metal/20 hover:text-white'
                  }`}
                  role="option"
                  aria-selected={selectedIndustry === industry.id}
                >
                  <span className="text-xl" role="img" aria-hidden="true">{industry.icon}</span>
                  <span className="font-medium">{industry.name}</span>
                  {selectedIndustry === industry.id && (
                    <svg className="w-5 h-5 ml-auto text-azure" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <div className="mt-4 p-4 bg-azure/5 border border-azure/10 rounded-lg animate-fadeIn">
          <h4 className="text-sm font-semibold text-azure mb-2">
            Tips for {selected.name} Businesses
          </h4>
          <ul className="space-y-1">
            {selected.tips.slice(0, 3).map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-cloudy">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-turtle" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
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

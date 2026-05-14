import React from 'react';

export default function FilterTabs({ tabs, active, onSelect, colorMap, className = '' }) {
  if (!tabs || tabs.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        const activeColor = colorMap && colorMap[tab.key];
        return (
          <button
            key={tab.key}
            onClick={() => onSelect(tab.key)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? activeColor
                  ? `${activeColor.bg} ${activeColor.text} ${activeColor.border} border`
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                : 'bg-surface-card text-slate-400 border border-surface-border hover:bg-surface-hover hover:text-slate-300'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`ml-1.5 text-xs ${
                  isActive ? 'opacity-80' : 'text-slate-500'
                }`}
              >
                ({tab.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

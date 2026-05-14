import React from 'react';

export default function FilterTabs({ tabs, active, onSelect, colorMap = {}, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tabs.map((tab) => {
        const isActive = active === tab.value;
        const colors = colorMap[tab.value];

        return (
          <button
            key={tab.value}
            onClick={() => onSelect(tab.value)}
            className={`
              inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
              text-sm font-body font-medium
              border transition-all duration-200
              ${isActive
                ? colors
                  ? `${colors.bg} ${colors.text} ${colors.border}`
                  : 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                : 'bg-surface-card text-slate-400 border-surface-border hover:border-slate-600 hover:text-slate-300'
              }
            `}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`
                text-xs px-1.5 py-0.5 rounded-full
                ${isActive ? 'bg-white/20' : 'bg-surface-border text-slate-500'}
              `}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

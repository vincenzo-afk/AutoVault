import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        className="absolute left-3 text-slate-400 pointer-events-none"
        size={16}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-9 pr-9 py-2.5
          bg-surface-card border border-surface-border
          rounded-xl
          text-sm font-body text-slate-200 placeholder-slate-500
          focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30
          transition-all duration-200
        "
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

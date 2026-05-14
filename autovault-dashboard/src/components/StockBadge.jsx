import React from 'react';

const SIZE_CLASSES = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-3 py-1 gap-1.5',
  lg: 'text-base px-4 py-1.5 gap-2',
};

const DOT_SIZES = { sm: 'w-1.5 h-1.5', md: 'w-2 h-2', lg: 'w-2.5 h-2.5' };

const STOCK_COLORS = {
  Available:      { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/40', dot: '#10B981' },
  Low:            { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/40',   dot: '#F59E0B' },
  'Out of Stock': { bg: 'bg-red-500/15',     text: 'text-red-400',     border: 'border-red-500/40',     dot: '#EF4444' },
};

export default function StockBadge({ status, size = 'md' }) {
  const colors = STOCK_COLORS[status] || STOCK_COLORS['Available'];
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const dotSize   = DOT_SIZES[size]   || DOT_SIZES.md;

  return (
    <span
      className={`inline-flex items-center font-body font-medium rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizeClass}`}
    >
      <span
        className={`${dotSize} rounded-full animate-pulse-slow`}
        style={{ backgroundColor: colors.dot }}
      />
      {status}
    </span>
  );
}

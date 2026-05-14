import React from 'react';
import { STOCK_COLORS } from '../utils/constants';

const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
  lg: 'px-3 py-1.5 text-base gap-2',
};

const DOT_SIZES = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

export default function StockBadge({ status = 'Available', size = 'md' }) {
  const colors = STOCK_COLORS[status] || STOCK_COLORS.Available;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${SIZE_CLASSES[size]} ${colors.bg} ${colors.text} ${colors.border} border`}
    >
      <span
        className={`${DOT_SIZES[size]} rounded-full animate-pulse-slow`}
        style={{ backgroundColor: colors.dot }}
      />
      {status}
    </span>
  );
}

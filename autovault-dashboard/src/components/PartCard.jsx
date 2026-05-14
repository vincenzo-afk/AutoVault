import React from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { CATEGORY_COLORS } from '../utils/constants';
import StockBadge from './StockBadge';

export default function PartCard({ part, imageSrc, onClick, index = 0 }) {
  const catColor = CATEGORY_COLORS[part.part_category] || CATEGORY_COLORS.Engine;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick?.();
      }}
      role="button"
      tabIndex={0}
      className="rounded-2xl bg-surface-card border border-surface-border cursor-pointer group shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden relative"
      style={{
        '--hover-glow': `${catColor.dot}55`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 20px ${catColor.dot}55`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Category colored top bar */}
      <div className="h-1 w-full" style={{ backgroundColor: catColor.dot }} />
      {/* Image */}
      <div className="h-36 bg-gradient-to-br from-surface to-surface-hover flex items-center justify-center overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={part.part_name} className="w-full h-full object-contain p-3" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-card rounded-xl">
            <span className="text-slate-600 text-xs font-body">No Image</span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Category tag */}
        <span
          className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mb-2 ${catColor.bg} ${catColor.text} ${catColor.border} border`}
        >
          {part.part_category}
        </span>

        <h3 className="text-sm font-semibold text-slate-100 mb-1 truncate">
          {part.part_name}
        </h3>

        <p className="text-xs text-slate-500 mb-1 truncate">
          OEM: {part.oem_number || '—'}
        </p>

        <p className="text-xs text-slate-500 mb-3 truncate">
          {part.manufacturer || '—'}
        </p>

        <div className="flex items-center justify-between">
          <StockBadge status={part.stock_status} size="sm" />
          <span className="text-sm font-semibold text-slate-200">
            ₹{part.price_inr?.toLocaleString('en-IN') || '—'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

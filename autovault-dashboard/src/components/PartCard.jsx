import React from 'react';
import { motion } from 'framer-motion';
import StockBadge from './StockBadge';
import { CATEGORY_COLORS } from '../utils/constants';

export default function PartCard({ part, imageSrc, onClick, index }) {
  const catColor = CATEGORY_COLORS[part.part_category] || CATEGORY_COLORS['Engine'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="glass-card rounded-2xl p-5 cursor-pointer group flex flex-col items-center gap-4 text-center"
    >
      {/* Part image */}
      <div className="w-36 h-36 rounded-xl overflow-hidden bg-surface-border flex items-center justify-center flex-shrink-0">
        {imageSrc ? (
          <img src={imageSrc} alt={part.part_name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="text-5xl opacity-20">🔩</span>
        )}
      </div>

      {/* Category tag */}
      <span className={`text-xs px-2.5 py-1 rounded-full font-body font-medium border ${catColor.bg} ${catColor.text} ${catColor.border}`}>
        {part.part_category}
      </span>

      {/* Part name */}
      <h4 className="font-body font-semibold text-slate-100 text-sm leading-tight">{part.part_name}</h4>

      {/* OEM */}
      <p className="font-mono text-slate-500 text-xs">{part.oem_number}</p>

      {/* Manufacturer */}
      <p className="text-slate-400 text-xs">{part.manufacturer}</p>

      {/* Stock badge */}
      <StockBadge status={part.stock_status} size="sm" />

      {/* Price */}
      <p className="text-slate-200 font-body font-semibold text-sm">
        ₹{Number(part.price_inr).toLocaleString('en-IN')}
      </p>
    </motion.div>
  );
}

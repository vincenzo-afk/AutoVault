import React from 'react';
import { motion } from 'framer-motion';
import { Fuel, Settings2, Users, Zap } from 'lucide-react';
import { MODEL_CATEGORY_COLORS } from '../utils/constants';

const FUEL_ICONS = { Petrol: '⛽', Diesel: '🛢️', Electric: '⚡', Hybrid: '🔋' };

export default function ModelCard({ model, imageSrc, brandColor, onClick, index }) {
  const categoryClass = MODEL_CATEGORY_COLORS[model.category] || 'bg-slate-500/20 text-slate-300 border border-slate-500/40';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer group"
    >
      {/* Car image */}
      <div className="relative h-48 bg-surface-border overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={model.model_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-30">🚗</span>
          </div>
        )}
        {/* Category badge overlay */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-lg ${categoryClass}`}>
            {model.category}
          </span>
        </div>
        {/* Year badge overlay */}
        <div className="absolute top-3 right-3">
          <span className="text-xs font-body font-medium px-2.5 py-1 rounded-lg bg-black/60 text-white/90 border border-white/10">
            {model.year}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 space-y-3">
        <h3 className="font-display text-xl tracking-wide text-slate-100">{model.model_name}</h3>

        <div className="grid grid-cols-2 gap-2 text-xs font-body text-slate-400">
          <div className="flex items-center gap-1.5">
            <Settings2 size={12} className="text-slate-500" />
            <span className="truncate">{model.engine_type}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel size={12} className="text-slate-500" />
            <span>{FUEL_ICONS[model.fuel_type] || ''} {model.fuel_type}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={12} className="text-slate-500" />
            <span>{model.horsepower} HP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={12} className="text-slate-500" />
            <span>{model.seating_capacity} seats</span>
          </div>
        </div>

        {/* Price */}
        <div
          className="text-sm font-body font-semibold pt-1 border-t border-surface-border"
          style={{ color: brandColor }}
        >
          {model.price_range}
        </div>
      </div>
    </motion.div>
  );
}

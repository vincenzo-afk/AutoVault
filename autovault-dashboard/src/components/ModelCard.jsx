import React from 'react';
import { motion } from 'framer-motion';
import { Fuel, Settings2, Users, Zap } from 'lucide-react';
import { MODEL_CATEGORY_COLORS } from '../utils/constants';

const FUEL_ICONS = {
  Petrol: { icon: Zap, color: 'text-amber-400' },
  Diesel: { icon: Fuel, color: 'text-slate-400' },
  Electric: { icon: Zap, color: 'text-emerald-400' },
  Hybrid: { icon: Settings2, color: 'text-cyan-400' },
};

export default function ModelCard({ model, imageSrc, brandColor, onClick, index = 0 }) {
  const categoryStyle = MODEL_CATEGORY_COLORS[model.category] || MODEL_CATEGORY_COLORS.SUV;
  const FuelIcon = FUEL_ICONS[model.fuel_type]?.icon || Fuel;
  const fuelColor = FUEL_ICONS[model.fuel_type]?.color || 'text-slate-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick?.();
      }}
      role="button"
      tabIndex={0}
      className="relative overflow-hidden rounded-2xl bg-surface-card border border-surface-border cursor-pointer group shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative h-40 bg-gradient-to-br from-surface to-surface-hover overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={model.model_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-card rounded-xl">
            <span className="text-slate-600 text-xs font-body">No Image</span>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} border`}
          >
            {model.category}
          </span>
        </div>
        {/* Year badge */}
        <div className="absolute top-3 right-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-neon-gold/20 text-yellow-300 border border-yellow-400/40 backdrop-blur-sm">
            {model.year}
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-slate-100 mb-3 truncate">
          {model.model_name}
        </h3>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Settings2 size={12} className="text-slate-500" />
            {model.engine_type}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <FuelIcon size={12} className={fuelColor} />
            {model.fuel_type}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Zap size={12} className="text-blue-400" />
            {model.horsepower} hp
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Users size={12} className="text-slate-500" />
            {model.seating_capacity} seats
          </div>
        </div>

        {model.price_range && (
          <p
            className="text-sm font-semibold"
            style={{ color: brandColor?.primary || '#3B82F6' }}
          >
            {model.price_range}
          </p>
        )}
      </div>
    </motion.div>
  );
}

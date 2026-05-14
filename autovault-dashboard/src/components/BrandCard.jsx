import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import { COUNTRY_FLAGS } from '../utils/constants';

export default function BrandCard({ brand, modelCount, logoSrc, colorConfig, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.03, y: -4 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="cursor-pointer group relative overflow-hidden rounded-2xl"
      style={{
        boxShadow: `0 4px 24px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig.gradient} opacity-90`} />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-texture opacity-30" />

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col items-center text-center gap-4">
        {/* Logo circle */}
        <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
          {logoSrc ? (
            <img src={logoSrc} alt={`${brand.brand_name} logo`} className="w-14 h-14 object-contain" />
          ) : (
            <span className="text-2xl font-display text-slate-800">{brand.brand_name.charAt(0)}</span>
          )}
        </div>

        {/* Brand name */}
        <h3 className="text-white font-display text-2xl tracking-widest uppercase leading-tight">
          {brand.brand_name}
        </h3>

        {/* Meta row */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1.5 text-white/80 text-sm font-body">
            <span>{COUNTRY_FLAGS[brand.country] || '🌐'}</span>
            <span>{brand.country}</span>
          </div>
          <div className="flex items-center gap-1 text-white/70 text-xs font-body">
            <Calendar size={11} />
            <span>Est. {brand.founded_year}</span>
          </div>
        </div>

        {/* Models count pill */}
        <div className="mt-auto px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-sm font-body font-medium flex items-center gap-2">
          <span>{modelCount === 0 ? 'No models yet' : `${modelCount} Model${modelCount !== 1 ? 's' : ''}`}</span>
          {modelCount > 0 && <ChevronRight size={14} />}
        </div>
      </div>

      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.15), 0 0 32px ${colorConfig.primary}55` }}
      />
    </motion.div>
  );
}

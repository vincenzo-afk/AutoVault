import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import { COUNTRY_FLAGS } from '../utils/constants';

export default function BrandCard({ brand, modelCount, logoSrc, colorConfig, onClick, index = 0 }) {
  const colors = colorConfig || {
    primary: '#3B82F6',
    gradient: 'from-blue-500 to-blue-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.04, boxShadow: `0 0 25px ${colors.primary}55`, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick?.();
      }}
      role="button"
      tabIndex={0}
      className="relative overflow-hidden rounded-2xl bg-surface-card border cursor-pointer group transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, ${colors.secondary || colors.primary}33 0%, ${colors.primary}22 100%)`,
        borderColor: `${colors.primary}66`
      }}
    >
      {/* Top racing stripe */}
      <div className="racing-stripe absolute top-0 left-0" />

      {/* Grid texture overlay */}
      <div className="absolute inset-0 bg-grid-texture opacity-30 pointer-events-none" />

      {/* Hover background shift */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: `${colors.primary}18` }}
      />

      {/* Content */}
      <div className="relative p-5 flex flex-col h-full pt-6">
        {/* Logo / Initial */}
        <div className="mb-4">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md mx-auto relative z-10">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={brand.brand_name}
                className="w-16 h-16 object-contain"
              />
            ) : (
              <span className="text-slate-600 text-xs font-body">No Image</span>
            )}
          </div>
        </div>

        {/* Brand name */}
        <h3
          className="text-3xl font-display tracking-widest uppercase text-center mb-3"
          style={{ color: colors.primary }}
        >
          {brand.brand_name}
        </h3>

        {/* Meta info */}
        <div className="flex justify-center items-center gap-3 mt-auto mb-4">
          {brand.country && (
            <p className="text-xs text-slate-400 flex items-center gap-1 font-body">
              <span>{COUNTRY_FLAGS[brand.country] || '🏳️'}</span>
              {brand.country}
            </p>
          )}
          {brand.founded_year && (
            <p className="text-xs text-slate-400 flex items-center gap-1 font-body">
              <Calendar size={13} className="text-slate-500" />
              {brand.founded_year}
            </p>
          )}
        </div>

        {/* Model count pill */}
        <div className="flex justify-center">
          <span
            className="text-xs font-medium px-4 py-1.5 rounded-full"
            style={{
              backgroundColor: `${colors.primary}33`,
              color: colors.primary,
            }}
          >
            {modelCount} Model{modelCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

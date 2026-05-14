import React from 'react';
import { motion } from 'framer-motion';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({
  icon,
  title,
  description,
  action,
}) {
  const IconComponent = icon || PackageOpen;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="p-4 rounded-2xl bg-surface-card border border-surface-border mb-5">
        <IconComponent size={40} className="text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-all hover:shadow-glow-blue"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}

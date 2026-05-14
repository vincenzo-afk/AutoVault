import React from 'react';
import { motion } from 'framer-motion';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="mb-4 text-slate-600">
        {icon || <PackageOpen size={56} strokeWidth={1} />}
      </div>
      <h3 className="text-xl font-display tracking-wide text-slate-300 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-500 text-sm font-body max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-xl text-sm font-body font-medium hover:bg-blue-500/30 transition-colors duration-200"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}

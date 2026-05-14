import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon, color = 'text-blue-400', subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl p-5 flex items-start gap-4"
    >
      <div className={`p-3 rounded-xl bg-surface border border-surface-border ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-400 font-medium">{label}</p>
        <p className="text-3xl font-bold text-slate-100 mt-1">{value}</p>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}

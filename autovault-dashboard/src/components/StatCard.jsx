import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon, color = 'text-blue-400', subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        glass-card rounded-2xl p-5
        flex items-start gap-4
        hover:border-white/10 transition-colors duration-300
      "
    >
      <div className={`p-3 rounded-xl bg-surface-border/60 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-sm font-body font-medium">{label}</p>
        <p className={`text-3xl font-display tracking-wide mt-0.5 ${color}`}>{value}</p>
        {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
}

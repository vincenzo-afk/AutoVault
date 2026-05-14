import React from 'react';
import { motion } from 'framer-motion';

const CONDITION_ROW_STYLES = {
  Normal: 'border-l-emerald-500/40 bg-emerald-500/[0.02]',
  Warning: 'border-l-amber-500/40 bg-amber-500/[0.03]',
  Critical: 'border-l-red-500/40 bg-red-500/[0.03]',
};

const CONDITION_BADGE_STYLES = {
  Normal: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Critical: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export default function SpecTable({ specifications }) {
  if (!specifications || specifications.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="text-slate-500">No specifications available.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border">
              <th className="text-left py-3.5 px-4 text-slate-400 font-medium text-xs uppercase tracking-wider">
                Spec Name
              </th>
              <th className="text-left py-3.5 px-4 text-slate-400 font-medium text-xs uppercase tracking-wider">
                Value
              </th>
              <th className="text-left py-3.5 px-4 text-slate-400 font-medium text-xs uppercase tracking-wider">
                Standard
              </th>
              <th className="text-left py-3.5 px-4 text-slate-400 font-medium text-xs uppercase tracking-wider">
                Tolerance
              </th>
              <th className="text-left py-3.5 px-4 text-slate-400 font-medium text-xs uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-3.5 px-4 text-slate-400 font-medium text-xs uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {specifications.map((spec, i) => (
              <motion.tr
                key={spec.spec_id || i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className={`border-b border-surface-border border-l-2 ${
                  CONDITION_ROW_STYLES[spec.condition] || CONDITION_ROW_STYLES.Normal
                } hover:bg-surface-hover transition-colors`}
              >
                <td className="py-3 px-4 text-slate-200 font-medium">{spec.spec_name}</td>
                <td className="py-3 px-4 text-slate-300">
                  {spec.spec_value != null ? spec.spec_value : '—'}
                  {spec.unit && <span className="text-slate-500 ml-0.5">{spec.unit}</span>}
                </td>
                <td className="py-3 px-4 text-slate-400">
                  {spec.standard_value != null ? spec.standard_value : '—'}
                  {spec.standard_value != null && spec.unit && (
                    <span className="text-slate-600 ml-0.5">{spec.unit}</span>
                  )}
                </td>
                <td className="py-3 px-4 text-slate-400 text-xs">
                  {spec.tolerance_minus || spec.tolerance_plus
                    ? `${spec.tolerance_minus ?? 0} / +${spec.tolerance_plus ?? 0}`
                    : '—'}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                      CONDITION_BADGE_STYLES[spec.condition] || CONDITION_BADGE_STYLES.Normal
                    }`}
                  >
                    {spec.condition || 'Normal'}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-500 text-xs max-w-[150px] truncate">
                  {spec.notes || '—'}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

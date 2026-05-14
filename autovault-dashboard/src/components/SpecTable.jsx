import React from 'react';
import { motion } from 'framer-motion';

const CONDITION_ROW_STYLES = {
  Normal:   'bg-emerald-500/8 border-l-2 border-l-emerald-500',
  Warning:  'bg-amber-500/8 border-l-2 border-l-amber-500',
  Critical: 'bg-red-500/8 border-l-2 border-l-red-500',
};
const CONDITION_BADGE_STYLES = {
  Normal:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Warning:  'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Critical: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export default function SpecTable({ specifications }) {
  if (!specifications || specifications.length === 0) {
    return (
      <p className="text-slate-500 text-sm font-body py-8 text-center">No specifications available.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-surface-border">
      <table className="w-full text-sm font-body">
        <thead>
          <tr className="border-b border-surface-border bg-surface-hover">
            <th className="text-left px-5 py-3 text-slate-400 font-semibold">Spec Name</th>
            <th className="text-center px-5 py-3 text-slate-400 font-semibold">Value</th>
            <th className="text-center px-5 py-3 text-slate-400 font-semibold">Standard</th>
            <th className="text-center px-5 py-3 text-slate-400 font-semibold">Tolerance</th>
            <th className="text-center px-5 py-3 text-slate-400 font-semibold">Status</th>
            <th className="text-left px-5 py-3 text-slate-400 font-semibold">Notes</th>
          </tr>
        </thead>
        <tbody>
          {specifications.map((spec, i) => (
            <motion.tr
              key={spec.spec_id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`border-b border-surface-border last:border-b-0 ${CONDITION_ROW_STYLES[spec.condition]}`}
            >
              <td className="px-5 py-3.5 text-slate-200 font-medium">{spec.spec_name}</td>
              <td className="px-5 py-3.5 text-center text-slate-100 font-mono font-semibold">
                {spec.spec_value} <span className="text-slate-500 font-sans font-normal text-xs">{spec.unit}</span>
              </td>
              <td className="px-5 py-3.5 text-center text-slate-400 font-mono">
                {spec.standard_value} <span className="text-slate-600 text-xs">{spec.unit}</span>
              </td>
              <td className="px-5 py-3.5 text-center text-slate-500 font-mono text-xs">
                +{spec.tolerance_plus} / -{spec.tolerance_minus}
              </td>
              <td className="px-5 py-3.5 text-center">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${CONDITION_BADGE_STYLES[spec.condition]}`}>
                  {spec.condition}
                </span>
              </td>
              <td className="px-5 py-3.5 text-slate-500 text-xs">{spec.notes || '—'}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

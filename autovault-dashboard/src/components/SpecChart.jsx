import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';

const CONDITION_COLORS = {
  Normal:   '#10B981',
  Warning:  '#F59E0B',
  Critical: '#EF4444',
};

export default function SpecChart({ specifications, brandColor = '#3B82F6' }) {
  if (!specifications || specifications.length === 0) return null;

  const data = specifications.map((s) => ({
    name: s.spec_name.length > 12 ? s.spec_name.substring(0, 12) + '…' : s.spec_name,
    fullName: s.spec_name,
    actual: parseFloat(s.spec_value) || 0,
    standard: parseFloat(s.standard_value) || 0,
    unit: s.unit,
    condition: s.condition,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const item = data.find((d) => d.name === label) || {};
    return (
      <div className="bg-surface-card border border-surface-border rounded-xl p-3 text-xs font-body shadow-card">
        <p className="text-slate-200 font-semibold mb-2">{item.fullName || label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }} />
            <span className="text-slate-400">{entry.name}:</span>
            <span className="text-slate-200">{entry.value} {item.unit}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#252A3A" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'DM Sans' }}
            axisLine={{ stroke: '#252A3A' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Legend
            wrapperStyle={{ color: '#94A3B8', fontFamily: 'DM Sans', fontSize: 12, paddingTop: 8 }}
          />
          <Bar dataKey="actual" name="Actual" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={CONDITION_COLORS[entry.condition] || brandColor} fillOpacity={0.85} />
            ))}
          </Bar>
          <Bar dataKey="standard" name="Standard" fill="#334155" radius={[4, 4, 0, 0]} fillOpacity={0.7} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';

const CONDITION_COLORS = {
  Normal: '#10B981',
  Warning: '#F59E0B',
  Critical: '#EF4444',
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="glass-card rounded-xl px-4 py-3 shadow-card border border-surface-border text-sm">
      <p className="text-slate-200 font-medium mb-1.5">{item.fullName || label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-400">{entry.name}:</span>
          <span className="text-slate-200 font-medium">
            {entry.value} {item.unit || ''}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function SpecChart({ specifications, brandColor = '#3B82F6' }) {
  if (!specifications || specifications.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-500 font-body text-sm">
        No specification data to chart
      </div>
    );
  }

  const data = specifications
    .filter((s) => s.spec_value != null && s.standard_value != null)
    .map((s) => ({
      name: s.spec_name.length > 12
        ? s.spec_name.substring(0, 12) + '...'
        : s.spec_name,
      fullName: s.spec_name,
      Actual: parseFloat(s.spec_value) || 0,
      Standard: parseFloat(s.standard_value) || 0,
      unit: s.unit || '',
      condition: s.condition || 'Normal',
    }));

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-500 font-body text-sm">
        No specification data to chart
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5">
      <ResponsiveContainer width="100%" height={288}>
        <BarChart data={data} barCategoryGap="20%" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#252A3A" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'DM Sans' }}
            axisLine={{ stroke: '#252A3A' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'DM Sans' }}
            axisLine={{ stroke: '#252A3A' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Legend
            wrapperStyle={{ fontSize: 12, fontFamily: 'DM Sans', color: '#94A3B8' }}
          />
          <Bar dataKey="Actual" radius={[4, 4, 0, 0]} maxBarSize={32}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={CONDITION_COLORS[entry.condition] || brandColor}
              />
            ))}
          </Bar>
          <Bar
            dataKey="Standard"
            fill="#475569"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

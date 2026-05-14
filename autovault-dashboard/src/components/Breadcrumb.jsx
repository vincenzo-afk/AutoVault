import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ crumbs }) {
  const navigate = useNavigate();

  return (
    <nav
      className="flex items-center gap-1.5 text-sm font-body flex-wrap print:hidden"
      aria-label="Breadcrumb"
    >
      <button
        onClick={() => navigate('/brands')}
        className="text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
      >
        <Home size={13} />
        <span>Home</span>
      </button>
      {crumbs.map((crumb, i) => (
        <React.Fragment key={i}>
          <ChevronRight size={14} className="text-slate-600 flex-shrink-0" />
          {crumb.href && i !== crumbs.length - 1 ? (
            <button
              onClick={() => navigate(crumb.href)}
              className="text-slate-500 hover:text-slate-300 transition-colors truncate max-w-[160px] cursor-pointer"
            >
              {crumb.label}
            </button>
          ) : (
            <span className="text-slate-200 font-semibold truncate max-w-[200px]">
              {crumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

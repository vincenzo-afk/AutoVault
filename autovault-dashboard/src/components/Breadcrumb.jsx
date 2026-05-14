import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ crumbs }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm font-body flex-wrap" aria-label="Breadcrumb">
      <Link to="/brands" className="text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-1">
        <Home size={13} />
        <span>Home</span>
      </Link>
      {crumbs.map((crumb, i) => (
        <React.Fragment key={i}>
          <ChevronRight size={13} className="text-slate-600 flex-shrink-0" />
          {crumb.href ? (
            <Link
              to={crumb.href}
              className="text-slate-500 hover:text-blue-400 transition-colors truncate max-w-[160px]"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-slate-300 font-medium truncate max-w-[200px]">{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

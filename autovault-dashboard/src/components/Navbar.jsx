import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Sun, Moon, Car } from 'lucide-react';
import useAutoStore from '../store/useAutoStore';

export default function Navbar({ showSearch = false, searchValue = '', onSearchChange }) {
  const theme    = useAutoStore((s) => s.theme);
  const setTheme = useAutoStore((s) => s.setTheme);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-surface-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/brands"
          className="flex items-center gap-2.5 flex-shrink-0 group"
        >
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 transition-colors">
            <Car size={20} />
          </div>
          <span className="font-display text-xl tracking-widest text-slate-100 uppercase">
            AutoVault
          </span>
        </Link>

        {/* Search (optional) */}
        {showSearch && onSearchChange && (
          <div className="flex-1 max-w-sm hidden sm:block">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search brands…"
              className="
                w-full px-4 py-2 rounded-xl
                bg-surface-card border border-surface-border
                text-sm font-body text-slate-200 placeholder-slate-500
                focus:outline-none focus:border-blue-500/60
                transition-all duration-200
              "
            />
          </div>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-surface-hover transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-surface-hover transition-all text-sm font-body"
          >
            <Settings size={16} />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}

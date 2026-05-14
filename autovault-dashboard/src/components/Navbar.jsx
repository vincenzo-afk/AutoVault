import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Sun, Moon, Car, LogOut } from 'lucide-react';
import useAutoStore from '../store/useAutoStore';

export default function Navbar({ showSearch, searchValue, onSearchChange }) {
  const navigate = useNavigate();
  const { theme, setTheme } = useAutoStore();
  const auth = useAutoStore(s => s.auth);
  const logout = useAutoStore(s => s.logout);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 glass-card border-b border-surface-border print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/brands"
            className="flex items-center gap-2.5 text-slate-100 hover:text-blue-400 transition-colors"
          >
            <Car size={22} className="text-blue-400" />
            <span
              className="text-xl tracking-widest font-display"
              style={{ fontFamily: "'Bebas Neue', cursive" }}
            >
              AUTO<span className="text-blue-400">VAULT</span>
            </span>
          </Link>

          {/* Search */}
          {showSearch && (
            <div className="hidden sm:block flex-1 max-w-sm mx-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchValue || ''}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-surface border border-surface-border rounded-lg px-3 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            {auth.username && (
              <span className="text-slate-400 text-sm font-body hidden sm:inline-block">
                Hi, {auth.username}
              </span>
            )}

            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-surface-hover transition-all"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {auth.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-surface-hover transition-all"
                  title="Admin Panel"
                >
                  <Settings size={18} />
                </button>
              )}

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-surface-hover transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

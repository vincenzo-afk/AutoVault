import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Eye, EyeOff } from 'lucide-react';
import useAutoStore from '../store/useAutoStore';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const login = useAutoStore((state) => state.login);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    const role = login(username, password);
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'viewer') {
      navigate('/brands');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] flex items-center justify-center relative overflow-hidden">
      {/* Grid texture overlay */}
      <div className="absolute inset-0 bg-grid-texture opacity-30 pointer-events-none" />
      
      {/* Animated background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-10 w-full max-w-md mx-4 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center mb-6 border border-white/10">
            <Car size={48} className="text-blue-400" />
          </div>
          <h1 
            className="font-display text-5xl tracking-widest text-white uppercase mb-2"
            style={{ fontFamily: "'Bebas Neue', cursive" }}
          >
            Auto<span className="text-blue-400">Vault</span>
          </h1>
          <p className="text-slate-400 text-sm font-body">Automotive Intelligence Dashboard</p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent my-6" />

        <form onSubmit={handleLogin} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full bg-[#080B12] border border-surface-border rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-body transition-all"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#080B12] border border-surface-border rounded-xl px-4 py-3 pr-12 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-body transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-2"
          >
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 hover:brightness-110 font-display tracking-widest text-white text-xl py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25"
              style={{ fontFamily: "'Bebas Neue', cursive" }}
            >
              LOGIN
            </button>
          </motion.div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center mt-4 font-body"
            >
              {error}
            </motion.p>
          )}
        </form>
      </motion.div>
    </div>
  );
}

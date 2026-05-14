import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Eye, EyeOff, Lock, User } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import useAutoStore from '../store/useAutoStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, auth } = useAutoStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (auth.isLoggedIn) {
    if (auth.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/brands" replace />;
  }

  const handleSubmit = (e) => {
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
    <div className="min-h-screen w-full bg-[#0F1117] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-grid-texture opacity-20 pointer-events-none" />
      
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-10 w-full max-w-md mx-auto relative z-10 border border-white/5"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 p-0.5 mb-6">
            <div className="w-full h-full bg-[#0F1117] rounded-[14px] flex items-center justify-center">
              <Car size={48} className="text-blue-400" />
            </div>
          </div>
          
          <h1 className="font-display text-5xl tracking-widest text-white uppercase mb-2">
            Auto<span className="text-blue-400">Vault</span>
          </h1>
          <p className="text-slate-400 text-sm font-body tracking-wider uppercase">
            Automotive Intelligence Dashboard
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent my-8" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#161B22] border border-surface-border text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-body"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#161B22] border border-surface-border text-white pl-12 pr-12 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-body"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 hover:brightness-110 active:scale-[0.98] transition-all duration-200 font-display tracking-[0.2em] text-white text-xl py-4 rounded-xl shadow-lg shadow-blue-500/20"
            >
              LOGIN
            </button>
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center font-body"
            >
              {error}
            </motion.p>
          )}
        </form>
      </motion.div>
      
      {/* Decorative Bottom Line */}
      <div className="absolute bottom-0 left-0 w-full racing-stripe opacity-50" />
    </div>
  );
}

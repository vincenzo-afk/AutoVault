/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#0F1117",
          card: "#181C27",
          border: "#252A3A",
          hover: "#1E2436",
        },
        accent: {
          blue: "#3B82F6",
          red: "#EF4444",
          green: "#10B981",
          amber: "#F59E0B",
          violet: "#8B5CF6",
        },
        neon: {
          blue: '#00E5FF',
          red: '#FF3B3B',
          gold: '#FFD700',
          green: '#00FF88',
          orange: '#FF6B35',
        },
      },
      backgroundImage: {
        "grid-dark": "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(59,130,246,0.35)",
        "glow-red": "0 0 20px rgba(239,68,68,0.35)",
        "glow-green": "0 0 20px rgba(16,185,129,0.35)",
        "card": "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.6)",
        'neon-blue':   '0 0 15px rgba(0,229,255,0.5), 0 0 30px rgba(0,229,255,0.2)',
        'neon-red':    '0 0 15px rgba(255,59,59,0.5),  0 0 30px rgba(255,59,59,0.2)',
        'neon-gold':   '0 0 15px rgba(255,215,0,0.5),  0 0 30px rgba(255,215,0,0.2)',
        'neon-green':  '0 0 15px rgba(0,255,136,0.5),  0 0 30px rgba(0,255,136,0.2)',
      },
      animation: {
        "underline-grow": "underlineGrow 0.6s ease forwards",
        "fade-up": "fadeUp 0.4s ease forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        underlineGrow: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

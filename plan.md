# PLAN.md — AutoVault Dashboard
## Hyper-Detailed Blueprint for AI Coding Agents

> **AGENT INSTRUCTIONS:** Read this document top-to-bottom without skipping. Build every file in the exact order listed in the Build Order section. Every section is exhaustive and self-contained. Do not ask clarifying questions — all decisions are made here. Every class name, prop, function signature, and edge case is specified.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Project Initialization Commands](#3-project-initialization-commands)
4. [Complete File Tree](#4-complete-file-tree)
5. [Design System & Tokens](#5-design-system--tokens)
6. [Excel File Schema](#6-excel-file-schema)
7. [Zustand Store](#7-zustand-store)
8. [React Router Configuration](#8-react-router-configuration)
9. [Utility Functions](#9-utility-functions)
10. [Custom Hooks](#10-custom-hooks)
11. [Shared Components](#11-shared-components)
12. [Pages](#12-pages)
13. [Build Order](#13-build-order)
14. [Edge Cases](#14-edge-cases)
15. [localStorage Schema](#15-localstorage-schema)
16. [Validation Rules](#16-validation-rules)

---

## 1. Project Overview

**App Name:** AutoVault Dashboard  
**Type:** React 18 + Vite 5 SPA (Single Page Application)  
**Backend:** None — fully browser-based, zero server calls  
**Purpose:** An automotive industry client portal where the client uploads an Excel file + images and a fully interactive 4-page web application auto-generates in the browser.

### Core User Flow
1. User lands on `/admin` (AdminPanel).
2. User uploads an Excel file (`.xlsx` or `.xls`) containing 4 sheets: `Brands`, `Models`, `Parts`, `Specifications`.
3. User uploads brand logos + car/part images (individual files or a single ZIP).
4. User clicks "Confirm & Load" — data is parsed, stored in Zustand + localStorage.
5. App redirects to `/brands` (BrandsPage).
6. User browses Brands → Models → Parts → Specifications in a 4-level drill-down.
7. User can export specs to Excel, print the specs page, or return to admin to re-upload.

### Aesthetic Direction
- **Theme:** Dark-first, luxury automotive — deep charcoal/slate backgrounds, vivid brand-assigned gradient accents, frosted-glass card surfaces, subtle grid-line textures.
- **Typography:** `Bebas Neue` for display headings (imported via Google Fonts), `DM Sans` for body/UI text.
- **Motion:** Framer Motion staggered card entrances (0.05s delay per card), layout transitions between pages, hover lift effects.
- **Feel:** Think automotive showroom — dramatic, dark, premium, colorful gradients per brand.

---

## 2. Tech Stack & Dependencies

### Runtime Dependencies

| Package | Exact Version | Purpose |
|---|---|---|
| `react` | `^18.3.1` | UI framework |
| `react-dom` | `^18.3.1` | DOM renderer |
| `react-router-dom` | `^6.26.2` | Client-side routing |
| `zustand` | `^5.0.0` | Global state management |
| `xlsx` | `^0.18.5` | Excel file parser (SheetJS) |
| `file-saver` | `^2.0.5` | Download generated Excel files |
| `framer-motion` | `^11.5.4` | Animations and transitions |
| `recharts` | `^2.12.7` | Bar charts for specifications |
| `jszip` | `^3.10.1` | Extract images from ZIP uploads |
| `lucide-react` | `^0.441.0` | Icon library |

### Dev Dependencies

| Package | Exact Version | Purpose |
|---|---|---|
| `vite` | `^5.4.1` | Build tool |
| `@vitejs/plugin-react` | `^4.3.1` | React Fast Refresh |
| `tailwindcss` | `^3.4.11` | Utility CSS |
| `postcss` | `^8.4.45` | CSS processing |
| `autoprefixer` | `^10.4.20` | CSS vendor prefixes |

---

## 3. Project Initialization Commands

Run these commands in exact order:

```bash
npm create vite@latest autovault-dashboard -- --template react
cd autovault-dashboard
npm install react-router-dom@^6.26.2 zustand@^5.0.0 xlsx@^0.18.5 file-saver@^2.0.5 framer-motion@^11.5.4 recharts@^2.12.7 jszip@^3.10.1 lucide-react@^0.441.0
npm install -D tailwindcss@^3.4.11 postcss@^8.4.45 autoprefixer@^10.4.20
npx tailwindcss init -p
```

---

## 4. Complete File Tree

Every file that will exist in the project:

```
autovault-dashboard/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── public/
│   └── vite.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── store/
    │   └── useAutoStore.js
    ├── utils/
    │   ├── excelParser.js
    │   ├── colorAssigner.js
    │   ├── imageHandler.js
    │   └── exportHelper.js
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Breadcrumb.jsx
    │   ├── BrandCard.jsx
    │   ├── ModelCard.jsx
    │   ├── PartCard.jsx
    │   ├── SpecTable.jsx
    │   ├── SpecChart.jsx
    │   ├── StockBadge.jsx
    │   ├── FileUploader.jsx
    │   ├── ImageUploader.jsx
    │   ├── StatCard.jsx
    │   ├── FilterTabs.jsx
    │   ├── SearchBar.jsx
    │   ├── ConfirmModal.jsx
    │   └── EmptyState.jsx
    ├── pages/
    │   ├── BrandsPage.jsx
    │   ├── ModelsPage.jsx
    │   ├── PartsPage.jsx
    │   ├── SpecsPage.jsx
    │   └── AdminPanel.jsx
    └── hooks/
        ├── useExcelUpload.js
        └── useImageUpload.js
```

---

## 5. Design System & Tokens

### 5.1 `tailwind.config.js`

Write the full file:

```js
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
```

### 5.2 `src/index.css`

Write the full file:

```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --surface-bg: #0F1117;
  --surface-card: #181C27;
  --surface-border: #252A3A;
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --text-muted: #475569;
}

/* Light mode overrides */
.light {
  --surface-bg: #F1F5F9;
  --surface-card: #FFFFFF;
  --surface-border: #E2E8F0;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-muted: #94A3B8;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'DM Sans', sans-serif;
  background-color: var(--surface-bg);
  color: var(--text-primary);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #0F1117;
}
::-webkit-scrollbar-thumb {
  background: #252A3A;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #3B82F6;
}

/* Grid texture utility */
.bg-grid-texture {
  background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Glass card effect */
.glass-card {
  background: rgba(24, 28, 39, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.06);
}

/* Brand gradient text utility */
.gradient-text {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Focus ring override */
*:focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Drag-over highlight */
.drag-over {
  border-color: #3B82F6 !important;
  background-color: rgba(59, 130, 246, 0.08) !important;
}

/* Recharts tooltip override */
.recharts-tooltip-wrapper {
  outline: none !important;
}
.recharts-default-tooltip {
  background: #181C27 !important;
  border: 1px solid #252A3A !important;
  border-radius: 8px !important;
  color: #F1F5F9 !important;
}
```

### 5.3 `index.html`

```html
<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AutoVault Dashboard</title>
    <meta name="description" content="Automotive industry client dashboard — upload Excel + images to generate an interactive catalog." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 5.4 `vite.config.js`

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

### 5.5 `postcss.config.js`

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 5.6 Color Palette Constants

The 12 brand gradient palette entries (used in `colorAssigner.js`):

```
Index 0:  primary="#3B82F6" secondary="#1D4ED8" gradient="from-blue-500 to-blue-800"        label="Ocean Blue"
Index 1:  primary="#EF4444" secondary="#B91C1C" gradient="from-red-500 to-red-800"          label="Racing Red"
Index 2:  primary="#10B981" secondary="#065F46" gradient="from-emerald-500 to-emerald-900"  label="Rally Green"
Index 3:  primary="#F59E0B" secondary="#B45309" gradient="from-amber-400 to-amber-700"      label="Sunburst Amber"
Index 4:  primary="#8B5CF6" secondary="#5B21B6" gradient="from-violet-500 to-violet-800"    label="Royal Violet"
Index 5:  primary="#EC4899" secondary="#9D174D" gradient="from-pink-500 to-pink-800"        label="Hot Pink"
Index 6:  primary="#06B6D4" secondary="#0E7490" gradient="from-cyan-400 to-cyan-700"        label="Arctic Cyan"
Index 7:  primary="#84CC16" secondary="#3F6212" gradient="from-lime-400 to-lime-800"        label="Neon Lime"
Index 8:  primary="#F97316" secondary="#C2410C" gradient="from-orange-400 to-orange-700"    label="Turbo Orange"
Index 9:  primary="#6366F1" secondary="#3730A3" gradient="from-indigo-500 to-indigo-800"    label="Indigo Rush"
Index 10: primary="#14B8A6" secondary="#0F766E" gradient="from-teal-400 to-teal-700"        label="Teal Shift"
Index 11: primary="#A855F7" secondary="#6B21A8" gradient="from-purple-500 to-purple-800"    label="Deep Purple"
```

### 5.7 Category Color Map

Parts category tab colors (used in PartsPage and FilterTabs):

```js
export const CATEGORY_COLORS = {
  Engine:       { bg: "bg-red-500/20",    text: "text-red-400",    border: "border-red-500/40",    dot: "#EF4444" },
  Body:         { bg: "bg-blue-500/20",   text: "text-blue-400",   border: "border-blue-500/40",   dot: "#3B82F6" },
  Interior:     { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/40", dot: "#8B5CF6" },
  Electrical:   { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/40", dot: "#EAB308" },
  Suspension:   { bg: "bg-green-500/20",  text: "text-green-400",  border: "border-green-500/40",  dot: "#22C55E" },
  Transmission: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/40", dot: "#F97316" },
};
```

### 5.8 Model Category Badge Colors

```js
export const MODEL_CATEGORY_COLORS = {
  SUV:       "bg-blue-500/20 text-blue-300 border border-blue-500/40",
  Sedan:     "bg-green-500/20 text-green-300 border border-green-500/40",
  Hatchback: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40",
  Truck:     "bg-orange-500/20 text-orange-300 border border-orange-500/40",
  Coupe:     "bg-pink-500/20 text-pink-300 border border-pink-500/40",
  Van:       "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40",
};
```

### 5.9 Stock Status Color Map

```js
export const STOCK_COLORS = {
  Available:      { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/40", dot: "#10B981" },
  Low:            { bg: "bg-amber-500/15",   text: "text-amber-400",   border: "border-amber-500/40",   dot: "#F59E0B" },
  "Out of Stock": { bg: "bg-red-500/15",     text: "text-red-400",     border: "border-red-500/40",     dot: "#EF4444" },
};
```

---

## 6. Excel File Schema

### 6.1 Sheet 1 — Brands

| Col | Key | Type | Required | Notes |
|---|---|---|---|---|
| A | `brand_id` | string | ✅ | Unique. e.g. `"BR001"` |
| B | `brand_name` | string | ✅ | e.g. `"Toyota"` |
| C | `logo_filename` | string | ✅ | e.g. `"toyota_logo.png"` — matched against uploaded images |
| D | `country` | string | ✅ | e.g. `"Japan"` |
| E | `description` | string | ✅ | Marketing blurb |
| F | `founded_year` | number | ✅ | e.g. `1937` — coerce with `parseInt()` |
| G | `website` | string | ❌ | e.g. `"https://toyota.com"` — optional |

**Row 1 is headers. Data starts Row 2.**

### 6.2 Sheet 2 — Models

| Col | Key | Type | Required | Notes |
|---|---|---|---|---|
| A | `model_id` | string | ✅ | Unique. e.g. `"MD001"` |
| B | `brand_id` | string | ✅ | FK → Brands.brand_id |
| C | `model_name` | string | ✅ | e.g. `"Camry"` |
| D | `image_filename` | string | ✅ | e.g. `"camry.png"` |
| E | `year` | number | ✅ | coerce with `parseInt()` |
| F | `category` | string | ✅ | One of: `SUV \| Sedan \| Hatchback \| Truck \| Coupe \| Van` |
| G | `engine_type` | string | ✅ | e.g. `"2.0L 4-Cylinder"` |
| H | `fuel_type` | string | ✅ | One of: `Petrol \| Diesel \| Electric \| Hybrid` |
| I | `transmission` | string | ✅ | One of: `Manual \| Automatic \| CVT` |
| J | `price_range` | string | ✅ | e.g. `"₹15L - ₹20L"` |
| K | `horsepower` | number | ✅ | coerce with `parseInt()` |
| L | `torque` | string | ✅ | e.g. `"200 Nm"` |
| M | `seating_capacity` | number | ✅ | coerce with `parseInt()` |

### 6.3 Sheet 3 — Parts

| Col | Key | Type | Required | Notes |
|---|---|---|---|---|
| A | `part_id` | string | ✅ | Unique. e.g. `"PT001"` |
| B | `model_id` | string | ✅ | FK → Models.model_id |
| C | `part_name` | string | ✅ | e.g. `"Front Brake Pad"` |
| D | `part_category` | string | ✅ | One of: `Engine \| Body \| Interior \| Electrical \| Suspension \| Transmission` |
| E | `part_image_filename` | string | ❌ | Optional — fallback to placeholder |
| F | `stock_status` | string | ✅ | One of: `Available \| Low \| Out of Stock` |
| G | `oem_number` | string | ✅ | e.g. `"OEM-04465-02270"` |
| H | `manufacturer` | string | ✅ | e.g. `"Akebono"` |
| I | `weight_kg` | number | ✅ | coerce with `parseFloat()` |
| J | `warranty_months` | number | ✅ | coerce with `parseInt()` |
| K | `price_inr` | number | ✅ | coerce with `parseFloat()` |

### 6.4 Sheet 4 — Specifications

| Col | Key | Type | Required | Notes |
|---|---|---|---|---|
| A | `spec_id` | string | ✅ | Unique. e.g. `"SP001"` |
| B | `part_id` | string | ✅ | FK → Parts.part_id |
| C | `spec_name` | string | ✅ | e.g. `"Thickness"` |
| D | `spec_value` | number | ✅ | coerce with `parseFloat()` |
| E | `unit` | string | ✅ | e.g. `"mm"` |
| F | `standard_value` | number | ✅ | coerce with `parseFloat()` |
| G | `tolerance_plus` | number | ✅ | coerce with `parseFloat()` |
| H | `tolerance_minus` | number | ✅ | coerce with `parseFloat()` |
| I | `condition` | string | ✅ | One of: `Normal \| Warning \| Critical` — **auto-computed**, Excel value is ignored |
| J | `notes` | string | ❌ | Optional |

**Condition auto-computation rule:**
```
if (spec_value >= standard_value - tolerance_minus && spec_value <= standard_value + tolerance_plus):
  condition = "Normal"
else if (deviation from standard is within 20% beyond tolerance):
  condition = "Warning"
else:
  condition = "Critical"
```

Exact logic:
```js
function computeCondition(spec_value, standard_value, tolerance_plus, tolerance_minus) {
  const sv = parseFloat(spec_value);
  const std = parseFloat(standard_value);
  const tp = parseFloat(tolerance_plus);
  const tm = parseFloat(tolerance_minus);
  const lowerBound = std - tm;
  const upperBound = std + tp;
  if (sv >= lowerBound && sv <= upperBound) return "Normal";
  const deviation = Math.abs(sv - std);
  const maxTolerance = Math.max(tp, tm);
  if (deviation <= maxTolerance * 1.2) return "Warning";
  return "Critical";
}
```

---

## 7. Zustand Store

### 7.1 File: `src/store/useAutoStore.js`

Write the full file:

```js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { assignBrandColors } from '../utils/colorAssigner';

const useAutoStore = create(
  persist(
    (set, get) => ({
      // ─── State ──────────────────────────────────────────────────────────────
      brands: [],
      models: [],
      parts: [],
      specifications: [],
      images: {},               // { "filename.png": "data:image/png;base64,..." }
      selectedBrand: null,      // brand_id string | null
      selectedModel: null,      // model_id string | null
      selectedPart: null,       // part_id string | null
      isDataLoaded: false,
      theme: 'dark',            // "dark" | "light"
      brandColors: {},          // { brand_id: { primary, secondary, gradient } }

      // ─── Actions ─────────────────────────────────────────────────────────────

      setAllData: (brands, models, parts, specifications) => {
        const brandColors = assignBrandColors(brands);
        set({
          brands,
          models,
          parts,
          specifications,
          brandColors,
          isDataLoaded: true,
        });
      },

      setImages: (imagesMap) => {
        set({ images: imagesMap });
      },

      mergeImages: (newImagesMap) => {
        set((state) => ({
          images: { ...state.images, ...newImagesMap },
        }));
      },

      setSelectedBrand: (brand_id) => {
        set({ selectedBrand: brand_id });
      },

      setSelectedModel: (model_id) => {
        set({ selectedModel: model_id });
      },

      setSelectedPart: (part_id) => {
        set({ selectedPart: part_id });
      },

      clearAll: () => {
        set({
          brands: [],
          models: [],
          parts: [],
          specifications: [],
          images: {},
          selectedBrand: null,
          selectedModel: null,
          selectedPart: null,
          isDataLoaded: false,
          brandColors: {},
        });
      },

      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
      },

      assignBrandColors: () => {
        const { brands } = get();
        const brandColors = assignBrandColors(brands);
        set({ brandColors });
      },

      // ─── Derived selectors (not stored, computed on the fly) ─────────────────

      getModelsForBrand: (brand_id) => {
        return get().models.filter((m) => m.brand_id === brand_id);
      },

      getPartsForModel: (model_id) => {
        return get().parts.filter((p) => p.model_id === model_id);
      },

      getSpecsForPart: (part_id) => {
        return get().specifications.filter((s) => s.part_id === part_id);
      },

      getBrandById: (brand_id) => {
        return get().brands.find((b) => b.brand_id === brand_id) || null;
      },

      getModelById: (model_id) => {
        return get().models.find((m) => m.model_id === model_id) || null;
      },

      getPartById: (part_id) => {
        return get().parts.find((p) => p.part_id === part_id) || null;
      },

      getImage: (filename) => {
        if (!filename) return null;
        return get().images[filename] || null;
      },

      getBrandColor: (brand_id) => {
        const colors = get().brandColors;
        return colors[brand_id] || {
          primary: '#3B82F6',
          secondary: '#1D4ED8',
          gradient: 'from-blue-500 to-blue-800',
        };
      },

      getLowStockParts: () => {
        return get().parts.filter((p) => p.stock_status === 'Low');
      },

      getOutOfStockParts: () => {
        return get().parts.filter((p) => p.stock_status === 'Out of Stock');
      },
    }),
    {
      name: 'autovault-storage',
      // Persist everything except selectedBrand/Model/Part (those are ephemeral)
      partialize: (state) => ({
        brands: state.brands,
        models: state.models,
        parts: state.parts,
        specifications: state.specifications,
        images: state.images,
        isDataLoaded: state.isDataLoaded,
        theme: state.theme,
        brandColors: state.brandColors,
      }),
      // Handle localStorage quota exceeded
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('AutoVault: Failed to rehydrate from localStorage:', error);
        }
      },
    }
  )
);

export default useAutoStore;
```

**Note on images persistence:** The `images` map contains base64 strings which can be very large. The Zustand `persist` middleware stores this in `localStorage` under the key `autovault-storage`. If the payload exceeds ~5MB, localStorage will throw a `QuotaExceededError`. Handle this in the `setImages` action by wrapping the localStorage write in a try/catch (Zustand's persist handles this, but add a global error boundary too).

---

## 8. React Router Configuration

### 8.1 File: `src/App.jsx`

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAutoStore from './store/useAutoStore';
import AdminPanel from './pages/AdminPanel';
import BrandsPage from './pages/BrandsPage';
import ModelsPage from './pages/ModelsPage';
import PartsPage from './pages/PartsPage';
import SpecsPage from './pages/SpecsPage';
import { useEffect } from 'react';

// ProtectedRoute: redirects to /admin if no data is loaded
function ProtectedRoute({ children }) {
  const isDataLoaded = useAutoStore((s) => s.isDataLoaded);
  if (!isDataLoaded) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

export default function App() {
  const theme = useAutoStore((s) => s.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/brands" replace />} />

        {/* Admin Panel — always accessible */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Protected data routes */}
        <Route
          path="/brands"
          element={
            <ProtectedRoute>
              <BrandsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brands/:brandId/models"
          element={
            <ProtectedRoute>
              <ModelsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brands/:brandId/models/:modelId/parts"
          element={
            <ProtectedRoute>
              <PartsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brands/:brandId/models/:modelId/parts/:partId/specs"
          element={
            <ProtectedRoute>
              <SpecsPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 8.2 File: `src/main.jsx`

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

## 9. Utility Functions

### 9.1 `src/utils/colorAssigner.js`

**Full file:**

```js
// ─── Brand Palette ────────────────────────────────────────────────────────────
export const BRAND_PALETTE = [
  { primary: '#3B82F6', secondary: '#1D4ED8', gradient: 'from-blue-500 to-blue-800',      label: 'Ocean Blue'    },
  { primary: '#EF4444', secondary: '#B91C1C', gradient: 'from-red-500 to-red-800',        label: 'Racing Red'    },
  { primary: '#10B981', secondary: '#065F46', gradient: 'from-emerald-500 to-emerald-900', label: 'Rally Green'  },
  { primary: '#F59E0B', secondary: '#B45309', gradient: 'from-amber-400 to-amber-700',    label: 'Sunburst'      },
  { primary: '#8B5CF6', secondary: '#5B21B6', gradient: 'from-violet-500 to-violet-800',  label: 'Royal Violet'  },
  { primary: '#EC4899', secondary: '#9D174D', gradient: 'from-pink-500 to-pink-800',      label: 'Hot Pink'      },
  { primary: '#06B6D4', secondary: '#0E7490', gradient: 'from-cyan-400 to-cyan-700',      label: 'Arctic Cyan'   },
  { primary: '#84CC16', secondary: '#3F6212', gradient: 'from-lime-400 to-lime-800',      label: 'Neon Lime'     },
  { primary: '#F97316', secondary: '#C2410C', gradient: 'from-orange-400 to-orange-700',  label: 'Turbo Orange'  },
  { primary: '#6366F1', secondary: '#3730A3', gradient: 'from-indigo-500 to-indigo-800',  label: 'Indigo Rush'   },
  { primary: '#14B8A6', secondary: '#0F766E', gradient: 'from-teal-400 to-teal-700',      label: 'Teal Shift'    },
  { primary: '#A855F7', secondary: '#6B21A8', gradient: 'from-purple-500 to-purple-800',  label: 'Deep Purple'   },
];

/**
 * Assigns a color palette entry to each brand in the array.
 * Wraps around the palette using modulo when brands.length > 12.
 *
 * @param {Array<{ brand_id: string }>} brands
 * @returns {{ [brand_id: string]: { primary: string, secondary: string, gradient: string, label: string } }}
 */
export function assignBrandColors(brands) {
  const result = {};
  brands.forEach((brand, index) => {
    result[brand.brand_id] = BRAND_PALETTE[index % BRAND_PALETTE.length];
  });
  return result;
}

/**
 * Returns the color config for a given brand_id.
 * Falls back to first palette entry if not found.
 *
 * @param {{ [brand_id: string]: object }} brandColors - from Zustand store
 * @param {string} brand_id
 * @returns {{ primary: string, secondary: string, gradient: string, label: string }}
 */
export function getBrandColor(brandColors, brand_id) {
  return brandColors[brand_id] || BRAND_PALETTE[0];
}
```

---

### 9.2 `src/utils/excelParser.js`

**Full file with complete pseudocode-precise logic:**

```js
import * as XLSX from 'xlsx';
import { computeCondition } from './specCondition';

// ─── Sheet names expected in the workbook ────────────────────────────────────
const SHEET_NAMES = {
  brands: 'Brands',
  models: 'Models',
  parts: 'Parts',
  specifications: 'Specifications',
};

// ─── Column index → field mappings ───────────────────────────────────────────

const BRANDS_COLUMNS = {
  0: { key: 'brand_id',      type: 'string'  },
  1: { key: 'brand_name',    type: 'string'  },
  2: { key: 'logo_filename', type: 'string'  },
  3: { key: 'country',       type: 'string'  },
  4: { key: 'description',   type: 'string'  },
  5: { key: 'founded_year',  type: 'int'     },
  6: { key: 'website',       type: 'string'  },
};

const MODELS_COLUMNS = {
  0:  { key: 'model_id',        type: 'string' },
  1:  { key: 'brand_id',        type: 'string' },
  2:  { key: 'model_name',      type: 'string' },
  3:  { key: 'image_filename',  type: 'string' },
  4:  { key: 'year',            type: 'int'    },
  5:  { key: 'category',        type: 'string' },
  6:  { key: 'engine_type',     type: 'string' },
  7:  { key: 'fuel_type',       type: 'string' },
  8:  { key: 'transmission',    type: 'string' },
  9:  { key: 'price_range',     type: 'string' },
  10: { key: 'horsepower',      type: 'int'    },
  11: { key: 'torque',          type: 'string' },
  12: { key: 'seating_capacity',type: 'int'    },
};

const PARTS_COLUMNS = {
  0:  { key: 'part_id',             type: 'string' },
  1:  { key: 'model_id',            type: 'string' },
  2:  { key: 'part_name',           type: 'string' },
  3:  { key: 'part_category',       type: 'string' },
  4:  { key: 'part_image_filename', type: 'string' },
  5:  { key: 'stock_status',        type: 'string' },
  6:  { key: 'oem_number',          type: 'string' },
  7:  { key: 'manufacturer',        type: 'string' },
  8:  { key: 'weight_kg',           type: 'float'  },
  9:  { key: 'warranty_months',     type: 'int'    },
  10: { key: 'price_inr',           type: 'float'  },
};

const SPECIFICATIONS_COLUMNS = {
  0: { key: 'spec_id',        type: 'string' },
  1: { key: 'part_id',        type: 'string' },
  2: { key: 'spec_name',      type: 'string' },
  3: { key: 'spec_value',     type: 'float'  },
  4: { key: 'unit',           type: 'string' },
  5: { key: 'standard_value', type: 'float'  },
  6: { key: 'tolerance_plus', type: 'float'  },
  7: { key: 'tolerance_minus',type: 'float'  },
  8: { key: 'condition',      type: 'string' }, // will be overwritten by auto-compute
  9: { key: 'notes',          type: 'string' },
};

// ─── Type coercion helper ─────────────────────────────────────────────────────

/**
 * Coerces a raw cell value to the target type.
 * @param {any} raw
 * @param {'string'|'int'|'float'} type
 * @returns {string|number|null}
 */
function coerce(raw, type) {
  if (raw === null || raw === undefined || raw === '') return type === 'string' ? '' : null;
  if (type === 'string') return String(raw).trim();
  if (type === 'int') {
    const n = parseInt(String(raw), 10);
    return isNaN(n) ? null : n;
  }
  if (type === 'float') {
    const n = parseFloat(String(raw));
    return isNaN(n) ? null : n;
  }
  return raw;
}

// ─── Generic sheet parser ─────────────────────────────────────────────────────

/**
 * Parses a worksheet into an array of objects.
 * Row 0 = headers (skipped). Rows 1+ = data.
 * Primary key column is always index 0.
 *
 * @param {XLSX.WorkSheet|undefined} worksheet
 * @param {{ [colIndex: number]: { key: string, type: string } }} columnMap
 * @param {string} sheetName - used for warnings
 * @returns {Array<object>}
 */
function parseSheet(worksheet, columnMap, sheetName) {
  if (!worksheet) {
    console.warn(`AutoVault: Sheet "${sheetName}" not found in workbook.`);
    return [];
  }

  // Convert sheet to 2D array (arrays of arrays). header:1 gives raw arrays.
  const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

  if (rawRows.length <= 1) {
    // Only headers or empty sheet
    return [];
  }

  // Skip first row (headers = rawRows[0])
  const dataRows = rawRows.slice(1);

  const results = [];

  dataRows.forEach((row, rowIndex) => {
    // Skip completely empty rows
    const primaryKey = coerce(row[0], 'string');
    if (!primaryKey) return;

    const obj = {};
    Object.entries(columnMap).forEach(([colIndexStr, { key, type }]) => {
      const colIndex = parseInt(colIndexStr, 10);
      const raw = row[colIndex];
      obj[key] = coerce(raw, type);
    });

    results.push(obj);
  });

  return results;
}

// ─── Condition computation helper ─────────────────────────────────────────────

/**
 * Auto-computes the "condition" field for a specification row.
 * Overrides whatever was in the Excel column I.
 *
 * @param {number} spec_value
 * @param {number} standard_value
 * @param {number} tolerance_plus
 * @param {number} tolerance_minus
 * @returns {"Normal"|"Warning"|"Critical"}
 */
export function computeCondition(spec_value, standard_value, tolerance_plus, tolerance_minus) {
  const sv  = parseFloat(spec_value)     || 0;
  const std = parseFloat(standard_value) || 0;
  const tp  = parseFloat(tolerance_plus) || 0;
  const tm  = parseFloat(tolerance_minus)|| 0;

  const lowerBound = std - tm;
  const upperBound = std + tp;

  if (sv >= lowerBound && sv <= upperBound) return 'Normal';

  const deviation   = Math.abs(sv - std);
  const maxTolerance = Math.max(tp, tm);

  if (maxTolerance === 0) return 'Critical'; // no tolerance defined
  if (deviation <= maxTolerance * 1.2) return 'Warning';
  return 'Critical';
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Parses an Excel file and returns structured data.
 *
 * @param {File} file - File object from input/drop event
 * @returns {Promise<{
 *   brands: Array<object>,
 *   models: Array<object>,
 *   parts: Array<object>,
 *   specifications: Array<object>,
 *   warnings: Array<string>
 * }>}
 */
export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        const workbook = XLSX.read(buffer, { type: 'array' });

        const warnings = [];

        // ── Parse each sheet ─────────────────────────────────────────────────
        const brandsWS = workbook.Sheets[SHEET_NAMES.brands];
        const modelsWS = workbook.Sheets[SHEET_NAMES.models];
        const partsWS  = workbook.Sheets[SHEET_NAMES.parts];
        const specsWS  = workbook.Sheets[SHEET_NAMES.specifications];

        if (!brandsWS)        warnings.push('Sheet "Brands" not found.');
        if (!modelsWS)        warnings.push('Sheet "Models" not found.');
        if (!partsWS)         warnings.push('Sheet "Parts" not found.');
        if (!specsWS)         warnings.push('Sheet "Specifications" not found.');

        const brands         = parseSheet(brandsWS, BRANDS_COLUMNS,         SHEET_NAMES.brands);
        const models         = parseSheet(modelsWS, MODELS_COLUMNS,         SHEET_NAMES.models);
        const parts          = parseSheet(partsWS,  PARTS_COLUMNS,          SHEET_NAMES.parts);
        const rawSpecs       = parseSheet(specsWS,  SPECIFICATIONS_COLUMNS, SHEET_NAMES.specifications);

        // ── Auto-compute condition for each spec ──────────────────────────────
        const specifications = rawSpecs.map((spec) => ({
          ...spec,
          condition: computeCondition(
            spec.spec_value,
            spec.standard_value,
            spec.tolerance_plus,
            spec.tolerance_minus
          ),
        }));

        resolve({ brands, models, parts, specifications, warnings });
      } catch (err) {
        reject(new Error(`Failed to parse Excel file: ${err.message}`));
      }
    };

    reader.onerror = () => reject(new Error('FileReader failed to read the file.'));
    reader.readAsArrayBuffer(file);
  });
}
```

---

### 9.3 `src/utils/imageHandler.js`

**Full file:**

```js
import JSZip from 'jszip';

// Accepted image MIME types
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
const ACCEPTED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

/**
 * Converts a File (image) to a base64 data URL string.
 *
 * @param {File} file
 * @returns {Promise<string>} e.g. "data:image/png;base64,iVBOR..."
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsDataURL(file);
  });
}

/**
 * Processes an array of image Files into a filename → base64 map.
 * Skips non-image files silently.
 *
 * @param {File[]} files
 * @returns {Promise<{ [filename: string]: string }>}
 */
export async function processImageFiles(files) {
  const result = {};
  const validFiles = Array.from(files).filter((f) =>
    ACCEPTED_IMAGE_TYPES.includes(f.type) ||
    ACCEPTED_IMAGE_EXTENSIONS.some((ext) => f.name.toLowerCase().endsWith(ext))
  );

  await Promise.all(
    validFiles.map(async (file) => {
      try {
        const base64 = await fileToBase64(file);
        result[file.name] = base64;
      } catch (err) {
        console.warn(`Skipping image "${file.name}": ${err.message}`);
      }
    })
  );

  return result;
}

/**
 * Extracts images from a ZIP file and returns a filename → base64 map.
 * Only processes image files inside the ZIP. Ignores __MACOSX and hidden files.
 *
 * @param {File} zipFile
 * @returns {Promise<{ [filename: string]: string }>}
 */
export async function processZipFile(zipFile) {
  const result = {};
  const zip = await JSZip.loadAsync(zipFile);

  const imageEntries = Object.entries(zip.files).filter(([name, entry]) => {
    if (entry.dir) return false;
    if (name.startsWith('__MACOSX')) return false;
    if (name.startsWith('.')) return false;
    const lowerName = name.toLowerCase();
    return ACCEPTED_IMAGE_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  });

  await Promise.all(
    imageEntries.map(async ([fullPath, zipEntry]) => {
      try {
        const blob = await zipEntry.async('blob');
        // Use only the filename, not the full path inside the ZIP
        const filename = fullPath.split('/').pop();
        const mimeType = getMimeType(filename);
        const blobWithType = new Blob([blob], { type: mimeType });
        const base64 = await fileToBase64(new File([blobWithType], filename, { type: mimeType }));
        result[filename] = base64;
      } catch (err) {
        console.warn(`Skipping zip entry "${fullPath}": ${err.message}`);
      }
    })
  );

  return result;
}

/**
 * Returns a MIME type string based on file extension.
 *
 * @param {string} filename
 * @returns {string}
 */
function getMimeType(filename) {
  const ext = filename.toLowerCase().split('.').pop();
  const map = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' };
  return map[ext] || 'image/png';
}

/**
 * Estimates the total size of the images map in bytes.
 * Used to warn the user before hitting localStorage quota.
 *
 * @param {{ [filename: string]: string }} imagesMap
 * @returns {number} approximate byte size
 */
export function estimateImagesSize(imagesMap) {
  return Object.values(imagesMap).reduce((total, b64) => total + b64.length * 0.75, 0);
}

/**
 * Formats bytes to human-readable string.
 * @param {number} bytes
 * @returns {string} e.g. "4.2 MB"
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
```

---

### 9.4 `src/utils/exportHelper.js`

**Full file:**

```js
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Exports a single part's specifications to an Excel file.
 *
 * @param {object} part - Part object from Zustand store
 * @param {Array<object>} specifications - Array of spec objects for this part
 * @param {object} model - Model object (for context)
 * @param {object} brand - Brand object (for context)
 * @returns {void} — triggers browser download
 */
export function exportSpecsToExcel(part, specifications, model, brand) {
  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Part Info ───────────────────────────────────────────────────
  const partInfoData = [
    ['Field', 'Value'],
    ['Part ID',        part.part_id],
    ['Part Name',      part.part_name],
    ['OEM Number',     part.oem_number],
    ['Category',       part.part_category],
    ['Manufacturer',   part.manufacturer],
    ['Stock Status',   part.stock_status],
    ['Weight (kg)',    part.weight_kg],
    ['Warranty',       `${part.warranty_months} months`],
    ['Price (INR)',    `₹${Number(part.price_inr).toLocaleString('en-IN')}`],
    ['Model',          model?.model_name || ''],
    ['Brand',          brand?.brand_name || ''],
    ['Export Date',    new Date().toLocaleDateString('en-IN')],
  ];
  const partInfoWS = XLSX.utils.aoa_to_sheet(partInfoData);
  partInfoWS['!cols'] = [{ wch: 20 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, partInfoWS, 'Part Info');

  // ── Sheet 2: Specifications ───────────────────────────────────────────────
  const specsHeaders = [
    'Spec ID', 'Spec Name', 'Value', 'Unit', 'Standard Value',
    'Tolerance (+)', 'Tolerance (-)', 'Condition', 'Notes',
  ];
  const specsData = specifications.map((s) => [
    s.spec_id,
    s.spec_name,
    s.spec_value,
    s.unit,
    s.standard_value,
    s.tolerance_plus,
    s.tolerance_minus,
    s.condition,
    s.notes || '',
  ]);
  const specsWS = XLSX.utils.aoa_to_sheet([specsHeaders, ...specsData]);
  specsWS['!cols'] = [
    { wch: 10 }, { wch: 24 }, { wch: 10 }, { wch: 8 },
    { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 30 },
  ];
  XLSX.utils.book_append_sheet(wb, specsWS, 'Specifications');

  // ── Write + Download ──────────────────────────────────────────────────────
  const filename = `${part.part_id}_${part.part_name.replace(/\s+/g, '_')}_specs.xlsx`;
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), filename);
}

/**
 * Exports all brands data to an Excel overview file.
 *
 * @param {object} param0 - Destructured store data
 * @param {Array} param0.brands
 * @param {Array} param0.models
 * @param {Array} param0.parts
 * @param {Array} param0.specifications
 * @returns {void}
 */
export function exportFullDataToExcel({ brands, models, parts, specifications }) {
  const wb = XLSX.utils.book_new();

  const toSheet = (data, headers) => {
    if (!data.length) return XLSX.utils.aoa_to_sheet([headers]);
    const rows = data.map((row) => headers.map((h) => row[h] ?? ''));
    return XLSX.utils.aoa_to_sheet([headers, ...rows]);
  };

  const brandsHeaders = ['brand_id','brand_name','logo_filename','country','description','founded_year','website'];
  const modelsHeaders = ['model_id','brand_id','model_name','image_filename','year','category','engine_type','fuel_type','transmission','price_range','horsepower','torque','seating_capacity'];
  const partsHeaders  = ['part_id','model_id','part_name','part_category','part_image_filename','stock_status','oem_number','manufacturer','weight_kg','warranty_months','price_inr'];
  const specsHeaders  = ['spec_id','part_id','spec_name','spec_value','unit','standard_value','tolerance_plus','tolerance_minus','condition','notes'];

  XLSX.utils.book_append_sheet(wb, toSheet(brands,         brandsHeaders), 'Brands');
  XLSX.utils.book_append_sheet(wb, toSheet(models,         modelsHeaders), 'Models');
  XLSX.utils.book_append_sheet(wb, toSheet(parts,          partsHeaders),  'Parts');
  XLSX.utils.book_append_sheet(wb, toSheet(specifications, specsHeaders),  'Specifications');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'AutoVault_Export.xlsx');
}
```

---

## 10. Custom Hooks

### 10.1 `src/hooks/useExcelUpload.js`

```js
import { useState, useCallback } from 'react';
import { parseExcelFile } from '../utils/excelParser';
import useAutoStore from '../store/useAutoStore';

/**
 * Hook to manage the entire Excel upload + parse + preview + confirm flow.
 *
 * @returns {{
 *   parsedData: { brands: [], models: [], parts: [], specifications: [], warnings: [] } | null,
 *   isLoading: boolean,
 *   error: string | null,
 *   fileName: string | null,
 *   handleFile: (file: File) => void,
 *   confirmLoad: () => void,
 *   reset: () => void,
 * }}
 */
export function useExcelUpload() {
  const [parsedData, setParsedData] = useState(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState(null);
  const [fileName, setFileName]     = useState(null);

  const setAllData = useAutoStore((s) => s.setAllData);

  const handleFile = useCallback(async (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel',                                           // .xls
    ];
    const validExtensions = ['.xlsx', '.xls'];
    const hasValidType = validTypes.includes(file.type);
    const hasValidExt  = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidType && !hasValidExt) {
      setError('Invalid file type. Please upload a .xlsx or .xls file.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFileName(file.name);
    setParsedData(null);

    try {
      const data = await parseExcelFile(file);
      setParsedData(data);
    } catch (err) {
      setError(err.message || 'Failed to parse Excel file.');
      setFileName(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmLoad = useCallback(() => {
    if (!parsedData) return;
    const { brands, models, parts, specifications } = parsedData;
    setAllData(brands, models, parts, specifications);
  }, [parsedData, setAllData]);

  const reset = useCallback(() => {
    setParsedData(null);
    setIsLoading(false);
    setError(null);
    setFileName(null);
  }, []);

  return { parsedData, isLoading, error, fileName, handleFile, confirmLoad, reset };
}
```

---

### 10.2 `src/hooks/useImageUpload.js`

```js
import { useState, useCallback } from 'react';
import { processImageFiles, processZipFile, estimateImagesSize, formatBytes } from '../utils/imageHandler';
import useAutoStore from '../store/useAutoStore';

const MAX_IMAGES_BYTES = 4.5 * 1024 * 1024; // 4.5MB safety limit

/**
 * Hook to manage image uploads (individual files or ZIP).
 *
 * @returns {{
 *   uploadedImages: { [filename: string]: string },
 *   isLoading: boolean,
 *   error: string | null,
 *   warning: string | null,
 *   totalSize: string,
 *   handleFiles: (files: FileList | File[]) => void,
 *   handleZip: (file: File) => void,
 *   removeImage: (filename: string) => void,
 *   confirmSave: () => void,
 *   reset: () => void,
 * }}
 */
export function useImageUpload() {
  const [uploadedImages, setUploadedImages] = useState({});
  const [isLoading, setIsLoading]           = useState(false);
  const [error, setError]                   = useState(null);
  const [warning, setWarning]               = useState(null);

  const mergeImages  = useAutoStore((s) => s.mergeImages);
  const storeImages  = useAutoStore((s) => s.images);

  const checkSizeWarning = (map) => {
    const size = estimateImagesSize({ ...storeImages, ...map });
    if (size > MAX_IMAGES_BYTES) {
      setWarning(`Total image storage is ${formatBytes(size * 1.33)}, which may exceed localStorage limits. Consider clearing old data first.`);
    } else {
      setWarning(null);
    }
  };

  const handleFiles = useCallback(async (files) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await processImageFiles(Array.from(files));
      setUploadedImages((prev) => {
        const merged = { ...prev, ...result };
        checkSizeWarning(merged);
        return merged;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [storeImages]);

  const handleZip = useCallback(async (file) => {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setError('Only .zip files are accepted here.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await processZipFile(file);
      if (Object.keys(result).length === 0) {
        setError('No valid images found inside the ZIP file.');
      } else {
        setUploadedImages((prev) => {
          const merged = { ...prev, ...result };
          checkSizeWarning(merged);
          return merged;
        });
      }
    } catch (err) {
      setError(`ZIP extraction failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [storeImages]);

  const removeImage = useCallback((filename) => {
    setUploadedImages((prev) => {
      const updated = { ...prev };
      delete updated[filename];
      return updated;
    });
  }, []);

  const confirmSave = useCallback(() => {
    mergeImages(uploadedImages);
  }, [uploadedImages, mergeImages]);

  const reset = useCallback(() => {
    setUploadedImages({});
    setIsLoading(false);
    setError(null);
    setWarning(null);
  }, []);

  const totalSize = formatBytes(estimateImagesSize(uploadedImages) * 1.33);

  return {
    uploadedImages,
    isLoading,
    error,
    warning,
    totalSize,
    handleFiles,
    handleZip,
    removeImage,
    confirmSave,
    reset,
  };
}
```

---

## 11. Shared Components

Each component section below provides: props interface, full JSX, exact Tailwind classes, and behavior description.

---

### 11.1 `src/components/StockBadge.jsx`

**Props:**
```ts
{
  status: "Available" | "Low" | "Out of Stock";
  size?: "sm" | "md" | "lg";  // default "md"
}
```

**Full JSX:**
```jsx
import React from 'react';
import { STOCK_COLORS } from '../utils/constants'; // export STOCK_COLORS from a constants file or inline

const SIZE_CLASSES = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-3 py-1 gap-1.5',
  lg: 'text-base px-4 py-1.5 gap-2',
};

const DOT_SIZES = { sm: 'w-1.5 h-1.5', md: 'w-2 h-2', lg: 'w-2.5 h-2.5' };

const STOCK_COLORS = {
  Available:      { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/40', dot: '#10B981' },
  Low:            { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/40',   dot: '#F59E0B' },
  'Out of Stock': { bg: 'bg-red-500/15',     text: 'text-red-400',     border: 'border-red-500/40',     dot: '#EF4444' },
};

export default function StockBadge({ status, size = 'md' }) {
  const colors = STOCK_COLORS[status] || STOCK_COLORS['Available'];
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const dotSize   = DOT_SIZES[size]   || DOT_SIZES.md;

  return (
    <span
      className={`inline-flex items-center font-body font-medium rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizeClass}`}
    >
      <span
        className={`${dotSize} rounded-full animate-pulse-slow`}
        style={{ backgroundColor: colors.dot }}
      />
      {status}
    </span>
  );
}
```

---

### 11.2 `src/components/SearchBar.jsx`

**Props:**
```ts
{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;  // default "Search..."
  className?: string;
}
```

**Full JSX:**
```jsx
import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        className="absolute left-3 text-slate-400 pointer-events-none"
        size={16}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-9 pr-9 py-2.5
          bg-surface-card border border-surface-border
          rounded-xl
          text-sm font-body text-slate-200 placeholder-slate-500
          focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30
          transition-all duration-200
        "
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
```

---

### 11.3 `src/components/FilterTabs.jsx`

**Props:**
```ts
{
  tabs: Array<{ label: string; value: string; count?: number }>;
  active: string;
  onSelect: (value: string) => void;
  colorMap?: { [value: string]: { bg: string; text: string; border: string } };
  className?: string;
}
```

**Full JSX:**
```jsx
import React from 'react';

export default function FilterTabs({ tabs, active, onSelect, colorMap = {}, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tabs.map((tab) => {
        const isActive = active === tab.value;
        const colors = colorMap[tab.value];

        return (
          <button
            key={tab.value}
            onClick={() => onSelect(tab.value)}
            className={`
              inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
              text-sm font-body font-medium
              border transition-all duration-200
              ${isActive
                ? colors
                  ? `${colors.bg} ${colors.text} ${colors.border}`
                  : 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                : 'bg-surface-card text-slate-400 border-surface-border hover:border-slate-600 hover:text-slate-300'
              }
            `}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`
                text-xs px-1.5 py-0.5 rounded-full
                ${isActive ? 'bg-white/20' : 'bg-surface-border text-slate-500'}
              `}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
```

---

### 11.4 `src/components/StatCard.jsx`

**Props:**
```ts
{
  label: string;
  value: number | string;
  icon: React.ReactNode;  // Lucide icon component
  color?: string;         // Tailwind text color class, e.g. "text-blue-400"
  subtitle?: string;      // optional small text below value
}
```

**Full JSX:**
```jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon, color = 'text-blue-400', subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        glass-card rounded-2xl p-5
        flex items-start gap-4
        hover:border-white/10 transition-colors duration-300
      "
    >
      <div className={`p-3 rounded-xl bg-surface-border/60 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-sm font-body font-medium">{label}</p>
        <p className={`text-3xl font-display tracking-wide mt-0.5 ${color}`}>{value}</p>
        {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
```

---

### 11.5 `src/components/Breadcrumb.jsx`

**Props:**
```ts
{
  crumbs: Array<{ label: string; href?: string }>;
  // Last crumb has no href (current page)
}
```

**Full JSX:**
```jsx
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
```

---

### 11.6 `src/components/EmptyState.jsx`

**Props:**
```ts
{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}
```

**Full JSX:**
```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="mb-4 text-slate-600">
        {icon || <PackageOpen size={56} strokeWidth={1} />}
      </div>
      <h3 className="text-xl font-display tracking-wide text-slate-300 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-500 text-sm font-body max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-xl text-sm font-body font-medium hover:bg-blue-500/30 transition-colors duration-200"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
```

---

### 11.7 `src/components/ConfirmModal.jsx`

**Props:**
```ts
{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;     // default "Confirm"
  confirmVariant?: "danger" | "primary";  // default "danger"
}
```

**Full JSX:**
```jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen, onClose, onConfirm,
  title, description,
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
}) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const btnClass = confirmVariant === 'danger'
    ? 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30'
    : 'bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 glass-card rounded-2xl p-6 max-w-md w-full"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-red-500/15 text-red-400 flex-shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-lg font-display tracking-wide text-slate-100 mb-1">{title}</h3>
                <p className="text-slate-400 text-sm font-body">{description}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-body font-medium text-slate-400 border border-surface-border rounded-xl hover:text-slate-300 hover:border-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className={`px-4 py-2 text-sm font-body font-medium border rounded-xl transition-colors ${btnClass}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

### 11.8 `src/components/FileUploader.jsx`

**Props:**
```ts
{
  onFile: (file: File) => void;
  accept?: string;           // default ".xlsx,.xls"
  label?: string;
  isLoading?: boolean;
  fileName?: string | null;
  error?: string | null;
}
```

**Behavior:**
- Renders a dashed-border drop zone.
- Accepts drag & drop: on `dragover` adds `drag-over` class (CSS in index.css); on `drop` calls `onFile(droppedFile)`.
- Also renders a hidden `<input type="file">` triggered by clicking the zone.
- Shows spinner when `isLoading=true`.
- Shows `fileName` with a check icon when a file is loaded.
- Shows `error` in red if present.

**Full JSX:**
```jsx
import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export default function FileUploader({
  onFile,
  accept = '.xlsx,.xls',
  label = 'Drop your Excel file here',
  isLoading = false,
  fileName = null,
  error = null,
}) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onFile(file);
  };

  return (
    <div>
      <div
        onClick={() => !isLoading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center gap-3
          border-2 border-dashed rounded-2xl p-10
          cursor-pointer transition-all duration-200 select-none
          ${isDragOver
            ? 'border-blue-500 bg-blue-500/8'
            : fileName && !error
              ? 'border-emerald-500/50 bg-emerald-500/5'
              : error
                ? 'border-red-500/50 bg-red-500/5'
                : 'border-surface-border bg-surface-card hover:border-slate-500 hover:bg-surface-hover'
          }
        `}
      >
        {isLoading ? (
          <>
            <Loader2 size={40} className="text-blue-400 animate-spin" />
            <p className="text-slate-400 text-sm font-body">Parsing Excel file…</p>
          </>
        ) : fileName && !error ? (
          <>
            <CheckCircle size={40} className="text-emerald-400" />
            <p className="text-emerald-300 font-body font-medium text-sm">{fileName}</p>
            <p className="text-slate-500 text-xs">Click to replace file</p>
          </>
        ) : error ? (
          <>
            <AlertCircle size={40} className="text-red-400" />
            <p className="text-red-400 font-body text-sm">{error}</p>
            <p className="text-slate-500 text-xs">Click to try again</p>
          </>
        ) : (
          <>
            <div className="p-4 rounded-2xl bg-surface-border">
              <FileSpreadsheet size={36} className="text-blue-400" />
            </div>
            <div className="text-center">
              <p className="text-slate-300 font-body font-medium">{label}</p>
              <p className="text-slate-500 text-sm mt-1">or click to browse — .xlsx, .xls accepted</p>
            </div>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          aria-label="File upload input"
        />
      </div>
    </div>
  );
}
```

---

### 11.9 `src/components/ImageUploader.jsx`

**Props:**
```ts
{
  onFiles: (files: FileList | File[]) => void;
  onZip: (file: File) => void;
  uploadedImages: { [filename: string]: string };
  onRemove: (filename: string) => void;
  isLoading?: boolean;
  error?: string | null;
  warning?: string | null;
  totalSize?: string;
}
```

**Full JSX layout:**
```jsx
import React, { useRef, useState } from 'react';
import { Images, ZipIcon, Trash2, Loader2, AlertCircle, AlertTriangle, HardDrive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageUploader({
  onFiles, onZip, uploadedImages, onRemove,
  isLoading = false, error = null, warning = null, totalSize = '0 B',
}) {
  const imgInputRef = useRef(null);
  const zipInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const zipFile = files.find((f) => f.name.toLowerCase().endsWith('.zip'));
    if (zipFile) {
      onZip(zipFile);
    } else {
      onFiles(files);
    }
  };

  const imageEntries = Object.entries(uploadedImages);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center gap-3 p-8
          border-2 border-dashed rounded-2xl transition-all duration-200
          ${isDragOver ? 'border-violet-500 bg-violet-500/8' : 'border-surface-border bg-surface-card'}
        `}
      >
        {isLoading ? (
          <Loader2 size={36} className="text-violet-400 animate-spin" />
        ) : (
          <Images size={36} className="text-violet-400" />
        )}
        <div className="text-center">
          <p className="text-slate-300 font-body font-medium">Drop images or a ZIP file here</p>
          <p className="text-slate-500 text-xs mt-1">PNG, JPG, WEBP — or a single .zip containing all images</p>
        </div>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => imgInputRef.current?.click()}
            className="px-4 py-2 text-sm font-body font-medium text-violet-400 border border-violet-500/40 rounded-xl hover:bg-violet-500/10 transition-colors"
          >
            Browse Images
          </button>
          <button
            onClick={() => zipInputRef.current?.click()}
            className="px-4 py-2 text-sm font-body font-medium text-slate-400 border border-surface-border rounded-xl hover:bg-surface-hover transition-colors flex items-center gap-1.5"
          >
            <ZipIcon size={14} />
            Upload ZIP
          </button>
        </div>

        <input ref={imgInputRef} type="file" accept="image/*" multiple onChange={(e) => onFiles(e.target.files)} className="hidden" />
        <input ref={zipInputRef} type="file" accept=".zip" onChange={(e) => onZip(e.target.files[0])} className="hidden" />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-body">
          <AlertCircle size={15} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Warning */}
      {warning && (
        <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm font-body">
          <AlertTriangle size={15} className="flex-shrink-0" />
          {warning}
        </div>
      )}

      {/* Image thumbnails grid */}
      {imageEntries.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-300 text-sm font-body font-medium">
              {imageEntries.length} image{imageEntries.length !== 1 ? 's' : ''} loaded
            </p>
            <span className="flex items-center gap-1 text-slate-500 text-xs">
              <HardDrive size={12} /> ~{totalSize}
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            <AnimatePresence>
              {imageEntries.map(([filename, src]) => (
                <motion.div
                  key={filename}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group rounded-xl overflow-hidden bg-surface-border aspect-square"
                >
                  <img
                    src={src}
                    alt={filename}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                    <p className="text-white text-[9px] text-center leading-tight break-all">{filename}</p>
                    <button
                      onClick={() => onRemove(filename)}
                      className="p-1 bg-red-500/80 rounded-lg text-white hover:bg-red-500 transition-colors"
                      aria-label={`Remove ${filename}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### 11.10 `src/components/BrandCard.jsx`

**Props:**
```ts
{
  brand: {
    brand_id: string;
    brand_name: string;
    logo_filename: string;
    country: string;
    description: string;
    founded_year: number;
    website?: string;
  };
  modelCount: number;
  logoSrc: string | null;   // base64 or null
  colorConfig: { primary: string; secondary: string; gradient: string };
  onClick: () => void;
  index: number;            // for stagger animation delay
}
```

**Full JSX:**
```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Calendar, ChevronRight } from 'lucide-react';
import { COUNTRY_FLAGS } from '../utils/constants'; // map of country → emoji flag

export default function BrandCard({ brand, modelCount, logoSrc, colorConfig, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.03, y: -4 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="cursor-pointer group relative overflow-hidden rounded-2xl"
      style={{
        boxShadow: `0 4px 24px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig.gradient} opacity-90`} />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-grid-texture opacity-30" />

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col items-center text-center gap-4">
        {/* Logo circle */}
        <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
          {logoSrc ? (
            <img src={logoSrc} alt={`${brand.brand_name} logo`} className="w-14 h-14 object-contain" />
          ) : (
            <span className="text-2xl font-display text-slate-800">{brand.brand_name.charAt(0)}</span>
          )}
        </div>

        {/* Brand name */}
        <h3 className="text-white font-display text-2xl tracking-widest uppercase leading-tight">
          {brand.brand_name}
        </h3>

        {/* Meta row */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1.5 text-white/80 text-sm font-body">
            <span>{getCountryFlag(brand.country)}</span>
            <span>{brand.country}</span>
          </div>
          <div className="flex items-center gap-1 text-white/70 text-xs font-body">
            <Calendar size={11} />
            <span>Est. {brand.founded_year}</span>
          </div>
        </div>

        {/* Models count pill */}
        <div className="mt-auto px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-sm font-body font-medium flex items-center gap-2">
          <span>{modelCount === 0 ? 'No models yet' : `${modelCount} Model${modelCount !== 1 ? 's' : ''}`}</span>
          {modelCount > 0 && <ChevronRight size={14} />}
        </div>
      </div>

      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.15), 0 0 32px ${colorConfig.primary}55` }}
      />
    </motion.div>
  );
}

function getCountryFlag(country) {
  const flagMap = {
    Japan: '🇯🇵', Germany: '🇩🇪', USA: '🇺🇸', 'United States': '🇺🇸',
    South Korea: '🇰🇷', Italy: '🇮🇹', France: '🇫🇷', Sweden: '🇸🇪',
    India: '🇮🇳', China: '🇨🇳', UK: '🇬🇧', 'United Kingdom': '🇬🇧',
    Czechia: '🇨🇿', Romania: '🇷🇴', Spain: '🇪🇸', Netherlands: '🇳🇱',
  };
  return flagMap[country] || '🌐';
}
```

---

### 11.11 `src/components/ModelCard.jsx`

**Props:**
```ts
{
  model: {
    model_id: string;
    model_name: string;
    image_filename: string;
    year: number;
    category: string;
    engine_type: string;
    fuel_type: string;
    transmission: string;
    price_range: string;
    horsepower: number;
    seating_capacity: number;
  };
  imageSrc: string | null;
  brandColor: string;    // hex primary color
  onClick: () => void;
  index: number;
}
```

**Full JSX:**
```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Fuel, Settings2, Users, Zap, DollarSign } from 'lucide-react';
import { MODEL_CATEGORY_COLORS } from '../utils/constants';

const FUEL_ICONS = { Petrol: '⛽', Diesel: '🛢️', Electric: '⚡', Hybrid: '🔋' };

export default function ModelCard({ model, imageSrc, brandColor, onClick, index }) {
  const categoryClass = MODEL_CATEGORY_COLORS[model.category] || 'bg-slate-500/20 text-slate-300 border border-slate-500/40';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer group"
      style={{ '--brand-color': brandColor }}
    >
      {/* Car image */}
      <div className="relative h-48 bg-surface-border overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={model.model_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-30">🚗</span>
          </div>
        )}
        {/* Category badge overlay */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-lg ${categoryClass}`}>
            {model.category}
          </span>
        </div>
        {/* Year badge overlay */}
        <div className="absolute top-3 right-3">
          <span className="text-xs font-body font-medium px-2.5 py-1 rounded-lg bg-black/60 text-white/90 border border-white/10">
            {model.year}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 space-y-3">
        <h3 className="font-display text-xl tracking-wide text-slate-100">{model.model_name}</h3>

        <div className="grid grid-cols-2 gap-2 text-xs font-body text-slate-400">
          <div className="flex items-center gap-1.5">
            <Settings2 size={12} className="text-slate-500" />
            <span className="truncate">{model.engine_type}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel size={12} className="text-slate-500" />
            <span>{FUEL_ICONS[model.fuel_type] || ''} {model.fuel_type}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={12} className="text-slate-500" />
            <span>{model.horsepower} HP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={12} className="text-slate-500" />
            <span>{model.seating_capacity} seats</span>
          </div>
        </div>

        {/* Price */}
        <div
          className="text-sm font-body font-semibold pt-1 border-t border-surface-border"
          style={{ color: brandColor }}
        >
          {model.price_range}
        </div>
      </div>
    </motion.div>
  );
}
```

---

### 11.12 `src/components/PartCard.jsx`

**Props:**
```ts
{
  part: {
    part_id: string;
    part_name: string;
    part_category: string;
    part_image_filename: string;
    stock_status: string;
    oem_number: string;
    manufacturer: string;
    price_inr: number;
  };
  imageSrc: string | null;
  onClick: () => void;
  index: number;
}
```

**Full JSX:**
```jsx
import React from 'react';
import { motion } from 'framer-motion';
import StockBadge from './StockBadge';
import { CATEGORY_COLORS } from '../utils/constants';

export default function PartCard({ part, imageSrc, onClick, index }) {
  const catColor = CATEGORY_COLORS[part.part_category] || CATEGORY_COLORS['Engine'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="glass-card rounded-2xl p-5 cursor-pointer group flex flex-col items-center gap-4 text-center"
    >
      {/* Part image */}
      <div className="w-36 h-36 rounded-xl overflow-hidden bg-surface-border flex items-center justify-center flex-shrink-0">
        {imageSrc ? (
          <img src={imageSrc} alt={part.part_name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="text-5xl opacity-20">🔩</span>
        )}
      </div>

      {/* Category tag */}
      <span className={`text-xs px-2.5 py-1 rounded-full font-body font-medium border ${catColor.bg} ${catColor.text} ${catColor.border}`}>
        {part.part_category}
      </span>

      {/* Part name */}
      <h4 className="font-body font-semibold text-slate-100 text-sm leading-tight">{part.part_name}</h4>

      {/* OEM */}
      <p className="font-mono text-slate-500 text-xs">{part.oem_number}</p>

      {/* Manufacturer */}
      <p className="text-slate-400 text-xs">{part.manufacturer}</p>

      {/* Stock badge */}
      <StockBadge status={part.stock_status} size="sm" />

      {/* Price */}
      <p className="text-slate-200 font-body font-semibold text-sm">
        ₹{Number(part.price_inr).toLocaleString('en-IN')}
      </p>
    </motion.div>
  );
}
```

---

### 11.13 `src/components/SpecTable.jsx`

**Props:**
```ts
{
  specifications: Array<{
    spec_id: string;
    spec_name: string;
    spec_value: number;
    unit: string;
    standard_value: number;
    tolerance_plus: number;
    tolerance_minus: number;
    condition: "Normal" | "Warning" | "Critical";
    notes?: string;
  }>;
}
```

**Full JSX:**
```jsx
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
```

---

### 11.14 `src/components/SpecChart.jsx`

**Props:**
```ts
{
  specifications: Array<{
    spec_name: string;
    spec_value: number;
    standard_value: number;
    unit: string;
    condition: "Normal" | "Warning" | "Critical";
  }>;
  brandColor?: string;  // hex, used for "Actual" bar color
}
```

**Full JSX:**
```jsx
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
```

---

### 11.15 `src/components/Navbar.jsx`

**Props:**
```ts
{
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}
```

**Full JSX:**
```jsx
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
```

---

## 12. Pages

### 12.1 `src/pages/BrandsPage.jsx`

**Full description:**
- Renders `<Navbar showSearch searchValue onSearchChange />`.
- Below navbar: `max-w-7xl mx-auto px-4 sm:px-6 py-10` container.
- Hero section: `<h1 className="font-display text-5xl sm:text-7xl tracking-widest text-slate-100 uppercase">Select a Brand</h1>` with an animated underline `<div className="h-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full mt-2 animate-underline-grow" />`.
- Below hero: brand grid `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">`.
- Filter: `searchQuery` state — filter brands where `brand_name.toLowerCase().includes(searchQuery.toLowerCase())`.
- For each filtered brand, render `<BrandCard>` with: `brand`, `modelCount={models.filter(m => m.brand_id === brand.brand_id).length}`, `logoSrc={getImage(brand.logo_filename)}`, `colorConfig={getBrandColor(brand.brand_id)}`, `onClick={() => { setSelectedBrand(brand.brand_id); navigate('/brands/' + brand.brand_id + '/models'); }}`, `index={i}`.
- If `brands.length === 0`: render `<EmptyState icon={<Car size={56} strokeWidth={1} />} title="No Data Loaded" description="Upload an Excel file to get started." action={{ label: "Go to Admin", onClick: () => navigate('/admin') }} />`.
- If `brands.length > 0` but filtered result is empty: render `<EmptyState title="No brands match your search" description='Try a different search term.' />`.

**Full JSX:**
```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';
import Navbar from '../components/Navbar';
import BrandCard from '../components/BrandCard';
import EmptyState from '../components/EmptyState';
import useAutoStore from '../store/useAutoStore';

export default function BrandsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const brands         = useAutoStore((s) => s.brands);
  const models         = useAutoStore((s) => s.models);
  const getBrandColor  = useAutoStore((s) => s.getBrandColor);
  const getImage       = useAutoStore((s) => s.getImage);
  const setSelectedBrand = useAutoStore((s) => s.setSelectedBrand);
  const brandColors    = useAutoStore((s) => s.brandColors);

  const filteredBrands = brands.filter((b) =>
    b.brand_name.toLowerCase().includes(search.toLowerCase()) ||
    b.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleBrandClick = (brand_id) => {
    setSelectedBrand(brand_id);
    navigate(`/brands/${brand_id}/models`);
  };

  return (
    <div className="min-h-screen bg-surface-bg bg-grid-texture">
      <Navbar showSearch searchValue={search} onSearchChange={setSearch} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="font-display text-5xl sm:text-7xl tracking-widest text-slate-100 uppercase">
            Select a Brand
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full mt-3" />
          <p className="text-slate-500 font-body text-sm mt-3">
            {brands.length} brand{brands.length !== 1 ? 's' : ''} loaded
          </p>
        </div>

        {/* Empty state — no data */}
        {brands.length === 0 && (
          <EmptyState
            icon={<Car size={56} strokeWidth={1} />}
            title="No Data Loaded"
            description="Upload an Excel file in the Admin Panel to get started."
            action={{ label: 'Go to Admin Panel', onClick: () => navigate('/admin') }}
          />
        )}

        {/* Empty state — no search results */}
        {brands.length > 0 && filteredBrands.length === 0 && (
          <EmptyState
            title="No brands match your search"
            description={`No results for "${search}". Try a different term.`}
            action={{ label: 'Clear Search', onClick: () => setSearch('') }}
          />
        )}

        {/* Brand grid */}
        {filteredBrands.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBrands.map((brand, i) => (
              <BrandCard
                key={brand.brand_id}
                brand={brand}
                modelCount={models.filter((m) => m.brand_id === brand.brand_id).length}
                logoSrc={getImage(brand.logo_filename)}
                colorConfig={getBrandColor(brand.brand_id)}
                onClick={() => handleBrandClick(brand.brand_id)}
                index={i}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
```

---

### 12.2 `src/pages/ModelsPage.jsx`

**Full description:**
- Uses `useParams()` to get `brandId`.
- On mount, if brand not found → `navigate('/brands')`.
- Sets `selectedBrand(brandId)` on mount via `useEffect`.
- Renders `<Navbar />`.
- Below navbar, full-width brand banner: `<div className="w-full bg-gradient-to-r ${colorConfig.gradient} py-10 px-6">` containing logo + brand name + description.
- Below banner: `max-w-7xl mx-auto px-4 sm:px-6 py-8`.
- `<Breadcrumb crumbs={[{ label: brand.brand_name }]} />`.
- Filter bar: `<FilterTabs tabs={categoryTabs} active={activeCategory} onSelect={setActiveCategory} />` + fuel type `<select>` + year range state.
- `categoryTabs` = `[{ label: 'All', value: 'all' }, ...unique categories from models]`.
- Filtered models: filter by `activeCategory` (if not 'all'), `activeFuel` (if not 'all'), year range.
- Models grid: `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">`.
- For each model render `<ModelCard>` with appropriate props.
- Click: `navigate('/brands/${brandId}/models/${model.model_id}/parts')`.

**Full JSX:**
```jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import FilterTabs from '../components/FilterTabs';
import ModelCard from '../components/ModelCard';
import EmptyState from '../components/EmptyState';
import useAutoStore from '../store/useAutoStore';

export default function ModelsPage() {
  const { brandId } = useParams();
  const navigate    = useNavigate();

  const getBrandById   = useAutoStore((s) => s.getBrandById);
  const getModelsForBrand = useAutoStore((s) => s.getModelsForBrand);
  const getBrandColor  = useAutoStore((s) => s.getBrandColor);
  const getImage       = useAutoStore((s) => s.getImage);
  const setSelectedBrand = useAutoStore((s) => s.setSelectedBrand);
  const setSelectedModel = useAutoStore((s) => s.setSelectedModel);

  const brand  = getBrandById(brandId);
  const models = getModelsForBrand(brandId);
  const colorConfig = getBrandColor(brandId);

  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFuel, setActiveFuel]         = useState('all');

  useEffect(() => {
    if (!brand) { navigate('/brands'); return; }
    setSelectedBrand(brandId);
  }, [brandId]);

  const categories = useMemo(() => {
    const cats = [...new Set(models.map((m) => m.category))];
    return [{ label: 'All', value: 'all', count: models.length },
      ...cats.map((c) => ({ label: c, value: c, count: models.filter((m) => m.category === c).length }))];
  }, [models]);

  const fuels = useMemo(() => ['all', ...[...new Set(models.map((m) => m.fuel_type))]], [models]);

  const filteredModels = useMemo(() => models.filter((m) => {
    if (activeCategory !== 'all' && m.category !== activeCategory) return false;
    if (activeFuel !== 'all' && m.fuel_type !== activeFuel)       return false;
    return true;
  }), [models, activeCategory, activeFuel]);

  if (!brand) return null;

  return (
    <div className="min-h-screen bg-surface-bg bg-grid-texture">
      <Navbar />

      {/* Brand banner */}
      <div className={`w-full bg-gradient-to-r ${colorConfig.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-grid-texture opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden">
            {getImage(brand.logo_filename) ? (
              <img src={getImage(brand.logo_filename)} alt={brand.brand_name} className="w-14 h-14 object-contain" />
            ) : (
              <span className="text-2xl font-display text-slate-800">{brand.brand_name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h1 className="font-display text-4xl sm:text-5xl tracking-widest text-white uppercase">{brand.brand_name}</h1>
            <p className="text-white/70 font-body text-sm mt-1 max-w-xl">{brand.description}</p>
            <p className="text-white/50 font-body text-xs mt-1">{brand.country} · Est. {brand.founded_year}</p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb crumbs={[{ label: brand.brand_name }]} />

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <FilterTabs tabs={categories} active={activeCategory} onSelect={setActiveCategory} />
          <select
            value={activeFuel}
            onChange={(e) => setActiveFuel(e.target.value)}
            className="px-3 py-2 text-sm font-body bg-surface-card border border-surface-border rounded-xl text-slate-300 focus:outline-none focus:border-blue-500/60 cursor-pointer"
          >
            {fuels.map((f) => <option key={f} value={f}>{f === 'all' ? 'All Fuel Types' : f}</option>)}
          </select>
        </div>

        {/* Count */}
        <p className="text-slate-500 text-sm font-body mt-4 mb-6">
          Showing {filteredModels.length} of {models.length} model{models.length !== 1 ? 's' : ''}
        </p>

        {/* Grid */}
        {filteredModels.length === 0 ? (
          <EmptyState
            title="No models match the filters"
            description="Try removing a filter to see more results."
            action={{ label: 'Reset Filters', onClick: () => { setActiveCategory('all'); setActiveFuel('all'); }}}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model, i) => (
              <ModelCard
                key={model.model_id}
                model={model}
                imageSrc={getImage(model.image_filename)}
                brandColor={colorConfig.primary}
                onClick={() => { setSelectedModel(model.model_id); navigate(`/brands/${brandId}/models/${model.model_id}/parts`); }}
                index={i}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
```

---

### 12.3 `src/pages/PartsPage.jsx`

**Full description:**
- Uses `useParams()` → `{ brandId, modelId }`.
- On mount: if brand or model not found → navigate to appropriate parent.
- Sets `selectedModel(modelId)`.
- Layout: Navbar → Breadcrumb → Model info card → Category filter tabs + search bar → Parts grid.
- **Model info card:** `flex` row on desktop (car image left 280px, specs right). If no image: placeholder. Specs: engine, fuel, transmission, HP, torque, seats, price_range. Displayed as icon+label grid.
- **Category tabs:** `[{ label: 'All', value: 'all' }, ...PART_CATEGORIES]` where `PART_CATEGORIES = ['Engine','Body','Interior','Electrical','Suspension','Transmission']`. Use `CATEGORY_COLORS` for active tab color.
- **Search:** filters by `part_name` OR `oem_number`.
- Parts grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5`.
- Click part → `navigate('/brands/${brandId}/models/${modelId}/parts/${part.part_id}/specs')`.

**Full JSX:**
```jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Zap, Settings2, Fuel, Users, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import FilterTabs from '../components/FilterTabs';
import SearchBar from '../components/SearchBar';
import PartCard from '../components/PartCard';
import EmptyState from '../components/EmptyState';
import { CATEGORY_COLORS } from '../utils/constants';
import useAutoStore from '../store/useAutoStore';

const PART_CATEGORIES = ['Engine','Body','Interior','Electrical','Suspension','Transmission'];

export default function PartsPage() {
  const { brandId, modelId } = useParams();
  const navigate = useNavigate();

  const getBrandById   = useAutoStore((s) => s.getBrandById);
  const getModelById   = useAutoStore((s) => s.getModelById);
  const getPartsForModel = useAutoStore((s) => s.getPartsForModel);
  const getBrandColor  = useAutoStore((s) => s.getBrandColor);
  const getImage       = useAutoStore((s) => s.getImage);
  const setSelectedModel = useAutoStore((s) => s.setSelectedModel);
  const setSelectedPart  = useAutoStore((s) => s.setSelectedPart);

  const brand = getBrandById(brandId);
  const model = getModelById(modelId);
  const parts = getPartsForModel(modelId);
  const colorConfig = getBrandColor(brandId);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery]       = useState('');

  useEffect(() => {
    if (!brand) { navigate('/brands'); return; }
    if (!model) { navigate(`/brands/${brandId}/models`); return; }
    setSelectedModel(modelId);
  }, [modelId]);

  const categoryTabs = useMemo(() => [
    { label: 'All', value: 'all', count: parts.length },
    ...PART_CATEGORIES
      .filter((c) => parts.some((p) => p.part_category === c))
      .map((c) => ({ label: c, value: c, count: parts.filter((p) => p.part_category === c).length })),
  ], [parts]);

  const filteredParts = useMemo(() => parts.filter((p) => {
    const matchCat    = activeCategory === 'all' || p.part_category === activeCategory;
    const q           = searchQuery.toLowerCase();
    const matchSearch = !q || p.part_name.toLowerCase().includes(q) || p.oem_number.toLowerCase().includes(q);
    return matchCat && matchSearch;
  }), [parts, activeCategory, searchQuery]);

  if (!brand || !model) return null;

  const modelImageSrc = getImage(model.image_filename);

  return (
    <div className="min-h-screen bg-surface-bg bg-grid-texture">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <Breadcrumb
          crumbs={[
            { label: brand.brand_name, href: `/brands/${brandId}/models` },
            { label: model.model_name },
          ]}
        />

        {/* Model hero card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Car image */}
          <div className="md:w-72 h-52 md:h-auto bg-surface-border flex-shrink-0 relative overflow-hidden">
            {modelImageSrc ? (
              <img src={modelImageSrc} alt={model.model_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><span className="text-7xl opacity-20">🚗</span></div>
            )}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorConfig.gradient}`} />
          </div>

          {/* Specs */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-display text-3xl tracking-widest text-slate-100 uppercase">{model.model_name}</h2>
                <p className="text-slate-500 font-body text-sm">{model.year} · {model.category}</p>
              </div>
              <span
                className="text-lg font-body font-semibold px-4 py-1.5 rounded-xl border"
                style={{ color: colorConfig.primary, borderColor: colorConfig.primary + '40', backgroundColor: colorConfig.primary + '15' }}
              >
                {model.price_range}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
              {[
                { icon: <Settings2 size={15} />, label: 'Engine',       value: model.engine_type },
                { icon: <Fuel size={15} />,      label: 'Fuel',         value: model.fuel_type   },
                { icon: <Settings2 size={15} />, label: 'Transmission', value: model.transmission },
                { icon: <Zap size={15} />,       label: 'Power',        value: `${model.horsepower} HP` },
                { icon: <Zap size={15} />,       label: 'Torque',       value: model.torque      },
                { icon: <Users size={15} />,     label: 'Seating',      value: `${model.seating_capacity} seats` },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-2">
                  <span className="text-slate-500 mt-0.5">{icon}</span>
                  <div>
                    <p className="text-slate-500 text-xs font-body">{label}</p>
                    <p className="text-slate-200 text-sm font-body font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <FilterTabs tabs={categoryTabs} active={activeCategory} onSelect={setActiveCategory} colorMap={CATEGORY_COLORS} className="flex-wrap" />
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by name or OEM…" className="sm:ml-auto w-full sm:w-64" />
        </div>

        {/* Parts count */}
        <p className="text-slate-500 text-sm font-body">
          {filteredParts.length} part{filteredParts.length !== 1 ? 's' : ''} found
          {parts.length === 0 && ' — no parts added for this model yet'}
        </p>

        {/* Parts grid */}
        {filteredParts.length === 0 ? (
          <EmptyState
            title={parts.length === 0 ? 'No Parts for This Model' : 'No parts match filters'}
            description={parts.length === 0
              ? 'Add parts to the Parts sheet in your Excel file.'
              : 'Clear the search or change the category filter.'}
            action={parts.length > 0 ? { label: 'Clear Filters', onClick: () => { setActiveCategory('all'); setSearchQuery(''); } } : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredParts.map((part, i) => (
              <PartCard
                key={part.part_id}
                part={part}
                imageSrc={getImage(part.part_image_filename)}
                onClick={() => { setSelectedPart(part.part_id); navigate(`/brands/${brandId}/models/${modelId}/parts/${part.part_id}/specs`); }}
                index={i}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
```

---

### 12.4 `src/pages/SpecsPage.jsx`

**Full description:**
- Uses `useParams()` → `{ brandId, modelId, partId }`.
- On mount: validates brand, model, part exist — redirects to parent if not.
- Sets `selectedPart(partId)`.
- Layout: Navbar → Breadcrumb → Part hero card → Specs section → Spec chart → Action buttons.
- **Part hero:** Image left (192×192px, object-contain, white-bg rounded-2xl) + info right. Info includes: part name, OEM (monospace), manufacturer, category badge, weight, warranty, price, `<StockBadge status={part.stock_status} size="lg" />`.
- **Specs table:** `<SpecTable specifications={specs} />`.
- **Chart:** `<SpecChart specifications={specs} brandColor={colorConfig.primary} />`.
- **Actions row:**
  1. "← Back to Parts" button: `navigate(-1)`.
  2. "Export to Excel" button: calls `exportSpecsToExcel(part, specs, model, brand)`.
  3. "Print Page" button: calls `window.print()`.

**Full JSX:**
```jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Printer, Package } from 'lucide-react';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import SpecTable from '../components/SpecTable';
import SpecChart from '../components/SpecChart';
import StockBadge from '../components/StockBadge';
import EmptyState from '../components/EmptyState';
import { exportSpecsToExcel } from '../utils/exportHelper';
import { CATEGORY_COLORS } from '../utils/constants';
import useAutoStore from '../store/useAutoStore';

export default function SpecsPage() {
  const { brandId, modelId, partId } = useParams();
  const navigate = useNavigate();

  const getBrandById   = useAutoStore((s) => s.getBrandById);
  const getModelById   = useAutoStore((s) => s.getModelById);
  const getPartById    = useAutoStore((s) => s.getPartById);
  const getSpecsForPart = useAutoStore((s) => s.getSpecsForPart);
  const getBrandColor  = useAutoStore((s) => s.getBrandColor);
  const getImage       = useAutoStore((s) => s.getImage);
  const setSelectedPart = useAutoStore((s) => s.setSelectedPart);

  const brand = getBrandById(brandId);
  const model = getModelById(modelId);
  const part  = getPartById(partId);
  const specs = getSpecsForPart(partId);
  const colorConfig = getBrandColor(brandId);

  useEffect(() => {
    if (!brand) { navigate('/brands'); return; }
    if (!model) { navigate(`/brands/${brandId}/models`); return; }
    if (!part)  { navigate(`/brands/${brandId}/models/${modelId}/parts`); return; }
    setSelectedPart(partId);
  }, [partId]);

  if (!brand || !model || !part) return null;

  const partImageSrc = getImage(part.part_image_filename);
  const catColor = CATEGORY_COLORS[part.part_category] || CATEGORY_COLORS['Engine'];

  return (
    <div className="min-h-screen bg-surface-bg bg-grid-texture">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 print:py-4">
        {/* Breadcrumb — hidden on print */}
        <div className="print:hidden">
          <Breadcrumb
            crumbs={[
              { label: brand.brand_name, href: `/brands/${brandId}/models` },
              { label: model.model_name, href: `/brands/${brandId}/models/${modelId}/parts` },
              { label: part.part_name },
            ]}
          />
        </div>

        {/* Part hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row gap-6"
        >
          {/* Image */}
          <div className="w-48 h-48 rounded-2xl bg-white/95 flex items-center justify-center flex-shrink-0 self-center overflow-hidden">
            {partImageSrc ? (
              <img src={partImageSrc} alt={part.part_name} className="w-40 h-40 object-contain" />
            ) : (
              <Package size={64} className="text-slate-300 opacity-40" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-body font-medium border ${catColor.bg} ${catColor.text} ${catColor.border}`}>
                  {part.part_category}
                </span>
                <h1 className="font-display text-3xl sm:text-4xl tracking-wide text-slate-100 mt-2 uppercase">
                  {part.part_name}
                </h1>
                <p className="text-slate-500 font-body text-sm">{model.model_name} · {brand.brand_name}</p>
              </div>
              <StockBadge status={part.stock_status} size="lg" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              {[
                { label: 'OEM Number',  value: part.oem_number,   mono: true  },
                { label: 'Manufacturer',value: part.manufacturer,  mono: false },
                { label: 'Part ID',     value: part.part_id,       mono: true  },
                { label: 'Weight',      value: `${part.weight_kg} kg`, mono: false },
                { label: 'Warranty',    value: `${part.warranty_months} months`, mono: false },
                { label: 'Price (INR)', value: `₹${Number(part.price_inr).toLocaleString('en-IN')}`, mono: false },
              ].map(({ label, value, mono }) => (
                <div key={label}>
                  <p className="text-slate-500 text-xs font-body">{label}</p>
                  <p className={`text-slate-200 text-sm font-medium mt-0.5 ${mono ? 'font-mono' : 'font-body'}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Specifications section */}
        <div>
          <h2 className="font-display text-2xl tracking-wider text-slate-100 uppercase mb-4">Specifications</h2>

          {specs.length === 0 ? (
            <EmptyState title="No Specifications" description="No specification data found for this part." />
          ) : (
            <>
              <SpecTable specifications={specs} />

              {/* Chart */}
              <div className="glass-card rounded-2xl p-6 mt-6">
                <h3 className="font-body font-semibold text-slate-300 mb-4">Actual vs Standard Values</h3>
                <SpecChart specifications={specs} brandColor={colorConfig.primary} />
              </div>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pb-10 print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm text-slate-400 border border-surface-border hover:text-slate-200 hover:border-slate-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Parts
          </button>
          <button
            onClick={() => exportSpecsToExcel(part, specs, model, brand)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm text-emerald-400 border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
          >
            <Download size={16} /> Export to Excel
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm text-blue-400 border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
          >
            <Printer size={16} /> Print Page
          </button>
        </div>
      </main>
    </div>
  );
}
```

---

### 12.5 `src/pages/AdminPanel.jsx`

**Full description:**

The AdminPanel has 5 major sections stacked vertically inside a `max-w-4xl mx-auto px-4 sm:px-6 py-10` container.

**Section 1 — Header**
- `<h1 className="font-display text-4xl tracking-widest text-slate-100 uppercase">Admin Panel</h1>`
- Subtitle: `<p className="text-slate-500 font-body text-sm">Upload data, manage images, configure the dashboard</p>`
- If data is loaded: show green "Data Loaded" badge + "View Dashboard" button linking to `/brands`.

**Section 2 — Excel Upload**
- Section card: `glass-card rounded-2xl p-6 space-y-4`
- Header: `<h2>` with FileSpreadsheet icon
- `<FileUploader>` wired to `useExcelUpload` hook
- After parsing: show 4 preview cards — one per sheet
  - Each preview card shows sheet name, row count, and a mini table (first 5 data rows, first 4 columns)
  - Use `overflow-x-auto` on the mini table container
- If `parsedData.warnings.length > 0`: show yellow warning list
- "Confirm & Load Data" button: `onClick={confirmLoad}` → then `navigate('/brands')`
  - Disabled when `parsedData === null` or `isLoading`
  - Full width, `bg-gradient-to-r from-blue-500 to-violet-600 text-white font-body font-semibold py-3 rounded-xl`

**Section 3 — Image Upload**
- Section card: `glass-card rounded-2xl p-6 space-y-4`
- Header with Images icon
- `<ImageUploader>` wired to `useImageUpload` hook
- "Save Images" button: `onClick={confirmSave}` → shows toast or inline confirmation
  - Disabled when `Object.keys(uploadedImages).length === 0`

**Section 4 — Data Overview** (only shown if `isDataLoaded`)
- 4 `<StatCard>` in a `grid grid-cols-2 sm:grid-cols-4 gap-4` grid:
  - Brands: count, Car icon, text-blue-400
  - Models: count, Settings2 icon, text-violet-400
  - Parts: count, Package icon, text-emerald-400
  - Specs: count, BarChart2 icon, text-amber-400
- Low Stock list: `parts.filter(p => p.stock_status === 'Low')` — shown as rows with part name, model name, OEM, amber badge
- Out of Stock list: similar with red badge

**Section 5 — Danger Zone**
- Theme toggle switch: controlled by `theme` / `setTheme`
- "Reset All Data" button → opens `<ConfirmModal>` with title "Reset All Data?" and description "This will delete all loaded brands, models, parts, specifications, and images from this browser."
  - On confirm: `clearAll()` then `navigate('/admin')`

**Full JSX:**
```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car, FileSpreadsheet, Images, BarChart2, Package, Settings2,
  CheckCircle2, AlertTriangle, Trash2, Sun, Moon, ExternalLink,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import FileUploader from '../components/FileUploader';
import ImageUploader from '../components/ImageUploader';
import StatCard from '../components/StatCard';
import ConfirmModal from '../components/ConfirmModal';
import { useExcelUpload } from '../hooks/useExcelUpload';
import { useImageUpload } from '../hooks/useImageUpload';
import useAutoStore from '../store/useAutoStore';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const isDataLoaded   = useAutoStore((s) => s.isDataLoaded);
  const brands         = useAutoStore((s) => s.brands);
  const models         = useAutoStore((s) => s.models);
  const parts          = useAutoStore((s) => s.parts);
  const specifications = useAutoStore((s) => s.specifications);
  const clearAll       = useAutoStore((s) => s.clearAll);
  const theme          = useAutoStore((s) => s.theme);
  const setTheme       = useAutoStore((s) => s.setTheme);

  const {
    parsedData, isLoading: excelLoading, error: excelError,
    fileName, handleFile, confirmLoad, reset: resetExcel,
  } = useExcelUpload();

  const {
    uploadedImages, isLoading: imgLoading, error: imgError,
    warning: imgWarning, totalSize, handleFiles, handleZip,
    removeImage, confirmSave, reset: resetImages,
  } = useImageUpload();

  const handleConfirmLoad = () => {
    confirmLoad();
    navigate('/brands');
  };

  const handleReset = () => {
    clearAll();
    resetExcel();
    resetImages();
  };

  const lowStockParts = parts.filter((p) => p.stock_status === 'Low');
  const outOfStockParts = parts.filter((p) => p.stock_status === 'Out of Stock');

  // Mini preview table for a parsed sheet
  const PreviewTable = ({ data, maxCols = 4 }) => {
    if (!data || data.length === 0) return <p className="text-slate-500 text-xs py-2">No rows parsed.</p>;
    const keys = Object.keys(data[0]).slice(0, maxCols);
    const rows = data.slice(0, 5);
    return (
      <div className="overflow-x-auto rounded-lg border border-surface-border mt-2">
        <table className="text-xs font-body w-full">
          <thead>
            <tr className="bg-surface-hover">
              {keys.map((k) => <th key={k} className="px-3 py-2 text-left text-slate-500 font-medium whitespace-nowrap">{k}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-surface-border">
                {keys.map((k) => <td key={k} className="px-3 py-2 text-slate-400 truncate max-w-[120px]">{String(row[k] ?? '')}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length > 5 && <p className="px-3 py-1.5 text-slate-600 text-xs">…and {data.length - 5} more rows</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface-bg bg-grid-texture">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div>
          <h1 className="font-display text-4xl tracking-widest text-slate-100 uppercase">Admin Panel</h1>
          <p className="text-slate-500 font-body text-sm mt-1">Upload data, manage images, and configure the dashboard.</p>
          {isDataLoaded && (
            <div className="flex items-center gap-3 mt-4">
              <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-body font-medium">
                <CheckCircle2 size={15} /> Data loaded
              </span>
              <button
                onClick={() => navigate('/brands')}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-body text-blue-400 border border-blue-500/40 hover:bg-blue-500/10 transition-colors"
              >
                <ExternalLink size={13} /> View Dashboard
              </button>
            </div>
          )}
        </div>

        {/* ── Excel Upload ────────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400"><FileSpreadsheet size={20} /></div>
            <div>
              <h2 className="font-body font-semibold text-slate-200">Excel Data Upload</h2>
              <p className="text-slate-500 text-xs">Expects 4 sheets: Brands, Models, Parts, Specifications</p>
            </div>
          </div>

          <FileUploader onFile={handleFile} isLoading={excelLoading} fileName={fileName} error={excelError} />

          {/* Parsed data previews */}
          {parsedData && (
            <div className="space-y-4">
              {/* Warnings */}
              {parsedData.warnings.length > 0 && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1">
                  {parsedData.warnings.map((w, i) => (
                    <div key={i} className="flex items-center gap-2 text-amber-400 text-sm font-body">
                      <AlertTriangle size={13} className="flex-shrink-0" />{w}
                    </div>
                  ))}
                </div>
              )}

              {/* Sheet previews */}
              {[
                { label: 'Brands',         data: parsedData.brands,         color: 'text-blue-400' },
                { label: 'Models',         data: parsedData.models,         color: 'text-violet-400' },
                { label: 'Parts',          data: parsedData.parts,          color: 'text-emerald-400' },
                { label: 'Specifications', data: parsedData.specifications, color: 'text-amber-400' },
              ].map(({ label, data, color }) => (
                <div key={label} className="bg-surface-card rounded-xl p-4 border border-surface-border">
                  <div className="flex items-center justify-between">
                    <span className="font-body font-semibold text-slate-300 text-sm">{label}</span>
                    <span className={`text-xs font-body font-medium ${color}`}>{data.length} rows</span>
                  </div>
                  <PreviewTable data={data} />
                </div>
              ))}

              {/* Confirm button */}
              <button
                onClick={handleConfirmLoad}
                disabled={excelLoading}
                className="w-full py-3 rounded-xl font-body font-semibold text-white bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm & Load Data → Go to Dashboard
              </button>
            </div>
          )}
        </motion.section>

        {/* ── Image Upload ─────────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/15 text-violet-400"><Images size={20} /></div>
            <div>
              <h2 className="font-body font-semibold text-slate-200">Image Upload</h2>
              <p className="text-slate-500 text-xs">Upload logos, car images, part images — or a single ZIP</p>
            </div>
          </div>

          <ImageUploader
            onFiles={handleFiles}
            onZip={handleZip}
            uploadedImages={uploadedImages}
            onRemove={removeImage}
            isLoading={imgLoading}
            error={imgError}
            warning={imgWarning}
            totalSize={totalSize}
          />

          {Object.keys(uploadedImages).length > 0 && (
            <button
              onClick={confirmSave}
              className="w-full py-2.5 rounded-xl font-body font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 transition-all duration-200"
            >
              Save {Object.keys(uploadedImages).length} Image{Object.keys(uploadedImages).length !== 1 ? 's' : ''} to Dashboard
            </button>
          )}
        </motion.section>

        {/* ── Data Overview ─────────────────────────────────────────────────── */}
        {isDataLoaded && (
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="space-y-5">
            <h2 className="font-body font-semibold text-slate-300">Data Overview</h2>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Brands"         value={brands.length}         icon={<Car size={20} />}       color="text-blue-400" />
              <StatCard label="Models"         value={models.length}         icon={<Settings2 size={20} />} color="text-violet-400" />
              <StatCard label="Parts"          value={parts.length}          icon={<Package size={20} />}   color="text-emerald-400" />
              <StatCard label="Specifications" value={specifications.length} icon={<BarChart2 size={20} />} color="text-amber-400" />
            </div>

            {/* Low stock */}
            {lowStockParts.length > 0 && (
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-body font-semibold text-amber-400 text-sm mb-3 flex items-center gap-2">
                  <AlertTriangle size={14} /> Low Stock ({lowStockParts.length})
                </h3>
                <div className="space-y-2">
                  {lowStockParts.slice(0, 10).map((p) => {
                    const m = models.find((m) => m.model_id === p.model_id);
                    return (
                      <div key={p.part_id} className="flex items-center justify-between text-sm font-body">
                        <div>
                          <span className="text-slate-200">{p.part_name}</span>
                          <span className="text-slate-500 text-xs ml-2">{m?.model_name || p.model_id}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500">{p.oem_number}</span>
                      </div>
                    );
                  })}
                  {lowStockParts.length > 10 && <p className="text-slate-600 text-xs">…and {lowStockParts.length - 10} more</p>}
                </div>
              </div>
            )}

            {/* Out of stock */}
            {outOfStockParts.length > 0 && (
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-body font-semibold text-red-400 text-sm mb-3 flex items-center gap-2">
                  <AlertTriangle size={14} /> Out of Stock ({outOfStockParts.length})
                </h3>
                <div className="space-y-2">
                  {outOfStockParts.slice(0, 10).map((p) => {
                    const m = models.find((m) => m.model_id === p.model_id);
                    return (
                      <div key={p.part_id} className="flex items-center justify-between text-sm font-body">
                        <div>
                          <span className="text-slate-200">{p.part_name}</span>
                          <span className="text-slate-500 text-xs ml-2">{m?.model_name || p.model_id}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500">{p.oem_number}</span>
                      </div>
                    );
                  })}
                  {outOfStockParts.length > 10 && <p className="text-slate-600 text-xs">…and {outOfStockParts.length - 10} more</p>}
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* ── Danger Zone ──────────────────────────────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-card rounded-2xl p-6 space-y-5 border-red-500/20">
          <h2 className="font-body font-semibold text-slate-300">Settings & Danger Zone</h2>

          {/* Theme toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-sm font-body">
              {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`
                relative w-12 h-6 rounded-full transition-colors duration-300
                ${theme === 'dark' ? 'bg-blue-500' : 'bg-slate-600'}
              `}
              aria-label="Toggle theme"
            >
              <span
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300
                  ${theme === 'light' ? 'translate-x-6' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* Reset */}
          <div className="flex items-center justify-between pt-3 border-t border-surface-border">
            <div>
              <p className="text-slate-300 text-sm font-body font-medium">Reset All Data</p>
              <p className="text-slate-600 text-xs font-body">Clears all brands, models, parts, specs, and images from the browser.</p>
            </div>
            <button
              onClick={() => setResetModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-body font-medium text-red-400 border border-red-500/40 rounded-xl hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={15} /> Reset
            </button>
          </div>
        </motion.section>

      </main>

      <ConfirmModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleReset}
        title="Reset All Data?"
        description="This will permanently delete all loaded brands, models, parts, specifications, and images from this browser. You will need to re-upload your Excel file."
        confirmLabel="Yes, Reset Everything"
        confirmVariant="danger"
      />
    </div>
  );
}
```

---

## 13. Build Order

Build files in this exact order. Do not skip steps. Each file should compile without errors before moving to the next.

| Step | File | Reason |
|---|---|---|
| 1 | `package.json` | Define all dependencies |
| 2 | `vite.config.js` | Build tool config |
| 3 | `tailwind.config.js` | Design tokens |
| 4 | `postcss.config.js` | CSS processor |
| 5 | `index.html` | HTML entry |
| 6 | `src/index.css` | Global styles, Google Fonts import, CSS vars |
| 7 | `src/store/useAutoStore.js` | Central state — all other files depend on it |
| 8 | `src/utils/colorAssigner.js` | Used by store |
| 9 | `src/utils/excelParser.js` | Used by hook |
| 10 | `src/utils/imageHandler.js` | Used by hook |
| 11 | `src/utils/exportHelper.js` | Used by SpecsPage |
| 12 | `src/utils/constants.js` | Shared color maps — create this file with all exported constants: `CATEGORY_COLORS`, `MODEL_CATEGORY_COLORS`, `STOCK_COLORS` |
| 13 | `src/hooks/useExcelUpload.js` | Wraps parser |
| 14 | `src/hooks/useImageUpload.js` | Wraps image handler |
| 15 | `src/components/StockBadge.jsx` | No dependencies on other components |
| 16 | `src/components/SearchBar.jsx` | Standalone |
| 17 | `src/components/FilterTabs.jsx` | Standalone |
| 18 | `src/components/StatCard.jsx` | Standalone |
| 19 | `src/components/Breadcrumb.jsx` | Uses react-router Link |
| 20 | `src/components/EmptyState.jsx` | Standalone |
| 21 | `src/components/ConfirmModal.jsx` | Standalone |
| 22 | `src/components/FileUploader.jsx` | Standalone |
| 23 | `src/components/ImageUploader.jsx` | Uses imageHandler |
| 24 | `src/components/BrandCard.jsx` | Uses colorAssigner, store |
| 25 | `src/components/ModelCard.jsx` | Uses constants |
| 26 | `src/components/PartCard.jsx` | Uses StockBadge, constants |
| 27 | `src/components/SpecTable.jsx` | Standalone |
| 28 | `src/components/SpecChart.jsx` | Uses recharts |
| 29 | `src/components/Navbar.jsx` | Uses store, router |
| 30 | `src/pages/AdminPanel.jsx` | Uses all hooks and components |
| 31 | `src/pages/BrandsPage.jsx` | Uses BrandCard, Navbar |
| 32 | `src/pages/ModelsPage.jsx` | Uses ModelCard, Navbar |
| 33 | `src/pages/PartsPage.jsx` | Uses PartCard, Navbar |
| 34 | `src/pages/SpecsPage.jsx` | Uses SpecTable, SpecChart |
| 35 | `src/App.jsx` | Wires router and pages |
| 36 | `src/main.jsx` | Entry point |

---

## 14. Edge Cases

Every edge case and its exact handling:

### 14.1 No Data Loaded
- **Trigger:** User navigates to `/brands`, `/brands/:id/models`, etc. without loading Excel.
- **Handler:** `<ProtectedRoute>` in `App.jsx` redirects to `/admin`.
- **AdminPanel shows:** Empty stat cards, no overview section, an upload-first CTA.

### 14.2 Excel Uploaded But No Images
- **Trigger:** User confirms Excel data but hasn't uploaded images.
- **Handler:** All `getImage(filename)` calls return `null`.
- **BrandCard:** Shows first letter of brand name as text avatar inside the logo circle.
- **ModelCard:** Shows 🚗 emoji placeholder in the image div.
- **PartCard:** Shows 🔩 emoji placeholder in the image div.
- **SpecsPage part hero:** Shows `<Package>` icon from lucide.

### 14.3 Image Filename Mismatch
- **Trigger:** Excel references `toyota_logo.png` but uploaded image is `Toyota_Logo.PNG`.
- **Handler:** In `getImage(filename)`, also attempt case-insensitive lookup:
  ```js
  getImage: (filename) => {
    if (!filename) return null;
    const images = get().images;
    if (images[filename]) return images[filename];
    // Case-insensitive fallback
    const lower = filename.toLowerCase();
    const key = Object.keys(images).find((k) => k.toLowerCase() === lower);
    return key ? images[key] : null;
  },
  ```
- If still no match: return null → placeholder shown.

### 14.4 Brand Has Zero Models
- **Trigger:** Brand exists in `Brands` sheet but no matching rows in `Models` sheet.
- **BrandCard:** Shows `"No models yet"` pill instead of model count with ChevronRight.
- **ModelsPage:** Shows `<EmptyState title="No Models" description="This brand has no models yet." />`.
- **Navigate still works:** Clicking the brand card still navigates (do NOT block navigation).

### 14.5 Model Has Zero Parts
- **Trigger:** Model exists but no matching `model_id` in `Parts` sheet.
- **PartsPage:** Shows `<EmptyState title="No Parts for This Model" description="Add parts to the Parts sheet." />`.

### 14.6 Part Has Zero Specifications
- **Trigger:** Part exists but no matching `part_id` in `Specifications` sheet.
- **SpecsPage:** Shows `<EmptyState title="No Specifications" />`. Chart is hidden (`specs.length === 0` → don't render `SpecChart`).

### 14.7 Extra Columns in Excel
- **Trigger:** User adds extra columns beyond the defined schema.
- **Handler:** `parseSheet` maps by column index, not by header name. Extra columns are simply not mapped and are silently ignored. They do not cause errors.

### 14.8 Missing Required Column Data
- **Trigger:** A row in `Brands` has empty `brand_id` (column A).
- **Handler:** `parseSheet` filters out any row where `row[0]` coerces to an empty string. The row is skipped silently.
- **Other missing fields:** Coercion returns `null` or `''`. Components handle null gracefully with fallback text (`|| '—'` or `|| 'N/A'`).

### 14.9 ZIP File Upload Fails
- **Trigger:** ZIP is corrupted, password-protected, or contains no valid images.
- **Handler in `useImageUpload.handleZip`:**
  - JSZip throws → catch block → `setError('ZIP extraction failed: ' + err.message)`.
  - Zero valid images found → `setError('No valid images found inside the ZIP file.')`.
  - UI: error shown in ImageUploader's error display, user can retry.

### 14.10 localStorage Quota Exceeded
- **Trigger:** Images + data exceed ~5MB browser localStorage limit.
- **Handler:** Zustand persist middleware wraps the write. The `onRehydrateStorage` callback logs the error. Additionally, in `useImageUpload`, `estimateImagesSize` warns the user with a yellow warning banner before they even click "Save Images" if the estimated total exceeds `4.5MB`.
- **Do NOT silently fail** — always surface the warning to the user.

### 14.11 Direct URL Navigation
- **Trigger:** User pastes `http://localhost:5173/brands/BR099/models` directly.
- **Handler in ModelsPage `useEffect`:** `getBrandById('BR099')` returns `null` if data is not loaded → `navigate('/admin')`.
- **Handler in App.jsx `ProtectedRoute`:** If `isDataLoaded === false` → `<Navigate to="/admin" replace />`.

### 14.12 Invalid Specification Values
- **Trigger:** `spec_value`, `standard_value`, `tolerance_plus`, or `tolerance_minus` contain non-numeric strings.
- **Handler in `computeCondition`:** `parseFloat` returns `NaN`. Default to 0 via `|| 0`. The condition logic still runs without throwing.
- **Display:** Value shows as `0` in the table rather than NaN or crashing.

### 14.13 Empty Excel File
- **Trigger:** User uploads an `.xlsx` with empty sheets or no sheets.
- **Handler:** `parseSheet` returns `[]` for each sheet. `parsedData` = `{ brands: [], models: [], parts: [], specifications: [], warnings: [...] }`.
- **UI:** Preview tables say "No rows parsed." Confirm button is still enabled (user may just have the wrong file and can replace it). After confirming, dashboard will show empty states everywhere.

### 14.14 Search Returns No Results
- **BrandsPage:** Shows `<EmptyState title="No brands match your search" ... action="Clear Search" />`.
- **ModelsPage:** Shows `<EmptyState title="No models match the filters" ... action="Reset Filters" />`.
- **PartsPage:** Shows `<EmptyState title="No parts match filters" ... action="Clear Filters" />`.

### 14.15 Print Styles
- The `print:hidden` Tailwind class hides the Navbar, Breadcrumb, and action buttons on print.
- The SpecsPage part hero, spec table, and chart remain visible for printing.
- No `@media print` CSS is needed beyond Tailwind's `print:` variants.

---

## 15. localStorage Schema

Zustand persist stores one top-level key:

**Key:** `autovault-storage`

**Value shape (JSON stringified):**
```json
{
  "state": {
    "brands": [ ... ],
    "models": [ ... ],
    "parts": [ ... ],
    "specifications": [ ... ],
    "images": {
      "toyota_logo.png": "data:image/png;base64,...",
      "camry.png": "data:image/jpeg;base64,..."
    },
    "isDataLoaded": true,
    "theme": "dark",
    "brandColors": {
      "BR001": { "primary": "#3B82F6", "secondary": "#1D4ED8", "gradient": "from-blue-500 to-blue-800" }
    }
  },
  "version": 0
}
```

**Note:** `selectedBrand`, `selectedModel`, `selectedPart` are NOT persisted (excluded via `partialize`).

---

## 16. Validation Rules

### 16.1 Excel File Upload Validation
- Accept only `.xlsx` and `.xls` extensions.
- Check `file.type` against `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` and `application/vnd.ms-excel`.
- If both fail: show error "Invalid file type. Please upload a .xlsx or .xls file."
- Max file size recommendation: 50MB (no hard enforcement, but warn if > 10MB).

### 16.2 Image File Validation
- Accept: `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`.
- In `processImageFiles`: skip (silently) any file not matching these extensions or MIME types.
- ZIP: only accept `.zip` extension. Reject with error if not.

### 16.3 Data Integrity
- `brand_id` must be non-empty string per brand row.
- `model_id` must be non-empty string per model row.
- `part_id` must be non-empty string per part row.
- `spec_id` must be non-empty string per spec row.
- Missing FK integrity (e.g. `model.brand_id` references non-existent brand): do NOT crash — the model simply won't appear under any brand (it will still be in the store but `getModelsForBrand` won't return it).

### 16.4 Required File: `src/utils/constants.js`

This file must be created at step 12 in the Build Order:

```js
export const CATEGORY_COLORS = {
  Engine:       { bg: 'bg-red-500/20',    text: 'text-red-400',    border: 'border-red-500/40'    },
  Body:         { bg: 'bg-blue-500/20',   text: 'text-blue-400',   border: 'border-blue-500/40'   },
  Interior:     { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/40' },
  Electrical:   { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/40' },
  Suspension:   { bg: 'bg-green-500/20',  text: 'text-green-400',  border: 'border-green-500/40'  },
  Transmission: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/40' },
};

export const MODEL_CATEGORY_COLORS = {
  SUV:       'bg-blue-500/20 text-blue-300 border border-blue-500/40',
  Sedan:     'bg-green-500/20 text-green-300 border border-green-500/40',
  Hatchback: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40',
  Truck:     'bg-orange-500/20 text-orange-300 border border-orange-500/40',
  Coupe:     'bg-pink-500/20 text-pink-300 border border-pink-500/40',
  Van:       'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
};

export const STOCK_COLORS = {
  Available:      { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/40', dot: '#10B981' },
  Low:            { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/40',   dot: '#F59E0B' },
  'Out of Stock': { bg: 'bg-red-500/15',     text: 'text-red-400',     border: 'border-red-500/40',     dot: '#EF4444' },
};

export const PART_CATEGORIES = ['Engine', 'Body', 'Interior', 'Electrical', 'Suspension', 'Transmission'];
export const MODEL_CATEGORIES = ['SUV', 'Sedan', 'Hatchback', 'Truck', 'Coupe', 'Van'];
export const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
export const TRANSMISSION_TYPES = ['Manual', 'Automatic', 'CVT'];
```

---

## Final Checklist for AI Agent

Before declaring the build complete, verify:

- [ ] `npm run dev` starts without errors on port 5173
- [ ] Navigating to `/admin` shows the AdminPanel (not a blank screen)
- [ ] Uploading a valid `.xlsx` shows the 4 sheet preview tables
- [ ] Clicking "Confirm & Load" redirects to `/brands` and shows brand cards
- [ ] Clicking a brand navigates to `/brands/:id/models`
- [ ] Models page shows the brand banner gradient and model cards
- [ ] Clicking a model navigates to `/brands/:id/models/:id/parts`
- [ ] Parts page shows the model info card and part cards
- [ ] Clicking a part navigates to the specs page
- [ ] Specs page shows the spec table with condition row colors
- [ ] Specs page shows the Recharts bar chart
- [ ] "Export to Excel" button downloads an `.xlsx` file
- [ ] "Print Page" opens the browser print dialog
- [ ] Image upload (individual files) works and shows thumbnails
- [ ] ZIP image upload works and shows thumbnails
- [ ] Deleting an image thumbnail removes it from the map
- [ ] "Save Images" persists images to Zustand store
- [ ] Reset modal appears and clearing data returns to admin panel
- [ ] Theme toggle switches between dark and light correctly
- [ ] All empty states display correctly when data is absent
- [ ] Breadcrumb links navigate correctly to parent pages
- [ ] Direct URL navigation without data loaded redirects to `/admin`
- [ ] No `console.error` for React key warnings or prop-type violations
- [ ] All Tailwind classes are valid and render correctly (no purge issues)
- [ ] Google Fonts (`Bebas Neue` + `DM Sans`) load correctly from the CDN import in `index.css`

---

*End of PLAN.md — AutoVault Dashboard Blueprint v1.0*
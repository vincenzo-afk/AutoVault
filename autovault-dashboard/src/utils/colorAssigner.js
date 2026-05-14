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

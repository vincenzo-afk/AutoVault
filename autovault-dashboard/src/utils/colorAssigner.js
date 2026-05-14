export const BRAND_PALETTE = [
  {
    primary: '#3B82F6',
    secondary: '#1D4ED8',
    gradient: 'from-blue-500 to-blue-700',
    label: 'Ocean Blue',
  },
  {
    primary: '#EF4444',
    secondary: '#B91C1C',
    gradient: 'from-red-500 to-red-700',
    label: 'Racing Red',
  },
  {
    primary: '#10B981',
    secondary: '#047857',
    gradient: 'from-emerald-500 to-emerald-700',
    label: 'Forest Green',
  },
  {
    primary: '#F59E0B',
    secondary: '#B45309',
    gradient: 'from-amber-500 to-amber-700',
    label: 'Solar Amber',
  },
  {
    primary: '#8B5CF6',
    secondary: '#5B21B6',
    gradient: 'from-violet-500 to-violet-700',
    label: 'Royal Purple',
  },
  {
    primary: '#EC4899',
    secondary: '#9D174D',
    gradient: 'from-pink-500 to-pink-700',
    label: 'Rose Gold',
  },
  {
    primary: '#06B6D4',
    secondary: '#0E7490',
    gradient: 'from-cyan-500 to-cyan-700',
    label: 'Cyan Wave',
  },
  {
    primary: '#F97316',
    secondary: '#C2410C',
    gradient: 'from-orange-500 to-orange-700',
    label: 'Blazing Orange',
  },
  {
    primary: '#84CC16',
    secondary: '#4D7C0F',
    gradient: 'from-lime-500 to-lime-700',
    label: 'Neon Lime',
  },
  {
    primary: '#6366F1',
    secondary: '#3730A3',
    gradient: 'from-indigo-500 to-indigo-700',
    label: 'Indigo Night',
  },
  {
    primary: '#14B8A6',
    secondary: '#0F766E',
    gradient: 'from-teal-500 to-teal-700',
    label: 'Teal Surf',
  },
  {
    primary: '#A855F7',
    secondary: '#7E22CE',
    gradient: 'from-purple-500 to-purple-700',
    label: 'Deep Purple',
  },
];

export function assignBrandColors(brands) {
  const brandColors = {};
  brands.forEach((brand, index) => {
    brandColors[brand.brand_id] = BRAND_PALETTE[index % BRAND_PALETTE.length];
  });
  return brandColors;
}

export function getBrandColor(brandColors, brand_id) {
  return brandColors[brand_id] || BRAND_PALETTE[0];
}

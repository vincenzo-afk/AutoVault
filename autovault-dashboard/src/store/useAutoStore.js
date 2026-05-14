import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { assignBrandColors } from '../utils/colorAssigner';

const useAutoStore = create(
  persist(
    (set, get) => ({
      // ─── State ─────────────────────────────────────────────────────────
      brands: [],
      models: [],
      parts: [],
      specifications: [],
      images: {},
      selectedBrand: null,
      selectedModel: null,
      selectedPart: null,
      isDataLoaded: false,
      theme: 'dark',
      brandColors: {},

      // ─── Actions ────────────────────────────────────────────────────────

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

      // ─── Derived selectors ─────────────────────────────────────────────

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
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('AutoVault: Failed to rehydrate from localStorage:', error);
        }
      },
    }
  )
);

export default useAutoStore;

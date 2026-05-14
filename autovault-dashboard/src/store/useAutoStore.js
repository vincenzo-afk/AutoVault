import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { assignBrandColors, getBrandColor } from '../utils/colorAssigner';

const useAutoStore = create(
  persist(
    (set, get) => ({
      // Data state
      brands: [],
      models: [],
      parts: [],
      specifications: [],
      images: {},
      isDataLoaded: false,
      theme: 'dark',
      brandColors: {},
      auth: {
        isLoggedIn: false,
        role: null, // "admin" | "viewer" | null
        username: "",
      },

      // Transient selection state (not persisted)
      selectedBrand: null,
      selectedModel: null,
      selectedPart: null,

      // ---- Actions ----

      login: (username, password) => {
        if (username === "admin" && password === "password") {
          set({ auth: { isLoggedIn: true, role: "admin", username } });
          return "admin";
        } else if (username.trim() && password.trim()) {
          set({ auth: { isLoggedIn: true, role: "viewer", username } });
          return "viewer";
        }
        return null; // failed
      },

      logout: () => {
        set({ auth: { isLoggedIn: false, role: null, username: "" } });
      },

      setAllData: ({ brands, models, parts, specifications }) => {
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

      setImages: (images) => set({ images }),

      mergeImages: (newImages) =>
        set((state) => ({
          images: { ...state.images, ...newImages },
        })),

      clearAll: () =>
        set({
          brands: [],
          models: [],
          parts: [],
          specifications: [],
          images: {},
          isDataLoaded: false,
          brandColors: {},
          selectedBrand: null,
          selectedModel: null,
          selectedPart: null,
        }),

      setTheme: (theme) => {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
        set({ theme });
      },

      assignBrandColors: (brands) => {
        const brandColors = assignBrandColors(brands);
        set({ brandColors });
      },

      setSelectedBrand: (id) => set({ selectedBrand: id }),
      setSelectedModel: (id) => set({ selectedModel: id }),
      setSelectedPart: (id) => set({ selectedPart: id }),

      // ---- Derived Selectors ----

      getBrandById: (id) => get().brands.find((b) => b.brand_id === id) || null,

      getModelById: (id) => get().models.find((m) => m.model_id === id) || null,

      getPartById: (id) => get().parts.find((p) => p.part_id === id) || null,

      getImage: (filename) => {
        if (!filename) return null;
        const { images } = get();
        if (images[filename]) return images[filename];
        // Case-insensitive fallback
        const key = Object.keys(images).find(
          (k) => k.toLowerCase() === filename.toLowerCase()
        );
        return key ? images[key] : null;
      },

      getBrandColor: (brand_id) => getBrandColor(get().brandColors, brand_id),

      getModelsForBrand: (brand_id) =>
        get().models.filter((m) => m.brand_id === brand_id),

      getPartsForModel: (model_id) =>
        get().parts.filter((p) => p.model_id === model_id),

      getSpecsForPart: (part_id) =>
        get().specifications.filter((s) => s.part_id === part_id),

      getLowStockParts: () =>
        get().parts.filter((p) => p.stock_status === 'Low'),

      getOutOfStockParts: () =>
        get().parts.filter((p) => p.stock_status === 'Out of Stock'),
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
        auth: state.auth,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate store:', error);
        }
        if (state && state.theme) {
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add(state.theme);
        }
      },
    }
  )
);

export default useAutoStore;

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings2 } from 'lucide-react';
import useAutoStore from '../store/useAutoStore';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import FilterTabs from '../components/FilterTabs';
import ModelCard from '../components/ModelCard';
import EmptyState from '../components/EmptyState';

export default function ModelsPage() {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const {
    getBrandById,
    getModelsForBrand,
    getBrandColor,
    getImage,
    setSelectedBrand,
  } = useAutoStore();

  const brand = getBrandById(brandId);
  const brandColor = getBrandColor(brandId);
  const brandModels = getModelsForBrand(brandId);

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFuel, setActiveFuel] = useState('All');

  useEffect(() => {
    if (!brand) {
      navigate('/brands', { replace: true });
      return;
    }
    setSelectedBrand(brandId);
  }, [brand, brandId, navigate, setSelectedBrand]);

  const categories = useMemo(() => {
    const counts = {};
    brandModels.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return [
      { key: 'All', label: 'All', count: brandModels.length },
      ...Object.entries(counts).map(([key, count]) => ({ key, label: key, count })),
    ];
  }, [brandModels]);

  const fuels = useMemo(() => {
    const set = new Set(brandModels.map((m) => m.fuel_type).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [brandModels]);

  const filteredModels = useMemo(() => {
    let result = brandModels;
    if (activeCategory !== 'All') {
      result = result.filter((m) => m.category === activeCategory);
    }
    if (activeFuel !== 'All') {
      result = result.filter((m) => m.fuel_type === activeFuel);
    }
    return result;
  }, [brandModels, activeCategory, activeFuel]);

  const logoSrc = brand ? getImage(brand.logo_filename) : null;

  if (!brand) return null;

  return (
    <div className="min-h-screen bg-surface-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          crumbs={[
            { label: brand.brand_name, href: null },
            { label: 'Models' },
          ]}
        />

        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
          style={{
            background: `linear-gradient(135deg, ${brandColor.secondary || brandColor.primary}44, ${brandColor.primary}88, #080B12)`,
          }}
        >
          <div className="flex items-center gap-6 relative z-10">
            {/* Logo */}
            <div className="flex-shrink-0">
              {logoSrc ? (
                <div 
                  className="w-24 h-24 rounded-full bg-white flex items-center justify-center p-3"
                  style={{ boxShadow: `0 0 20px ${brandColor.primary}88` }}
                >
                  <img
                    src={logoSrc}
                    alt={brand.brand_name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold bg-white"
                  style={{
                    color: brandColor.primary,
                    boxShadow: `0 0 20px ${brandColor.primary}88`
                  }}
                >
                  {brand.brand_name?.charAt(0) || '?'}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1
                className="font-display text-5xl sm:text-7xl uppercase tracking-widest text-white leading-none"
              >
                {brand.brand_name}
              </h1>
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-300">
                {brand.country && <span>📍 {brand.country}</span>}
                {brand.founded_year && <span>📅 Founded {brand.founded_year}</span>}
                <span>🚗 {brandModels.length} Model{brandModels.length !== 1 ? 's' : ''}</span>
              </div>
              {brand.description && (
                <p className="text-sm text-slate-400 mt-2 max-w-2xl">{brand.description}</p>
              )}
            </div>
          </div>
          
          {/* Bottom racing stripe */}
          <div className="racing-stripe absolute bottom-0 left-0" />
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <FilterTabs
            tabs={categories}
            active={activeCategory}
            onSelect={setActiveCategory}
            colorMap={{}}
            className="flex-1"
          />
          <select
            value={activeFuel}
            onChange={(e) => setActiveFuel(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
          >
            {fuels.map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel === 'All' ? 'All Fuel Types' : fuel}
              </option>
            ))}
          </select>
        </div>

        {/* Count */}
        <p className="text-sm text-slate-500">
          Showing {filteredModels.length} of {brandModels.length} models
        </p>

        {/* Empty State */}
        {filteredModels.length === 0 && (
          <EmptyState
            icon={Settings2}
            title="No Models Found"
            description="No models match the selected filters. Try adjusting your criteria."
          />
        )}

        {/* Models Grid */}
        {filteredModels.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredModels.map((model, i) => {
              const imageSrc = getImage(model.image_filename);
              return (
                <ModelCard
                  key={model.model_id}
                  model={model}
                  imageSrc={imageSrc}
                  brandColor={brandColor}
                  onClick={() =>
                    navigate(`/brands/${brandId}/models/${model.model_id}/parts`)
                  }
                  index={i}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

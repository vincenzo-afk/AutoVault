import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model, i) => (
              <ModelCard
                key={model.model_id}
                model={model}
                imageSrc={getImage(model.image_filename)}
                brandColor={colorConfig.primary}
                onClick={() => {
                  setSelectedModel(model.model_id);
                  navigate(`/brands/${brandId}/models/${model.model_id}/parts`);
                }}
                index={i}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

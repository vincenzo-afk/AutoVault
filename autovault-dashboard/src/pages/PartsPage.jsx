import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings2, Fuel, Zap, Users, DollarSign, Gauge } from 'lucide-react';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import FilterTabs from '../components/FilterTabs';
import PartCard from '../components/PartCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import useAutoStore from '../store/useAutoStore';
import { CATEGORY_COLORS } from '../utils/constants';

export default function PartsPage() {
  const { brandId, modelId } = useParams();
  const navigate = useNavigate();

  const getBrandById    = useAutoStore((s) => s.getBrandById);
  const getModelById    = useAutoStore((s) => s.getModelById);
  const getPartsForModel = useAutoStore((s) => s.getPartsForModel);
  const getBrandColor   = useAutoStore((s) => s.getBrandColor);
  const getImage        = useAutoStore((s) => s.getImage);
  const setSelectedModel = useAutoStore((s) => s.setSelectedModel);
  const setSelectedPart  = useAutoStore((s) => s.setSelectedPart);

  const brand = getBrandById(brandId);
  const model = getModelById(modelId);
  const parts = getPartsForModel(modelId);
  const colorConfig = getBrandColor(brandId);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!brand) { navigate('/brands'); return; }
    if (!model) { navigate(`/brands/${brandId}/models`); return; }
    setSelectedModel(modelId);
  }, [brandId, modelId]);

  const categories = useMemo(() => {
    const cats = [...new Set(parts.map((p) => p.part_category))];
    return [
      { label: 'All', value: 'all', count: parts.length },
      ...cats.map((c) => ({
        label: c,
        value: c,
        count: parts.filter((p) => p.part_category === c).length,
      })),
    ];
  }, [parts]);

  const filteredParts = useMemo(() => {
    return parts.filter((p) => {
      if (activeCategory !== 'all' && p.part_category !== activeCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!p.part_name.toLowerCase().includes(q) && !p.oem_number.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [parts, activeCategory, searchQuery]);

  if (!brand || !model) return null;

  return (
    <div className="min-h-screen bg-surface-bg bg-grid-texture">
      <Navbar />

      {/* Model banner */}
      <div className="bg-surface-card border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Breadcrumb crumbs={[
            { label: brand.brand_name, href: `/brands/${brandId}/models` },
            { label: model.model_name },
          ]} />

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Model image */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-surface-border flex-shrink-0">
              {getImage(model.image_filename) ? (
                <img src={getImage(model.image_filename)} alt={model.model_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🚗</div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl sm:text-4xl tracking-widest text-slate-100 uppercase">
                {model.model_name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs font-body text-slate-400">
                <span className="flex items-center gap-1"><Settings2 size={12} /> {model.engine_type}</span>
                <span className="flex items-center gap-1"><Fuel size={12} /> {model.fuel_type}</span>
                <span className="flex items-center gap-1"><Zap size={12} /> {model.horsepower} HP</span>
                <span className="flex items-center gap-1"><Gauge size={12} /> {model.torque}</span>
                <span className="flex items-center gap-1"><Users size={12} /> {model.seating_capacity} seats</span>
                <span className="flex items-center gap-1"><DollarSign size={12} /> {model.price_range}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <FilterTabs
            tabs={categories}
            active={activeCategory}
            onSelect={setActiveCategory}
            colorMap={CATEGORY_COLORS}
          />
          <div className="flex-1 min-w-[200px] max-w-xs ml-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search parts or OEM…"
            />
          </div>
        </div>

        {/* Count */}
        <p className="text-slate-500 text-sm font-body mt-4 mb-6">
          Showing {filteredParts.length} of {parts.length} part{parts.length !== 1 ? 's' : ''}
        </p>

        {/* Grid */}
        {filteredParts.length === 0 ? (
          <EmptyState
            title="No parts found"
            description={searchQuery ? `No parts matching "${searchQuery}". Try a different search.` : 'No parts match this category.'}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredParts.map((part, i) => (
              <PartCard
                key={part.part_id}
                part={part}
                imageSrc={getImage(part.part_image_filename)}
                onClick={() => {
                  setSelectedPart(part.part_id);
                  navigate(`/brands/${brandId}/models/${modelId}/parts/${part.part_id}/specs`);
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

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Fuel,
  Gauge,
  Settings2,
  Users,
  Zap,
  Package,
  ArrowLeft,
} from 'lucide-react';
import useAutoStore from '../store/useAutoStore';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import FilterTabs from '../components/FilterTabs';
import SearchBar from '../components/SearchBar';
import PartCard from '../components/PartCard';
import EmptyState from '../components/EmptyState';
import { CATEGORY_COLORS } from '../utils/constants';

export default function PartsPage() {
  const { brandId, modelId } = useParams();
  const navigate = useNavigate();
  const {
    getBrandById,
    getModelById,
    getPartsForModel,
    getBrandColor,
    getImage,
    setSelectedModel,
  } = useAutoStore();

  const brand = getBrandById(brandId);
  const model = getModelById(modelId);
  const brandParts = getPartsForModel(modelId);
  const brandColor = getBrandColor(brandId);

  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!brand || !model) {
      navigate(brand ? `/brands/${brandId}/models` : '/brands', { replace: true });
      return;
    }
    setSelectedModel(modelId);
  }, [brand, model, brandId, modelId, navigate, setSelectedModel]);

  const categories = useMemo(() => {
    const counts = {};
    brandParts.forEach((p) => {
      counts[p.part_category] = (counts[p.part_category] || 0) + 1;
    });
    return [
      { key: 'All', label: 'All', count: brandParts.length },
      ...Object.entries(counts).map(([key, count]) => ({ key, label: key, count })),
    ];
  }, [brandParts]);

  const filteredParts = useMemo(() => {
    let result = brandParts;
    if (activeCategory !== 'All') {
      result = result.filter((p) => p.part_category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.part_name?.toLowerCase().includes(q) ||
          p.oem_number?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [brandParts, activeCategory, search]);

  const modelImageSrc = model ? getImage(model.image_filename) : null;

  if (!brand || !model) return null;

  return (
    <div className="min-h-screen bg-surface-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          crumbs={[
            { label: brand.brand_name, href: `/brands/${brandId}/models` },
            { label: model.model_name, href: null },
            { label: 'Parts' },
          ]}
        />

        {/* Back Button */}
        <button
          onClick={() => navigate(`/brands/${brandId}/models`)}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Models
        </button>

        {/* Model Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Model Image */}
            <div className="flex-shrink-0 w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-surface border border-surface-border">
              {modelImageSrc ? (
                <img src={modelImageSrc} alt={model.model_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl">🚗</span>
                </div>
              )}
            </div>

            {/* Model Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">{model.model_name}</h2>
                  <p className="text-sm text-slate-400">
                    {brand.brand_name} · {model.year}
                  </p>
                </div>
                {model.category && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    {model.category}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {model.engine_type && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Settings2 size={13} className="text-slate-500" />
                    {model.engine_type}
                  </div>
                )}
                {model.fuel_type && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Fuel size={13} className="text-amber-400" />
                    {model.fuel_type}
                  </div>
                )}
                {model.transmission && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Gauge size={13} className="text-slate-500" />
                    {model.transmission}
                  </div>
                )}
                {model.horsepower && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Zap size={13} className="text-blue-400" />
                    {model.horsepower} hp
                  </div>
                )}
                {model.torque && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Gauge size={13} className="text-emerald-400" />
                    {model.torque}
                  </div>
                )}
                {model.seating_capacity && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Users size={13} className="text-slate-500" />
                    {model.seating_capacity} seats
                  </div>
                )}
              </div>

              {model.price_range && (
                <p className="mt-3 text-sm font-semibold" style={{ color: brandColor.primary }}>
                  {model.price_range}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <FilterTabs
            tabs={categories}
            active={activeCategory}
            onSelect={setActiveCategory}
            colorMap={CATEGORY_COLORS}
            className="flex-1"
          />
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search parts by name or OEM..."
            className="w-full sm:w-64"
          />
        </div>

        {/* Count */}
        <p className="text-sm text-slate-500">
          Showing {filteredParts.length} of {brandParts.length} parts
        </p>

        {/* Empty State: No Parts */}
        {brandParts.length === 0 && (
          <EmptyState
            icon={Package}
            title="No Parts Added"
            description="This model doesn't have any parts yet."
          />
        )}

        {/* Empty State: No Match */}
        {brandParts.length > 0 && filteredParts.length === 0 && (
          <EmptyState
            icon={Package}
            title="No Matching Parts"
            description="Try adjusting your filters or search terms."
          />
        )}

        {/* Parts Grid */}
        {filteredParts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredParts.map((part, i) => {
              const imageSrc = getImage(part.part_image_filename);
              return (
                <PartCard
                  key={part.part_id}
                  part={part}
                  imageSrc={imageSrc}
                  onClick={() =>
                    navigate(
                      `/brands/${brandId}/models/${modelId}/parts/${part.part_id}/specs`
                    )
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

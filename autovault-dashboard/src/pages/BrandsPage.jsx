import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Search as SearchIcon } from 'lucide-react';
import useAutoStore from '../store/useAutoStore';
import Navbar from '../components/Navbar';
import BrandCard from '../components/BrandCard';
import EmptyState from '../components/EmptyState';

export default function BrandsPage() {
  const navigate = useNavigate();
  const { brands, models, getBrandColor, getImage, setSelectedBrand } = useAutoStore();
  const [search, setSearch] = useState('');

  const filteredBrands = useMemo(() => {
    if (!search.trim()) return brands;
    const q = search.toLowerCase();
    return brands.filter(
      (b) =>
        b.brand_name?.toLowerCase().includes(q) ||
        b.country?.toLowerCase().includes(q)
    );
  }, [brands, search]);

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand.brand_id);
    navigate(`/brands/${brand.brand_id}/models`);
  };

  return (
    <div className="min-h-screen bg-surface-bg">
      <Navbar showSearch searchValue={search} onSearchChange={setSearch} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {/* Hero Section */}
        <div className="mb-12 relative">
          {/* Racing stripe across top */}
          <div className="racing-stripe mb-6" />

          {/* Main heading */}
          <h1 className="font-display text-6xl sm:text-8xl tracking-widest text-white uppercase leading-none">
            Auto<span style={{ color: '#00E5FF' }} className="neon-blue">Vault</span>
          </h1>

          {/* Tagline */}
          <p className="font-body text-slate-400 text-base mt-3 tracking-wide">
            {brands.length} Brands · {models.length} Models · {useAutoStore.getState().parts.length || 0} Parts
          </p>

          {/* Decorative speed lines */}
          <div className="absolute inset-0 speed-lines pointer-events-none opacity-40" />
        </div>

        {/* Empty State: No Data */}
        {brands.length === 0 && (
          <EmptyState
            icon={Car}
            title="No Brands Loaded"
            description="Upload an Excel file with brand data in the Admin Panel to get started."
            action={{
              label: 'Go to Admin Panel',
              onClick: () => navigate('/admin'),
            }}
          />
        )}

        {/* Empty State: No Search Results */}
        {brands.length > 0 && filteredBrands.length === 0 && (
          <EmptyState
            icon={SearchIcon}
            title="No Matching Brands"
            description={`No brands match "${search}". Try a different search term.`}
          />
        )}

        {/* Brands Grid */}
        {filteredBrands.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredBrands.map((brand, i) => {
              const colorConfig = getBrandColor(brand.brand_id);
              const logoSrc = getImage(brand.logo_filename);
              const modelCount = models.filter((m) => m.brand_id === brand.brand_id).length;
              return (
                <BrandCard
                  key={brand.brand_id}
                  brand={brand}
                  modelCount={modelCount}
                  logoSrc={logoSrc}
                  colorConfig={colorConfig}
                  onClick={() => handleBrandClick(brand)}
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

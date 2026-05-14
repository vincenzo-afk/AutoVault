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

import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import SpecTable from '../components/SpecTable';
import SpecChart from '../components/SpecChart';
import StockBadge from '../components/StockBadge';
import EmptyState from '../components/EmptyState';
import useAutoStore from '../store/useAutoStore';
import { exportSpecsToExcel } from '../utils/exportHelper';

export default function SpecsPage() {
  const { brandId, modelId, partId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);

  const getBrandById   = useAutoStore((s) => s.getBrandById);
  const getModelById   = useAutoStore((s) => s.getModelById);
  const getPartById    = useAutoStore((s) => s.getPartById);
  const getSpecsForPart = useAutoStore((s) => s.getSpecsForPart);
  const getBrandColor  = useAutoStore((s) => s.getBrandColor);
  const setSelectedPart = useAutoStore((s) => s.setSelectedPart);

  const brand = getBrandById(brandId);
  const model = getModelById(modelId);
  const part  = getPartById(partId);
  const specifications = getSpecsForPart(partId);
  const colorConfig = getBrandColor(brandId);

  useEffect(() => {
    if (!brand) { navigate('/brands'); return; }
    if (!model) { navigate(`/brands/${brandId}/models`); return; }
    if (!part)  { navigate(`/brands/${brandId}/models/${modelId}/parts`); return; }
    setSelectedPart(partId);
  }, [brandId, modelId, partId]);

  const handleExport = () => {
    if (part && specifications) {
      exportSpecsToExcel(part, specifications, model, brand);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!brand || !model || !part) return null;

  return (
    <div className="min-h-screen bg-surface-bg bg-grid-texture">
      <Navbar />

      {/* Header */}
      <div className="bg-surface-card border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Breadcrumb crumbs={[
            { label: brand.brand_name, href: `/brands/${brandId}/models` },
            { label: model.model_name, href: `/brands/${brandId}/models/${modelId}/parts` },
            { label: part.part_name },
          ]} />

          <div className="mt-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl tracking-widest text-slate-100 uppercase">
                {part.part_name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm font-body text-slate-400">
                <span>{part.oem_number}</span>
                <span className="text-slate-600">|</span>
                <span>{part.manufacturer}</span>
                <span className="text-slate-600">|</span>
                <span>{part.part_category}</span>
                <span className="text-slate-600">|</span>
                <span>₹{Number(part.price_inr).toLocaleString('en-IN')}</span>
                <StockBadge status={part.stock_status} size="sm" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => navigate(`/brands/${brandId}/models/${modelId}/parts`)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-body text-slate-400 border border-surface-border hover:text-slate-200 hover:border-slate-600 transition-all"
              >
                <ArrowLeft size={15} />
                <span className="hidden sm:inline">Back</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-body text-blue-400 border border-blue-500/40 hover:bg-blue-500/10 transition-all"
              >
                <Download size={15} />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-body text-slate-400 border border-surface-border hover:text-slate-200 hover:border-slate-600 transition-all"
              >
                <Printer size={15} />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main ref={printRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Chart */}
        {specifications.length > 0 && (
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-display text-xl tracking-wide text-slate-100 mb-4">Specifications Overview</h2>
            <SpecChart specifications={specifications} brandColor={colorConfig.primary} />
          </div>
        )}

        {/* Table */}
        {specifications.length > 0 ? (
          <div>
            <h2 className="font-display text-xl tracking-wide text-slate-100 mb-4">Detailed Specs</h2>
            <SpecTable specifications={specifications} />
          </div>
        ) : (
          <EmptyState
            title="No specifications available"
            description={`No spec data found for ${part.part_name}.`}
          />
        )}

        {/* Print-only footer */}
        <div className="hidden print:block text-xs text-slate-500 pt-8 border-t border-surface-border mt-8">
          <p>AutoVault Dashboard — {brand.brand_name} / {model.model_name} / {part.part_name}</p>
          <p>Generated on {new Date().toLocaleDateString('en-IN')}</p>
        </div>
      </main>
    </div>
  );
}

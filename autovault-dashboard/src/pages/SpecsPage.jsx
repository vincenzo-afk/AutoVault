import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Printer, Package } from 'lucide-react';
import useAutoStore from '../store/useAutoStore';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import SpecTable from '../components/SpecTable';
import SpecChart from '../components/SpecChart';
import StockBadge from '../components/StockBadge';
import EmptyState from '../components/EmptyState';
import { exportSpecsToExcel } from '../utils/exportHelper';

export default function SpecsPage() {
  const { brandId, modelId, partId } = useParams();
  const navigate = useNavigate();
  const {
    getBrandById,
    getModelById,
    getPartById,
    getSpecsForPart,
    getBrandColor,
    getImage,
  } = useAutoStore();

  const brand = getBrandById(brandId);
  const model = getModelById(modelId);
  const part = getPartById(partId);
  const specifications = getSpecsForPart(partId);
  const brandColor = getBrandColor(brandId);

  useEffect(() => {
    if (!brand) {
      navigate('/brands', { replace: true });
    } else if (!model) {
      navigate(`/brands/${brandId}/models`, { replace: true });
    } else if (!part) {
      navigate(`/brands/${brandId}/models/${modelId}/parts`, { replace: true });
    }
  }, [brand, model, part, brandId, modelId, navigate]);

  const handleExport = () => {
    if (part && specifications) {
      exportSpecsToExcel(part, specifications, model, brand);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const partImageSrc = part ? getImage(part.part_image_filename) : null;

  if (!brand || !model || !part) return null;

  return (
    <div className="min-h-screen bg-surface-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          crumbs={[
            { label: brand.brand_name, href: `/brands/${brandId}/models` },
            { label: model.model_name, href: `/brands/${brandId}/models/${modelId}/parts` },
            { label: part.part_name, href: null },
          ]}
        />

        {/* Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={() =>
              navigate(`/brands/${brandId}/models/${modelId}/parts`)
            }
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Parts
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-300 bg-surface-card border border-surface-border rounded-lg hover:bg-surface-hover transition-all"
            >
              <Download size={15} />
              Export to Excel
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-300 bg-surface-card border border-surface-border rounded-lg hover:bg-surface-hover transition-all"
            >
              <Printer size={15} />
              Print Page
            </button>
          </div>
        </div>

        {/* Part Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Part Image */}
            <div className="flex-shrink-0 w-full sm:w-40 h-32 rounded-xl overflow-hidden bg-surface border border-surface-border">
              {partImageSrc ? (
                <img
                  src={partImageSrc}
                  alt={part.part_name}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={36} className="text-slate-600" />
                </div>
              )}
            </div>

            {/* Part Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">{part.part_name}</h2>
                  <p className="text-sm text-slate-400">
                    {model.model_name} · {brand.brand_name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StockBadge status={part.stock_status} size="md" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                {part.part_id && (
                  <div>
                    <p className="text-xs text-slate-500">Part ID</p>
                    <p className="text-sm text-slate-300">{part.part_id}</p>
                  </div>
                )}
                {part.part_category && (
                  <div>
                    <p className="text-xs text-slate-500">Category</p>
                    <p className="text-sm text-slate-300">{part.part_category}</p>
                  </div>
                )}
                {part.oem_number && (
                  <div>
                    <p className="text-xs text-slate-500">OEM Number</p>
                    <p className="text-sm text-slate-300">{part.oem_number}</p>
                  </div>
                )}
                {part.manufacturer && (
                  <div>
                    <p className="text-xs text-slate-500">Manufacturer</p>
                    <p className="text-sm text-slate-300">{part.manufacturer}</p>
                  </div>
                )}
                {part.weight_kg != null && (
                  <div>
                    <p className="text-xs text-slate-500">Weight</p>
                    <p className="text-sm text-slate-300">{part.weight_kg} kg</p>
                  </div>
                )}
                {part.warranty_months != null && (
                  <div>
                    <p className="text-xs text-slate-500">Warranty</p>
                    <p className="text-sm text-slate-300">{part.warranty_months} months</p>
                  </div>
                )}
                {part.price_inr != null && (
                  <div>
                    <p className="text-xs text-slate-500">Price</p>
                    <p className="text-sm font-semibold" style={{ color: brandColor.primary }}>
                      ₹{part.price_inr.toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Spec Chart */}
        {specifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-slate-200 mb-4">
              Specifications Chart
            </h3>
            <SpecChart specifications={specifications} brandColor={brandColor.primary} />
          </motion.div>
        )}

        {/* Spec Table */}
        {specifications.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h3 className="text-lg font-semibold text-slate-200 mb-4">
              Technical Specifications
            </h3>
            <SpecTable specifications={specifications} />
          </motion.div>
        ) : (
          <EmptyState
            icon={Package}
            title="No Specifications"
            description="This part has no technical specifications defined."
          />
        )}

        {/* Print Footer */}
        <div className="hidden print:block text-center text-xs text-slate-400 mt-8">
          AutoVault Dashboard — Generated {new Date().toLocaleDateString()}
        </div>
      </main>
    </div>
  );
}

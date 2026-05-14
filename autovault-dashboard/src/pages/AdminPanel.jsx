import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Download,
  AlertTriangle,
  Sun,
  Moon,
  Trash2,
  BarChart3,
  Package,
  Wrench,
  FileSpreadsheet,
  CheckCircle,
} from 'lucide-react';
import useAutoStore from '../store/useAutoStore';
import useExcelUpload from '../hooks/useExcelUpload';
import useImageUpload from '../hooks/useImageUpload';
import Navbar from '../components/Navbar';
import FileUploader from '../components/FileUploader';
import ImageUploader from '../components/ImageUploader';
import StatCard from '../components/StatCard';
import ConfirmModal from '../components/ConfirmModal';
import StockBadge from '../components/StockBadge';
import { exportFullDataToExcel } from '../utils/exportHelper';

export default function AdminPanel() {
  const navigate = useNavigate();
  const {
    brands,
    models,
    parts,
    specifications,
    isDataLoaded,
    theme,
    setTheme,
    clearAll,
    lowStockParts,
    outOfStockParts,
  } = useAutoStore();

  const excel = useExcelUpload();
  const image = useImageUpload();
  const [showResetModal, setShowResetModal] = useState(false);

  const lowStock = useAutoStore.getState().getLowStockParts?.() || [];
  const outOfStock = useAutoStore.getState().getOutOfStockParts?.() || [];

  const handleConfirmLoad = () => {
    excel.confirmLoad();
    image.confirmSave();
    const role = useAutoStore.getState().auth?.role;
    if (role === 'admin') {
      // stay on /admin
    } else {
      navigate('/brands');
    }
  };

  const handleExportAll = () => {
    exportFullDataToExcel({ brands, models, parts, specifications });
  };

  const handleResetAll = () => {
    clearAll();
    setShowResetModal(false);
    navigate('/admin');
  };

  const hasData = excel.parsedData || Object.keys(image.uploadedImages).length > 0;

  return (
    <div className="min-h-screen bg-surface-bg">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-display tracking-wider text-slate-100">
              ADMIN PANEL
            </h1>
            <p className="text-sm text-slate-500 mt-1">Upload data and manage the catalog</p>
          </div>
          {isDataLoaded && (
            <button
              onClick={handleExportAll}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-200 bg-surface-card border border-surface-border rounded-xl hover:bg-surface-hover transition-all"
            >
              <Download size={16} />
              Export All Data
            </button>
          )}
        </motion.div>

        {/* Excel Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-slate-200 mb-1">
            1. Upload Excel Data
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Upload a .xlsx file with Brands, Models, Parts, and Specifications sheets.
          </p>

          <FileUploader
            onFile={excel.handleFile}
            isLoading={excel.isLoading}
            fileName={excel.fileName}
            error={excel.error}
          />

          {/* Preview Table */}
          {excel.parsedData && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-5 space-y-4"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Brands', count: excel.parsedData.brands.length, icon: BarChart3 },
                  { label: 'Models', count: excel.parsedData.models.length, icon: Package },
                  { label: 'Parts', count: excel.parsedData.parts.length, icon: Wrench },
                  { label: 'Specs', count: excel.parsedData.specifications.length, icon: FileSpreadsheet },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-surface-border"
                  >
                    <item.icon size={20} className="text-blue-400" />
                    <div>
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <p className="text-lg font-bold text-slate-200">{item.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Image Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-slate-200 mb-1">
            2. Upload Brand / Model Images
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Upload images individually or as a ZIP archive. Supported: PNG, JPG, WebP, GIF.
          </p>

          <ImageUploader
            onFiles={image.handleFiles}
            onZip={image.handleZip}
            uploadedImages={image.uploadedImages}
            onRemove={image.removeImage}
            isLoading={image.isLoading}
            error={image.error}
            warning={image.warning}
            totalSize={image.totalSize}
          />

          {Object.keys(image.uploadedImages).length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={image.confirmSave}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 hover:shadow-glow-blue transition-all"
              >
                <CheckCircle size={16} />
                Save Images
              </button>
            </div>
          )}
        </motion.div>

        {/* Confirm & Load */}
        {hasData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-2xl p-6 border-blue-500/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-200">Ready to Load</h2>
                <p className="text-sm text-slate-500">
                  {excel.parsedData ? 'Excel data parsed and ready' : ''}
                  {excel.parsedData && Object.keys(image.uploadedImages).length > 0 ? ' + ' : ''}
                  {Object.keys(image.uploadedImages).length > 0
                    ? `${Object.keys(image.uploadedImages).length} image(s) ready`
                    : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleConfirmLoad}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-500 hover:shadow-glow-blue transition-all"
                >
                  <CheckCircle size={18} />
                  {isDataLoaded ? 'Update & Reload' : 'Confirm & Load'}
                </button>
                {isDataLoaded && (
                  <button
                    onClick={() => navigate('/brands')}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-blue-400 bg-blue-500/10 rounded-xl hover:bg-blue-500/20 transition-all"
                  >
                    View Dashboard →
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Data Overview (when loaded) */}
        {isDataLoaded && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-slate-200 mb-4">Data Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Brands"
                  value={brands.length}
                  icon={<BarChart3 size={22} />}
                  color="text-blue-400"
                />
                <StatCard
                  label="Models"
                  value={models.length}
                  icon={<Package size={22} />}
                  color="text-emerald-400"
                />
                <StatCard
                  label="Parts"
                  value={parts.length}
                  icon={<Wrench size={22} />}
                  color="text-amber-400"
                />
                <StatCard
                  label="Specifications"
                  value={specifications.length}
                  icon={<FileSpreadsheet size={22} />}
                  color="text-violet-400"
                />
              </div>
            </motion.div>

            {/* Stock Alerts */}
            {(lowStock.length > 0 || outOfStock.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="text-lg font-semibold text-slate-200 mb-4">
                  Stock Alerts
                </h2>
                <div className="space-y-3">
                  {lowStock.map((p) => (
                    <div
                      key={p.part_id}
                      className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/20"
                    >
                      <div>
                        <p className="text-sm text-slate-200">{p.part_name}</p>
                        <p className="text-xs text-slate-500">OEM: {p.oem_number || '—'}</p>
                      </div>
                      <StockBadge status="Low" size="sm" />
                    </div>
                  ))}
                  {outOfStock.map((p) => (
                    <div
                      key={p.part_id}
                      className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/20"
                    >
                      <div>
                        <p className="text-sm text-slate-200">{p.part_name}</p>
                        <p className="text-xs text-slate-500">OEM: {p.oem_number || '—'}</p>
                      </div>
                      <StockBadge status="Out of Stock" size="sm" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 border-red-500/20"
        >
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Settings & Danger Zone</h2>
          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-surface-border">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon size={18} className="text-blue-400" />
                ) : (
                  <Sun size={18} className="text-amber-400" />
                )}
                <div>
                  <p className="text-sm text-slate-200">Theme</p>
                  <p className="text-xs text-slate-500">
                    Current: <span className="capitalize">{theme}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="px-4 py-1.5 text-sm font-medium rounded-lg bg-surface-card border border-surface-border text-slate-300 hover:bg-surface-hover transition-all"
              >
                Toggle
              </button>
            </div>

            {/* Reset All Data */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/20">
              <div className="flex items-center gap-3">
                <AlertTriangle size={18} className="text-red-400" />
                <div>
                  <p className="text-sm text-slate-200">Reset All Data</p>
                  <p className="text-xs text-slate-500">
                    Permanently delete all brands, models, parts, and images
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowResetModal(true)}
                className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all"
              >
                <Trash2 size={15} />
                Reset
              </button>
            </div>
          </div>
        </motion.div>

        <ConfirmModal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          onConfirm={handleResetAll}
          title="Reset All Data?"
          description="This will permanently delete all brands, models, parts, specifications, and uploaded images. This action cannot be undone."
          confirmLabel="Yes, Reset Everything"
          confirmVariant="danger"
        />
      </main>
    </div>
  );
}

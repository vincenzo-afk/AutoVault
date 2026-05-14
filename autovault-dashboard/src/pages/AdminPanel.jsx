import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car, Settings, Database, Upload, Image, Download,
  AlertTriangle, RefreshCw, Sun, Moon, BarChart3,
  Building2, Package, Wrench, ClipboardList,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import FileUploader from '../components/FileUploader';
import ImageUploader from '../components/ImageUploader';
import StatCard from '../components/StatCard';
import ConfirmModal from '../components/ConfirmModal';
import StockBadge from '../components/StockBadge';
import useAutoStore from '../store/useAutoStore';
import { useExcelUpload } from '../hooks/useExcelUpload';
import { useImageUpload } from '../hooks/useImageUpload';
import { exportFullDataToExcel } from '../utils/exportHelper';

export default function AdminPanel() {
  const navigate = useNavigate();
  const {
    brands, models, parts, specifications, images,
    isDataLoaded, theme,
    clearAll, setTheme, getLowStockParts, getOutOfStockParts,
  } = useAutoStore();

  const excel = useExcelUpload();
  const image = useImageUpload();

  const [showResetModal, setShowResetModal] = useState(false);

  const lowStockParts = useMemo(() => getLowStockParts(), [parts]);
  const outOfStockParts = useMemo(() => getOutOfStockParts(), [parts]);

  const handleConfirmLoad = () => {
    excel.confirmLoad();
    image.confirmSave();
    navigate('/brands');
  };

  const handleExportAll = () => {
    exportFullDataToExcel({ brands, models, parts, specifications });
  };

  return (
    <div className="min-h-screen bg-surface-bg bg-grid-texture">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Header */}
        <div>
          <h1 className="font-display text-4xl sm:text-5xl tracking-widest text-slate-100 uppercase">
            Admin Panel
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full mt-3" />
          <p className="text-slate-500 font-body text-sm mt-3">
            Upload your Excel file and images to generate the dashboard.
          </p>
        </div>

        {/* Excel Upload */}
        <section className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400">
              <Database size={20} />
            </div>
            <h2 className="font-display text-xl tracking-wide text-slate-100">Excel Data</h2>
          </div>
          <FileUploader
            onFile={excel.handleFile}
            isLoading={excel.isLoading}
            fileName={excel.fileName}
            error={excel.error}
          />

          {/* Parsed data preview */}
          {excel.parsedData && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-sm font-body">
              <p className="text-emerald-300 font-medium mb-1">File parsed successfully</p>
              <p className="text-slate-400">
                {excel.parsedData.brands.length} Brands · {excel.parsedData.models.length} Models · {excel.parsedData.parts.length} Parts · {excel.parsedData.specifications.length} Specifications
              </p>
              {excel.parsedData.warnings.length > 0 && (
                <ul className="mt-2 text-amber-400 text-xs space-y-0.5">
                  {excel.parsedData.warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              )}
            </div>
          )}
        </section>

        {/* Image Upload */}
        <section className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/15 text-violet-400">
              <Image size={20} />
            </div>
            <h2 className="font-display text-xl tracking-wide text-slate-100">Brand Images &amp; Logos</h2>
          </div>
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
        </section>

        {/* Data Overview (only when data is loaded) */}
        {isDataLoaded && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
                <BarChart3 size={20} />
              </div>
              <h2 className="font-display text-xl tracking-wide text-slate-100">Data Overview</h2>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Brands" value={brands.length} icon={<Building2 size={20} />} color="text-blue-400" />
              <StatCard label="Models" value={models.length} icon={<Car size={20} />} color="text-violet-400" />
              <StatCard label="Parts"   value={parts.length}   icon={<Package size={20} />} color="text-amber-400" />
              <StatCard label="Specs"   value={specifications.length} icon={<ClipboardList size={20} />} color="text-emerald-400" />
            </div>

            {/* Stock warnings */}
            {(lowStockParts.length > 0 || outOfStockParts.length > 0) && (
              <div className="glass-card rounded-2xl p-5 space-y-3">
                <h3 className="font-display text-lg tracking-wide text-slate-100">Stock Alerts</h3>
                {lowStockParts.length > 0 && (
                  <div>
                    <p className="text-amber-400 text-sm font-body font-medium mb-2">Low Stock ({lowStockParts.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {lowStockParts.slice(0, 5).map((p) => (
                        <StockBadge key={p.part_id} status="Low" size="sm" />
                      ))}
                    </div>
                  </div>
                )}
                {outOfStockParts.length > 0 && (
                  <div>
                    <p className="text-red-400 text-sm font-body font-medium mb-2">Out of Stock ({outOfStockParts.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {outOfStockParts.slice(0, 5).map((p) => (
                        <StockBadge key={p.part_id} status="Out of Stock" size="sm" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Export button */}
            <button
              onClick={handleExportAll}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-xl text-sm font-body font-medium hover:bg-blue-500/30 transition-colors"
            >
              <Download size={16} />
              Export All Data to Excel
            </button>
          </section>
        )}

        {/* Confirm & Load */}
        {(excel.parsedData || Object.keys(image.uploadedImages).length > 0) && (
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={handleConfirmLoad}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl text-sm font-body font-medium hover:bg-emerald-500/30 transition-all"
            >
              <Upload size={18} />
              {isDataLoaded ? 'Update & Reload' : 'Confirm & Load'}
            </button>
            <button
              onClick={excel.reset}
              className="px-4 py-3 text-sm font-body text-slate-400 border border-surface-border rounded-xl hover:text-slate-300 transition-colors"
            >
              Clear Upload
            </button>
          </div>
        )}

        {/* Danger Zone */}
        <section className="glass-card rounded-2xl p-6 border-red-500/30 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/15 text-red-400">
              <Settings size={20} />
            </div>
            <h2 className="font-display text-xl tracking-wide text-slate-100">Danger Zone</h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-body text-slate-400 border border-surface-border rounded-xl hover:text-slate-200 hover:border-slate-600 transition-all"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </button>

            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-body text-red-400 border border-red-500/40 rounded-xl hover:bg-red-500/10 transition-all"
            >
              <RefreshCw size={16} />
              Reset All Data
            </button>
          </div>
        </section>
      </main>

      <ConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={clearAll}
        title="Reset All Data"
        description="This will permanently delete all uploaded data, including brands, models, parts, specifications, and images. This action cannot be undone."
        confirmLabel="Reset Everything"
        confirmVariant="danger"
      />
    </div>
  );
}

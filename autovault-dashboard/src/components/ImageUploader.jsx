import React, { useRef, useState } from 'react';
import { Images, Upload, Trash2, Loader2, AlertCircle, AlertTriangle, HardDrive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageUploader({
  onFiles, onZip, uploadedImages, onRemove,
  isLoading = false, error = null, warning = null, totalSize = '0 B',
}) {
  const imgInputRef = useRef(null);
  const zipInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const zipFile = files.find((f) => f.name.toLowerCase().endsWith('.zip'));
    if (zipFile) {
      onZip(zipFile);
    } else {
      onFiles(files);
    }
  };

  const imageEntries = Object.entries(uploadedImages);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center gap-3 p-8
          border-2 border-dashed rounded-2xl transition-all duration-200
          ${isDragOver ? 'border-violet-500 bg-violet-500/8' : 'border-surface-border bg-surface-card'}
        `}
      >
        {isLoading ? (
          <Loader2 size={36} className="text-violet-400 animate-spin" />
        ) : (
          <Images size={36} className="text-violet-400" />
        )}
        <div className="text-center">
          <p className="text-slate-300 font-body font-medium">Drop images or a ZIP file here</p>
          <p className="text-slate-500 text-xs mt-1">PNG, JPG, WEBP — or a single .zip containing all images</p>
        </div>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => imgInputRef.current?.click()}
            className="px-4 py-2 text-sm font-body font-medium text-violet-400 border border-violet-500/40 rounded-xl hover:bg-violet-500/10 transition-colors"
          >
            Browse Images
          </button>
          <button
            onClick={() => zipInputRef.current?.click()}
            className="px-4 py-2 text-sm font-body font-medium text-slate-400 border border-surface-border rounded-xl hover:bg-surface-hover transition-colors flex items-center gap-1.5"
          >
            <Upload size={14} />
            Upload ZIP
          </button>
        </div>

        <input ref={imgInputRef} type="file" accept="image/*" multiple onChange={(e) => onFiles(e.target.files)} className="hidden" />
        <input ref={zipInputRef} type="file" accept=".zip" onChange={(e) => onZip(e.target.files[0])} className="hidden" />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-body">
          <AlertCircle size={15} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Warning */}
      {warning && (
        <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm font-body">
          <AlertTriangle size={15} className="flex-shrink-0" />
          {warning}
        </div>
      )}

      {/* Image thumbnails grid */}
      {imageEntries.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-300 text-sm font-body font-medium">
              {imageEntries.length} image{imageEntries.length !== 1 ? 's' : ''} loaded
            </p>
            <span className="flex items-center gap-1 text-slate-500 text-xs">
              <HardDrive size={12} /> ~{totalSize}
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            <AnimatePresence>
              {imageEntries.map(([filename, src]) => (
                <motion.div
                  key={filename}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group rounded-xl overflow-hidden bg-surface-border aspect-square"
                >
                  <img
                    src={src}
                    alt={filename}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                    <p className="text-white text-[9px] text-center leading-tight break-all">{filename}</p>
                    <button
                      onClick={() => onRemove(filename)}
                      className="p-1 bg-red-500/80 rounded-lg text-white hover:bg-red-500 transition-colors"
                      aria-label={`Remove ${filename}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

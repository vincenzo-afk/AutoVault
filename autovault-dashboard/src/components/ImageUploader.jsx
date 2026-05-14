import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, FileArchive, Loader2, AlertCircle, AlertTriangle, Trash2, X } from 'lucide-react';

export default function ImageUploader({
  onFiles,
  onZip,
  uploadedImages = {},
  onRemove,
  isLoading = false,
  error = null,
  warning = null,
  totalSize = '',
}) {
  const imgInputRef = useRef(null);
  const zipInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const imageCount = Object.keys(uploadedImages).length;

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const imgFiles = files.filter((f) => f.type.startsWith('image/'));
    const zipFile = files.find((f) => f.name.endsWith('.zip'));
    if (imgFiles.length > 0) onFiles(imgFiles);
    if (zipFile) onZip(zipFile);
  };

  return (
    <div>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-500 bg-blue-500/5 drag-over'
            : 'border-surface-border hover:border-blue-500/40 hover:bg-surface-hover'
        }`}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={36} className="text-blue-400 animate-spin" />
            <p className="text-sm text-slate-400">Processing images...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Upload size={36} className="text-slate-500" />
            <p className="text-sm text-slate-400">Drop images or ZIP file here</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => imgInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-surface border border-surface-border rounded-lg hover:bg-surface-hover transition-all"
              >
                <ImageIcon size={16} />
                Browse Images
              </button>
              <button
                type="button"
                onClick={() => zipInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-surface border border-surface-border rounded-lg hover:bg-surface-hover transition-all"
              >
                <FileArchive size={16} />
                Upload ZIP
              </button>
            </div>
            <input
              ref={imgInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onFiles(e.target.files)}
              className="hidden"
              aria-label="Browse images"
            />
            <input
              ref={zipInputRef}
              type="file"
              accept=".zip"
              onChange={(e) => {
                if (e.target.files[0]) onZip(e.target.files[0]);
              }}
              className="hidden"
              aria-label="Upload ZIP"
            />
          </div>
        )}
      </div>

      {/* Notifications */}
      {error && (
        <div className="mt-4 flex items-start gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {warning && (
        <div className="mt-2 flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-300">{warning}</p>
        </div>
      )}

      {/* Thumbnail Grid */}
      <AnimatePresence>
        {imageCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5"
          >
            <p className="text-sm text-slate-400 mb-3">
              {imageCount} image{imageCount !== 1 ? 's' : ''}
              {totalSize && ` — ${totalSize}`}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {Object.entries(uploadedImages).map(([filename, src]) => (
                <motion.div
                  key={filename}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  className="relative group aspect-square rounded-xl overflow-hidden border border-surface-border bg-surface-card"
                >
                  <img
                    src={src}
                    alt={filename}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                    <p className="text-xs text-slate-300 text-center truncate w-full mb-2">
                      {filename}
                    </p>
                    <button
                      onClick={() => onRemove(filename)}
                      className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-all"
                      title="Remove image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

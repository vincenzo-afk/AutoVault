import React, { useRef, useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export default function FileUploader({
  onFile,
  accept = '.xlsx,.xls',
  label = 'Upload Excel File',
  isLoading = false,
  fileName = null,
  error = null,
}) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onFile(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick();
      }}
      role="button"
      tabIndex={0}
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
        isDragOver
          ? 'border-blue-500 bg-blue-500/5 drag-over'
          : error
          ? 'border-red-500/40 bg-red-500/5'
          : fileName
          ? 'border-emerald-500/40 bg-emerald-500/5'
          : 'border-surface-border hover:border-blue-500/40 hover:bg-surface-hover'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        aria-label={label}
      />

      {isLoading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="text-blue-400 animate-spin" />
          <p className="text-sm text-slate-400">Parsing file...</p>
        </div>
      ) : fileName ? (
        <div className="flex flex-col items-center gap-3">
          <CheckCircle size={36} className="text-emerald-400" />
          <p className="text-sm text-slate-300 font-medium">{fileName}</p>
          <p className="text-xs text-slate-500">Click to replace</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3">
          <AlertCircle size={36} className="text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
          <p className="text-xs text-slate-500">Click to try again</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <FileSpreadsheet size={36} className="text-slate-500" />
          <p className="text-sm text-slate-400">{label}</p>
          <p className="text-xs text-slate-600">Drag & drop or click to browse</p>
        </div>
      )}
    </div>
  );
}

import React, { useRef, useState } from 'react';
import { FileSpreadsheet, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export default function FileUploader({
  onFile,
  accept = '.xlsx,.xls',
  label = 'Drop your Excel file here',
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

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onFile(file);
  };

  return (
    <div>
      <div
        onClick={() => !isLoading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center gap-3
          border-2 border-dashed rounded-2xl p-10
          cursor-pointer transition-all duration-200 select-none
          ${isDragOver
            ? 'border-blue-500 bg-blue-500/8'
            : fileName && !error
              ? 'border-emerald-500/50 bg-emerald-500/5'
              : error
                ? 'border-red-500/50 bg-red-500/5'
                : 'border-surface-border bg-surface-card hover:border-slate-500 hover:bg-surface-hover'
          }
        `}
      >
        {isLoading ? (
          <>
            <Loader2 size={40} className="text-blue-400 animate-spin" />
            <p className="text-slate-400 text-sm font-body">Parsing Excel file…</p>
          </>
        ) : fileName && !error ? (
          <>
            <CheckCircle size={40} className="text-emerald-400" />
            <p className="text-emerald-300 font-body font-medium text-sm">{fileName}</p>
            <p className="text-slate-500 text-xs">Click to replace file</p>
          </>
        ) : error ? (
          <>
            <AlertCircle size={40} className="text-red-400" />
            <p className="text-red-400 font-body text-sm">{error}</p>
            <p className="text-slate-500 text-xs">Click to try again</p>
          </>
        ) : (
          <>
            <div className="p-4 rounded-2xl bg-surface-border">
              <FileSpreadsheet size={36} className="text-blue-400" />
            </div>
            <div className="text-center">
              <p className="text-slate-300 font-body font-medium">{label}</p>
              <p className="text-slate-500 text-sm mt-1">or click to browse — .xlsx, .xls accepted</p>
            </div>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          aria-label="File upload input"
        />
      </div>
    </div>
  );
}

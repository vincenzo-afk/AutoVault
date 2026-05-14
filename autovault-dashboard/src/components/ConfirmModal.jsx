import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative glass-card rounded-2xl p-6 w-full max-w-md shadow-card z-10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Icon */}
            <div
              className={`p-3 rounded-xl w-fit mb-4 ${
                confirmVariant === 'danger'
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-blue-500/10 text-blue-400'
              }`}
            >
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
            <p className="text-sm text-slate-400 mb-6">{description}</p>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-400 bg-surface border border-surface-border rounded-lg hover:bg-surface-hover hover:text-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all ${
                  confirmVariant === 'danger'
                    ? 'bg-red-600 hover:bg-red-500 hover:shadow-glow-red'
                    : 'bg-blue-600 hover:bg-blue-500 hover:shadow-glow-blue'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

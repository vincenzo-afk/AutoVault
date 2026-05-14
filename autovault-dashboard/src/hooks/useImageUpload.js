import { useState, useCallback } from 'react';
import { processImageFiles, processZipFile, estimateImagesSize, formatBytes } from '../utils/imageHandler';
import useAutoStore from '../store/useAutoStore';

const MAX_IMAGES_BYTES = 4.5 * 1024 * 1024; // 4.5MB safety limit

export function useImageUpload() {
  const [uploadedImages, setUploadedImages] = useState({});
  const [isLoading, setIsLoading]           = useState(false);
  const [error, setError]                   = useState(null);
  const [warning, setWarning]               = useState(null);

  const mergeImages  = useAutoStore((s) => s.mergeImages);
  const storeImages  = useAutoStore((s) => s.images);

  const checkSizeWarning = (map) => {
    const size = estimateImagesSize({ ...storeImages, ...map });
    if (size > MAX_IMAGES_BYTES) {
      setWarning(`Total image storage is ${formatBytes(size * 1.33)}, which may exceed localStorage limits. Consider clearing old data first.`);
    } else {
      setWarning(null);
    }
  };

  const handleFiles = useCallback(async (files) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await processImageFiles(Array.from(files));
      setUploadedImages((prev) => {
        const merged = { ...prev, ...result };
        checkSizeWarning(merged);
        return merged;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [storeImages]);

  const handleZip = useCallback(async (file) => {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setError('Only .zip files are accepted here.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await processZipFile(file);
      if (Object.keys(result).length === 0) {
        setError('No valid images found inside the ZIP file.');
      } else {
        setUploadedImages((prev) => {
          const merged = { ...prev, ...result };
          checkSizeWarning(merged);
          return merged;
        });
      }
    } catch (err) {
      setError(`ZIP extraction failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [storeImages]);

  const removeImage = useCallback((filename) => {
    setUploadedImages((prev) => {
      const updated = { ...prev };
      delete updated[filename];
      return updated;
    });
  }, []);

  const confirmSave = useCallback(() => {
    mergeImages(uploadedImages);
  }, [uploadedImages, mergeImages]);

  const reset = useCallback(() => {
    setUploadedImages({});
    setIsLoading(false);
    setError(null);
    setWarning(null);
  }, []);

  const totalSize = formatBytes(estimateImagesSize(uploadedImages) * 1.33);

  return {
    uploadedImages,
    isLoading,
    error,
    warning,
    totalSize,
    handleFiles,
    handleZip,
    removeImage,
    confirmSave,
    reset,
  };
}

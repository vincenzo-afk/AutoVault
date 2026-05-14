import { useState, useCallback, useMemo } from 'react';
import { processImageFiles, processZipFile, estimateImagesSize, formatBytes } from '../utils/imageHandler';
import useAutoStore from '../store/useAutoStore';

const MAX_IMAGES_BYTES = 4.5 * 1024 * 1024; // 4.5MB soft limit

export default function useImageUpload() {
  const [uploadedImages, setUploadedImages] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const { images: storedImages, mergeImages } = useAutoStore();

  const totalSize = useMemo(() => {
    return formatBytes(estimateImagesSize(uploadedImages));
  }, [uploadedImages]);

  const checkSizeWarning = useCallback(
    (newMap) => {
      const allImages = { ...storedImages, ...newMap };
      const totalBytes = estimateImagesSize(allImages);
      if (totalBytes > MAX_IMAGES_BYTES) {
        setWarning(
          `Total image size exceeds 4.5MB (currently ${formatBytes(totalBytes)}). Consider using smaller images to avoid localStorage quota issues.`
        );
      } else {
        setWarning(null);
      }
    },
    [storedImages]
  );

  const handleFiles = useCallback(
    async (files) => {
      setIsLoading(true);
      setError(null);
      try {
        const newImages = await processImageFiles(files);
        setUploadedImages((prev) => {
          const merged = { ...prev, ...newImages };
          checkSizeWarning(merged);
          return merged;
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [checkSizeWarning]
  );

  const handleZip = useCallback(
    async (file) => {
      if (!file.name.match(/\.zip$/i)) {
        setError('Please upload a valid .zip file');
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const extracted = await processZipFile(file);
        if (Object.keys(extracted).length === 0) {
          setError('No valid image files found in the ZIP archive');
        } else {
          setUploadedImages((prev) => {
            const merged = { ...prev, ...extracted };
            checkSizeWarning(merged);
            return merged;
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [checkSizeWarning]
  );

  const removeImage = useCallback((filename) => {
    setUploadedImages((prev) => {
      const updated = { ...prev };
      delete updated[filename];
      return updated;
    });
  }, []);

  const confirmSave = useCallback(() => {
    if (Object.keys(uploadedImages).length === 0) return;
    mergeImages(uploadedImages);
    setUploadedImages({});
  }, [uploadedImages, mergeImages]);

  const reset = useCallback(() => {
    setUploadedImages({});
    setIsLoading(false);
    setError(null);
    setWarning(null);
  }, []);

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

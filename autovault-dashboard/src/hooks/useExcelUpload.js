import { useState, useCallback } from 'react';
import { parseExcelFile } from '../utils/excelParser';
import useAutoStore from '../store/useAutoStore';

export function useExcelUpload() {
  const [parsedData, setParsedData] = useState(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState(null);
  const [fileName, setFileName]     = useState(null);

  const setAllData = useAutoStore((s) => s.setAllData);

  const handleFile = useCallback(async (file) => {
    if (!file) return;

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    const validExtensions = ['.xlsx', '.xls'];
    const hasValidType = validTypes.includes(file.type);
    const hasValidExt  = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidType && !hasValidExt) {
      setError('Invalid file type. Please upload a .xlsx or .xls file.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFileName(file.name);
    setParsedData(null);

    try {
      const data = await parseExcelFile(file);
      setParsedData(data);
    } catch (err) {
      setError(err.message || 'Failed to parse Excel file.');
      setFileName(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmLoad = useCallback(() => {
    if (!parsedData) return;
    const { brands, models, parts, specifications } = parsedData;
    setAllData(brands, models, parts, specifications);
  }, [parsedData, setAllData]);

  const reset = useCallback(() => {
    setParsedData(null);
    setIsLoading(false);
    setError(null);
    setFileName(null);
  }, []);

  return { parsedData, isLoading, error, fileName, handleFile, confirmLoad, reset };
}

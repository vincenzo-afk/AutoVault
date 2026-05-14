import { useState, useCallback } from 'react';
import { parseExcelFile } from '../utils/excelParser';
import useAutoStore from '../store/useAutoStore';

export default function useExcelUpload() {
  const [parsedData, setParsedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);
  const { setAllData } = useAutoStore();

  const handleFile = useCallback(async (file) => {
    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    const validExt = /\.(xlsx|xls)$/i;
    if (!validTypes.includes(file.type) && !validExt.test(file.name)) {
      setError('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      const data = await parseExcelFile(file);
      setParsedData(data);
    } catch (err) {
      setError(err.message);
      setParsedData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmLoad = useCallback(() => {
    if (!parsedData) return;
    setAllData({
      brands: parsedData.brands,
      models: parsedData.models,
      parts: parsedData.parts,
      specifications: parsedData.specifications,
    });
  }, [parsedData, setAllData]);

  const reset = useCallback(() => {
    setParsedData(null);
    setIsLoading(false);
    setError(null);
    setFileName(null);
  }, []);

  return { parsedData, isLoading, error, fileName, handleFile, confirmLoad, reset };
}

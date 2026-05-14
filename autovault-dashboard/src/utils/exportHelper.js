import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Exports a single part's specifications to an Excel file.
 *
 * @param {object} part - Part object from Zustand store
 * @param {Array<object>} specifications - Array of spec objects for this part
 * @param {object} model - Model object (for context)
 * @param {object} brand - Brand object (for context)
 * @returns {void}
 */
export function exportSpecsToExcel(part, specifications, model, brand) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Part Info
  const partInfoData = [
    ['Field', 'Value'],
    ['Part ID',        part.part_id],
    ['Part Name',      part.part_name],
    ['OEM Number',     part.oem_number],
    ['Category',       part.part_category],
    ['Manufacturer',   part.manufacturer],
    ['Stock Status',   part.stock_status],
    ['Weight (kg)',    part.weight_kg],
    ['Warranty',       `${part.warranty_months} months`],
    ['Price (INR)',    `₹${Number(part.price_inr).toLocaleString('en-IN')}`],
    ['Model',          model?.model_name || ''],
    ['Brand',          brand?.brand_name || ''],
    ['Export Date',    new Date().toLocaleDateString('en-IN')],
  ];
  const partInfoWS = XLSX.utils.aoa_to_sheet(partInfoData);
  partInfoWS['!cols'] = [{ wch: 20 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, partInfoWS, 'Part Info');

  // Sheet 2: Specifications
  const specsHeaders = [
    'Spec ID', 'Spec Name', 'Value', 'Unit', 'Standard Value',
    'Tolerance (+)', 'Tolerance (-)', 'Condition', 'Notes',
  ];
  const specsData = specifications.map((s) => [
    s.spec_id,
    s.spec_name,
    s.spec_value,
    s.unit,
    s.standard_value,
    s.tolerance_plus,
    s.tolerance_minus,
    s.condition,
    s.notes || '',
  ]);
  const specsWS = XLSX.utils.aoa_to_sheet([specsHeaders, ...specsData]);
  specsWS['!cols'] = [
    { wch: 10 }, { wch: 24 }, { wch: 10 }, { wch: 8 },
    { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 30 },
  ];
  XLSX.utils.book_append_sheet(wb, specsWS, 'Specifications');

  const filename = `${part.part_id}_${part.part_name.replace(/\s+/g, '_')}_specs.xlsx`;
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), filename);
}

/**
 * Exports all brands data to an Excel overview file.
 *
 * @param {object} param0 - Destructured store data
 * @param {Array} param0.brands
 * @param {Array} param0.models
 * @param {Array} param0.parts
 * @param {Array} param0.specifications
 * @returns {void}
 */
export function exportFullDataToExcel({ brands, models, parts, specifications }) {
  const wb = XLSX.utils.book_new();

  const toSheet = (data, headers) => {
    if (!data.length) return XLSX.utils.aoa_to_sheet([headers]);
    const rows = data.map((row) => headers.map((h) => row[h] ?? ''));
    return XLSX.utils.aoa_to_sheet([headers, ...rows]);
  };

  const brandsHeaders = ['brand_id','brand_name','logo_filename','country','description','founded_year','website'];
  const modelsHeaders = ['model_id','brand_id','model_name','image_filename','year','category','engine_type','fuel_type','transmission','price_range','horsepower','torque','seating_capacity'];
  const partsHeaders  = ['part_id','model_id','part_name','part_category','part_image_filename','stock_status','oem_number','manufacturer','weight_kg','warranty_months','price_inr'];
  const specsHeaders  = ['spec_id','part_id','spec_name','spec_value','unit','standard_value','tolerance_plus','tolerance_minus','condition','notes'];

  XLSX.utils.book_append_sheet(wb, toSheet(brands,         brandsHeaders), 'Brands');
  XLSX.utils.book_append_sheet(wb, toSheet(models,         modelsHeaders), 'Models');
  XLSX.utils.book_append_sheet(wb, toSheet(parts,          partsHeaders),  'Parts');
  XLSX.utils.book_append_sheet(wb, toSheet(specifications, specsHeaders),  'Specifications');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'AutoVault_Export.xlsx');
}

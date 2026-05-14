import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function exportSpecsToExcel(part, specifications, model, brand) {
  const wb = XLSX.utils.book_new();

  // Part Info sheet
  const infoData = [
    ['Field', 'Value'],
    ['Part ID', part.part_id],
    ['Part Name', part.part_name],
    ['OEM Number', part.oem_number],
    ['Category', part.part_category],
    ['Manufacturer', part.manufacturer],
    ['Stock Status', part.stock_status],
    ['Weight (kg)', part.weight_kg],
    ['Warranty (months)', part.warranty_months],
    ['Price (INR)', part.price_inr],
    ['Model', model ? model.model_name : ''],
    ['Brand', brand ? brand.brand_name : ''],
    ['Export Date', new Date().toLocaleDateString()],
  ];
  const infoSheet = XLSX.utils.aoa_to_sheet(infoData);
  XLSX.utils.book_append_sheet(wb, infoSheet, 'Part Info');

  // Specifications sheet
  const specHeader = [
    'Spec ID',
    'Spec Name',
    'Value',
    'Unit',
    'Standard Value',
    'Tolerance +',
    'Tolerance –',
    'Condition',
    'Notes',
  ];
  const specRows = specifications.map((s) => [
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
  const specSheet = XLSX.utils.aoa_to_sheet([specHeader, ...specRows]);
  XLSX.utils.book_append_sheet(wb, specSheet, 'Specifications');

  const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const filename = `${part.part_id}_${part.part_name.replace(/\s+/g, '_')}_specs.xlsx`;
  saveAs(new Blob([wbOut], { type: 'application/octet-stream' }), filename);
}

export function exportFullDataToExcel({ brands, models, parts, specifications }) {
  const wb = XLSX.utils.book_new();

  // Brands sheet
  const brandHeader = [
    'Brand ID',
    'Brand Name',
    'Logo Filename',
    'Country',
    'Founded Year',
    'Description',
  ];
  const brandRows = brands.map((b) => [
    b.brand_id,
    b.brand_name,
    b.logo_filename,
    b.country,
    b.founded_year,
    b.description,
  ]);
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([brandHeader, ...brandRows]),
    'Brands'
  );

  // Models sheet
  const modelHeader = [
    'Model ID',
    'Brand ID',
    'Model Name',
    'Year',
    'Category',
    'Engine Type',
    'Fuel Type',
    'Transmission',
    'Horsepower',
    'Torque',
    'Seating',
    'Price Range',
  ];
  const modelRows = models.map((m) => [
    m.model_id,
    m.brand_id,
    m.model_name,
    m.year,
    m.category,
    m.engine_type,
    m.fuel_type,
    m.transmission,
    m.horsepower,
    m.torque,
    m.seating_capacity,
    m.price_range,
  ]);
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([modelHeader, ...modelRows]),
    'Models'
  );

  // Parts sheet
  const partHeader = [
    'Part ID',
    'Model ID',
    'Part Name',
    'Category',
    'OEM Number',
    'Manufacturer',
    'Weight (kg)',
    'Warranty',
    'Price (INR)',
    'Stock Status',
  ];
  const partRows = parts.map((p) => [
    p.part_id,
    p.model_id,
    p.part_name,
    p.part_category,
    p.oem_number,
    p.manufacturer,
    p.weight_kg,
    p.warranty_months,
    p.price_inr,
    p.stock_status,
  ]);
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([partHeader, ...partRows]),
    'Parts'
  );

  // Specifications sheet
  const specHeader = [
    'Spec ID',
    'Part ID',
    'Spec Name',
    'Value',
    'Unit',
    'Standard',
    'Tol +',
    'Tol –',
    'Condition',
    'Notes',
  ];
  const specRows = specifications.map((s) => [
    s.spec_id,
    s.part_id,
    s.spec_name,
    s.spec_value,
    s.unit,
    s.standard_value,
    s.tolerance_plus,
    s.tolerance_minus,
    s.condition,
    s.notes || '',
  ]);
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([specHeader, ...specRows]),
    'Specifications'
  );

  const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbOut], { type: 'application/octet-stream' }), 'AutoVault_Export.xlsx');
}

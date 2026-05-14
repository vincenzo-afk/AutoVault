import * as XLSX from 'xlsx';
import { computeCondition } from './specCondition';

const SHEET_NAMES = ['Brands', 'Models', 'Parts', 'Specifications'];

const BRANDS_COLUMNS = {
  0: { key: 'brand_id', type: 'string' },
  1: { key: 'brand_name', type: 'string' },
  2: { key: 'logo_filename', type: 'string' },
  3: { key: 'country', type: 'string' },
  4: { key: 'founded_year', type: 'int' },
  5: { key: 'description', type: 'string' },
};

const MODELS_COLUMNS = {
  0: { key: 'model_id', type: 'string' },
  1: { key: 'brand_id', type: 'string' },
  2: { key: 'model_name', type: 'string' },
  3: { key: 'year', type: 'int' },
  4: { key: 'category', type: 'string' },
  5: { key: 'engine_type', type: 'string' },
  6: { key: 'fuel_type', type: 'string' },
  7: { key: 'transmission', type: 'string' },
  8: { key: 'horsepower', type: 'int' },
  9: { key: 'torque', type: 'string' },
  10: { key: 'seating_capacity', type: 'int' },
  11: { key: 'price_range', type: 'string' },
  12: { key: 'image_filename', type: 'string' },
};

const PARTS_COLUMNS = {
  0: { key: 'part_id', type: 'string' },
  1: { key: 'model_id', type: 'string' },
  2: { key: 'part_name', type: 'string' },
  3: { key: 'part_category', type: 'string' },
  4: { key: 'part_image_filename', type: 'string' },
  5: { key: 'oem_number', type: 'string' },
  6: { key: 'manufacturer', type: 'string' },
  7: { key: 'weight_kg', type: 'float' },
  8: { key: 'warranty_months', type: 'int' },
  9: { key: 'price_inr', type: 'float' },
  10: { key: 'stock_status', type: 'string' },
};

const SPECIFICATIONS_COLUMNS = {
  0: { key: 'spec_id', type: 'string' },
  1: { key: 'part_id', type: 'string' },
  2: { key: 'spec_name', type: 'string' },
  3: { key: 'spec_value', type: 'float' },
  4: { key: 'unit', type: 'string' },
  5: { key: 'standard_value', type: 'float' },
  6: { key: 'tolerance_plus', type: 'float' },
  7: { key: 'tolerance_minus', type: 'float' },
  8: { key: 'notes', type: 'string' },
};

function coerce(value, type) {
  if (value === null || value === undefined || value === '') {
    return type === 'string' ? '' : 0;
  }
  switch (type) {
    case 'string':
      return String(value).trim();
    case 'int':
      return parseInt(String(value).replace(/[^0-9.-]/g, ''), 10) || 0;
    case 'float':
      return parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0;
    default:
      return value;
  }
}

function parseSheet(worksheet, columnMap) {
  const rows = [];
  if (!worksheet || !worksheet['!ref']) return rows;
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  // Skip header row (first row)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.every((cell) => cell === undefined || cell === null || cell === '')) {
      continue;
    }
    const obj = {};
    Object.entries(columnMap).forEach(([colIdx, { key, type }]) => {
      obj[key] = coerce(row[parseInt(colIdx)], type);
    });
    rows.push(obj);
  }
  return rows;
}

export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'array' });
        const missingSheets = [];
        const data = {};

        SHEET_NAMES.forEach((name) => {
          const ws = workbook.Sheets[name];
          if (!ws) {
            missingSheets.push(name);
            data[name.toLowerCase()] = [];
            return;
          }
          switch (name) {
            case 'Brands':
              data.brands = parseSheet(ws, BRANDS_COLUMNS);
              break;
            case 'Models':
              data.models = parseSheet(ws, MODELS_COLUMNS);
              break;
            case 'Parts':
              data.parts = parseSheet(ws, PARTS_COLUMNS);
              break;
            case 'Specifications':
              data.specifications = parseSheet(ws, SPECIFICATIONS_COLUMNS).map(
                (spec) => ({
                  ...spec,
                  condition: computeCondition(spec),
                })
              );
              break;
          }
        });

        resolve({
          brands: data.brands || [],
          models: data.models || [],
          parts: data.parts || [],
          specifications: data.specifications || [],
          warnings: missingSheets.length > 0
            ? `Missing sheets: ${missingSheets.join(', ')}`
            : null,
        });
      } catch (err) {
        reject(new Error(`Failed to parse Excel file: ${err.message}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

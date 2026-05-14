import * as XLSX from 'xlsx';

// ─── Sheet names expected in the workbook ────────────────────────────────────
const SHEET_NAMES = {
  brands: 'Brands',
  models: 'Models',
  parts: 'Parts',
  specifications: 'Specifications',
};

// ─── Column index → field mappings ───────────────────────────────────────────

const BRANDS_COLUMNS = {
  0: { key: 'brand_id',      type: 'string'  },
  1: { key: 'brand_name',    type: 'string'  },
  2: { key: 'logo_filename', type: 'string'  },
  3: { key: 'country',       type: 'string'  },
  4: { key: 'description',   type: 'string'  },
  5: { key: 'founded_year',  type: 'int'     },
  6: { key: 'website',       type: 'string'  },
};

const MODELS_COLUMNS = {
  0:  { key: 'model_id',        type: 'string' },
  1:  { key: 'brand_id',        type: 'string' },
  2:  { key: 'model_name',      type: 'string' },
  3:  { key: 'image_filename',  type: 'string' },
  4:  { key: 'year',            type: 'int'    },
  5:  { key: 'category',        type: 'string' },
  6:  { key: 'engine_type',     type: 'string' },
  7:  { key: 'fuel_type',       type: 'string' },
  8:  { key: 'transmission',    type: 'string' },
  9:  { key: 'price_range',     type: 'string' },
  10: { key: 'horsepower',      type: 'int'    },
  11: { key: 'torque',          type: 'string' },
  12: { key: 'seating_capacity',type: 'int'    },
};

const PARTS_COLUMNS = {
  0:  { key: 'part_id',             type: 'string' },
  1:  { key: 'model_id',            type: 'string' },
  2:  { key: 'part_name',           type: 'string' },
  3:  { key: 'part_category',       type: 'string' },
  4:  { key: 'part_image_filename', type: 'string' },
  5:  { key: 'stock_status',        type: 'string' },
  6:  { key: 'oem_number',          type: 'string' },
  7:  { key: 'manufacturer',        type: 'string' },
  8:  { key: 'weight_kg',           type: 'float'  },
  9:  { key: 'warranty_months',     type: 'int'    },
  10: { key: 'price_inr',           type: 'float'  },
};

const SPECIFICATIONS_COLUMNS = {
  0: { key: 'spec_id',        type: 'string' },
  1: { key: 'part_id',        type: 'string' },
  2: { key: 'spec_name',      type: 'string' },
  3: { key: 'spec_value',     type: 'float'  },
  4: { key: 'unit',           type: 'string' },
  5: { key: 'standard_value', type: 'float'  },
  6: { key: 'tolerance_plus', type: 'float'  },
  7: { key: 'tolerance_minus',type: 'float'  },
  8: { key: 'condition',      type: 'string' },
  9: { key: 'notes',          type: 'string' },
};

// ─── Type coercion helper ─────────────────────────────────────────────────────

function coerce(raw, type) {
  if (raw === null || raw === undefined || raw === '') return type === 'string' ? '' : null;
  if (type === 'string') return String(raw).trim();
  if (type === 'int') {
    const n = parseInt(String(raw), 10);
    return isNaN(n) ? null : n;
  }
  if (type === 'float') {
    const n = parseFloat(String(raw));
    return isNaN(n) ? null : n;
  }
  return raw;
}

// ─── Generic sheet parser ─────────────────────────────────────────────────────

function parseSheet(worksheet, columnMap, sheetName) {
  if (!worksheet) {
    console.warn(`AutoVault: Sheet "${sheetName}" not found in workbook.`);
    return [];
  }

  const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

  if (rawRows.length <= 1) {
    return [];
  }

  const dataRows = rawRows.slice(1);
  const results = [];

  dataRows.forEach((row) => {
    const primaryKey = coerce(row[0], 'string');
    if (!primaryKey) return;

    const obj = {};
    Object.entries(columnMap).forEach(([colIndexStr, { key, type }]) => {
      const colIndex = parseInt(colIndexStr, 10);
      const raw = row[colIndex];
      obj[key] = coerce(raw, type);
    });

    results.push(obj);
  });

  return results;
}

// ─── Condition computation ────────────────────────────────────────────────────

export function computeCondition(spec_value, standard_value, tolerance_plus, tolerance_minus) {
  const sv  = parseFloat(spec_value)     || 0;
  const std = parseFloat(standard_value) || 0;
  const tp  = parseFloat(tolerance_plus) || 0;
  const tm  = parseFloat(tolerance_minus)|| 0;

  const lowerBound = std - tm;
  const upperBound = std + tp;

  if (sv >= lowerBound && sv <= upperBound) return 'Normal';

  const deviation   = Math.abs(sv - std);
  const maxTolerance = Math.max(tp, tm);

  if (maxTolerance === 0) return 'Critical';
  if (deviation <= maxTolerance * 1.2) return 'Warning';
  return 'Critical';
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        const workbook = XLSX.read(buffer, { type: 'array' });

        const warnings = [];

        const brandsWS = workbook.Sheets[SHEET_NAMES.brands];
        const modelsWS = workbook.Sheets[SHEET_NAMES.models];
        const partsWS  = workbook.Sheets[SHEET_NAMES.parts];
        const specsWS  = workbook.Sheets[SHEET_NAMES.specifications];

        if (!brandsWS) warnings.push('Sheet "Brands" not found.');
        if (!modelsWS) warnings.push('Sheet "Models" not found.');
        if (!partsWS)  warnings.push('Sheet "Parts" not found.');
        if (!specsWS)  warnings.push('Sheet "Specifications" not found.');

        const brands         = parseSheet(brandsWS, BRANDS_COLUMNS,         SHEET_NAMES.brands);
        const models         = parseSheet(modelsWS, MODELS_COLUMNS,         SHEET_NAMES.models);
        const parts          = parseSheet(partsWS,  PARTS_COLUMNS,          SHEET_NAMES.parts);
        const rawSpecs       = parseSheet(specsWS,  SPECIFICATIONS_COLUMNS, SHEET_NAMES.specifications);

        const specifications = rawSpecs.map((spec) => ({
          ...spec,
          condition: computeCondition(
            spec.spec_value,
            spec.standard_value,
            spec.tolerance_plus,
            spec.tolerance_minus
          ),
        }));

        resolve({ brands, models, parts, specifications, warnings });
      } catch (err) {
        reject(new Error(`Failed to parse Excel file: ${err.message}`));
      }
    };

    reader.onerror = () => reject(new Error('FileReader failed to read the file.'));
    reader.readAsArrayBuffer(file);
  });
}

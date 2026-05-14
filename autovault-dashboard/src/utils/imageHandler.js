import JSZip from 'jszip';

// Accepted image MIME types
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
const ACCEPTED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

/**
 * Converts a File (image) to a base64 data URL string.
 *
 * @param {File} file
 * @returns {Promise<string>}
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsDataURL(file);
  });
}

/**
 * Processes an array of image Files into a filename → base64 map.
 * Skips non-image files silently.
 *
 * @param {File[]} files
 * @returns {Promise<{ [filename: string]: string }>}
 */
export async function processImageFiles(files) {
  const result = {};
  const validFiles = Array.from(files).filter((f) =>
    ACCEPTED_IMAGE_TYPES.includes(f.type) ||
    ACCEPTED_IMAGE_EXTENSIONS.some((ext) => f.name.toLowerCase().endsWith(ext))
  );

  await Promise.all(
    validFiles.map(async (file) => {
      try {
        const base64 = await fileToBase64(file);
        result[file.name] = base64;
      } catch (err) {
        console.warn(`Skipping image "${file.name}": ${err.message}`);
      }
    })
  );

  return result;
}

/**
 * Extracts images from a ZIP file and returns a filename → base64 map.
 * Only processes image files inside the ZIP. Ignores __MACOSX and hidden files.
 *
 * @param {File} zipFile
 * @returns {Promise<{ [filename: string]: string }>}
 */
export async function processZipFile(zipFile) {
  const result = {};
  const zip = await JSZip.loadAsync(zipFile);

  const imageEntries = Object.entries(zip.files).filter(([name, entry]) => {
    if (entry.dir) return false;
    if (name.startsWith('__MACOSX')) return false;
    if (name.startsWith('.')) return false;
    const lowerName = name.toLowerCase();
    return ACCEPTED_IMAGE_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  });

  await Promise.all(
    imageEntries.map(async ([fullPath, zipEntry]) => {
      try {
        const blob = await zipEntry.async('blob');
        const filename = fullPath.split('/').pop();
        const mimeType = getMimeType(filename);
        const blobWithType = new Blob([blob], { type: mimeType });
        const base64 = await fileToBase64(new File([blobWithType], filename, { type: mimeType }));
        result[filename] = base64;
      } catch (err) {
        console.warn(`Skipping zip entry "${fullPath}": ${err.message}`);
      }
    })
  );

  return result;
}

/**
 * Returns a MIME type string based on file extension.
 *
 * @param {string} filename
 * @returns {string}
 */
function getMimeType(filename) {
  const ext = filename.toLowerCase().split('.').pop();
  const map = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' };
  return map[ext] || 'image/png';
}

/**
 * Estimates the total size of the images map in bytes.
 * Used to warn the user before hitting localStorage quota.
 *
 * @param {{ [filename: string]: string }} imagesMap
 * @returns {number} approximate byte size
 */
export function estimateImagesSize(imagesMap) {
  return Object.values(imagesMap).reduce((total, b64) => total + b64.length * 0.75, 0);
}

/**
 * Formats bytes to human-readable string.
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

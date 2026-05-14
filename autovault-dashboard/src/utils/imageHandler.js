import JSZip from 'jszip';

const ACCEPTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
const ACCEPTED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
];

export function getMimeType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const mimeMap = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
  };
  return mimeMap[ext] || 'image/png';
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function processImageFiles(files) {
  const validFiles = Array.from(files).filter((file) => {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    return ACCEPTED_EXTENSIONS.includes(ext);
  });

  const images = {};
  await Promise.all(
    validFiles.map(async (file) => {
      try {
        images[file.name] = await fileToBase64(file);
      } catch (err) {
        console.error(`Failed to process ${file.name}:`, err);
      }
    })
  );
  return images;
}

export async function processZipFile(zipFile) {
  try {
    const zip = await JSZip.loadAsync(zipFile);
    const images = {};

    await Promise.all(
      Object.keys(zip.files).map(async (filename) => {
        const file = zip.files[filename];
        if (file.dir) return;
        // Skip __MACOSX and hidden files
        if (filename.startsWith('__MACOSX') || filename.startsWith('.')) return;
        const ext = '.' + filename.split('.').pop().toLowerCase();
        if (!ACCEPTED_EXTENSIONS.includes(ext)) return;

        try {
          const blob = await file.async('blob');
          const mimeType = getMimeType(filename);
          const base64 = await fileToBase64(new File([blob], filename, { type: mimeType }));
          images[filename] = base64;
        } catch (err) {
          console.error(`Failed to extract ${filename}:`, err);
        }
      })
    );
    return images;
  } catch (err) {
    throw new Error('Failed to process ZIP file: ' + err.message);
  }
}

export function estimateImagesSize(imagesMap) {
  let totalBytes = 0;
  Object.values(imagesMap).forEach((base64) => {
    // base64 is ~1.37x larger than raw binary
    totalBytes += Math.round((base64.length * 3) / 4);
  });
  return totalBytes;
}

export function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

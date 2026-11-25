/**
 * Reusable Cloudinary upload helper.
 * Automatically compresses large phone photos (>1MB) client-side before uploading,
 * validates file type, and uploads via backend API to get a permanent Cloudinary secure_url.
 */

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  storage: 'cloudinary' | 'database-permanent';
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

async function compressImageIfNeeded(file: File): Promise<File> {
  if (typeof window === 'undefined') return file;
  if (file.size <= 900 * 1024) return file; // Under 900KB: upload original directly

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDim = 1600;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile.size < file.size ? compressedFile : file);
        },
        'image/jpeg',
        0.82
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export async function uploadToCloudinary(
  file: File,
  folder = 'passiton/products'
): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type.toLowerCase()) && !file.type.startsWith('image/')) {
    throw new Error('Please upload an image file (PNG, JPG, or WEBP).');
  }

  const readyFile = await compressImageIfNeeded(file);

  if (readyFile.size > MAX_SIZE_BYTES) {
    throw new Error('Image size must be less than 5MB even after compression.');
  }

  const formData = new FormData();
  formData.append('file', readyFile);
  formData.append('folder', folder);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success || (!data.secure_url && !data.url)) {
    throw new Error(data.error || 'Failed to upload image to Cloudinary');
  }

  return (data.secure_url || data.url) as string;
}

export const uploadImageToStorage = uploadToCloudinary;

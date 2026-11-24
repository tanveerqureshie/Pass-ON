/**
 * Reusable Cloudinary upload helper.
 * Handles file validation (whitelist, max 5MB) and uploads via backend API.
 * Returns secure_url and public_id.
 */

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  storage: 'cloudinary' | 'database-permanent';
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function uploadToCloudinary(
  file: File,
  folder = 'passiton/products'
): Promise<string> {
  // Frontend pre-validation
  if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
    throw new Error('Please upload an image file (PNG, JPG, or WEBP).');
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('Image size must be less than 5MB.');
  }

  const formData = new FormData();
  formData.append('file', file);
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

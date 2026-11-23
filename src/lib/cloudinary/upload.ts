/**
 * Uploads an image file to Cloudinary via secure server API route.
 * Returns the permanent Cloudinary secure CDN URL.
 */
export async function uploadToCloudinary(file: File, folder = 'pass-on/listings'): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success || !data.url) {
    throw new Error(data.error || 'Failed to upload image to Cloudinary');
  }

  return data.url as string;
}

// Backward-compatible alias for existing components
export const uploadImageToStorage = uploadToCloudinary;

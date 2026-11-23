import { createClient } from './client';

export interface UploadResult {
  success: boolean;
  publicUrl: string;
  filePath: string;
  error?: string;
}

/**
 * Uploads an image file or blob directly to Supabase Storage bucket 'product-images'.
 * 
 * Guarantees:
 * 1. NEVER writes to Vercel's ephemeral filesystem (/tmp or ./public/uploads).
 * 2. Uses unique timestamps & UUIDs to avoid any filename collisions or overwrites.
 * 3. Uses getPublicUrl() to return a PERMANENT public URL that never expires.
 */
export async function uploadProductImage(
  fileOrBlob: File | Blob,
  originalFileName?: string
): Promise<UploadResult> {
  try {
    const supabase = createClient();

    // Determine extension
    let ext = 'jpg';
    if (fileOrBlob instanceof File && fileOrBlob.name) {
      ext = fileOrBlob.name.split('.').pop()?.toLowerCase() || 'jpg';
    } else if (originalFileName) {
      ext = originalFileName.split('.').pop()?.toLowerCase() || 'jpg';
    } else if (fileOrBlob.type) {
      const typeParts = fileOrBlob.type.split('/');
      if (typeParts.length === 2 && typeParts[1]) {
        ext = typeParts[1].replace('jpeg', 'jpg');
      }
    }

    // Clean extension
    ext = ext.replace(/[^a-z0-9]/gi, '');
    if (!ext) ext = 'jpg';

    // Generate collision-proof unique filename with timestamp & random UUID
    const randomId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 10);
    const uniqueFileName = `${Date.now()}-${randomId}.${ext}`;
    const filePath = `products/${uniqueFileName}`;

    const mimeType = fileOrBlob.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`;

    // Upload directly to public Supabase Storage bucket
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, fileOrBlob, {
        contentType: mimeType,
        cacheControl: '31536000', // 1 year immutable cache on CDN
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase direct storage upload failed:', uploadError);
      // Try fallback to server route if client anon upload is blocked
      return await uploadViaApi(fileOrBlob, uniqueFileName, mimeType);
    }

    // Retrieve permanent public URL (never expires)
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    if (!data || !data.publicUrl) {
      throw new Error('Failed to retrieve public URL from Supabase Storage');
    }

    return {
      success: true,
      publicUrl: data.publicUrl,
      filePath,
    };
  } catch (err: unknown) {
    console.error('Error uploading product image to Supabase:', err);
    // Fallback to API route
    try {
      return await uploadViaApi(fileOrBlob, originalFileName || 'image.jpg');
    } catch (apiErr: unknown) {
      const msg = apiErr instanceof Error ? apiErr.message : 'Upload failed';
      return {
        success: false,
        publicUrl: '',
        filePath: '',
        error: msg,
      };
    }
  }
}

/**
 * Fallback upload via Next.js API route (/api/upload)
 */
async function uploadViaApi(
  fileOrBlob: File | Blob,
  fileName?: string,
  contentType?: string
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', fileOrBlob, fileName || 'upload.jpg');
  if (contentType) {
    formData.append('contentType', contentType);
  }

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Server upload failed');
  }

  return {
    success: true,
    publicUrl: data.publicUrl,
    filePath: data.filePath,
  };
}

import { createClient } from './client';

/**
 * Uploads an image (File or Blob) directly to a public Supabase Storage bucket
 * and returns the permanent public URL.
 */
export async function uploadImageToStorage(
  file: File | Blob,
  bucket: 'product-images' | 'verification-docs' = 'product-images',
  prefix: string = 'img'
): Promise<string | null> {
  try {
    const supabase = createClient();
    
    // Determine file extension
    let ext = 'jpg';
    if (file instanceof File && file.name) {
      const parts = file.name.split('.');
      if (parts.length > 1) {
        ext = parts.pop()?.toLowerCase() || 'jpg';
      }
    } else if (file.type) {
      const typeExt = file.type.split('/')[1];
      if (typeExt) ext = typeExt.toLowerCase();
    }
    
    const cleanExt = ext.replace(/[^a-z0-9]/g, '') || 'jpg';
    const uniqueFileName = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;

    const { data, error } = await supabase.storage.from(bucket).upload(uniqueFileName, file, {
      contentType: file.type || 'image/jpeg',
      cacheControl: '31536000', // 1 year cache
      upsert: true,
    });

    if (error) {
      console.error(`Supabase storage upload error in [${bucket}]:`, error);
      return null;
    }

    const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(uniqueFileName);
    return pubData?.publicUrl || null;
  } catch (err) {
    console.error('uploadImageToStorage exception:', err);
    return null;
  }
}

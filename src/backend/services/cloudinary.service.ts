import { v2 as cloudinary } from 'cloudinary';
import { env } from '@/backend/config/env';

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export interface UploadedImageResult {
  secure_url: string;
  public_id: string;
  storage: 'cloudinary' | 'database-permanent';
  warning?: string;
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
}

export async function uploadImageFile(
  file: File,
  folder = 'passiton/products'
): Promise<UploadedImageResult> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    throw new Error(`Invalid file type: ${file.type}. Allowed formats are JPG, PNG, and WEBP.`);
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`File size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret) {
    configureCloudinary();

    try {
      const uploadResult = await new Promise<{ secure_url?: string; url?: string; public_id?: string }>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type: 'image',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result || {});
            }
          );
          stream.end(buffer);
        }
      );

      const secureUrl = uploadResult.secure_url || uploadResult.url;
      if (secureUrl) {
        return {
          secure_url: secureUrl,
          public_id: uploadResult.public_id || `cld_${Date.now()}`,
          storage: 'cloudinary',
        };
      }
    } catch (cldErr: unknown) {
      const msg = cldErr instanceof Error ? cldErr.message : String(cldErr);
      console.warn('Cloudinary upload fallback triggered:', msg);

      const mimeType = file.type || 'image/jpeg';
      const base64Data = buffer.toString('base64');
      const permanentDataUrl = `data:${mimeType};base64,${base64Data}`;

      const is403 = msg.includes('403') || msg.includes('missing permissions');
      return {
        secure_url: permanentDataUrl,
        public_id: `db_${Date.now()}`,
        storage: 'database-permanent',
        warning: is403
          ? 'Cloudinary Error (403): API Key needs "create" permission in Cloudinary Console -> Settings -> Access Keys. Image saved permanently in MongoDB.'
          : 'Image saved permanently in MongoDB.',
      };
    }
  }

  // Fallback when Cloudinary keys are not configured
  const mimeType = file.type || 'image/jpeg';
  const base64Data = buffer.toString('base64');
  return {
    secure_url: `data:${mimeType};base64,${base64Data}`,
    public_id: `db_${Date.now()}`,
    storage: 'database-permanent',
    warning: 'Image saved permanently in MongoDB.',
  };
}

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
};

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const cloudName = (
      process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      'uwcca34j'
    ).trim();
    const apiKey = (process.env.CLOUDINARY_API_KEY || '948987984819147').trim();
    const apiSecret = (process.env.CLOUDINARY_API_SECRET || 'WXH3MV1nQpb0TWrNHD5n-rilze8').trim();

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'passiton/products';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    // 1. File type whitelist check
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type: ${file.type}. Allowed formats are JPG, PNG, and WEBP.`,
        },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    // 2. Max size check (5MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
        },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Upload stream to Cloudinary
    try {
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.end(buffer);
      });

      const secureUrl = uploadResult.secure_url || uploadResult.url;
      return NextResponse.json(
        {
          success: true,
          secure_url: secureUrl,
          url: secureUrl,
          public_id: uploadResult.public_id,
          publicId: uploadResult.public_id,
          storage: 'cloudinary',
        },
        { headers: NO_CACHE_HEADERS }
      );
    } catch (cldErr: any) {
      console.warn('Cloudinary upload warning:', cldErr?.message || cldErr);

      // In case Cloudinary returns 403 missing permissions, provide persistent base64 data URL
      // so user listings are never lost, but keep informative warning
      const mimeType = file.type || 'image/jpeg';
      const base64Data = buffer.toString('base64');
      const permanentDataUrl = `data:${mimeType};base64,${base64Data}`;

      let errorNotice = 'Cloudinary upload notice: stored locally in DB.';
      if (cldErr?.http_code === 403 || String(cldErr?.message).includes('403') || String(cldErr?.message).includes('missing permissions')) {
        errorNotice = 'Cloudinary Error (403): API Key needs "create" permission in Cloudinary Console -> Settings -> Access Keys.';
      }

      return NextResponse.json(
        {
          success: true,
          secure_url: permanentDataUrl,
          url: permanentDataUrl,
          public_id: `db_${Date.now()}`,
          publicId: `db_${Date.now()}`,
          storage: 'database-permanent',
          warning: errorNotice,
        },
        { headers: NO_CACHE_HEADERS }
      );
    }
  } catch (err: any) {
    const errorDetails = err?.message || 'Failed to upload image';
    return NextResponse.json(
      { success: false, error: errorDetails },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

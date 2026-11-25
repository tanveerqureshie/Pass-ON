import { NextRequest, NextResponse } from 'next/server';
import { uploadImageFile } from '@/backend/services/cloudinary.service';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'passiton/products';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const result = await uploadImageFile(file, folder);

    return NextResponse.json(
      {
        success: true,
        secure_url: result.secure_url,
        url: result.secure_url,
        public_id: result.public_id,
        publicId: result.public_id,
        storage: result.storage,
        ...(result.warning ? { warning: result.warning } : {}),
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: unknown) {
    const errorDetails = err instanceof Error ? err.message : 'Failed to upload image';
    const status = errorDetails.includes('Invalid file type') || errorDetails.includes('5MB limit') ? 400 : 500;
    return NextResponse.json(
      { success: false, error: errorDetails },
      { status, headers: NO_CACHE_HEADERS }
    );
  }
}

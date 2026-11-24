import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'pass-on',
  api_key: process.env.CLOUDINARY_API_KEY || '948987984819147',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'WXH3MV1nQpb0TWrNHD5n-rilze8',
  secure: true,
});

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '').trim();
    const apiKey = (process.env.CLOUDINARY_API_KEY || '948987984819147').trim();
    const apiSecret = (process.env.CLOUDINARY_API_SECRET || 'WXH3MV1nQpb0TWrNHD5n-rilze8').trim();

    if (!cloudName) {
      console.error('Cloudinary Error: CLOUDINARY_CLOUD_NAME is not set in .env.local');
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing Cloud Name: Please set CLOUDINARY_CLOUD_NAME in your .env.local file (found in your Cloudinary Dashboard at console.cloudinary.com).',
        },
        { status: 400 }
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'pass-on';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Stream upload directly to Cloudinary
    try {
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
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
      return NextResponse.json({
        success: true,
        url: secureUrl,
        publicId: uploadResult.public_id,
        storage: 'cloudinary',
      });
    } catch (cldErr: any) {
      console.warn('Cloudinary upload warning, saving permanent image to database:', cldErr?.message || cldErr);
      const mimeType = file.type || 'image/jpeg';
      const base64Data = buffer.toString('base64');
      const permanentDataUrl = `data:${mimeType};base64,${base64Data}`;
      return NextResponse.json({
        success: true,
        url: permanentDataUrl,
        storage: 'database-permanent',
        warning: 'Image saved permanently in database.',
      });
    }
  } catch (err: any) {
    let errorDetails = err?.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
    if (err?.http_code === 403 || errorDetails.includes('403') || errorDetails.includes('missing permissions')) {
      errorDetails =
        'Cloudinary Error (403): The API Key is missing "create" (upload) permissions. In Cloudinary Console, go to Settings -> Access Keys, edit your API key permissions to allow "create", or use your Master API Key.';
    }
    console.error('Cloudinary upload error:', errorDetails);
    return NextResponse.json(
      { success: false, error: errorDetails || 'Failed to upload image to Cloudinary' },
      { status: 500 }
    );
  }
}

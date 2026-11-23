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
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'pass-on';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Stream upload directly to Cloudinary
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
    });
  } catch (err: any) {
    console.error('Cloudinary upload error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to upload image to Cloudinary' },
      { status: 500 }
    );
  }
}

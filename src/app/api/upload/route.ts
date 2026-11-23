import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xpspymjknipcyoachatz.supabase.co';
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhwc3B5bWprbmlwY3lvYWNoYXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyNDUzMDIsImV4cCI6MjExMDgyMTMwMn0.x_LH6jyTrZ1IpJU7g5KZ9T_RG-Zb_OBpLeQDq6RkftM';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'product-images';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in form data' },
        { status: 400 }
      );
    }

    // Determine extension
    let ext = 'jpg';
    if (file.name) {
      ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    }
    ext = ext.replace(/[^a-z0-9]/gi, '');
    if (!ext) ext = 'jpg';

    // Unique filename using timestamp + random UUID
    const randomId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 10);
    const uniqueFileName = `${Date.now()}-${randomId}.${ext}`;
    const filePath = `products/${uniqueFileName}`;

    // Read file bytes into array buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });

    // Upload directly to Supabase storage bucket (never touch Vercel filesystem)
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        cacheControl: '31536000',
        upsert: false,
      });

    if (uploadError) {
      console.error('API route Supabase storage upload failed:', uploadError);
      return NextResponse.json(
        { success: false, error: uploadError.message },
        { status: 500 }
      );
    }

    // Get permanent public URL
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      return NextResponse.json(
        { success: false, error: 'Failed to retrieve permanent public URL' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        publicUrl: data.publicUrl,
        filePath,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error during upload';
    console.error('Upload API route error:', err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

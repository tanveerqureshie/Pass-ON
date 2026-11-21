import { NextRequest, NextResponse } from 'next/server';
import { getAllInquiries, saveInquiry, updateInquiryStatus } from '@/lib/server/db';
import { Inquiry } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET: Returns all inquiries across the campus network
export async function GET() {
  try {
    const inquiries = await getAllInquiries();
    return NextResponse.json({ success: true, inquiries });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch inquiries';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// POST: Creates a new inquiry
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Inquiry;
    if (!body || !body.listingId || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Listing ID and message are required' },
        { status: 400 }
      );
    }

    const saved = await saveInquiry(body);
    return NextResponse.json({ success: true, inquiry: saved });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save inquiry';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// PATCH: Updates inquiry status
export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as { id: string; status: Inquiry['status'] };
    if (!body.id || !body.status) {
      return NextResponse.json(
        { success: false, error: 'Inquiry ID and status are required' },
        { status: 400 }
      );
    }

    const ok = await updateInquiryStatus(body.id, body.status);
    return NextResponse.json({ success: ok });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update inquiry';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

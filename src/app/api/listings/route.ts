import { NextRequest, NextResponse } from 'next/server';
import { getAllListings, saveListing, deleteListing } from '@/lib/server/db';
import { Listing } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET: Returns all marketplace listings across all devices
export async function GET() {
  try {
    const listings = await getAllListings();
    return NextResponse.json({ success: true, listings });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch listings';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// POST: Publishes a new listing (with uploaded item photos)
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Listing;
    if (!body || !body.title || !body.categoryId) {
      return NextResponse.json(
        { success: false, error: 'Title and category are required' },
        { status: 400 }
      );
    }

    const saved = await saveListing(body);
    return NextResponse.json({ success: true, listing: saved });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save listing';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// DELETE: Removes a listing
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    const deleted = await deleteListing(id);
    return NextResponse.json({ success: deleted });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete listing';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

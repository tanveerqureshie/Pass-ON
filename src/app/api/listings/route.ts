import { NextRequest, NextResponse } from 'next/server';
import { getAllListings, saveListing, deleteListing } from '@/lib/server/db';
import { Listing } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
};

// GET: Returns all marketplace listings across all devices
export async function GET() {
  try {
    const listings = await getAllListings();
    return NextResponse.json(
      { success: true, listings },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch listings';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

// POST: Publishes a new listing (with uploaded item photos)
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Listing;
    if (!body || !body.title || !body.categoryId) {
      return NextResponse.json(
        { success: false, error: 'Title and category are required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const saved = await saveListing(body);
    return NextResponse.json(
      { success: true, listing: saved },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save listing';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

// DELETE: Removes a listing
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || !id.trim()) {
      return NextResponse.json(
        { success: false, error: 'Listing ID is required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const cleanId = id.trim();
    const deleted = await deleteListing(cleanId);
    return NextResponse.json(
      { success: deleted, deletedId: cleanId },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete listing';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

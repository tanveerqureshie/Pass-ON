import { NextRequest, NextResponse } from 'next/server';
import { getAllReports, saveReport, updateReportStatus } from '@/lib/server/db';
import { Report } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET: Returns all reports for moderation
export async function GET() {
  try {
    const reports = await getAllReports();
    return NextResponse.json({ success: true, reports });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch reports';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// POST: Submits a new report on a listing
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Report;
    if (!body || !body.listingId || !body.reason) {
      return NextResponse.json(
        { success: false, error: 'Listing ID and reason are required' },
        { status: 400 }
      );
    }

    const saved = await saveReport(body);
    return NextResponse.json({ success: true, report: saved });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save report';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// PATCH: Resolves or updates report status
export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      id: string;
      status: Report['status'];
      adminNotes?: string;
    };
    if (!body.id || !body.status) {
      return NextResponse.json(
        { success: false, error: 'Report ID and status are required' },
        { status: 400 }
      );
    }

    const ok = await updateReportStatus(body.id, body.status, body.adminNotes);
    return NextResponse.json({ success: ok });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update report';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

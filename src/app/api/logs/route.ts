import { NextRequest, NextResponse } from 'next/server';
import { getAllAuditLogs, saveAuditLog } from '@/lib/server/db';
import { AuditLog } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const logs = await getAllAuditLogs();
    return NextResponse.json({ success: true, logs });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch audit logs';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AuditLog;
    if (!body || !body.action) {
      return NextResponse.json(
        { success: false, error: 'Log action is required' },
        { status: 400 }
      );
    }

    const saved = await saveAuditLog(body);
    return NextResponse.json({ success: true, log: saved });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save audit log';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/backend/services/auth.service';

export const dynamic = 'force-dynamic';

export async function POST() {
  const res = NextResponse.json({ success: true });
  clearSessionCookie(res);
  return res;
}

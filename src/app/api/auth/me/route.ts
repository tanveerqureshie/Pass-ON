import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/backend/db/mongodb';
import { getAllStudents } from '@/lib/server/db';
import { DEFAULT_ADMIN_PROFILE, isAdminEmail } from '@/context/AppContext';
import {
  SESSION_COOKIE_NAME,
  sanitizeUser,
  verifySessionToken,
} from '@/backend/services/auth.service';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
};

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ success: false, user: null }, { headers: NO_CACHE_HEADERS });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, user: null }, { headers: NO_CACHE_HEADERS });
    }

    if (payload.role === 'admin' || isAdminEmail(payload.email)) {
      return NextResponse.json(
        {
          success: true,
          user: {
            ...DEFAULT_ADMIN_PROFILE,
            id: payload.id,
            email: payload.email,
            role: 'admin',
          },
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    let student: any = null;
    try {
      const db = await getDb();
      student = await db.collection('students').findOne({
        $or: [{ id: payload.id }, { email: payload.email.toLowerCase() }],
      });
    } catch {
      // fallback below
    }

    if (!student) {
      const all = await getAllStudents();
      student = all.find(
        (s) => s.id === payload.id || s.email.toLowerCase() === payload.email.toLowerCase()
      );
    }

    if (!student) {
      return NextResponse.json({ success: false, user: null }, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json(
      { success: true, user: sanitizeUser(student) },
      { headers: NO_CACHE_HEADERS }
    );
  } catch {
    return NextResponse.json({ success: false, user: null }, { headers: NO_CACHE_HEADERS });
  }
}

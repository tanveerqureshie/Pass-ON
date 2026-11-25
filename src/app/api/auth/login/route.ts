import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/backend/db/mongodb';
import { getAllStudents } from '@/lib/server/db';
import { ADMIN_CREDENTIALS, DEFAULT_ADMIN_PROFILE } from '@/context/AppContext';
import {
  attachSessionCookie,
  checkLoginRateLimit,
  getClientIp,
  recordFailedLogin,
  resetLoginRateLimit,
  sanitizeUser,
  verifyPassword,
} from '@/backend/services/auth.service';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
};

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkLoginRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          field: 'general',
          message: `Too many login attempts. Please try again after ${rateCheck.retryAfterMinutes} minutes.`,
        },
        { status: 429, headers: NO_CACHE_HEADERS }
      );
    }

    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    if (!email || !password) {
      return NextResponse.json(
        { success: false, field: 'general', message: 'Email and password are required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    // Check Administrator credentials
    const matchingAdmin = ADMIN_CREDENTIALS.find(
      (c) =>
        c.email.toLowerCase() === email &&
        (c.password === password || c.password.toLowerCase() === password.toLowerCase())
    );
    if (matchingAdmin) {
      resetLoginRateLimit(ip);
      const adminProfile = {
        ...DEFAULT_ADMIN_PROFILE,
        email: matchingAdmin.email,
        fullName: matchingAdmin.name || 'Campus Administrator',
      };
      const res = NextResponse.json(
        { success: true, user: adminProfile },
        { headers: NO_CACHE_HEADERS }
      );
      attachSessionCookie(res, adminProfile);
      return res;
    }

    // Check MongoDB students collection
    let foundStudent: any = null;
    try {
      const db = await getDb();
      foundStudent = await db.collection('students').findOne({ email });
    } catch (e) {
      console.warn('DB lookup fallback:', e);
    }

    // Fallback to memory
    if (!foundStudent) {
      const all = await getAllStudents();
      foundStudent = all.find((s) => s.email.toLowerCase() === email);
    }

    if (!foundStudent) {
      recordFailedLogin(ip);
      return NextResponse.json(
        { success: false, field: 'email', message: 'Email or password is incorrect.' },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    const passwordMatches = await verifyPassword(password, foundStudent.password || '');
    if (!passwordMatches) {
      recordFailedLogin(ip);
      return NextResponse.json(
        { success: false, field: 'password', message: 'Email or password is incorrect.' },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    resetLoginRateLimit(ip);

    const safeUser = sanitizeUser(foundStudent);
    const res = NextResponse.json(
      { success: true, user: safeUser },
      { headers: NO_CACHE_HEADERS }
    );
    attachSessionCookie(res, {
      id: foundStudent.id,
      email: foundStudent.email,
      role: foundStudent.role || 'student',
    });
    return res;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Login failed';
    return NextResponse.json(
      { success: false, field: 'general', message: msg },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb/client';
import { getAllStudents } from '@/lib/server/db';
import { ADMIN_CREDENTIALS, DEFAULT_ADMIN_PROFILE } from '@/context/AppContext';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
};

// Rate limiting: Max 5 login attempts / 15 min per IP
interface RateEntry {
  attempts: number;
  firstAttempt: number;
}
const rateLimitMap = new Map<string, RateEntry>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (entry) {
      if (now - entry.firstAttempt > WINDOW_MS) {
        // Window expired, reset
        rateLimitMap.delete(ip);
      } else if (entry.attempts >= MAX_ATTEMPTS) {
        const remainingMinutes = Math.ceil((WINDOW_MS - (now - entry.firstAttempt)) / 60000);
        return NextResponse.json(
          {
            success: false,
            field: 'general',
            message: `Too many login attempts. Please try again after ${remainingMinutes} minutes.`,
          },
          { status: 429, headers: NO_CACHE_HEADERS }
        );
      }
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
      (c) => c.email.toLowerCase() === email && (c.password === password || c.password.toLowerCase() === password.toLowerCase())
    );
    if (matchingAdmin) {
      rateLimitMap.delete(ip);
      const adminProfile = {
        ...DEFAULT_ADMIN_PROFILE,
        email: matchingAdmin.email,
        fullName: matchingAdmin.name || 'Campus Administrator',
      };
      return NextResponse.json({ success: true, user: adminProfile }, { headers: NO_CACHE_HEADERS });
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
      // Record failed attempt
      const curr = rateLimitMap.get(ip) || { attempts: 0, firstAttempt: now };
      curr.attempts += 1;
      rateLimitMap.set(ip, curr);

      return NextResponse.json(
        { success: false, field: 'email', message: 'Email or password is incorrect.' },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    // Verify Password (handle both bcrypt hashed passwords and legacy plain-text passwords gracefully)
    let passwordMatches = false;
    if (foundStudent.password) {
      if (foundStudent.password.startsWith('$2a$') || foundStudent.password.startsWith('$2b$')) {
        passwordMatches = await bcrypt.compare(password, foundStudent.password);
      } else {
        passwordMatches = foundStudent.password === password;
      }
    }

    if (!passwordMatches) {
      const curr = rateLimitMap.get(ip) || { attempts: 0, firstAttempt: now };
      curr.attempts += 1;
      rateLimitMap.set(ip, curr);

      return NextResponse.json(
        { success: false, field: 'password', message: 'Email or password is incorrect.' },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    // Login successful - clear rate limit for this IP
    rateLimitMap.delete(ip);

    const safeUser = {
      ...foundStudent,
      password: undefined, // Never send password back
    };

    return NextResponse.json({ success: true, user: safeUser }, { headers: NO_CACHE_HEADERS });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Login failed';
    return NextResponse.json(
      { success: false, field: 'general', message: msg },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/backend/config/env';
import { UserProfile, UserRole } from '@/lib/types';

export const SESSION_COOKIE_NAME = 'passon_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Rate limiting: Max 5 login attempts / 15 min per IP
interface RateEntry {
  attempts: number;
  firstAttempt: number;
}
const rateLimitMap = new Map<string, RateEntry>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

export function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfterMinutes?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) return { allowed: true };

  if (now - entry.firstAttempt > WINDOW_MS) {
    rateLimitMap.delete(ip);
    return { allowed: true };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    const remainingMinutes = Math.ceil((WINDOW_MS - (now - entry.firstAttempt)) / 60000);
    return { allowed: false, retryAfterMinutes: remainingMinutes };
  }
  return { allowed: true };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    rateLimitMap.set(ip, { attempts: 1, firstAttempt: now });
  } else {
    entry.attempts += 1;
  }
}

export function resetLoginRateLimit(ip: string): void {
  rateLimitMap.delete(ip);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  if (!stored) return false;
  if (stored.startsWith('$2a$') || stored.startsWith('$2b$')) {
    return bcrypt.compare(plain, stored);
  }
  return plain === stored;
}

export interface SessionPayload {
  id: string;
  email: string;
  role: UserRole;
  exp: number;
}

export function signSessionToken(user: Pick<UserProfile, 'id' | 'email' | 'role'>): string {
  const payload: SessionPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = crypto
    .createHmac('sha256', env.authSecret)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${sig}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [encoded, sig] = token.split('.');
    if (!encoded || !sig) return null;

    const expectedSig = crypto
      .createHmac('sha256', env.authSecret)
      .update(encoded)
      .digest('base64url');

    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function attachSessionCookie(res: NextResponse, user: Pick<UserProfile, 'id' | 'email' | 'role'>): void {
  const token = signSessionToken(user);
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.isProduction,
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.isProduction,
    path: '/',
    maxAge: 0,
  });
}

export function sanitizeUser<T extends { password?: string }>(user: T): Omit<T, 'password'> {
  const copy = { ...user };
  delete copy.password;
  return copy;
}

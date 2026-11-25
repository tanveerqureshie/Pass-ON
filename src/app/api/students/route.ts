import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/backend/db/mongodb';
import { saveStudent, getAllStudents, updateStudentStatus } from '@/lib/server/db';
import { UserProfile, VerificationStatus } from '@/lib/types';
import { attachSessionCookie, hashPassword, sanitizeUser } from '@/backend/services/auth.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
};

// GET: Returns all students registered across all devices (sanitized)
export async function GET() {
  try {
    const students = await getAllStudents();
    return NextResponse.json(
      { success: true, students: students.map((s) => sanitizeUser(s)) },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch students';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

// POST: Registers a new student with strict validation, duplicate check, bcrypt hashing & session cookie
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<UserProfile> & { password?: string };

    const fullName = (body.fullName || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    // 1. Name validation: Required, min 3 chars, letters/spaces only
    if (!fullName || fullName.length < 3) {
      return NextResponse.json(
        { success: false, field: 'fullName', message: 'Full name is required (minimum 3 characters).' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }
    if (!/^[a-zA-Z\s.'-]+$/.test(fullName)) {
      return NextResponse.json(
        { success: false, field: 'fullName', message: 'Name can only contain letters and spaces.' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    // 2. Email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, field: 'email', message: 'Please enter a valid email address.' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    // 3. Password validation: Min 8 chars, 1 upper, 1 lower, 1 number, 1 symbol
    if (!password || password.length < 8) {
      return NextResponse.json(
        { success: false, field: 'password', message: 'Password must be at least 8 characters.' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }
    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      return NextResponse.json(
        {
          success: false,
          field: 'password',
          message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.',
        },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    // 4. Duplicate email check in MongoDB & Memory
    try {
      const db = await getDb();
      try {
        await db.collection('students').createIndex({ email: 1 }, { unique: true });
      } catch {
        // Index may already exist
      }

      const existingInDb = await db.collection('students').findOne({ email });
      if (existingInDb && existingInDb.id !== body.id) {
        return NextResponse.json(
          { success: false, field: 'email', message: 'Email already in use' },
          { status: 409, headers: NO_CACHE_HEADERS }
        );
      }
    } catch (dbErr) {
      console.warn('MongoDB duplicate check fallback:', dbErr);
    }

    const allStudents = await getAllStudents();
    const duplicate = allStudents.find((s) => s.email.toLowerCase() === email && s.id !== body.id);
    if (duplicate) {
      return NextResponse.json(
        { success: false, field: 'email', message: 'Email already in use' },
        { status: 409, headers: NO_CACHE_HEADERS }
      );
    }

    // 5. Hash password with bcrypt (10 rounds)
    const hashedPassword = await hashPassword(password);

    const studentToSave: UserProfile = {
      id: body.id || `student_${Date.now()}`,
      email,
      fullName,
      phoneNumber: body.phoneNumber?.trim() || undefined,
      instagramHandle: body.instagramHandle?.trim()?.replace(/^@/, '') || undefined,
      contactPreference: body.contactPreference || 'whatsapp',
      idCardUrl: body.idCardUrl || undefined,
      enrollmentNumber: body.enrollmentNumber?.trim() || undefined,
      collegeId: body.collegeId || 'mait',
      collegeName: body.collegeName || undefined,
      collegeShortName: body.collegeShortName || undefined,
      branch: body.branch || 'CSE',
      academicYear: body.academicYear || '2nd Year',
      role: 'student',
      verificationStatus: 'pending',
      createdAt: body.createdAt || new Date().toISOString(),
      password: hashedPassword,
    };

    const saved = await saveStudent(studentToSave);
    const safeStudent = sanitizeUser(saved);

    const res = NextResponse.json(
      { success: true, student: safeStudent },
      { headers: NO_CACHE_HEADERS }
    );
    attachSessionCookie(res, {
      id: saved.id,
      email: saved.email,
      role: saved.role || 'student',
    });
    return res;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to register student';
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

// PATCH: Updates student verification status (Approve / Reject from Admin Panel)
export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      userId: string;
      verificationStatus: VerificationStatus;
      rejectionReason?: string;
      verifiedBy?: string;
    };

    if (!body.userId || !body.verificationStatus) {
      return NextResponse.json(
        { success: false, error: 'User ID and status are required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const updated = await updateStudentStatus(
      body.userId,
      body.verificationStatus,
      body.rejectionReason,
      body.verifiedBy
    );

    return NextResponse.json(
      { success: true, student: updated ? sanitizeUser(updated) : null },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update student verification';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

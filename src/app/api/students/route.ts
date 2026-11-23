import { NextRequest, NextResponse } from 'next/server';
import { getAllStudents, saveStudent, updateStudentStatus } from '@/lib/server/db';
import { UserProfile, VerificationStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

// GET: Returns all students registered across all devices
export async function GET() {
  try {
    const students = await getAllStudents();
    return NextResponse.json(
      { success: true, students },
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

// POST: Registers a new student (with ID card photo)
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as UserProfile;
    if (!body || !body.email || !body.fullName) {
      return NextResponse.json(
        { success: false, error: 'Email and full name are required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const saved = await saveStudent(body);
    return NextResponse.json(
      { success: true, student: saved },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to register student';
    return NextResponse.json(
      { success: false, error: msg },
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
      { success: true, student: updated },
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

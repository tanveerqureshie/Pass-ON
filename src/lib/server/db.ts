import { getDb } from '@/lib/mongodb/client';
import fs from 'fs';
import path from 'path';
import {
  UserProfile,
  Listing,
  Inquiry,
  Report,
  AuditLog,
  VerificationStatus,
} from '@/lib/types';

export interface ServerDbData {
  students: UserProfile[];
  listings: Listing[];
  inquiries: Inquiry[];
  reports: Report[];
  auditLogs: AuditLog[];
}

let memoryDb: ServerDbData = {
  students: [],
  listings: [],
  inquiries: [],
  reports: [],
  auditLogs: [],
};

// Local JSON disk persistence helpers for backup / fallback resilience
function getPrimaryPath(): string {
  return path.join(process.cwd(), 'data', 'db.json');
}

function syncLocalBackup(data: Partial<ServerDbData>): void {
  try {
    const primaryPath = getPrimaryPath();
    const dir = path.dirname(primaryPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const current = { ...memoryDb, ...data };
    fs.writeFileSync(primaryPath, JSON.stringify(current, null, 2), 'utf-8');
  } catch {
    // Non-fatal if read-only filesystem
  }
}

function loadLocalBackup(): void {
  try {
    const primaryPath = getPrimaryPath();
    if (fs.existsSync(primaryPath)) {
      const parsed = JSON.parse(fs.readFileSync(primaryPath, 'utf-8'));
      if (parsed) {
        if (Array.isArray(parsed.students)) memoryDb.students = parsed.students;
        if (Array.isArray(parsed.listings)) memoryDb.listings = parsed.listings;
        if (Array.isArray(parsed.inquiries)) memoryDb.inquiries = parsed.inquiries;
        if (Array.isArray(parsed.reports)) memoryDb.reports = parsed.reports;
        if (Array.isArray(parsed.auditLogs)) memoryDb.auditLogs = parsed.auditLogs;
      }
    }
  } catch {
    // Non-fatal
  }
}
loadLocalBackup();

// ==========================================
// LISTINGS
// ==========================================

function toDbListing(l: Listing) {
  return {
    id: l.id,
    owner_id: l.ownerId,
    owner_name: l.ownerName,
    owner_college_id: l.ownerCollegeId,
    owner_branch: l.ownerBranch || null,
    owner_academic_year: l.ownerAcademicYear || null,
    title: l.title,
    description: l.description || '',
    category_id: l.categoryId,
    category_name: l.categoryName || null,
    subcategory: l.subcategory || null,
    listing_type: l.listingType || 'sell',
    price: Number(l.price) || 0,
    condition: l.condition || 'good',
    college_id: l.collegeId,
    college_name: l.collegeName || '',
    college_short_name: l.collegeShortName || '',
    department: l.department || null,
    academic_year: l.academicYear || null,
    preferred_pickup_location: l.preferredPickupLocation || '',
    pickup_instructions: l.pickupInstructions || null,
    whatsapp_number: l.whatsappNumber || null,
    instagram_handle: l.instagramHandle || null,
    contact_preference: l.contactPreference || 'whatsapp',
    status: l.status || 'active',
    borrow_duration: l.borrowDuration || null,
    borrow_conditions: l.borrowConditions || null,
    exchange_preferences: l.exchangePreferences || null,
    views_count: l.viewsCount || 0,
    is_reported: !!l.isReported,
    is_demo: !!l.isDemo,
    images: Array.isArray(l.images) ? l.images : [],
    created_at: l.createdAt || new Date().toISOString(),
    updated_at: l.updatedAt || new Date().toISOString(),
  };
}

function fromDbListing(row: any): Listing {
  return {
    id: row.id,
    ownerId: row.owner_id,
    ownerName: row.owner_name,
    ownerCollegeId: row.owner_college_id,
    ownerBranch: row.owner_branch || undefined,
    ownerAcademicYear: row.owner_academic_year || undefined,
    title: row.title,
    description: row.description || '',
    categoryId: row.category_id,
    categoryName: row.category_name || undefined,
    subcategory: row.subcategory || undefined,
    listingType: row.listing_type || 'sell',
    price: Number(row.price) || 0,
    condition: row.condition || 'good',
    collegeId: row.college_id,
    collegeName: row.college_name || '',
    collegeShortName: row.college_short_name || '',
    department: row.department || undefined,
    academicYear: row.academic_year || undefined,
    preferredPickupLocation: row.preferred_pickup_location || '',
    pickupInstructions: row.pickup_instructions || undefined,
    whatsappNumber: row.whatsapp_number || undefined,
    instagramHandle: row.instagram_handle || undefined,
    contactPreference: row.contact_preference || 'whatsapp',
    status: row.status || 'active',
    borrowDuration: row.borrow_duration || undefined,
    borrowConditions: row.borrow_conditions || undefined,
    exchangePreferences: row.exchange_preferences || undefined,
    viewsCount: row.views_count || 0,
    isReported: !!row.is_reported,
    isDemo: !!row.is_demo,
    images: Array.isArray(row.images) ? row.images : [],
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
  };
}

export async function getAllListings(): Promise<Listing[]> {
  try {
    const db = await getDb();
    const rows = await db
      .collection('listings')
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    if (Array.isArray(rows) && rows.length > 0) {
      const items = rows.map(fromDbListing);
      memoryDb.listings = items;
      syncLocalBackup({ listings: items });
      return items;
    }
  } catch (err) {
    console.error('MongoDB getAllListings failed, using memory fallback:', err);
  }
  return memoryDb.listings;
}

export async function saveListing(listing: Listing): Promise<Listing> {
  const existingIdx = memoryDb.listings.findIndex((l) => l.id === listing.id);
  if (existingIdx >= 0) {
    memoryDb.listings[existingIdx] = listing;
  } else {
    memoryDb.listings.unshift(listing);
  }
  syncLocalBackup({ listings: memoryDb.listings });

  try {
    const db = await getDb();
    const row = toDbListing(listing);
    await db.collection('listings').updateOne(
      { id: listing.id },
      { $set: row },
      { upsert: true }
    );
  } catch (err) {
    console.error('MongoDB saveListing failed:', err);
  }

  return listing;
}

export async function deleteListing(id: string): Promise<boolean> {
  const cleanId = id.trim();
  memoryDb.listings = memoryDb.listings.filter((l) => l.id !== cleanId);
  syncLocalBackup({ listings: memoryDb.listings });

  try {
    const db = await getDb();
    await Promise.all([
      db.collection('listings').deleteOne({ id: cleanId }),
      db.collection('inquiries').deleteMany({ listing_id: cleanId }),
      db.collection('reports').deleteMany({ listing_id: cleanId }),
    ]);
    return true;
  } catch (err) {
    console.error('MongoDB deleteListing failed:', err);
    return false;
  }
}

// ==========================================
// STUDENTS & PROFILES
// ==========================================

function toDbProfile(s: UserProfile) {
  return {
    id: s.id,
    email: s.email,
    full_name: s.fullName,
    avatar_url: s.avatarUrl || null,
    phone_number: s.phoneNumber || null,
    instagram_handle: s.instagramHandle || null,
    contact_preference: s.contactPreference || 'whatsapp',
    id_card_url: s.idCardUrl || null,
    enrollment_number: s.enrollmentNumber || null,
    college_id: s.collegeId || null,
    college_name: s.collegeName || null,
    college_short_name: s.collegeShortName || null,
    branch: s.branch || null,
    academic_year: s.academicYear || null,
    role: s.role || 'student',
    verification_status: s.verificationStatus || 'pending',
    rejection_reason: s.rejectionReason || null,
    verified_at: s.verifiedAt || null,
    verified_by: s.verifiedBy || null,
    is_suspended: !!s.isSuspended,
    password: s.password || null,
    created_at: s.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function fromDbProfile(row: any): UserProfile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url || undefined,
    phoneNumber: row.phone_number || undefined,
    instagramHandle: row.instagram_handle || undefined,
    contactPreference: row.contact_preference || 'whatsapp',
    idCardUrl: row.id_card_url || undefined,
    enrollmentNumber: row.enrollment_number || undefined,
    collegeId: row.college_id || '',
    collegeName: row.college_name || undefined,
    collegeShortName: row.college_short_name || undefined,
    branch: row.branch || undefined,
    academicYear: row.academic_year || undefined,
    role: row.role || 'student',
    verificationStatus: row.verification_status || 'pending',
    rejectionReason: row.rejection_reason || undefined,
    verifiedAt: row.verified_at || undefined,
    verifiedBy: row.verified_by || undefined,
    isSuspended: !!row.is_suspended,
    createdAt: row.created_at || new Date().toISOString(),
    password: row.password || undefined,
  };
}

export async function getAllStudents(): Promise<UserProfile[]> {
  try {
    const db = await getDb();
    const rows = await db
      .collection('students')
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    if (Array.isArray(rows) && rows.length > 0) {
      const items = rows.map(fromDbProfile);
      memoryDb.students = items;
      syncLocalBackup({ students: items });
      return items;
    }
  } catch (err) {
    console.error('MongoDB getAllStudents failed, using fallback:', err);
  }
  return memoryDb.students;
}

export async function saveStudent(student: UserProfile): Promise<UserProfile> {
  const cleanEmail = student.email.trim().toLowerCase();
  const existingIdx = memoryDb.students.findIndex(
    (s) => s.id === student.id || s.email.toLowerCase() === cleanEmail
  );
  if (existingIdx >= 0) {
    memoryDb.students[existingIdx] = { ...memoryDb.students[existingIdx], ...student, email: cleanEmail };
  } else {
    memoryDb.students.unshift({ ...student, email: cleanEmail });
  }
  syncLocalBackup({ students: memoryDb.students });

  try {
    const db = await getDb();
    const row = toDbProfile(student);
    row.email = cleanEmail;

    await db.collection('students').updateOne(
      { $or: [{ id: student.id }, { email: cleanEmail }] },
      { $set: row },
      { upsert: true }
    );
  } catch (err) {
    console.error('MongoDB saveStudent failed:', err);
  }

  return student;
}

export async function updateStudentStatus(
  userId: string,
  status: VerificationStatus,
  reason?: string,
  verifiedBy?: string
): Promise<UserProfile | null> {
  const existing = memoryDb.students.find(
    (s) => s.id === userId || s.email.toLowerCase() === userId.toLowerCase()
  );
  if (existing) {
    existing.verificationStatus = status;
    existing.rejectionReason = status === 'rejected' ? reason : undefined;
    existing.verifiedAt = status === 'approved' ? new Date().toISOString() : undefined;
    existing.verifiedBy = verifiedBy;
    syncLocalBackup({ students: memoryDb.students });
  }

  try {
    const db = await getDb();
    const updates: Record<string, any> = {
      verification_status: status,
      updated_at: new Date().toISOString(),
    };
    if (status === 'rejected') {
      updates.rejection_reason = reason || null;
      updates.verified_at = null;
    } else if (status === 'approved') {
      updates.rejection_reason = null;
      updates.verified_at = new Date().toISOString();
      updates.verified_by = verifiedBy || null;
    }

    const result = await db.collection('students').findOneAndUpdate(
      { $or: [{ id: userId }, { email: userId.toLowerCase() }] },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (result) {
      return fromDbProfile(result);
    }
  } catch (err) {
    console.error('MongoDB updateStudentStatus failed:', err);
  }

  return existing || null;
}

// ==========================================
// INQUIRIES & CAMPUS REQUESTS
// ==========================================

function toDbInquiry(i: Inquiry) {
  return {
    id: i.id,
    listing_id: i.listingId,
    listing_title: i.listingTitle,
    listing_price: Number(i.listingPrice) || 0,
    listing_type: i.listingType || 'sell',
    sender_id: i.senderId,
    sender_name: i.senderName,
    sender_college: i.senderCollege || null,
    sender_branch: i.senderBranch || null,
    receiver_id: i.receiverId,
    receiver_name: i.receiverName,
    message: i.message,
    status: i.status || 'pending',
    created_at: i.createdAt || new Date().toISOString(),
  };
}

function fromDbInquiry(row: any): Inquiry {
  return {
    id: row.id,
    listingId: row.listing_id,
    listingTitle: row.listing_title,
    listingPrice: Number(row.listing_price) || 0,
    listingType: row.listing_type || 'sell',
    senderId: row.sender_id,
    senderName: row.sender_name,
    senderCollege: row.sender_college || '',
    senderBranch: row.sender_branch || undefined,
    receiverId: row.receiver_id,
    receiverName: row.receiver_name,
    message: row.message,
    status: row.status || 'pending',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export async function getAllInquiries(): Promise<Inquiry[]> {
  try {
    const db = await getDb();
    const rows = await db
      .collection('inquiries')
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    if (Array.isArray(rows) && rows.length > 0) {
      const items = rows.map(fromDbInquiry);
      memoryDb.inquiries = items;
      syncLocalBackup({ inquiries: items });
      return items;
    }
  } catch (err) {
    console.error('MongoDB getAllInquiries failed:', err);
  }
  return memoryDb.inquiries;
}

export async function saveInquiry(inquiry: Inquiry): Promise<Inquiry> {
  const existingIdx = memoryDb.inquiries.findIndex((i) => i.id === inquiry.id);
  if (existingIdx >= 0) {
    memoryDb.inquiries[existingIdx] = inquiry;
  } else {
    memoryDb.inquiries.unshift(inquiry);
  }
  syncLocalBackup({ inquiries: memoryDb.inquiries });

  try {
    const db = await getDb();
    const row = toDbInquiry(inquiry);
    await db.collection('inquiries').updateOne(
      { id: inquiry.id },
      { $set: row },
      { upsert: true }
    );
  } catch (err) {
    console.error('MongoDB saveInquiry failed:', err);
  }

  return inquiry;
}

export async function updateInquiryStatus(
  id: string,
  status: Inquiry['status']
): Promise<boolean> {
  const target = memoryDb.inquiries.find((i) => i.id === id);
  if (target) {
    target.status = status;
    syncLocalBackup({ inquiries: memoryDb.inquiries });
  }

  try {
    const db = await getDb();
    const res = await db.collection('inquiries').updateOne({ id }, { $set: { status } });
    return res.acknowledged;
  } catch (err) {
    console.error('MongoDB updateInquiryStatus failed:', err);
    return false;
  }
}

// ==========================================
// REPORTS & MODERATION
// ==========================================

function toDbReport(r: Report) {
  return {
    id: r.id,
    listing_id: r.listingId,
    listing_title: r.listingTitle,
    reporter_id: r.reporterId,
    reporter_name: r.reporterName,
    reason: r.reason,
    details: r.details || null,
    status: r.status || 'pending',
    admin_notes: r.adminNotes || null,
    created_at: r.createdAt || new Date().toISOString(),
    resolved_at: r.status === 'action_taken' ? new Date().toISOString() : null,
  };
}

function fromDbReport(row: any): Report {
  return {
    id: row.id,
    listingId: row.listing_id,
    listingTitle: row.listing_title,
    reporterId: row.reporter_id,
    reporterName: row.reporter_name,
    reason: row.reason,
    details: row.details || undefined,
    status: row.status || 'pending',
    adminNotes: row.admin_notes || undefined,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export async function getAllReports(): Promise<Report[]> {
  try {
    const db = await getDb();
    const rows = await db
      .collection('reports')
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    if (Array.isArray(rows) && rows.length > 0) {
      const items = rows.map(fromDbReport);
      memoryDb.reports = items;
      syncLocalBackup({ reports: items });
      return items;
    }
  } catch (err) {
    console.error('MongoDB getAllReports failed:', err);
  }
  return memoryDb.reports;
}

export async function saveReport(report: Report): Promise<Report> {
  const existingIdx = memoryDb.reports.findIndex((r) => r.id === report.id);
  if (existingIdx >= 0) {
    memoryDb.reports[existingIdx] = report;
  } else {
    memoryDb.reports.unshift(report);
  }
  syncLocalBackup({ reports: memoryDb.reports });

  try {
    const db = await getDb();
    const row = toDbReport(report);
    await db.collection('reports').updateOne(
      { id: report.id },
      { $set: row },
      { upsert: true }
    );
  } catch (err) {
    console.error('MongoDB saveReport failed:', err);
  }

  return report;
}

export async function updateReportStatus(
  id: string,
  status: Report['status'],
  adminNotes?: string
): Promise<boolean> {
  const target = memoryDb.reports.find((r) => r.id === id);
  if (target) {
    target.status = status;
    if (adminNotes) target.adminNotes = adminNotes;
    syncLocalBackup({ reports: memoryDb.reports });
  }

  try {
    const db = await getDb();
    const updates: Record<string, any> = {
      status,
      resolved_at: status === 'action_taken' ? new Date().toISOString() : null,
    };
    if (adminNotes) {
      updates.admin_notes = adminNotes;
    }
    const res = await db.collection('reports').updateOne({ id }, { $set: updates });
    return res.acknowledged;
  } catch (err) {
    console.error('MongoDB updateReportStatus failed:', err);
    return false;
  }
}

// ==========================================
// AUDIT LOGS
// ==========================================

function toDbAuditLog(l: AuditLog) {
  return {
    id: l.id,
    admin_id: l.adminId,
    admin_name: l.adminName,
    action: l.action,
    target_type: l.targetType,
    target_id: l.targetId,
    details: l.details || '',
    created_at: l.createdAt || new Date().toISOString(),
  };
}

function fromDbAuditLog(row: any): AuditLog {
  return {
    id: row.id,
    adminId: row.admin_id,
    adminName: row.admin_name,
    action: row.action,
    targetType: row.target_type as any,
    targetId: row.target_id,
    details: row.details || '',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export async function getAllAuditLogs(): Promise<AuditLog[]> {
  try {
    const db = await getDb();
    const rows = await db
      .collection('audit_logs')
      .find({})
      .sort({ created_at: -1 })
      .limit(100)
      .toArray();

    if (Array.isArray(rows) && rows.length > 0) {
      const items = rows.map(fromDbAuditLog);
      memoryDb.auditLogs = items;
      return items;
    }
  } catch (err) {
    console.error('MongoDB getAllAuditLogs failed:', err);
  }
  return memoryDb.auditLogs;
}

export async function saveAuditLog(log: AuditLog): Promise<AuditLog> {
  memoryDb.auditLogs.unshift(log);
  if (memoryDb.auditLogs.length > 200) memoryDb.auditLogs.pop();

  try {
    const db = await getDb();
    const row = toDbAuditLog(log);
    await db.collection('audit_logs').insertOne(row);
  } catch (err) {
    console.error('MongoDB saveAuditLog failed:', err);
  }

  return log;
}

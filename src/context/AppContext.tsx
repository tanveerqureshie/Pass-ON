'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  College,
  Category,
  Listing,
  UserProfile,
  Inquiry,
  Report,
  AuditLog,
  ListingStatus,
  VerificationStatus,
} from '@/lib/types';
import { INITIAL_COLLEGES } from '@/lib/data/colleges';
import { INITIAL_CATEGORIES } from '@/lib/data/categories';
import { SEED_LISTINGS } from '@/lib/data/seed-listings';
import { createClient } from '@/lib/supabase/client';

export const ADMIN_EMAIL = 'mrtanveerqureshi@gmail.com';
export const ADMIN_PASSWORD = 'MrVeer9906';

/* All administrator credential sets accepted by the sign-in portal.
   NOTE: keep this server-side in a real deployment. */
export const ADMIN_CREDENTIALS: ReadonlyArray<{ email: string; password: string; name?: string }> = [
  { email: 'mrtanveerqureshi@gmail.com', password: 'MrVeer9906', name: 'Tanveer Qureshi (Founder)' },
  { email: 'mrtanveerqureshie@gmail.com', password: 'MrVeer9906', name: 'Tanveer Qureshi (Founder)' },
  { email: 'admin321@gmail.com', password: 'Admin321', name: 'Campus Admin Partner' },
  { email: 'admin321@gmail.com', password: 'admin321', name: 'Campus Admin Partner' },
  { email: 'passon@gmail.com', password: 'passon@321', name: 'Pass ON Team' },
];

const ADMIN_EMAILS: ReadonlyArray<string> = [
  ADMIN_EMAIL,
  'mrtanveerqureshie@gmail.com',
  'admin321@gmail.com',
  'admin@passon.in',
  'passon@gmail.com',
];

export const isAdminEmail = (email: string) =>
  ADMIN_EMAILS.includes(email.trim().toLowerCase());

// Single clean initial Admin Account
export const DEFAULT_ADMIN_PROFILE: UserProfile = {
  id: 'admin-tanveer-01',
  email: ADMIN_EMAIL,
  fullName: 'Tanveer Qureshi',
  collegeId: 'mait',
  collegeName: 'Maharaja Agrasen Institute of Technology',
  branch: 'CSE',
  academicYear: 'Campus Administration',
  enrollmentNumber: 'ADM-TQ-001',
  role: 'admin',
  verificationStatus: 'approved',
  createdAt: new Date().toISOString(),
};

interface AppContextType {
  // Current user & Auth
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  isUserVerified: boolean;
  loginWithEmail: (email: string, password?: string) => UserProfile | null;

  // Verification & Student Management
  registeredStudents: UserProfile[];
  registerStudent: (student: UserProfile) => Promise<boolean> | void;
  approveStudent: (userId: string) => Promise<boolean> | void;
  rejectStudent: (userId: string, reason: string) => Promise<boolean> | void;

  // Colleges
  colleges: College[];
  selectedCollegeId: string;
  setSelectedCollegeId: (id: string) => void;
  selectedCollege: College | undefined;
  addCollege: (college: College) => void;
  updateCollege: (id: string, updates: Partial<College>) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;

  // Listings
  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>) => Listing | null;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => Promise<boolean> | void;
  updateListingStatus: (id: string, status: ListingStatus) => void;

  // Saved Listings
  savedListingIds: string[];
  toggleSaveListing: (id: string) => void;
  isListingSaved: (id: string) => boolean;

  // Inquiries & Requests
  inquiries: Inquiry[];
  sendInquiry: (listingId: string, message: string) => boolean;

  // Reports & Moderation
  reports: Report[];
  reportListing: (listingId: string, reason: string, details?: string) => void;
  updateReportStatus: (id: string, status: Report['status'], adminNotes?: string) => void;
  resolveReport: (id: string, adminNotes?: string) => void;
  dismissReport: (id: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  logAdminAction: (action: string, targetType: AuditLog['targetType'], targetId: string, details: string) => void;

  // Theme Toggle Mode
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Fresh V3 storage keys so legacy dummy data is not rehydrated
const STORAGE_KEY_LISTINGS = 'passon_listings_v3';
const STORAGE_KEY_DELETED_LISTINGS = 'passon_deleted_listings_v3';
const STORAGE_KEY_SAVED = 'passon_saved_v3';
const STORAGE_KEY_USER = 'passon_user_v3';
const STORAGE_KEY_STUDENTS = 'passon_students_v3';
const STORAGE_KEY_COLLEGES = 'passon_colleges_v3';
const STORAGE_KEY_COLLEGE_ID = 'passon_selected_college_v3';
const STORAGE_KEY_INQUIRIES = 'passon_inquiries_v3';
const STORAGE_KEY_REPORTS = 'passon_reports_v3';
const STORAGE_KEY_LOGS = 'passon_logs_v3';

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Tombstone set of permanently deleted listing IDs to prevent re-hydration from stale network caches
  const deletedListingIds = useRef<Set<string>>(new Set());

  // Initial state: starts completely fresh with null user and clean student list
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [registeredStudents, setRegisteredStudents] = useState<UserProfile[]>([]);
  const [colleges, setColleges] = useState<College[]>(INITIAL_COLLEGES);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('mait');
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [listings, setListings] = useState<Listing[]>(SEED_LISTINGS);
  const [savedListingIds, setSavedListingIds] = useState<string[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-init-1',
      adminId: 'admin-passon-01',
      adminName: 'Campus Administrator',
      action: 'System Initialized',
      targetType: 'college',
      targetId: 'all-campuses',
      details: 'Pass ON platform initialized with Delhi engineering institutions.',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Sync theme with HTML class — always default to clean light/white mode unless explicitly set to 'dark'
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('passon_theme') as 'light' | 'dark' | null;
      if (savedTheme === 'dark') {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      }
    } catch {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('passon_theme', next);
      } catch {
        // storage disabled
      }
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Synchronize state with central Next.js server API endpoints (Bidirectional Smart Merge with Cache Busting)
  const syncFromServer = async () => {
    try {
      const ts = Date.now();
      const [resStudents, resListings, resInquiries, resReports, resLogs] = await Promise.all([
        fetch(`/api/students?t=${ts}`, { cache: 'no-store' }),
        fetch(`/api/listings?t=${ts}`, { cache: 'no-store' }),
        fetch(`/api/inquiries?t=${ts}`, { cache: 'no-store' }),
        fetch(`/api/reports?t=${ts}`, { cache: 'no-store' }),
        fetch(`/api/logs?t=${ts}`, { cache: 'no-store' }),
      ]);

      if (resStudents.ok) {
        const data = await resStudents.json();
        if (data.success && Array.isArray(data.students)) {
          setRegisteredStudents(data.students);
          try {
            localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(data.students));
          } catch {}

          // If current logged-in user is a student, sync verification status updates
          setCurrentUser((prev) => {
            if (!prev) return null;
            if (prev.role === 'admin') return prev;
            const updatedProfile = data.students.find(
              (s: UserProfile) =>
                s.id === prev.id || s.email.toLowerCase() === prev.email.toLowerCase()
            );
            if (
              updatedProfile &&
              (updatedProfile.verificationStatus !== prev.verificationStatus ||
                updatedProfile.role !== prev.role)
            ) {
              const merged = { ...prev, ...updatedProfile };
              try {
                localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(merged));
              } catch {}
              return merged;
            }
            return prev;
          });
        }
      }

      if (resListings.ok) {
        const data = await resListings.json();
        if (data.success && Array.isArray(data.listings)) {
          // Filter out any listings that have been deleted locally to prevent resurrection from stale network caches
          const freshListings = data.listings.filter(
            (l: Listing) => !deletedListingIds.current.has(l.id)
          );
          setListings(freshListings);
          try {
            localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(freshListings));
          } catch {}
        }
      }

      if (resInquiries.ok) {
        const inqData = await resInquiries.json();
        if (inqData.success && Array.isArray(inqData.inquiries)) {
          setInquiries(inqData.inquiries);
          try {
            localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(inqData.inquiries));
          } catch {}
        }
      }

      if (resReports.ok) {
        const repData = await resReports.json();
        if (repData.success && Array.isArray(repData.reports)) {
          setReports(repData.reports);
          try {
            localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(repData.reports));
          } catch {}
        }
      }

      if (resLogs.ok) {
        const logsData = await resLogs.json();
        if (logsData.success && Array.isArray(logsData.logs) && logsData.logs.length > 0) {
          setAuditLogs(logsData.logs);
          try {
            localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logsData.logs));
          } catch {}
        }
      }
    } catch {
      // Offline fallback
    }
  };

  useEffect(() => {
    try {
      // Restore deleted listing IDs tombstone
      const storedDeleted = localStorage.getItem(STORAGE_KEY_DELETED_LISTINGS);
      if (storedDeleted) {
        try {
          const parsed = JSON.parse(storedDeleted) as string[];
          if (Array.isArray(parsed)) {
            parsed.forEach((id) => deletedListingIds.current.add(id));
          }
        } catch {}
      }

      // Drop pre-v3 browser data so old demo users/listings cannot reappear.
      localStorage.removeItem('passon_listings');
      localStorage.removeItem('passon_students');
      localStorage.removeItem('passon_user');
      const storedListings = localStorage.getItem(STORAGE_KEY_LISTINGS);
      if (storedListings) {
        const parsed = JSON.parse(storedListings) as Listing[];
        setListings(
          parsed.filter((listing) => !listing.isDemo && !deletedListingIds.current.has(listing.id))
        );
      }

      const storedSaved = localStorage.getItem(STORAGE_KEY_SAVED);
      if (storedSaved) setSavedListingIds(JSON.parse(storedSaved));

      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && parsed.email) {
            setCurrentUser(parsed);
          } else {
            setCurrentUser(null);
          }
        } catch {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }

      const storedStudents = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (storedStudents) {
        try {
          const parsed = JSON.parse(storedStudents) as UserProfile[];
          setRegisteredStudents(Array.isArray(parsed) ? parsed.filter((s) => s.id !== 'admin-tanveer-01') : []);
        } catch {
          setRegisteredStudents([]);
        }
      } else {
        setRegisteredStudents([]);
      }

      const storedCollegeId = localStorage.getItem(STORAGE_KEY_COLLEGE_ID);
      if (storedCollegeId) setSelectedCollegeId(storedCollegeId);

      const storedColleges = localStorage.getItem(STORAGE_KEY_COLLEGES);
      if (storedColleges) setColleges(JSON.parse(storedColleges));

      const storedInquiries = localStorage.getItem(STORAGE_KEY_INQUIRIES);
      if (storedInquiries) setInquiries(JSON.parse(storedInquiries));

      const storedReports = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (storedReports) setReports(JSON.parse(storedReports));

      const storedLogs = localStorage.getItem(STORAGE_KEY_LOGS);
      if (storedLogs) setAuditLogs(JSON.parse(storedLogs));
    } catch {
      // Ignored
    }

    // Immediately sync with central server DB
    syncFromServer();

    // Auto-poll central database every 4 seconds for cross-device updates
    const interval = setInterval(syncFromServer, 4000);

    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        syncFromServer();
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      clearInterval(interval);
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const isUserVerified = currentUser?.role === 'admin' || currentUser?.verificationStatus === 'approved';

  // Register student (from personal email signup) - async to ensure server persistence before navigation
  const registerStudent = async (student: UserProfile): Promise<boolean> => {
    const cleanStudent: UserProfile = {
      ...student,
      email: student.email.trim().toLowerCase(),
      verificationStatus: student.verificationStatus || 'pending',
    };

    const updated = [
      cleanStudent,
      ...registeredStudents.filter(
        (s) => s.id !== cleanStudent.id && s.email.toLowerCase() !== cleanStudent.email
      ),
    ];
    setRegisteredStudents(updated);
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(updated));
    } catch {}

    setCurrentUser(cleanStudent);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(cleanStudent));
    } catch {}

    // Persist to central server database immediately and await confirmation
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanStudent),
      });
      const data = await res.json();
      if (data.success) {
        await syncFromServer();
      }
    } catch (err) {
      console.error('Error saving student to server:', err);
    }

    logAdminAction(
      'New Student Registered',
      'user',
      cleanStudent.id,
      `Student ${cleanStudent.fullName} (${cleanStudent.email}) registered from ${cleanStudent.collegeName}. Awaiting verification review.`
    );
    return true;
  };

  // Login with personal email & admin password authentication
  const loginWithEmail = (email: string, password?: string): UserProfile | null => {
    const trimmed = email.trim().toLowerCase();
    if (isAdminEmail(trimmed)) {
      const matchingCreds = ADMIN_CREDENTIALS.filter((c) => c.email.toLowerCase() === trimmed);
      if (!password || password.trim() === '') {
        return null;
      }
      const matches = matchingCreds.some(
        (c) => c.password === password.trim() || c.password.toLowerCase() === password.trim().toLowerCase()
      );
      if (!matches) {
        return null;
      }
      const cred = matchingCreds[0];
      const adminProfile: UserProfile = {
        ...DEFAULT_ADMIN_PROFILE,
        id: `admin-${trimmed.replace(/[^a-z0-9]/g, '-')}`,
        email: trimmed,
        fullName: cred?.name || 'Campus Administrator',
        role: 'admin',
        verificationStatus: 'approved',
      };
      setCurrentUser(adminProfile);
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(adminProfile));
      } catch {}
      showToast(`Logged in as Administrator (${adminProfile.fullName})`);
      return adminProfile;
    }

    const found = registeredStudents.find((s) => s.email.toLowerCase() === trimmed);
    if (found) {
      setCurrentUser(found);
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(found));
      } catch {}
      showToast(`Welcome back, ${found.fullName}!`);
      return found;
    }
    return null;
  };

  const approveStudent = async (userId: string) => {
    const updated = registeredStudents.map((s) =>
      s.id === userId || s.email.toLowerCase() === userId.toLowerCase()
        ? {
            ...s,
            verificationStatus: 'approved' as VerificationStatus,
            rejectionReason: undefined,
            verifiedAt: new Date().toISOString(),
            verifiedBy: currentUser?.id,
          }
        : s
    );
    setRegisteredStudents(updated);
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(updated));
    } catch {}

    // If current logged-in user is this student, update session
    if (currentUser && currentUser.role !== 'admin' && (currentUser.id === userId || currentUser.email.toLowerCase() === userId.toLowerCase())) {
      const selfUpdated = { ...currentUser, verificationStatus: 'approved' as VerificationStatus, rejectionReason: undefined };
      setCurrentUser(selfUpdated);
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(selfUpdated));
      } catch {}
    }

    try {
      await fetch('/api/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          verificationStatus: 'approved',
          verifiedBy: currentUser?.id,
        }),
      });
      await syncFromServer();
    } catch (err) {
      console.error('Error approving student on server:', err);
    }

    const student = registeredStudents.find((s) => s.id === userId || s.email.toLowerCase() === userId.toLowerCase());
    logAdminAction(
      'Approved Student Verification',
      'user',
      userId,
      `Verified ${student?.fullName || 'student'} (${student?.enrollmentNumber || 'no-id'}) against ${student?.collegeName || 'college'} department records.`
    );
    showToast(`Student ${student?.fullName || 'account'} approved and verified.`);
    return true;
  };

  const rejectStudent = async (userId: string, reason: string) => {
    const updated = registeredStudents.map((s) =>
      s.id === userId || s.email.toLowerCase() === userId.toLowerCase()
        ? {
            ...s,
            verificationStatus: 'rejected' as VerificationStatus,
            rejectionReason: reason,
          }
        : s
    );
    setRegisteredStudents(updated);
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(updated));
    } catch {}

    // Never degrade or lock out active admin sessions during moderation
    if (currentUser && currentUser.role !== 'admin' && (currentUser.id === userId || currentUser.email.toLowerCase() === userId.toLowerCase())) {
      const selfUpdated = {
        ...currentUser,
        verificationStatus: 'rejected' as VerificationStatus,
        rejectionReason: reason,
      };
      setCurrentUser(selfUpdated);
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(selfUpdated));
      } catch {}
    }

    try {
      await fetch('/api/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          verificationStatus: 'rejected',
          rejectionReason: reason,
          verifiedBy: currentUser?.id,
        }),
      });
      await syncFromServer();
    } catch (err) {
      console.error('Error rejecting student on server:', err);
    }

    const student = registeredStudents.find((s) => s.id === userId || s.email.toLowerCase() === userId.toLowerCase());
    logAdminAction(
      'Rejected Student Verification',
      'user',
      userId,
      `Rejected ${student?.fullName || 'student'} (${student?.enrollmentNumber || 'no-id'}): ${reason}`
    );
    showToast(`Verification rejected for ${student?.fullName || 'student'}.`);
    return true;
  };

  const logout = () => {
    try {
      const supabase = createClient();
      supabase.auth.signOut();
    } catch {
      // Ignored
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch {}
    showToast('Signed out of Pass ON');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const isReapplying = currentUser.verificationStatus === 'rejected';
    const updated: UserProfile = {
      ...currentUser,
      ...updates,
      verificationStatus: isReapplying ? ('pending' as VerificationStatus) : currentUser.verificationStatus,
      rejectionReason: isReapplying ? undefined : currentUser.rejectionReason,
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    } catch {}

    const updatedList = registeredStudents.map((s) => (s.id === currentUser.id ? updated : s));
    setRegisteredStudents(updatedList);
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(updatedList));
    } catch {}

    fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
      .then(() => syncFromServer())
      .catch((err) => console.error('Error updating profile on server:', err));

    showToast(
      isReapplying
        ? 'Profile updated and resubmitted for verification!'
        : 'Profile updated successfully!'
    );
  };

  const addListing = (itemData: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Listing | null => {
    if (!isUserVerified) {
      showToast('Verification Required: Only approved students can post campus listings.');
      return null;
    }

    const newListing: Listing = {
      ...itemData,
      id: `item-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewsCount: 0,
      isReported: false,
    };

    const updated = [newListing, ...listings];
    setListings(updated);
    try {
      localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(updated));
    } catch {}

    // Sync listing to central server database
    fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newListing),
    })
      .then(() => syncFromServer())
      .catch((err) => console.error('Error adding listing to server:', err));

    showToast(`Listing "${newListing.title}" published successfully!`);
    return newListing;
  };

  const updateListing = (id: string, updates: Partial<Listing>) => {
    const existing = listings.find((l) => l.id === id);
    const updated = listings.map((l) =>
      l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
    );
    setListings(updated);
    try {
      localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(updated));
    } catch {}

    if (existing) {
      const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
      fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      })
        .then(() => syncFromServer())
        .catch((err) => console.error('Error updating listing on server:', err));
    }

    showToast('Listing updated successfully!');
  };

  const deleteListing = async (id: string): Promise<boolean> => {
    const cleanId = id.trim();
    // 1. Mark ID in tombstone set so syncFromServer never resurrects it
    deletedListingIds.current.add(cleanId);
    try {
      localStorage.setItem(
        STORAGE_KEY_DELETED_LISTINGS,
        JSON.stringify(Array.from(deletedListingIds.current))
      );
    } catch {}

    // 2. Remove immediately from local state
    const updated = listings.filter((l) => l.id !== cleanId);
    setListings(updated);
    try {
      localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(updated));
    } catch {}

    // 3. Sync delete to central server database with cache-busting timestamp
    try {
      const res = await fetch(`/api/listings?id=${encodeURIComponent(cleanId)}&t=${Date.now()}`, {
        method: 'DELETE',
      });
      await syncFromServer();
      showToast('Listing removed permanently.');
      return true;
    } catch (err) {
      console.error('Error deleting listing from server:', err);
      showToast('Listing removed.');
      return false;
    }
  };

  const updateListingStatus = (id: string, status: ListingStatus) => {
    updateListing(id, { status });
  };

  const toggleSaveListing = (id: string) => {
    let updated: string[];
    if (savedListingIds.includes(id)) {
      updated = savedListingIds.filter((item) => item !== id);
      showToast('Item removed from saved list.');
    } else {
      updated = [...savedListingIds, id];
      showToast('Item saved to your bookmarks!');
    }
    setSavedListingIds(updated);
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
  };

  const isListingSaved = (id: string) => savedListingIds.includes(id);

  const sendInquiry = (listingId: string, message: string): boolean => {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return false;

    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      listingId,
      listingTitle: listing.title,
      listingPrice: listing.price,
      listingType: listing.listingType,
      senderId: currentUser?.id || `guest-${Date.now()}`,
      senderName: currentUser?.fullName || 'Verified Student',
      senderCollege: currentUser?.collegeName || 'Delhi College',
      senderBranch: currentUser?.branch,
      receiverId: listing.ownerId,
      receiverName: listing.ownerName,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const updated = [newInquiry, ...inquiries];
    setInquiries(updated);
    try {
      localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated));
    } catch {}

    // Persist inquiry to central database immediately
    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInquiry),
    })
      .then(() => syncFromServer())
      .catch((err) => console.error('Error saving inquiry:', err));

    showToast('Inquiry sent to seller! Check dashboard for responses.');
    return true;
  };

  const reportListing = (listingId: string, reason: string, details?: string) => {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;

    const newReport: Report = {
      id: `report-${Date.now()}`,
      listingId,
      listingTitle: listing.title,
      reporterId: currentUser?.id || 'anonymous',
      reporterName: currentUser?.fullName || 'Student',
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updatedReports));
    } catch {}

    // Persist report to central database immediately
    fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReport),
    })
      .then(() => syncFromServer())
      .catch((err) => console.error('Error submitting report:', err));

    updateListing(listingId, { isReported: true });

    logAdminAction(
      'Listing Reported',
      'listing',
      listingId,
      `Reported for "${reason}". Details: ${details || 'None provided'}`
    );
    showToast('Listing reported to campus moderation for safety review.');
  };

  const updateReportStatus = (id: string, status: Report['status'], adminNotes?: string) => {
    const updated = reports.map((r) =>
      r.id === id ? { ...r, status, adminNotes: adminNotes || r.adminNotes } : r
    );
    setReports(updated);
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
    } catch {}

    // Persist status update to central database immediately
    fetch('/api/reports', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, adminNotes }),
    })
      .then(() => syncFromServer())
      .catch((err) => console.error('Error updating report status:', err));

    showToast(`Report updated to ${status}.`);
  };

  const resolveReport = (id: string, adminNotes?: string) => {
    updateReportStatus(id, 'action_taken', adminNotes || 'Issue addressed by moderator.');
  };

  const dismissReport = (id: string) => {
    updateReportStatus(id, 'dismissed', 'Dismissed as compliant.');
  };

  const addCollege = (college: College) => {
    const updated = [...colleges, college];
    setColleges(updated);
    try {
      localStorage.setItem(STORAGE_KEY_COLLEGES, JSON.stringify(updated));
    } catch {}
    logAdminAction('Added College', 'college', college.id, `Added institution: ${college.name}`);
    showToast(`College ${college.name} added!`);
  };

  const updateCollege = (id: string, updates: Partial<College>) => {
    const updated = colleges.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setColleges(updated);
    try {
      localStorage.setItem(STORAGE_KEY_COLLEGES, JSON.stringify(updated));
    } catch {}
    logAdminAction('Updated College', 'college', id, `Updated institution settings for ${id}`);
    showToast('College details updated.');
  };

  const addCategory = (category: Category) => {
    const updated = [...categories, category];
    setCategories(updated);
    logAdminAction('Added Category', 'category', category.id, `Added category: ${category.name}`);
    showToast(`Category ${category.name} created!`);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const updated = categories.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setCategories(updated);
    logAdminAction('Updated Category', 'category', id, `Updated category ${id}`);
    showToast('Category updated.');
  };

  const logAdminAction = (
    action: string,
    targetType: AuditLog['targetType'],
    targetId: string,
    details: string
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      adminId: currentUser?.id || 'admin',
      adminName: currentUser?.fullName || 'Campus Administrator',
      action,
      targetType,
      targetId,
      details,
      createdAt: new Date().toISOString(),
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updated));
    } catch {}

    // Persist audit log to central database
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLog),
    }).catch(() => {});
  };

  const selectedCollege = colleges.find((c) => c.id === selectedCollegeId) || colleges[0];

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        logout,
        updateProfile,
        isUserVerified,
        loginWithEmail,
        registeredStudents,
        registerStudent,
        approveStudent,
        rejectStudent,
        colleges,
        selectedCollegeId,
        setSelectedCollegeId,
        selectedCollege,
        addCollege,
        updateCollege,
        categories,
        addCategory,
        updateCategory,
        listings,
        addListing,
        updateListing,
        deleteListing,
        updateListingStatus,
        savedListingIds,
        toggleSaveListing,
        isListingSaved,
        inquiries,
        sendInquiry,
        reports,
        reportListing,
        updateReportStatus,
        resolveReport,
        dismissReport,
        auditLogs,
        logAdminAction,
        theme,
        toggleTheme,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

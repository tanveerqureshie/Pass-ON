'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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
  { email: 'admin321@gmail.com', password: 'admin321', name: 'Campus Admin Partner' },
  { email: 'passon@gmail.com', password: 'passon@321', name: 'Pass ON Team' },
];

const ADMIN_EMAILS: ReadonlyArray<string> = [
  ADMIN_EMAIL,
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
  registerStudent: (student: UserProfile) => void;
  approveStudent: (userId: string) => void;
  rejectStudent: (userId: string, reason: string) => void;

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
  deleteListing: (id: string) => void;
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
const STORAGE_KEY_SAVED = 'passon_saved_v3';
const STORAGE_KEY_USER = 'passon_user_v3';
const STORAGE_KEY_STUDENTS = 'passon_students_v3';
const STORAGE_KEY_COLLEGES = 'passon_colleges_v3';
const STORAGE_KEY_COLLEGE_ID = 'passon_selected_college_v3';
const STORAGE_KEY_INQUIRIES = 'passon_inquiries_v3';
const STORAGE_KEY_REPORTS = 'passon_reports_v3';
const STORAGE_KEY_LOGS = 'passon_logs_v3';

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Initial state: starts with Admin logged in by default or null
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEFAULT_ADMIN_PROFILE);
  const [registeredStudents, setRegisteredStudents] = useState<UserProfile[]>([DEFAULT_ADMIN_PROFILE]);
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

  // Sync theme with HTML class
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('passon_theme') as 'light' | 'dark' | null;
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // fallback to light
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

  useEffect(() => {
    try {
      // Drop pre-v3 browser data so old demo users/listings cannot reappear.
      localStorage.removeItem('passon_listings');
      localStorage.removeItem('passon_students');
      localStorage.removeItem('passon_user');
      const storedListings = localStorage.getItem(STORAGE_KEY_LISTINGS);
      if (storedListings) {
        const parsed = JSON.parse(storedListings) as Listing[];
        setListings(parsed.filter((listing) => !listing.isDemo));
      }

      const storedSaved = localStorage.getItem(STORAGE_KEY_SAVED);
      if (storedSaved) setSavedListingIds(JSON.parse(storedSaved));

      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.role === 'admin' || isAdminEmail(parsed.email)) {
            setCurrentUser(DEFAULT_ADMIN_PROFILE);
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEFAULT_ADMIN_PROFILE));
          } else {
            setCurrentUser(parsed);
          }
        } catch {
          setCurrentUser(DEFAULT_ADMIN_PROFILE);
        }
      }

      const storedStudents = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (storedStudents) {
        try {
          const parsed = JSON.parse(storedStudents) as UserProfile[];
          const updated = parsed.map((s) =>
            s.role === 'admin' || isAdminEmail(s.email)
              ? DEFAULT_ADMIN_PROFILE
              : s
          );
          if (!updated.some((s) => s.email === ADMIN_EMAIL)) {
            updated.unshift(DEFAULT_ADMIN_PROFILE);
          }
          setRegisteredStudents(updated);
        } catch {
          setRegisteredStudents([DEFAULT_ADMIN_PROFILE]);
        }
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
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const isUserVerified = currentUser?.role === 'admin' || currentUser?.verificationStatus === 'approved';

  // Register student (from personal email signup)
  const registerStudent = (student: UserProfile) => {
    const updated = [student, ...registeredStudents.filter((s) => s.id !== student.id && s.email !== student.email)];
    setRegisteredStudents(updated);
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(updated));

    setCurrentUser(student);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(student));

    logAdminAction(
      'New Student Registered',
      'user',
      student.id,
      `Student ${student.fullName} (${student.email}) registered from ${student.collegeName}. Awaiting verification review.`
    );
  };

  // Login with personal email & optional admin password check
  const loginWithEmail = (email: string, password?: string): UserProfile | null => {
    const trimmed = email.trim().toLowerCase();
    if (isAdminEmail(trimmed)) {
      const cred = ADMIN_CREDENTIALS.find((c) => c.email.toLowerCase() === trimmed);
      if (password && cred && password !== cred.password) {
        return null;
      }
      const adminProfile: UserProfile = {
        ...DEFAULT_ADMIN_PROFILE,
        id: `admin-${trimmed.replace(/[^a-z0-9]/g, '-')}`,
        email: trimmed,
        fullName: cred?.name || 'Campus Administrator',
      };
      setCurrentUser(adminProfile);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(adminProfile));
      showToast(`Logged in as Administrator (${adminProfile.fullName})`);
      return adminProfile;
    }

    const found = registeredStudents.find((s) => s.email.toLowerCase() === trimmed);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(found));
      showToast(`Welcome back, ${found.fullName}!`);
      return found;
    }
    return null;
  };

  const approveStudent = (userId: string) => {
    const updated = registeredStudents.map((s) =>
      s.id === userId
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
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(updated));

    // If current logged-in user is this student, update session
    if (currentUser?.id === userId) {
      const selfUpdated = { ...currentUser, verificationStatus: 'approved' as VerificationStatus };
      setCurrentUser(selfUpdated);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(selfUpdated));
    }

    const student = registeredStudents.find((s) => s.id === userId);
    logAdminAction(
      'Approved Student Verification',
      'user',
      userId,
      `Verified ${student?.fullName} (${student?.enrollmentNumber}) against ${student?.collegeName} department records.`
    );
    showToast(`Student ${student?.fullName || 'account'} approved and verified.`);
  };

  const rejectStudent = (userId: string, reason: string) => {
    const updated = registeredStudents.map((s) =>
      s.id === userId
        ? {
            ...s,
            verificationStatus: 'rejected' as VerificationStatus,
            rejectionReason: reason,
          }
        : s
    );
    setRegisteredStudents(updated);
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(updated));

    if (currentUser?.id === userId) {
      const selfUpdated = {
        ...currentUser,
        verificationStatus: 'rejected' as VerificationStatus,
        rejectionReason: reason,
      };
      setCurrentUser(selfUpdated);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(selfUpdated));
    }

    const student = registeredStudents.find((s) => s.id === userId);
    logAdminAction(
      'Rejected Student Verification',
      'user',
      userId,
      `Rejected ${student?.fullName}. Reason: ${reason}`
    );
    showToast(`Verification rejected for ${student?.fullName || 'student'}.`);
  };

  const logout = () => {
    try {
      const supabase = createClient();
      supabase.auth.signOut();
    } catch {
      // Ignored
    }
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    showToast('Signed out of Pass ON');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));

    const updatedList = registeredStudents.map((s) => (s.id === currentUser.id ? updated : s));
    setRegisteredStudents(updatedList);
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(updatedList));

    showToast('Profile updated successfully!');
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
    localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(updated));
    showToast(`Listing "${newListing.title}" published successfully!`);
    return newListing;
  };

  const updateListing = (id: string, updates: Partial<Listing>) => {
    const updated = listings.map((l) =>
      l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
    );
    setListings(updated);
    localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(updated));
    showToast('Listing updated successfully!');
  };

  const deleteListing = (id: string) => {
    const updated = listings.filter((l) => l.id !== id);
    setListings(updated);
    localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(updated));
    showToast('Listing removed.');
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
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated));
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
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updatedReports));

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
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
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
    localStorage.setItem(STORAGE_KEY_COLLEGES, JSON.stringify(updated));
    logAdminAction('Added College', 'college', college.id, `Added institution: ${college.name}`);
    showToast(`College ${college.name} added!`);
  };

  const updateCollege = (id: string, updates: Partial<College>) => {
    const updated = colleges.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setColleges(updated);
    localStorage.setItem(STORAGE_KEY_COLLEGES, JSON.stringify(updated));
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
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updated));
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

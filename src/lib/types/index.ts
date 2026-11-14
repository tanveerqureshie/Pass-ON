export type ListingType = 'sell' | 'free' | 'borrow' | 'exchange';
export type ListingCondition = 'new' | 'like_new' | 'good' | 'fair';
export type ListingStatus = 'active' | 'sold' | 'donated' | 'borrowed' | 'unavailable' | 'archived';
export type UserRole = 'student' | 'moderator' | 'admin';

export interface College {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  location: string;
  category: 'Engineering' | 'Medical' | 'Law';
  isActive: boolean;
  branches: string[];
  description?: string;
  establishedYear?: number;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  subcategories: string[];
  itemCount?: number;
}

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phoneNumber?: string;
  instagramHandle?: string;
  contactPreference?: 'whatsapp' | 'instagram' | 'both';
  enrollmentNumber?: string; // e.g. '04114802721' - Kept secure, never exposed publicly
  collegeId: string;
  collegeName?: string;
  collegeShortName?: string;
  branch?: string;
  academicYear?: string; // '1st Year', '2nd Year', '3rd Year', '4th Year'
  role: UserRole;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  isSuspended?: boolean;
  createdAt: string;
  password?: string;
}

export interface Listing {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerCollegeId: string;
  ownerBranch?: string;
  ownerAcademicYear?: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  subcategory?: string;
  listingType: ListingType;
  price: number; // 0 for 'free'
  condition: ListingCondition;
  collegeId: string;
  collegeName: string;
  collegeShortName: string;
  department?: string;
  academicYear?: string;
  preferredPickupLocation: string;
  pickupInstructions?: string;
  whatsappNumber?: string;
  instagramHandle?: string;
  contactPreference?: 'whatsapp' | 'instagram' | 'both';
  status: ListingStatus;
  borrowDuration?: string;
  borrowConditions?: string;
  exchangePreferences?: string;
  viewsCount?: number;
  isReported?: boolean;
  isDemo?: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingType: ListingType;
  senderId: string;
  senderName: string;
  senderCollege: string;
  senderBranch?: string;
  receiverId: string;
  receiverName: string;
  message: string;
  status: 'pending' | 'replied' | 'closed';
  createdAt: string;
}

export interface Report {
  id: string;
  listingId: string;
  listingTitle: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'listing' | 'user' | 'college' | 'category';
  targetId: string;
  details: string;
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  collegeId: string;
  branch: string;
  categoryId: string;
  listingType: string;
  condition: string;
  isFreeOnly: boolean;
  minPrice: number | '';
  maxPrice: number | '';
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  mode: 'all' | 'my_college';
}

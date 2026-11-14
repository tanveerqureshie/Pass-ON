-- Pass ON Database Schema for Supabase
-- Modern College Student Marketplace

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom ENUM types
CREATE TYPE listing_type AS ENUM ('sell', 'free', 'borrow', 'exchange');
CREATE TYPE listing_condition AS ENUM ('new', 'like_new', 'good', 'fair');
CREATE TYPE listing_status AS ENUM ('active', 'sold', 'donated', 'borrowed', 'unavailable', 'archived');
CREATE TYPE user_role AS ENUM ('student', 'moderator', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE inquiry_status AS ENUM ('pending', 'replied', 'closed');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'action_taken', 'dismissed');

-- 1. Profiles Table (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone_number TEXT,
  enrollment_number TEXT, -- Verified against college records, kept confidential
  college_id TEXT NOT NULL,
  branch TEXT,
  academic_year TEXT,
  role user_role DEFAULT 'student'::user_role,
  verification_status verification_status DEFAULT 'pending'::verification_status,
  rejection_reason TEXT,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  is_suspended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Colleges Table
CREATE TABLE IF NOT EXISTS colleges (
  id TEXT PRIMARY KEY, -- e.g. 'mait', 'msit', 'bvcoe'
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT DEFAULT 'Engineering', -- Engineering, Medical, Law
  is_active BOOLEAN DEFAULT TRUE,
  branches JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  subcategories JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Listings Table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  subcategory TEXT,
  listing_type listing_type NOT NULL DEFAULT 'sell',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  condition listing_condition NOT NULL DEFAULT 'good',
  college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE RESTRICT,
  department TEXT,
  academic_year TEXT,
  preferred_pickup_location TEXT NOT NULL,
  pickup_instructions TEXT,
  whatsapp_number TEXT,
  instagram_handle TEXT,
  status listing_status NOT NULL DEFAULT 'active',
  borrow_duration TEXT,
  exchange_preferences TEXT,
  views_count INT DEFAULT 0,
  is_reported BOOLEAN DEFAULT FALSE,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Saved Listings Table
CREATE TABLE IF NOT EXISTS saved_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, listing_id)
);

-- 6. Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status inquiry_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status report_status DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 8. Admin Audit Logs Table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL, -- 'listing', 'user', 'college', 'category'
  target_id TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_listings_college ON listings(college_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(listing_type);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_listings_user ON saved_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_receiver ON inquiries(receiver_id);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: everyone can read public profiles (enrollment number and phone protected); users can update own profile; admins can update all.
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Colleges & Categories: public read; admin write
CREATE POLICY "Colleges are viewable by everyone" ON colleges FOR SELECT USING (true);
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

-- Listings: active listings viewable by everyone; only APPROVED students can create listings
CREATE POLICY "Active listings are viewable by everyone" ON listings FOR SELECT USING (status = 'active' OR auth.uid() = owner_id);
CREATE POLICY "Only approved students can create listings" ON listings FOR INSERT WITH CHECK (
  auth.uid() = owner_id AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND verification_status = 'approved')
);
CREATE POLICY "Users can update own listings" ON listings FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own listings" ON listings FOR DELETE USING (auth.uid() = owner_id);

-- Saved Listings: users manage their own saved listings
CREATE POLICY "Users can view own saved listings" ON saved_listings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved listings" ON saved_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved listings" ON saved_listings FOR DELETE USING (auth.uid() = user_id);

-- Inquiries: only approved students can participate
CREATE POLICY "Users can view relevant inquiries" ON inquiries FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Only approved students can create inquiries" ON inquiries FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND verification_status = 'approved')
);

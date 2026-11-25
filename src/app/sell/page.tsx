'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ListingType, ListingCondition } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Form';
import { isValidContactNumber } from '@/lib/whatsapp';
import { uploadToCloudinary } from '@/lib/cloudinary/upload';
import {
  PlusCircle,
  Gift,
  Coins,
  Repeat,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  UploadCloud,
  Link as LinkIcon,
  X,
  MessageCircle,
  Instagram,
  Lock,
} from 'lucide-react';
import clsx from 'clsx';

const CATEGORY_FALLBACK: Record<string, string> = {
  academic: '/items/fallback-academic.jpg',
  'lab-equipment': '/items/fallback-lab.jpg',
  electronics: '/items/fallback-electronics.jpg',
  'hostel-essentials': '/items/fallback-hostel.jpg',
};
const FALLBACK_DEFAULT = '/items/fallback-general.jpg';

export default function SellPage() {
  const router = useRouter();
  const {
    colleges,
    categories,
    selectedCollegeId,
    currentUser,
    addListing,
    showToast,
    isUserVerified,
  } = useApp();

  // Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('academic');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [listingType, setListingType] = useState<ListingType>('sell');
  const [price, setPrice] = useState<string>('150');
  const [condition, setCondition] = useState<ListingCondition>('good');
  const [collegeId, setCollegeId] = useState(currentUser?.collegeId || selectedCollegeId || 'mait');
  const [department, setDepartment] = useState(currentUser?.branch || 'CSE');
  const [academicYear, setAcademicYear] = useState(currentUser?.academicYear || '1st & 2nd Year');
  const [preferredPickupLocation, setPreferredPickupLocation] = useState('College Canteen / Main Gate');
  const [pickupInstructions, setPickupInstructions] = useState('Available after 3:30 PM on weekdays');

  // Privacy & Contact Preferences
  const [contactPreference, setContactPreference] = useState<'whatsapp' | 'instagram' | 'both'>('whatsapp');
  const [whatsappNumber, setWhatsappNumber] = useState(currentUser?.phoneNumber || '');
  const [instagramHandle, setInstagramHandle] = useState(currentUser?.instagramHandle || '');

  // Image Upload or Link
  const [imageMode, setImageMode] = useState<'upload' | 'link'>('upload');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [borrowDuration, setBorrowDuration] = useState('1 to 2 weeks (for practicals)');
  const [borrowConditions, setBorrowConditions] = useState('Return in original working condition');
  const [exchangePreferences, setExchangePreferences] = useState('Looking for 3rd semester CSE core books');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCategoryObj = categories.find((c) => c.id === categoryId);
  const selectedCollegeObj = colleges.find((c) => c.id === collegeId);

  const getDefaultImageForCategory = (catId: string) =>
    CATEGORY_FALLBACK[catId] || FALLBACK_DEFAULT;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Image size should be less than 10MB');
        return;
      }
      setImageFile(file);
      setImageFileName(file.name);
      // Permanent Data URL preview (never expires like blob URLs)
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
      showToast('Photo selected! Ready for permanent storage.');
    }
  };

  // Block posting if student is pending verification
  if (currentUser && !isUserVerified) {
    return (
      <div className="container-x py-16">
        <div className="mx-auto max-w-xl space-y-5 rounded-3xl border border-ink-200 bg-white p-8 text-center shadow-card">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-600">
            <ShieldAlert className="h-7 w-7" />
          </span>

          <h1 className="font-display text-xl font-extrabold text-ink-950">Student Verification Required</h1>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-ink-600">
            Your registration is currently under review by college campus administrators. To maintain student
            safety and prevent non-student commercial posts, only approved students can post listings.
          </p>

          <div className="space-y-2 rounded-2xl border border-ink-200 bg-[#f7f7f8] p-4 text-left text-xs">
            <div className="flex justify-between">
              <span className="text-ink-500">Student Name:</span>
              <span className="font-bold text-ink-900">{currentUser?.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500">College:</span>
              <span className="font-bold text-ink-900">{currentUser?.collegeName || 'Not Set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500">Enrollment Number:</span>
              <span className="font-mono font-bold text-ink-900">{currentUser?.enrollmentNumber || 'Submitted'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500">Verification Status:</span>
              <span className="font-bold capitalize text-amber-600">
                {currentUser?.verificationStatus || 'Pending Approval'}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2.5 pt-1 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center rounded-xl border border-ink-300 bg-white px-5 text-xs font-bold text-ink-800 transition hover:bg-ink-50"
            >
              Return to Dashboard
            </Link>
            <Link
              href="/auth/sign-in"
              className="inline-flex h-10 items-center rounded-xl bg-ink-950 px-5 text-xs font-bold text-white transition hover:bg-ink-800"
            >
              Administrator Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!preferredPickupLocation.trim()) newErrors.pickup = 'Pickup location is required';

    // Validate based on contact preference
    if (contactPreference === 'whatsapp' || contactPreference === 'both') {
      if (!whatsappNumber.trim() || !isValidContactNumber(whatsappNumber)) {
        newErrors.whatsapp = 'Valid 10-digit WhatsApp number is required';
      }
    }

    if (contactPreference === 'instagram' || contactPreference === 'both') {
      if (!instagramHandle.trim()) {
        newErrors.instagram = 'Instagram username is required';
      }
    }

    if (listingType === 'sell') {
      const num = parseFloat(price);
      if (isNaN(num) || num <= 0) {
        newErrors.price = 'Please enter a valid price greater than ₹0';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Please fix the errors in the form.');
      return;
    }

    setIsSubmitting(true);

    try {
      const calculatedPrice = listingType === 'free' ? 0 : parseFloat(price) || 0;
      let finalImage = imageUrl.trim();

      // If user selected a local file, upload directly to Cloudinary to get a permanent URL
      if (imageFile) {
        showToast('Uploading photo to Cloudinary...');
        try {
          const permanentUrl = await uploadToCloudinary(imageFile, 'passiton/products');
          if (permanentUrl) {
            finalImage = permanentUrl;
          }
        } catch (uploadErr) {
          console.warn('Cloudinary upload warning:', uploadErr);
          showToast(uploadErr instanceof Error ? uploadErr.message : 'Photo upload warning, using fallback');
          if (!finalImage && imageUrl.trim()) {
            finalImage = imageUrl.trim();
          }
        }
      }

      if (!finalImage) {
        finalImage = getDefaultImageForCategory(categoryId);
      }

      const cleanedIg = instagramHandle.trim().replace(/^@/, '');

      const newListing = await addListing({
        ownerId: currentUser?.id || `student-${Date.now()}`,
        ownerName: currentUser?.fullName || 'Verified Senior',
        ownerCollegeId: collegeId,
        ownerBranch: department,
        ownerAcademicYear: academicYear,
        title,
        description,
        categoryId,
        categoryName: selectedCategoryObj?.name || 'Academic Materials',
        subcategory: subcategory || (selectedCategoryObj?.subcategories[0] ?? ''),
        listingType,
        price: calculatedPrice,
        condition,
        collegeId,
        collegeName: selectedCollegeObj?.name || 'Delhi College',
        collegeShortName: selectedCollegeObj?.short_name || 'DELHI',
        department,
        academicYear,
        preferredPickupLocation,
        pickupInstructions,
        contactPreference,
        whatsappNumber: whatsappNumber.trim(),
        instagramHandle: cleanedIg,
        images: [finalImage],
        status: 'active',
        borrowDuration: listingType === 'borrow' ? borrowDuration : undefined,
        borrowConditions: listingType === 'borrow' ? borrowConditions : undefined,
        exchangePreferences: listingType === 'exchange' ? exchangePreferences : undefined,
      });

      if (newListing) {
        showToast('Listing published & photo saved to Cloudinary!');
        router.push(`/item/${newListing.id}`);
      }
    } catch (err) {
      console.error('Failed to publish listing:', err);
      showToast('Failed to save listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-x py-8">
      <div className="mx-auto max-w-4xl space-y-7">
        {/* Header */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-extrabold text-brand-700">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified Student Listing
          </span>
          <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
            Pass On An Item
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Help a junior save money. List textbooks, calculators, lab coats, drafters, or hostel gear for sale,
            borrow, exchange, or 100% free giveaway.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl border border-ink-200 bg-white p-6 shadow-card sm:p-9"
        >
          {/* Step 1 — listing type */}
          <section className="space-y-3">
            <p className="label-base">1. Select Listing Type *</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { id: 'sell', label: 'Sell', desc: 'Set student price', icon: Coins },
                { id: 'free', label: 'Free Giveaway', desc: '₹0 senior gift', icon: Gift },
                { id: 'borrow', label: 'Borrow / Lend', desc: 'Temporary loan', icon: Repeat },
                { id: 'exchange', label: 'Exchange', desc: 'Barter item', icon: Sparkles },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setListingType(t.id as ListingType);
                    if (t.id === 'free') setPrice('0');
                  }}
                  className={clsx(
                    'rounded-xl border p-3.5 text-left transition-all',
                    listingType === t.id
                      ? 'border-brand-600 bg-brand-50 font-bold text-brand-800 ring-2 ring-brand-600/15'
                      : 'border-ink-200 bg-white font-medium text-ink-700 hover:border-ink-300 hover:bg-ink-50'
                  )}
                >
                  <span className="mb-1 flex items-center gap-2">
                    <t.icon
                      className={clsx('h-4 w-4', listingType === t.id ? 'text-brand-600' : 'text-ink-400')}
                    />
                    <span className="text-xs">{t.label}</span>
                  </span>
                  <span className="block text-[11px] text-ink-500">{t.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Step 2 — item details */}
          <section className="space-y-4 border-t border-ink-100 pt-6">
            <p className="label-base">2. Item Title &amp; Category *</p>

            <Input
              label="Listing Title"
              name="title"
              placeholder="e.g. Casio fx-991EX Scientific Calculator"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Category"
                name="category"
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  const cat = categories.find((c) => c.id === e.target.value);
                  setSubcategory(cat?.subcategories[0] || '');
                }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>

              <Select
                label="Subcategory"
                name="subcategory"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
              >
                {selectedCategoryObj?.subcategories.map((sc) => (
                  <option key={sc} value={sc}>
                    {sc}
                  </option>
                ))}
              </Select>
            </div>

            <Textarea
              label="Description *"
              name="description"
              rows={4}
              placeholder="Describe condition, edition/author, semesters used, included accessories…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={errors.description}
              required
            />
          </section>

          {/* Step 3 — pricing & condition */}
          <section className="space-y-4 border-t border-ink-100 pt-6">
            <p className="label-base">3. Pricing &amp; Condition</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {listingType === 'sell' && (
                <Input
                  label="Price (₹ INR)"
                  type="number"
                  name="price"
                  min={1}
                  placeholder="150"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  error={errors.price}
                  helper="Set an affordable student price"
                  required
                />
              )}

              {listingType === 'free' && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <Gift className="h-6 w-6 shrink-0 text-emerald-600" />
                  <div>
                    <span className="block text-xs font-extrabold text-ink-950">100% Free Senior Gift (₹0)</span>
                    <span className="text-[11px] text-ink-600">
                      This item is passed down to juniors completely free of charge.
                    </span>
                  </div>
                </div>
              )}

              {listingType === 'borrow' && (
                <Input
                  label="Maximum Borrow Duration"
                  name="borrowDuration"
                  value={borrowDuration}
                  onChange={(e) => setBorrowDuration(e.target.value)}
                  placeholder="e.g. 1 week, Exam period"
                  helper="Expected loan timeline"
                />
              )}

              {listingType === 'exchange' && (
                <Input
                  label="What Would You Like in Exchange?"
                  name="exchangePreferences"
                  value={exchangePreferences}
                  onChange={(e) => setExchangePreferences(e.target.value)}
                  placeholder="e.g. 3rd Sem DSA Book, Arduino Board"
                />
              )}

              <Select
                label="Item Condition"
                name="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value as ListingCondition)}
              >
                <option value="like_new">Like New (flawless, barely used)</option>
                <option value="good">Good (minor wear, fully functional)</option>
                <option value="fair">Fair (noticeable wear, works properly)</option>
                <option value="new">Brand New (unopened)</option>
              </Select>
            </div>
          </section>

          {/* Step 4 — campus handover */}
          <section className="space-y-4 border-t border-ink-100 pt-6">
            <p className="label-base">4. Campus Handover &amp; Department</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Select label="College Campus" name="college" value={collegeId} onChange={(e) => setCollegeId(e.target.value)}>
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.short_name} — {c.name}
                  </option>
                ))}
              </Select>

              <Select label="Department" name="department" value={department} onChange={(e) => setDepartment(e.target.value)}>
                {(selectedCollegeObj?.branches || ['CSE', 'IT', 'ECE', 'MAE', 'General']).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>

              <Select
                label="Target Semester"
                name="targetYear"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Any Year">Any Year</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Preferred Campus Pickup Spot"
                name="pickupSpot"
                placeholder="e.g. Near Canteen, Library Stairs, Main Gate 1"
                value={preferredPickupLocation}
                onChange={(e) => setPreferredPickupLocation(e.target.value)}
                error={errors.pickup}
                required
              />

              <Input
                label="Timing / Handover Instructions"
                name="pickupTiming"
                placeholder="e.g. Available Mon-Thu after 2:30 PM lab"
                value={pickupInstructions}
                onChange={(e) => setPickupInstructions(e.target.value)}
              />
            </div>
          </section>

          {/* Step 5 — contact & photo */}
          <section className="space-y-4 border-t border-ink-100 pt-6">
            <div className="flex items-center justify-between gap-3">
              <p className="label-base mb-0">5. Contact Method &amp; Privacy *</p>
              <span className="text-[11px] font-medium text-ink-400">Photo is optional</span>
            </div>

            {/* Privacy callout */}
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div className="text-xs">
                <span className="block font-extrabold text-ink-950">Student Phone Privacy Option</span>
                <p className="mt-0.5 text-[11px] leading-relaxed text-ink-600">
                  Not comfortable sharing your personal WhatsApp number? Choose{' '}
                  <strong className="font-bold">Instagram DM</strong> — buyers message your Instagram directly,
                  keeping your mobile number 100% hidden.
                </p>
              </div>
            </div>

            {/* Contact preference selector */}
            <div>
              <span className="label-base">How can buyers contact you?</span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[
                  { id: 'whatsapp', label: 'WhatsApp Only', icon: MessageCircle },
                  { id: 'instagram', label: 'Instagram (Private)', icon: Instagram },
                  { id: 'both', label: 'Both Options', icon: Sparkles },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setContactPreference(opt.id as typeof contactPreference)}
                    className={clsx(
                      'flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all',
                      contactPreference === opt.id
                        ? 'border-brand-600 bg-brand-50 text-brand-800 ring-2 ring-brand-600/15'
                        : 'border-ink-200 bg-white text-ink-700 hover:bg-ink-50'
                    )}
                  >
                    <opt.icon
                      className={clsx(
                        'h-4 w-4',
                        contactPreference === opt.id ? 'text-brand-600' : 'text-ink-400'
                      )}
                    />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(contactPreference === 'whatsapp' || contactPreference === 'both') && (
                <Input
                  label="10-digit WhatsApp Number"
                  type="tel"
                  name="whatsapp"
                  placeholder="9876543210"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  error={errors.whatsapp}
                  helper="Encoded into official click-to-chat links"
                  required={contactPreference === 'whatsapp'}
                />
              )}

              {(contactPreference === 'instagram' || contactPreference === 'both') && (
                <Input
                  label="Instagram Username (@handle)"
                  name="instagramHandle"
                  placeholder="e.g. your_insta_handle"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  error={errors.instagram}
                  helper="Buyers DM you on Instagram (no phone shared)"
                  required={contactPreference === 'instagram'}
                />
              )}
            </div>

            {/* Photo section */}
            <div className="space-y-2.5 border-t border-ink-100 pt-4">
              <span className="label-base">Item Photo (Upload from Device or Link)</span>

              <div className="flex rounded-xl border border-ink-200 bg-ink-100 p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={clsx(
                    'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all',
                    imageMode === 'upload' ? 'bg-white text-ink-950 shadow-chip' : 'text-ink-500 hover:text-ink-900'
                  )}
                >
                  <UploadCloud className="h-3.5 w-3.5 text-brand-600" />
                  <span>Upload from Device</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('link')}
                  className={clsx(
                    'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 transition-all',
                    imageMode === 'link' ? 'bg-white text-ink-950 shadow-chip' : 'text-ink-500 hover:text-ink-900'
                  )}
                >
                  <LinkIcon className="h-3.5 w-3.5 text-brand-600" />
                  <span>Image Link</span>
                </button>
              </div>

              {imageMode === 'upload' ? (
                <div className="rounded-xl border border-dashed border-ink-300 bg-ink-50 p-5 text-center transition-all hover:border-brand-500 hover:bg-brand-50/30">
                  <input type="file" id="file-upload" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  <label htmlFor="file-upload" className="block cursor-pointer space-y-1.5">
                    <UploadCloud className="mx-auto h-7 w-7 text-brand-600" />
                    <span className="block text-xs font-bold text-ink-900">
                      {imageFileName ? `Selected: ${imageFileName}` : 'Click to select photo from device'}
                    </span>
                    <span className="block text-[11px] text-ink-400">PNG, JPG, or WEBP up to 5MB</span>
                  </label>
                </div>
              ) : (
                <Input
                  name="imageUrl"
                  placeholder="https://images.unsplash.com/…"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  helper="Paste any direct public image URL"
                />
              )}

              {imageUrl && (
                <div className="flex items-center gap-3">
                  <div className="h-20 w-24 overflow-hidden rounded-xl border border-ink-200 bg-ink-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Preview" className="h-full w-full bg-white object-contain" />
                  </div>
                  <div>
                    <span className="mb-1 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                      ✓ Photo attached
                    </span>
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl('');
                          setImageFileName('');
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-red-500 underline transition hover:text-red-700"
                      >
                        <X className="h-3.5 w-3.5" /> Remove photo
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Submit */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-ink-100 pt-6 sm:flex-row">
            <Link
              href="/explore"
              className="text-xs font-bold text-ink-500 underline transition hover:text-ink-800"
            >
              Cancel and return to marketplace
            </Link>

            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              <PlusCircle className="h-4 w-4" />
              {isSubmitting ? 'Uploading to Cloudinary & Publishing...' : 'Publish Campus Listing'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

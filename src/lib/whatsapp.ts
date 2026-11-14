/**
 * WhatsApp Click-to-Chat utility for Pass ON
 * Generates official wa.me URLs with normalized Indian/international phone numbers
 * and pre-filled, URL-encoded messages.
 */

export interface WhatsAppLinkParams {
  phoneNumber?: string;
  itemTitle: string;
  collegeShortName?: string;
  listingType?: 'sell' | 'free' | 'borrow' | 'exchange';
  listingId?: string;
}

/**
 * Normalizes phone numbers:
 * - Strips all non-digit characters (+, -, spaces, brackets)
 * - Defaults to India country code 91 if a 10-digit number is provided
 * - Removes leading 0 if present before adding 91
 * - Validates minimum length requirement (10-15 digits standard E.164)
 */
export function normalizePhoneNumber(rawNumber?: string | null): string | null {
  if (!rawNumber) return null;

  // Keep only digits
  let cleaned = rawNumber.replace(/\D/g, '');

  // Remove leading 0 if present (common in Indian local dialing)
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }

  // If 10 digits (standard Indian mobile number without country code), prepend 91
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }

  // Valid international numbers should have between 10 and 15 digits
  if (cleaned.length < 10 || cleaned.length > 15) {
    return null;
  }

  return cleaned;
}

/**
 * Formats a pre-filled, polite campus message for the buyer/inquirer.
 */
export function generateWhatsAppMessage(params: WhatsAppLinkParams): string {
  const { itemTitle, collegeShortName, listingType } = params;

  let message = `Hi! I found your listing for the "${itemTitle}" on Pass ON`;

  if (collegeShortName) {
    message += ` (${collegeShortName})`;
  }

  if (listingType === 'free') {
    message += `. Is it still available to pick up?`;
  } else if (listingType === 'borrow') {
    message += `. Is it still available to borrow?`;
  } else if (listingType === 'exchange') {
    message += `. I'm interested in the exchange. What items are you looking for?`;
  } else {
    message += `. Is it still available?`;
  }

  return message;
}

/**
 * Constructs the official wa.me click-to-chat URL
 * Returns null if the phone number is invalid
 */
export function getWhatsAppUrl(params: WhatsAppLinkParams): string | null {
  if (!params.phoneNumber) return null;
  const normalized = normalizePhoneNumber(params.phoneNumber);
  if (!normalized) return null;

  const text = generateWhatsAppMessage(params);
  const encodedText = encodeURIComponent(text);

  return `https://wa.me/${normalized}?text=${encodedText}`;
}

/**
 * Validates whether a phone number can generate a valid WhatsApp link
 */
export function isValidContactNumber(rawNumber?: string | null): boolean {
  return normalizePhoneNumber(rawNumber) !== null;
}

/**
 * Normalizes an Instagram username / URL handle
 * Strips leading @, spaces, or full URL prefix (e.g. instagram.com/username)
 */
export function normalizeInstagramHandle(raw: string | undefined | null): string | null {
  if (!raw) return null;
  let cleaned = raw.trim();
  // Strip url prefixes
  cleaned = cleaned.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, '');
  // Strip leading @
  cleaned = cleaned.replace(/^@+/, '');
  // Strip trailing slashes, query parameters, spaces
  cleaned = cleaned.replace(/\/.*$/, '').replace(/\?.*$/, '').trim();
  // Standard Instagram handle length (1-30 chars, alphanumeric + periods + underscores)
  if (!/^[a-zA-Z0-9._]{1,30}$/.test(cleaned)) {
    return null;
  }
  return cleaned;
}

/**
 * Generates direct Instagram profile / DM link
 */
export function getInstagramUrl(handle: string | undefined | null): string | null {
  const normalized = normalizeInstagramHandle(handle);
  if (!normalized) return null;
  return `https://instagram.com/${normalized}`;
}

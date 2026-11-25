/**
 * Centralized Environment Configuration
 * Reads all keys from .env.local / Render / hosting environment variables.
 */

export const env = {
  mongodbUri: (process.env.MONGODB_URI || '').trim(),
  cloudinary: {
    cloudName: (
      process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      ''
    ).trim(),
    apiKey: (process.env.CLOUDINARY_API_KEY || '').trim(),
    apiSecret: (process.env.CLOUDINARY_API_SECRET || '').trim(),
  },
  authSecret: (
    process.env.AUTH_SECRET ||
    process.env.JWT_SECRET ||
    process.env.CLOUDINARY_API_SECRET ||
    'passon-campus-session-secret-key'
  ).trim(),
  isProduction: process.env.NODE_ENV === 'production',
};

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xpspymjknipcyoachatz.supabase.co';
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhwc3B5bWprbmlwY3lvYWNoYXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyNDUzMDIsImV4cCI6MjExMDgyMTMwMn0.x_LH6jyTrZ1IpJU7g5KZ9T_RG-Zb_OBpLeQDq6RkftM';

  return createBrowserClient(supabaseUrl, supabaseKey);
}

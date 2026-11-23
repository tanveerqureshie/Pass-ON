import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yvziylhrauitjqxkqqdn.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_0PF0MOzdJdjqrdDwGzYMZA_1jzKSKTX';

  return createBrowserClient(supabaseUrl, supabaseKey);
}

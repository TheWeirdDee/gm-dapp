import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Social feed will remain inactive.');
}

// Global anonymous client
// We use placeholders if variables are missing to prevent build crashes
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

/**
 * GET AUTHENTICATED SUPABASE CLIENT (Browser)
 * Returns a client with the current session token if available.
 */
export const getSupaClient = () => {
  if (typeof window === 'undefined') return supabase;
  
  const token = localStorage.getItem('gm_session_token');
  if (!token) return supabase;

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
};

/**
 * GET SERVICE ROLE CLIENT (Server Only)
 * Used by API routes to perform secure writes bypassing RLS.
 */
export const getServiceRoleClient = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey || serviceKey === 'PASTE_SERVICE_ROLE_KEY_HERE') {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

/**
 * Uploads a file to a Supabase bucket.
 * @param bucket 'media' or 'avatars'
 * @param file The File object from input
 */
export async function uploadFile(bucket: 'media' | 'avatars', file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await getSupaClient().storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    console.error(`Upload error to ${bucket}:`, error);
    return null;
  }

  const { data: { publicUrl } } = getSupaClient().storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}

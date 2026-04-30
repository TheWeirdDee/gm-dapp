import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  console.error('CRITICAL: NEXT_PUBLIC_SUPABASE_URL is missing or invalid. Check your .env.local!');
}


export const supabase = createClient(
  supabaseUrl || 'https://missing-supabase-url.co', 
  supabaseAnonKey || 'missing-key'
);

/** Authenticated client for browser-side requests using stored session token */
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

/** Uploads file to media/avatars bucket via API proxy to handle storage keys securely */
export async function uploadFile(bucket: 'media' | 'avatars', file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Upload failed');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error(`Upload error to ${bucket}:`, error);
    return null;
  }
}

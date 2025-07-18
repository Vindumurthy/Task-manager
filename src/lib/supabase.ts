import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables with proper fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly set
const isConfigured = supabaseUrl && 
                    supabaseKey && 
                    supabaseUrl !== 'your-supabase-url' && 
                    supabaseKey !== 'your-supabase-anon-key' &&
                    supabaseUrl.startsWith('https://') &&
                    supabaseUrl.includes('.supabase.co');

// 👇 Tell TypeScript the type
let supabase: SupabaseClient;

if (isConfigured) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('⚠️ Supabase not configured. Please set up your Supabase credentials.');
  console.warn('1. Click "Connect to Supabase" button in the top right');
  console.warn('2. Or manually add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file');
  
  supabase = createClient(
    'https://ezbmoerzqltpjvdiwnot.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6Ym1vZXJ6cWx0cGp2ZGl3bm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NzEwMjAsImV4cCI6MjA2ODI0NzAyMH0.Oszo66hnypFtlUgkwg2fBGE4YRY6DIuhq1ZKUUsqWOU'
  );
}

export { supabase };

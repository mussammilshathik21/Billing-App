// ============================================================
// SUPABASE CLIENT
// Replace the values below with your own project credentials.
// Get them from: https://supabase.com → Project Settings → API
// ============================================================

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";   // ← paste your URL
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";                    // ← paste your anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

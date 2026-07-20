// Supabase klienti (Auth + Realtime uchun).
// .env.local da NEXT_PUBLIC_SUPABASE_URL va NEXT_PUBLIC_SUPABASE_ANON_KEY
// bo'lmasa null qaytadi — ilova demo rejimda ishlashda davom etadi.
//
// ANON kalit ochiq bo'lishi mumkin (shuning uchun NEXT_PUBLIC_): u faqat
// RLS ruxsat bergan ma'lumotlarni ko'ra oladi. SERVICE kalit esa FAQAT
// backend .env da turadi.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const supabaseEnabled = supabase !== null;

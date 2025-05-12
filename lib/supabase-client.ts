'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from 'types/supabase';

const globalForSupabase = typeof window !== 'undefined' ? window : (global as any);

if (!globalForSupabase.supabase) {
  globalForSupabase.supabase = createClientComponentClient<Database>();
}

export const supabase = globalForSupabase.supabase; 
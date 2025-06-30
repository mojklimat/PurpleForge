import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface EarlyAccessSignup {
  id?: string;
  email: string;
  created_at?: string;
}

export const addEarlyAccessSignup = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('early_access_signups')
      .insert([{ email }]);

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};
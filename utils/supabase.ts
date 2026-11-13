import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bbdfewknrwiurrioojll.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_n5uBFZjz2WvEu-B0DOcisg_FoioK1jL';

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;

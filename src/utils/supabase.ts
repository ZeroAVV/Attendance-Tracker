import { createClient, type SupabaseClient as SupabaseClientType } from '@supabase/supabase-js';

export type SupabaseClient = SupabaseClientType;

export const createSupabaseClient = async (
    getToken: () => Promise<string | null>
): Promise<SupabaseClient> => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase URL and anon key are required. Please check your .env file.');
    }

    const token = await getToken();

    return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
        global: {
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
            },
        },
    });
};

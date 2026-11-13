import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bbdfewknrwiurrioojll.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_n5uBFZjz2WvEu-B0DOcisg_FoioK1jL";

export const createClient = (request: any) => {
  let supabaseResponse = {
    headers: request?.headers,
    cookies: {
      set: (name: string, value: string, options?: any) => {},
    },
  };

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request?.cookies?.getAll ? request.cookies.getAll() : [];
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            if (request?.cookies?.set) {
              request.cookies.set(name, value);
            }
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            if (supabaseResponse?.cookies?.set) {
              supabaseResponse.cookies.set(name, value, options);
            }
          });
        },
      },
    },
  );

  return supabaseResponse;
};

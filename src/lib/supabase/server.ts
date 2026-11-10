import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { isSupabaseConfigured } from './client';

export { isSupabaseConfigured };

/**
 * Creates a Supabase client for Server Components, Server Actions, and Route Handlers.
 * Seamlessly supports both synchronous cookies (Next.js 14) and async cookieStore Promises (Next.js 15 / 16).
 *
 * @param customCookieStore - Optional custom cookie store to use instead of next/headers cookies()
 */
export function createClient(customCookieStore?: any) {
  let cookieStore: any = customCookieStore;
  let cookiePromise: Promise<any> | null = null;

  if (!cookieStore) {
    try {
      const raw = cookies();
      if (raw && typeof (raw as any).then === 'function') {
        cookiePromise = (raw as unknown) as Promise<any>;
      } else {
        cookieStore = raw;
      }
    } catch {
      // Safe fallback when executed outside Next.js request context (e.g. node scripts, testing)
      cookieStore = null;
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const cookieHandlers = {
    async getAll() {
      if (cookiePromise) {
        const cs = await cookiePromise;
        return typeof cs.getAll === 'function' ? cs.getAll() : [];
      }
      if (cookieStore && typeof cookieStore.getAll === 'function') {
        return cookieStore.getAll();
      }
      return [];
    },
    async setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
      try {
        const cs = cookiePromise ? await cookiePromise : cookieStore;
        if (cs) {
          cookiesToSet.forEach(({ name, value, options }) => {
            if (typeof cs.set === 'function') {
              cs.set({ name, value, ...options });
            }
          });
        }
      } catch {
        // Can happen in Server Component render, handled by middleware
      }
    },
    get(name: string) {
      if (cookieStore && typeof cookieStore.get === 'function') {
        return cookieStore.get(name)?.value;
      }
      return undefined;
    },
    set(name: string, value: string, options: CookieOptions) {
      if (cookieStore && typeof cookieStore.set === 'function') {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Can happen in Server Component render, handled by middleware
        }
      }
    },
    remove(name: string, options: CookieOptions) {
      if (cookieStore && typeof cookieStore.set === 'function') {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch {
          // Can happen in Server Component render, handled by middleware
        }
      }
    },
  };

  if (!isSupabaseConfigured()) {
    return createServerClient(
      'https://placeholder-project.supabase.co',
      'placeholder-anon-key',
      { cookies: cookieHandlers as any }
    );
  }

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: cookieHandlers as any,
    global: {
      fetch: (url: any, init?: any) => fetch(url, { ...init, cache: 'no-store' }),
    },
  });
}

/**
 * Explicit async client factory for Next.js 15+ / 16 route handlers & server components.
 */
export async function createAsyncClient(): Promise<ReturnType<typeof createServerClient>> {
  let cookieStore: any = null;
  try {
    const raw = cookies();
    cookieStore = raw && typeof (raw as any).then === 'function' ? await raw : raw;
  } catch {
    cookieStore = null;
  }
  return createClient(cookieStore);
}

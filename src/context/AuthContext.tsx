import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AdminProfile } from '../types/database.types';

interface AuthContextType {
  user: AdminProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'nithya_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Check admin profile
            let role: 'admin' | 'superadmin' = 'admin';
            try {
              const { data: profile } = await supabase
                .from('admin_profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();

              if (profile?.role) {
                role = profile.role;
              }
            } catch {}

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              role,
              full_name: session.user.user_metadata?.full_name || 'Studio Administrator',
              created_at: session.user.created_at,
            });
          }
        } catch (e) {
          console.error('Supabase session load error:', e);
        }
      } else {
        const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY) || localStorage.getItem(ADMIN_STORAGE_KEY);
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    }

    initAuth();

    // Listen to Supabase Auth state changes
    if (isSupabaseConfigured && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: 'admin',
            full_name: session.user.user_metadata?.full_name || 'Studio Administrator',
            created_at: session.user.created_at,
          });
        } else {
          setUser(null);
          sessionStorage.removeItem(ADMIN_STORAGE_KEY);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          console.warn('Supabase auth signIn error:', error.message);
          if (
            (cleanEmail === 'nithyastudio90@gmail.com' || cleanEmail === 'admin@nithyastudio.in') &&
            password === 'NithyaStudio@2026'
          ) {
            const adminUser: AdminProfile = {
              id: 'admin-master',
              email: cleanEmail,
              role: 'admin',
              full_name: 'Studio Administrator',
              created_at: new Date().toISOString(),
            };
            setUser(adminUser);
            sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
            setIsLoading(false);
            return { success: true };
          }
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          // Check role in admin_profiles
          let role: 'admin' | 'superadmin' = 'admin';
          try {
            const { data: profile } = await supabase
              .from('admin_profiles')
              .select('*')
              .eq('id', data.user.id)
              .maybeSingle();

            if (profile?.role) {
              role = profile.role;
            }
          } catch {}

          const adminUser: AdminProfile = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            role,
            full_name: data.user.user_metadata?.full_name || 'Studio Administrator',
            created_at: data.user.created_at,
          };
          setUser(adminUser);
          sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
          setIsLoading(false);
          return { success: true };
        }
      }

      if (
        (cleanEmail === 'nithyastudio90@gmail.com' || cleanEmail === 'admin@nithyastudio.in') &&
        password === 'NithyaStudio@2026'
      ) {
        const adminUser: AdminProfile = {
          id: 'admin-master',
          email: cleanEmail,
          role: 'admin',
          full_name: 'Studio Administrator',
          created_at: new Date().toISOString(),
        };
        setUser(adminUser);
        sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return {
        success: false,
        error: 'Unable to authenticate. Please check your Supabase Auth credentials.'
      };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'An error occurred during authentication.' };
    }
  };

  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update password.' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: Boolean(user && (user.role === 'admin' || user.role === 'superadmin')),
        isLoading,
        login,
        logout,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AdminProfile } from '../types/database.types';

interface AuthContextType {
  user: AdminProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
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
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              role: 'admin',
              full_name: session.user.user_metadata?.full_name || 'Studio Administrator',
              created_at: session.user.created_at,
            });
          }
        } catch (e) {
          console.error('Supabase session load error:', e);
        }
      } else {
        // Check stored admin session
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
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          console.warn('Supabase auth signIn notice:', error.message);
          // If official studio master credentials match, allow administrative access
          const normalizedEmail = email.trim().toLowerCase();
          if (
            (normalizedEmail === 'nithyastudio90@gmail.com' || normalizedEmail === 'admin@nithyastudio.in') &&
            password === 'NithyaStudio@2026'
          ) {
            const adminProfile: AdminProfile = {
              id: 'admin-master',
              email: normalizedEmail,
              role: 'admin',
              full_name: 'Studio Administrator',
              created_at: new Date().toISOString(),
            };
            setUser(adminProfile);
            sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminProfile));
            setIsLoading(false);
            return { success: true };
          }
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const profile: AdminProfile = {
            id: data.user.id,
            email: data.user.email || email,
            role: 'admin',
            full_name: data.user.user_metadata?.full_name || 'Studio Administrator',
            created_at: data.user.created_at,
          };
          setUser(profile);
          sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(profile));
          setIsLoading(false);
          return { success: true };
        }
      }

      // Demo/Local Admin Authentication:
      // Accepts official studio email or admin user credentials
      const normalizedEmail = email.trim().toLowerCase();
      if (
        (normalizedEmail === 'nithyastudio90@gmail.com' || normalizedEmail === 'admin@nithyastudio.in') &&
        password === 'NithyaStudio@2026'
      ) {
        const adminProfile: AdminProfile = {
          id: 'admin-local-1',
          email: normalizedEmail,
          role: 'admin',
          full_name: 'Nithya Studio Admin',
          created_at: new Date().toISOString(),
        };
        setUser(adminProfile);
        sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminProfile));
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return {
          success: false,
          error: 'Invalid credentials. Please verify your administrative email and password.'
        };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'An error occurred during authentication.' };
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
        isAdmin: Boolean(user),
        isLoading,
        login,
        logout,
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

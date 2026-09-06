import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isSupabaseActive: boolean;
  signup: (fullName: string, email: string, password: string, targetRole?: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'resumaster_active_user_v1';
const LOCAL_USERS_DB = 'resumaster_registered_accounts_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user session on mount
  useEffect(() => {
    async function initAuth() {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser(profile as UserProfile);
              setLoading(false);
              return;
            } else {
              // Create default profile if missing
              const newProfile: UserProfile = {
                id: session.user.id,
                full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                email: session.user.email || '',
                target_role: 'Data Analyst',
                created_at: new Date().toISOString(),
              };
              setUser(newProfile);
              setLoading(false);
              return;
            }
          }
        }

        // Check local storage session
        const stored = localStorage.getItem(LOCAL_USER_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setUser(parsed);
          } catch (e) {
            console.error('Failed to parse local user session:', e);
          }
        }
      } catch (err) {
        console.warn('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const signup = async (fullName: string, email: string, password: string, targetRole: string = 'Data Analyst') => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = fullName.trim();

      if (!cleanName || !cleanEmail || !password) {
        return { success: false, error: 'Please provide your full name, email, and password.' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' };
      }

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: cleanName,
              target_role: targetRole,
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const newProfile: UserProfile = {
            id: data.user.id,
            full_name: cleanName,
            email: cleanEmail,
            target_role: targetRole,
            created_at: new Date().toISOString(),
          };

          // Try to insert profile row
          await supabase.from('profiles').upsert(newProfile);

          setUser(newProfile);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newProfile));
          return { success: true };
        }
      }

      // Local storage fallback registration
      const existingUsersRaw = localStorage.getItem(LOCAL_USERS_DB);
      const existingUsers: Array<{ user: UserProfile; pass: string }> = existingUsersRaw
        ? JSON.parse(existingUsersRaw)
        : [];

      if (existingUsers.some((u) => u.user.email === cleanEmail)) {
        return { success: false, error: 'An account with this email already exists. Please sign in.' };
      }

      const newId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const newProfile: UserProfile = {
        id: newId,
        full_name: cleanName,
        email: cleanEmail,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=0284c7`,
        target_role: targetRole,
        created_at: new Date().toISOString(),
      };

      existingUsers.push({ user: newProfile, pass: password });
      localStorage.setItem(LOCAL_USERS_DB, JSON.stringify(existingUsers));
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newProfile));
      setUser(newProfile);

      return { success: true };
    } catch (err: any) {
      console.error('Signup error:', err);
      return { success: false, error: err.message || 'Signup failed. Please try again.' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanEmail || !password) {
        return { success: false, error: 'Please enter your email and password.' };
      }

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const currentProfile: UserProfile = profile || {
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
            email: cleanEmail,
            target_role: data.user.user_metadata?.target_role || 'Data Analyst',
            created_at: data.user.created_at,
          };

          setUser(currentProfile);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(currentProfile));
          return { success: true };
        }
      }

      // Local storage authentication
      const existingUsersRaw = localStorage.getItem(LOCAL_USERS_DB);
      const existingUsers: Array<{ user: UserProfile; pass: string }> = existingUsersRaw
        ? JSON.parse(existingUsersRaw)
        : [];

      const found = existingUsers.find((u) => u.user.email === cleanEmail);
      if (!found) {
        return { success: false, error: 'No account found with this email. Please check credentials or sign up.' };
      }

      if (found.pass !== password) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      setUser(found.user);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(found.user));
      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      return { success: false, error: err.message || 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Supabase signOut error:', e);
    } finally {
      localStorage.removeItem(LOCAL_USER_KEY);
      setUser(null);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'Not authenticated.' };

    try {
      const updated: UserProfile = {
        ...user,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);

        if (error) {
          console.warn('Supabase profile update warning:', error);
        }
      }

      // Update local storage
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));

      const existingUsersRaw = localStorage.getItem(LOCAL_USERS_DB);
      if (existingUsersRaw) {
        const list = JSON.parse(existingUsersRaw);
        const idx = list.findIndex((item: any) => item.user.id === user.id);
        if (idx >= 0) {
          list[idx].user = updated;
          localStorage.setItem(LOCAL_USERS_DB, JSON.stringify(list));
        }
      }

      setUser(updated);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update profile.' };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail) {
        return { success: false, error: 'Please enter your email address.' };
      }

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
        if (error) {
          return { success: false, error: error.message };
        }
      }

      return {
        success: true,
        message: `Password reset instructions have been generated for ${cleanEmail}. In demo mode, you can sign in directly or register a new password.`,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send reset link.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSupabaseActive: isSupabaseConfigured,
        signup,
        login,
        logout,
        updateProfile,
        resetPassword,
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

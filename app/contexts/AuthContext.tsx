'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

console.log('AuthProvider 렌더링!');

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  // 세션 초기화 및 상태 업데이트
  const refreshSession = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        return;
      }
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      setLoading(true);
      if (session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // user가 바뀔 때마다 role을 가져옴
  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const { data } = await supabase
          .from('user')
          .select('role')
          .eq('id', user.id)
          .single();
        setRole(data?.role ?? null);
      } else {
        setRole(null);
      }
    };
    fetchRole();
  }, [user]);

  // 로그인 후 role이 admin/moderator면 /admin으로 이동
  useEffect(() => {
    if (user && (role === 'admin' || role === 'moderator')) {
      router.replace('/admin');
    }
  }, [user, role, router]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        await supabase
          .from('user')
          .update({ last_sign_in_at: new Date().toISOString() })
          .eq('id', data.user.id);
      }
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      if (!error) {
        window.location.href = '/auth/signup-complete';
      }
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // Supabase 로그아웃
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // 사용자 상태 초기화
      setUser(null);
      setRole(null);
      
      // 모든 Supabase 관련 localStorage 항목 삭제
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // 세션 스토리지 클리어
      sessionStorage.clear();
      
      // 홈페이지로 리다이렉트
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) throw error;
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        await supabase
          .from('user')
          .update({ last_sign_in_at: new Date().toISOString() })
          .eq('id', userData.user.id);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
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
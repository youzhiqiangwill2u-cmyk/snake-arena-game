import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { IS_TEST_MODE } from '../lib/constants';
import type { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 虚拟测试账号数据
 */
const MOCK_USER: User = {
  id: '00000000-0000-0000-0000-000000000000',
  email: 'test@local.dev',
  app_metadata: {},
  user_metadata: { username: '测试玩家' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

const MOCK_PROFILE: Profile = {
  id: '00000000-0000-0000-0000-000000000000',
  username: '测试玩家（本地）',
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
};

/**
 * 认证上下文 Provider
 * NOTE: 管理 Supabase Auth 状态，自动同步 profiles 表
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * 获取并缓存用户资料
   */
  const fetchProfile = useCallback(async (userId: string) => {
    if (IS_TEST_MODE && userId === MOCK_USER.id) {
      setProfile(MOCK_PROFILE);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile({
        id: data.id,
        username: data.username,
        avatarUrl: data.avatar_url,
        createdAt: data.created_at,
        lastLoginAt: data.last_login_at,
      });

      // 更新最后登录时间
      await supabase
        .from('profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', userId);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (IS_TEST_MODE) {
      setUser(MOCK_USER);
      setProfile(MOCK_PROFILE);
      setLoading(false);
      return;
    }

    // 获取初始会话
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id);
      } else {
        setLoading(false);
      }
    });

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          fetchProfile(s.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  /**
   * 注册新用户
   * @param email 邮箱
   * @param password 密码
   * @param username 用户昵称
   */
  const signUp = useCallback(async (email: string, password: string, username: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    return { error: error?.message ?? null };
  }, []);

  /**
   * 邮箱密码登录
   */
  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  /**
   * 退出登录
   */
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, profile, session, loading, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 获取认证状态的 Hook
 * @returns 认证上下文
 */
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }
  return ctx;
}

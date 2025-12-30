import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../stores/useAppStore';
import type { User, Session } from '@supabase/supabase-js';

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export function useCloudSync() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { bookmarks, settings, todos } = useAppStore();
  const importConfig = useAppStore((s) => s.importConfig);

  // 监听认证状态
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // 登录
  const signIn = async (provider: 'github' | 'google') => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) setError(error.message);
  };

  // 邮箱登录
  const signInWithEmail = async (email: string, password: string) => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
  };

  // 邮箱注册
  const signUpWithEmail = async (email: string, password: string) => {
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
  };

  // 登出
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  // 上传数据到云端
  const uploadToCloud = useCallback(async () => {
    if (!user) return;
    
    setSyncStatus('syncing');
    setError(null);

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          bookmarks,
          settings,
          todos,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;

      setSyncStatus('success');
      setLastSynced(new Date().toISOString());
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (err) {
      setSyncStatus('error');
      setError(err instanceof Error ? err.message : '同步失败');
    }
  }, [user, bookmarks, settings, todos]);

  // 从云端下载数据
  const downloadFromCloud = useCallback(async () => {
    if (!user) return;

    setSyncStatus('syncing');
    setError(null);

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const config = {
          bookmarks: data.bookmarks,
          settings: data.settings,
          todos: data.todos,
        };
        importConfig(JSON.stringify(config));
        setLastSynced(data.updated_at);
      }

      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (err) {
      setSyncStatus('error');
      setError(err instanceof Error ? err.message : '下载失败');
    }
  }, [user, importConfig]);

  return {
    user,
    session,
    syncStatus,
    lastSynced,
    error,
    signIn,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    uploadToCloud,
    downloadFromCloud,
    isLoggedIn: !!user,
  };
}

![1767488052888](image/useCloudSync/1767488052888.png)![1767488056239](image/useCloudSync/1767488056239.png)![1767488142763](image/useCloudSync/1767488142763.png)import { useState, useEffect, useCallback } from 'react';
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
      const uploadData = {
        user_id: user.id,
        bookmarks,
        settings,
        todos,
        updated_at: new Date().toISOString(),
      };
      
      console.log('上传到云端的数据:', uploadData);
      
      const { error } = await supabase
        .from('user_settings')
        .upsert(uploadData, {
          onConflict: 'user_id',
        });

      if (error) throw error;

      console.log('上传成功');
      setSyncStatus('success');
      setLastSynced(new Date().toISOString());
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (err) {
      console.error('上传失败:', err);
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
        console.log('从云端下载的数据:', data);
        
        const config = {
          bookmarks: data.bookmarks,
          settings: data.settings,
          todos: data.todos,
        };
        
        console.log('准备导入的配置:', config);
        
        const success = importConfig(JSON.stringify(config));
        
        if (!success) {
          throw new Error('导入配置失败');
        }
        
        setLastSynced(data.updated_at);
        setSyncStatus('success');
        
        // 自动刷新页面以应用所有设置
        setTimeout(() => {
          console.log('刷新页面以应用设置');
          window.location.reload();
        }, 1000);
        return;
      } else {
        // 没有找到云端数据
        setError('云端没有找到数据，请先在其他设备上传');
        setSyncStatus('error');
      }
    } catch (err) {
      console.error('下载失败:', err);
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

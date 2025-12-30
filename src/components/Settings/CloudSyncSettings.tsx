import { useState } from 'react';
import { Cloud, Upload, Download, LogOut, Loader2, Check, AlertCircle } from 'lucide-react';
import { useCloudSync } from '../../hooks/useCloudSync';

export function CloudSyncSettings() {
  const {
    user,
    syncStatus,
    lastSynced,
    error,
    signIn,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    uploadToCloud,
    downloadFromCloud,
    isLoggedIn,
  } = useCloudSync();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      await signUpWithEmail(email, password);
    } else {
      await signInWithEmail(email, password);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN');
  };

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Cloud size={20} />
          云同步
        </h3>
        <p className="text-slate-400 text-sm mb-6">
          登录后可以在多个设备间同步你的书签、设置和待办事项。
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-300">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {!isLoggedIn ? (
          <div className="space-y-4">
            {/* OAuth 登录 */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => signIn('github')}
                className="flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </button>
              <button
                onClick={() => signIn('google')}
                className="flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-white transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-400">或使用邮箱</span>
              </div>
            </div>

            {/* 邮箱登录 */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="邮箱地址"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors"
              >
                {isSignUp ? '注册' : '登录'}
              </button>
            </form>

            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-center text-sm text-slate-400 hover:text-white transition-colors"
            >
              {isSignUp ? '已有账号？点击登录' : '没有账号？点击注册'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 用户信息 */}
            <div className="p-4 bg-slate-800/50 border border-slate-600 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                      {user?.email?.[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium">
                      {user?.user_metadata?.full_name || user?.email}
                    </p>
                    <p className="text-slate-400 text-sm">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                  title="退出登录"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>

            {/* 同步状态 */}
            {lastSynced && (
              <p className="text-slate-400 text-sm">
                上次同步: {formatDate(lastSynced)}
              </p>
            )}

            {/* 同步按钮 */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={uploadToCloud}
                disabled={syncStatus === 'syncing'}
                className="flex items-center justify-center gap-2 p-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl transition-colors"
              >
                {syncStatus === 'syncing' ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : syncStatus === 'success' ? (
                  <Check size={18} />
                ) : (
                  <Upload size={18} />
                )}
                上传到云端
              </button>
              <button
                onClick={downloadFromCloud}
                disabled={syncStatus === 'syncing'}
                className="flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-xl transition-colors"
              >
                {syncStatus === 'syncing' ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Download size={18} />
                )}
                从云端下载
              </button>
            </div>

            <p className="text-slate-500 text-xs">
              提示：上传会覆盖云端数据，下载会覆盖本地数据。
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Bookmark, AppSettings, SearchEngine, BackgroundConfig } from '../types';

// 默认书签
const defaultBookmarks: Bookmark[] = [
  { id: '1', icon: '🔍', title: 'Google', url: 'https://www.google.com' },
  { id: '2', icon: '💻', title: 'GitHub', url: 'https://github.com' },
  { id: '3', icon: '📺', title: 'YouTube', url: 'https://www.youtube.com' },
  { id: '4', icon: '📧', title: 'Gmail', url: 'https://mail.google.com' },
  { id: '5', icon: '📱', title: 'B站', url: 'https://www.bilibili.com' },
  { id: '6', icon: '🎵', title: '网易云', url: 'https://music.163.com' },
  { id: '7', icon: '🛒', title: '淘宝', url: 'https://www.taobao.com' },
  { id: '8', icon: '📝', title: 'Notion', url: 'https://www.notion.so' },
];

// 默认设置
const defaultSettings: AppSettings = {
  searchEngine: 'google',
  background: {
    type: 'gradient',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  customCss: '',
  showSeconds: false,
};

interface AppState {
  // 书签
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id'>) => void;
  removeBookmark: (id: string) => void;
  updateBookmark: (id: string, bookmark: Partial<Bookmark>) => void;
  reorderBookmarks: (bookmarks: Bookmark[]) => void;
  
  // 设置
  settings: AppSettings;
  setSearchEngine: (engine: SearchEngine) => void;
  setBackground: (bg: BackgroundConfig) => void;
  setCustomCss: (css: string) => void;
  setShowSeconds: (show: boolean) => void;
  
  // 设置面板
  settingsOpen: boolean;
  toggleSettings: () => void;
  
  // 导入导出
  exportConfig: () => string;
  importConfig: (json: string) => boolean;
  resetToDefault: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 书签状态
      bookmarks: defaultBookmarks,
      
      addBookmark: (bookmark) => set((state) => ({
        bookmarks: [...state.bookmarks, { ...bookmark, id: Date.now().toString() }],
      })),
      
      removeBookmark: (id) => set((state) => ({
        bookmarks: state.bookmarks.filter((b) => b.id !== id),
      })),
      
      updateBookmark: (id, updates) => set((state) => ({
        bookmarks: state.bookmarks.map((b) => 
          b.id === id ? { ...b, ...updates } : b
        ),
      })),
      
      reorderBookmarks: (bookmarks) => set({ bookmarks }),

      // 设置状态
      settings: defaultSettings,
      
      setSearchEngine: (engine) => set((state) => ({
        settings: { ...state.settings, searchEngine: engine },
      })),
      
      setBackground: (bg) => set((state) => ({
        settings: { ...state.settings, background: bg },
      })),
      
      setCustomCss: (css) => set((state) => ({
        settings: { ...state.settings, customCss: css },
      })),
      
      setShowSeconds: (show) => set((state) => ({
        settings: { ...state.settings, showSeconds: show },
      })),
      
      // 设置面板
      settingsOpen: false,
      toggleSettings: () => set((state) => ({ settingsOpen: !state.settingsOpen })),
      
      // 导入导出
      exportConfig: () => {
        const { bookmarks, settings } = get();
        const config = {
          version: '2.0',
          bookmarks,
          settings,
          exportedAt: new Date().toISOString(),
        };
        return JSON.stringify(config, null, 2);
      },
      
      importConfig: (json) => {
        try {
          const config = JSON.parse(json);
          if (config.bookmarks) set({ bookmarks: config.bookmarks });
          if (config.settings) set({ settings: { ...defaultSettings, ...config.settings } });
          return true;
        } catch {
          return false;
        }
      },
      
      resetToDefault: () => set({
        bookmarks: defaultBookmarks,
        settings: defaultSettings,
      }),
    }),
    {
      name: 'new-tab-storage',
      partialize: (state) => ({
        bookmarks: state.bookmarks,
        settings: state.settings,
      }),
    }
  )
);

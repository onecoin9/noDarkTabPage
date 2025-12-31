import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Bookmark, 
  AppSettings, 
  SearchEngine, 
  BackgroundConfig,
  Todo,
  PomodoroState,
  BookmarkDisplayMode,
  SettingsTab
} from '../types';

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
  showSearchSuggestions: true,
  searchBoxOpacity: 95,
  searchBoxColor: '#ffffff',
  searchBoxRadius: 9999,
  clockFontSize: 80,
  clockStyle: {
    fontFamily: 'system',
    fontWeight: 200,
    color: '#ffffff',
    opacity: 100,
    shadow: true,
    separator: ':',
  },
  clockPosition: { preset: 'center', offsetX: 0, offsetY: -80 },
  searchPosition: { preset: 'center', offsetX: 0, offsetY: 0 },
  background: {
    type: 'gradient',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    blur: 0,
    brightness: 100,
  },
  customCss: '',
  theme: 'dark',
  timeFormat: '24h',
  showSeconds: false,
  showDate: true,
  bookmarkDisplayMode: 'grid',
  bookmarkPosition: 'center',
  showBookmarkTitle: true,
  showWeather: true,
  showQuote: true,
  showTodo: true,
  showPomodoro: true,
  showCountdown: false,
  showNote: false,
  showCalendar: false,
  weatherPosition: { preset: 'center-left', offsetX: 0, offsetY: -100 },
  pomodoroPosition: { preset: 'center-left', offsetX: 0, offsetY: 100 },
  todoPosition: { preset: 'center-right', offsetX: 0, offsetY: 0 },
  quotePosition: { preset: 'center', offsetX: 0, offsetY: 60 },
  countdownPosition: { preset: 'center-left', offsetX: 0, offsetY: 100 },
  notePosition: { preset: 'bottom-right', offsetX: 0, offsetY: 0 },
  calendarPosition: { preset: 'center-right', offsetX: 0, offsetY: 100 },
  weatherSize: 200,
  pomodoroSize: 200,
  todoWidth: 280,
  todoHeight: 320,
  quoteSize: 100,
  countdownSize: 240,
  noteWidth: 280,
  noteHeight: 200,
  calendarSize: 240,
  weatherCity: '北京',
  weatherUnit: 'celsius',
  webdavUrl: '',
  webdavUsername: '',
  webdavPassword: '',
  webdavUseCorsProxy: false,
  webdavCorsProxyUrl: 'https://corsproxy.io/?',
  cloudBookmarksXBEL: '',
};

// 默认番茄钟
const defaultPomodoro: PomodoroState = {
  isRunning: false,
  mode: 'work',
  timeLeft: 25 * 60,
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsCompleted: 0,
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
  setBookmarkDisplayMode: (mode: BookmarkDisplayMode) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // 设置面板
  settingsOpen: boolean;
  settingsTab: SettingsTab;
  toggleSettings: () => void;
  setSettingsTab: (tab: SettingsTab) => void;
  
  // 待办事项
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  
  // 番茄钟
  pomodoro: PomodoroState;
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  tickPomodoro: () => void;
  setPomodoroSettings: (settings: Partial<PomodoroState>) => void;
  
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

      setBookmarkDisplayMode: (mode) => set((state) => ({
        settings: { ...state.settings, bookmarkDisplayMode: mode },
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),
      
      // 设置面板
      settingsOpen: false,
      settingsTab: 'appearance',
      toggleSettings: () => set((state) => ({ settingsOpen: !state.settingsOpen })),
      setSettingsTab: (tab) => set({ settingsTab: tab }),
      
      // 待办事项
      todos: [],
      
      addTodo: (text) => set((state) => ({
        todos: [...state.todos, {
          id: Date.now().toString(),
          text,
          completed: false,
          createdAt: new Date().toISOString(),
        }],
      })),
      
      toggleTodo: (id) => set((state) => ({
        todos: state.todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ),
      })),
      
      removeTodo: (id) => set((state) => ({
        todos: state.todos.filter((t) => t.id !== id),
      })),
      
      // 番茄钟
      pomodoro: defaultPomodoro,
      
      startPomodoro: () => set((state) => ({
        pomodoro: { ...state.pomodoro, isRunning: true },
      })),
      
      pausePomodoro: () => set((state) => ({
        pomodoro: { ...state.pomodoro, isRunning: false },
      })),
      
      resetPomodoro: () => set((state) => ({
        pomodoro: {
          ...state.pomodoro,
          isRunning: false,
          timeLeft: state.pomodoro.workDuration * 60,
          mode: 'work',
        },
      })),
      
      tickPomodoro: () => set((state) => {
        const { pomodoro } = state;
        if (!pomodoro.isRunning) return state;
        
        if (pomodoro.timeLeft <= 1) {
          // 时间到，切换模式
          const isWork = pomodoro.mode === 'work';
          const sessions = isWork ? pomodoro.sessionsCompleted + 1 : pomodoro.sessionsCompleted;
          const nextMode = isWork 
            ? (sessions % 4 === 0 ? 'longBreak' : 'break')
            : 'work';
          const nextTime = nextMode === 'work' 
            ? pomodoro.workDuration * 60
            : nextMode === 'break'
            ? pomodoro.breakDuration * 60
            : pomodoro.longBreakDuration * 60;
          
          return {
            pomodoro: {
              ...pomodoro,
              mode: nextMode,
              timeLeft: nextTime,
              sessionsCompleted: sessions,
              isRunning: false,
            },
          };
        }
        
        return {
          pomodoro: { ...pomodoro, timeLeft: pomodoro.timeLeft - 1 },
        };
      }),
      
      setPomodoroSettings: (settings) => set((state) => ({
        pomodoro: { ...state.pomodoro, ...settings },
      })),
      
      // 导入导出
      exportConfig: () => {
        const { bookmarks, settings, todos } = get();
        const config = {
          version: '2.0',
          bookmarks,
          settings,
          todos,
          exportedAt: new Date().toISOString(),
        };
        return JSON.stringify(config, null, 2);
      },
      
      importConfig: (json) => {
        try {
          const config = JSON.parse(json);
          const currentState = get();
          
          // 深度合并设置，保留所有字段
          if (config.settings) {
            set({ 
              settings: {
                ...currentState.settings,
                ...config.settings,
              }
            });
          }
          
          if (config.bookmarks) set({ bookmarks: config.bookmarks });
          if (config.todos) set({ todos: config.todos });
          
          return true;
        } catch {
          return false;
        }
      },
      
      resetToDefault: () => set({
        bookmarks: defaultBookmarks,
        settings: defaultSettings,
        todos: [],
        pomodoro: defaultPomodoro,
      }),
    }),
    {
      name: 'new-tab-storage',
      partialize: (state) => ({
        bookmarks: state.bookmarks,
        settings: state.settings,
        todos: state.todos,
        pomodoro: state.pomodoro,
      }),
    }
  )
);

// 书签类型
export interface Bookmark {
  id: string;
  icon: string;
  title: string;
  url: string;
  category?: string;
}

// 背景类型
export type BackgroundType = 'gradient' | 'unsplash' | 'bing' | 'wallhaven' | 'custom' | 'solid';

export interface BackgroundConfig {
  type: BackgroundType;
  value: string;
  unsplashCategory?: string;
  wallhavenCategory?: string;
  blur?: number;
  brightness?: number;
}

// 搜索引擎
export type SearchEngine = 'google' | 'baidu' | 'bing' | 'duckduckgo';

// 书签显示模式
export type BookmarkDisplayMode = 'grid' | 'list' | 'icon';

// 时间格式
export type TimeFormat = '12h' | '24h';

// 待办事项
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

// 番茄钟状态
export interface PomodoroState {
  isRunning: boolean;
  mode: 'work' | 'break' | 'longBreak';
  timeLeft: number;
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsCompleted: number;
}

// 天气数据
export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  city: string;
  humidity: number;
  wind: number;
}

// 每日一言
export interface DailyQuote {
  content: string;
  author: string;
  source?: string;
}

// 应用设置
export interface AppSettings {
  // 搜索
  searchEngine: SearchEngine;
  showSearchSuggestions: boolean;
  
  // 搜索框样式
  searchBoxOpacity: number;
  searchBoxColor: string;
  searchBoxRadius: number;
  
  // 时间字体大小
  clockFontSize: number;
  
  // 外观
  background: BackgroundConfig;
  customCss: string;
  theme: 'auto' | 'light' | 'dark';
  
  // 时间
  timeFormat: TimeFormat;
  showSeconds: boolean;
  showDate: boolean;
  
  // 书签
  bookmarkDisplayMode: BookmarkDisplayMode;
  showBookmarkTitle: boolean;
  
  // 功能开关
  showWeather: boolean;
  showQuote: boolean;
  showTodo: boolean;
  showPomodoro: boolean;
  showCountdown: boolean;
  showNote: boolean;
  showCalendar: boolean;
  
  // 天气
  weatherCity: string;
  weatherUnit: 'celsius' | 'fahrenheit';
}

// 设置页面标签
export type SettingsTab = 
  | 'appearance'
  | 'theme'
  | 'wallpaper'
  | 'widgets'
  | 'features'
  | 'interaction'
  | 'time'
  | 'cards'
  | 'data'
  | 'sync'
  | 'about';

// 配置导出格式
export interface ExportConfig {
  version: string;
  bookmarks: Bookmark[];
  settings: AppSettings;
  todos: Todo[];
  exportedAt: string;
}

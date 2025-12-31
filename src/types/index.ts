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

// 位置类型
export type PositionPreset = 
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

// 组件位置配置（支持9宫格 + 微调）
export interface ComponentPosition {
  preset: PositionPreset;
  offsetX: number; // 水平偏移 px
  offsetY: number; // 垂直偏移 px
}

// 书签位置（保持兼容）
export type BookmarkPosition = PositionPreset;

// 时间格式
export type TimeFormat = '12h' | '24h';

// 时钟字体
export type ClockFontFamily = 
  | 'system' 
  | 'serif' 
  | 'mono' 
  | 'rounded'
  | 'elegant'
  | 'digital';

// 时钟样式配置
export interface ClockStyle {
  fontFamily: ClockFontFamily;
  fontWeight: number; // 100-900
  color: string;
  opacity: number; // 0-100
  shadow: boolean;
  separator: ':' | '.' | ' ';
}

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
  clockStyle: ClockStyle;
  
  // 组件位置
  clockPosition: ComponentPosition;
  searchPosition: ComponentPosition;
  
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
  bookmarkPosition: BookmarkPosition;
  showBookmarkTitle: boolean;
  
  // 功能开关
  showWeather: boolean;
  showQuote: boolean;
  showTodo: boolean;
  showPomodoro: boolean;
  showCountdown: boolean;
  showNote: boolean;
  showCalendar: boolean;
  
  // 小组件位置
  weatherPosition: ComponentPosition;
  pomodoroPosition: ComponentPosition;
  todoPosition: ComponentPosition;
  quotePosition: ComponentPosition;
  
  // 小组件大小 (缩放比例 50-150)
  weatherScale: number;
  pomodoroScale: number;
  todoScale: number;
  quoteScale: number;
  
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

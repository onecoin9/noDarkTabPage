// 书签类型
export interface Bookmark {
  id: string;
  icon: string;
  title: string;
  url: string;
}

// 背景类型
export type BackgroundType = 'gradient' | 'unsplash' | 'custom' | 'solid';

export interface BackgroundConfig {
  type: BackgroundType;
  value: string;
  unsplashCategory?: string;
}

// 搜索引擎
export type SearchEngine = 'google' | 'baidu' | 'bing';

// 应用设置
export interface AppSettings {
  searchEngine: SearchEngine;
  background: BackgroundConfig;
  customCss: string;
  showSeconds: boolean;
}

// 配置导出格式
export interface ExportConfig {
  version: string;
  bookmarks: Bookmark[];
  settings: AppSettings;
  exportedAt: string;
}

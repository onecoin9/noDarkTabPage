import { useState, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import type { SearchEngine } from '../types';

const searchUrls: Record<SearchEngine, string> = {
  google: 'https://www.google.com/search?q=',
  baidu: 'https://www.baidu.com/s?wd=',
  bing: 'https://www.bing.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q=',
};

const engineNames: Record<SearchEngine, string> = {
  google: 'Google',
  baidu: '百度',
  bing: 'Bing',
  duckduckgo: 'DuckDuckGo',
};

// 判断颜色是否为浅色
const isLightColor = (color: string) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
};

export function SearchBox() {
  const [query, setQuery] = useState('');
  const settings = useAppStore((s) => s.settings);
  const setSearchEngine = useAppStore((s) => s.setSearchEngine);

  const handleSearch = () => {
    if (!query.trim()) return;
    window.open(searchUrls[settings.searchEngine] + encodeURIComponent(query), '_blank');
    setQuery('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  // 计算样式
  const opacity = (settings.searchBoxOpacity ?? 95) / 100;
  const bgColor = settings.searchBoxColor ?? '#ffffff';
  const radius = settings.searchBoxRadius ?? 9999;
  const isLight = isLightColor(bgColor);
  const textColor = isLight ? '#1f2937' : '#f3f4f6';
  const placeholderColor = isLight ? '#6b7280' : '#9ca3af';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full max-w-xl mx-auto"
    >
      <div 
        className="flex items-center backdrop-blur-sm px-5 py-2 shadow-lg hover:shadow-xl transition-shadow"
        style={{
          backgroundColor: `${bgColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
          borderRadius: `${Math.min(radius, 9999)}px`,
        }}
      >
        <select
          value={settings.searchEngine}
          onChange={(e) => setSearchEngine(e.target.value as SearchEngine)}
          className="bg-transparent text-sm outline-none cursor-pointer pr-2"
          style={{ color: textColor }}
        >
          {Object.entries(engineNames).map(([key, name]) => (
            <option key={key} value={key} className="bg-slate-800 text-white">{name}</option>
          ))}
        </select>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="搜索互联网..."
          className="flex-1 bg-transparent text-base outline-none px-3 py-2"
          style={{ 
            color: textColor,
            ['--placeholder-color' as string]: placeholderColor,
          }}
        />
        
        <button
          onClick={handleSearch}
          className="transition-colors p-2 hover:opacity-70"
          style={{ color: textColor }}
        >
          <Search size={20} />
        </button>
      </div>
    </motion.div>
  );
}

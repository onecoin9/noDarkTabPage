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

// 搜索引擎图标
const engineIcons: Record<SearchEngine, string> = {
  google: 'https://www.google.com/favicon.ico',
  baidu: 'https://www.baidu.com/favicon.ico',
  bing: 'https://www.bing.com/favicon.ico',
  duckduckgo: 'https://duckduckgo.com/favicon.ico',
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
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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
  const baseOpacity = (settings.searchBoxOpacity ?? 95) / 100;
  const isActive = isHovered || isFocused;
  const opacity = isActive ? Math.min(baseOpacity + 0.3, 1) : baseOpacity * 0.6;
  const bgColor = settings.searchBoxColor ?? '#ffffff';
  const radius = settings.searchBoxRadius ?? 9999;
  const isLight = isLightColor(bgColor);
  const textColor = isLight ? '#1f2937' : '#f3f4f6';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full max-w-xl mx-auto"
    >
      <motion.div 
        className="flex items-center backdrop-blur-sm px-5 py-2 shadow-lg cursor-text"
        style={{
          backgroundColor: `${bgColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
          borderRadius: `${Math.min(radius, 9999)}px`,
        }}
        animate={{
          scale: isActive ? 1 : 0.95,
          opacity: isActive ? 1 : 0.8,
        }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-2 pr-2 border-r border-current/20">
          <img 
            src={engineIcons[settings.searchEngine]} 
            alt={engineNames[settings.searchEngine]}
            className="w-4 h-4"
          />
          <select
            value={settings.searchEngine}
            onChange={(e) => setSearchEngine(e.target.value as SearchEngine)}
            className="bg-transparent text-sm outline-none cursor-pointer"
            style={{ color: textColor }}
          >
            {Object.entries(engineNames).map(([key, name]) => (
              <option key={key} value={key} className="bg-slate-800 text-white">{name}</option>
            ))}
          </select>
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="搜索互联网..."
          className="flex-1 bg-transparent text-base outline-none px-3 py-2 placeholder:opacity-60"
          style={{ color: textColor }}
        />
        
        <button
          onClick={handleSearch}
          className="transition-colors p-2 hover:opacity-70"
          style={{ color: textColor }}
        >
          <Search size={20} />
        </button>
      </motion.div>
    </motion.div>
  );
}

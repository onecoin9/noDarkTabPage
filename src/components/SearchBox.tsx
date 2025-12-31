import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
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

// 搜索引擎图标 (使用更可靠的图标源)
const engineIcons: Record<SearchEngine, string> = {
  google: 'https://www.google.com/favicon.ico',
  baidu: 'https://www.baidu.com/favicon.ico',
  bing: 'https://www.bing.com/favicon.ico',
  duckduckgo: 'https://duckduckgo.com/favicon.ico',
};

const engines: SearchEngine[] = ['google', 'baidu', 'bing', 'duckduckgo'];

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const settings = useAppStore((s) => s.settings);
  const setSearchEngine = useAppStore((s) => s.setSearchEngine);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    window.open(searchUrls[settings.searchEngine] + encodeURIComponent(query), '_blank');
    setQuery('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSelectEngine = (engine: SearchEngine) => {
    setSearchEngine(engine);
    setDropdownOpen(false);
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
        className="flex items-center backdrop-blur-sm px-4 py-2 shadow-lg cursor-text relative"
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
        {/* 自定义搜索引擎选择器 */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-black/10 transition-colors"
            style={{ color: textColor }}
          >
            <img 
              src={engineIcons[settings.searchEngine]} 
              alt={engineNames[settings.searchEngine]}
              className="w-5 h-5"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-sm font-medium">{engineNames[settings.searchEngine]}</span>
            <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* 下拉菜单 */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 py-1 rounded-xl shadow-xl overflow-hidden z-50"
                style={{
                  backgroundColor: bgColor,
                  minWidth: '140px',
                }}
              >
                {engines.map((engine) => (
                  <button
                    key={engine}
                    onClick={() => handleSelectEngine(engine)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                      settings.searchEngine === engine 
                        ? isLight ? 'bg-black/10' : 'bg-white/10'
                        : isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'
                    }`}
                    style={{ color: textColor }}
                  >
                    <img 
                      src={engineIcons[engine]} 
                      alt={engineNames[engine]}
                      className="w-5 h-5"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span className="text-sm">{engineNames[engine]}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-6 mx-2" style={{ backgroundColor: `${textColor}30` }} />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="搜索互联网..."
          className="flex-1 bg-transparent text-base outline-none px-2 py-2 placeholder:opacity-50"
          style={{ color: textColor }}
        />
        
        <button
          onClick={handleSearch}
          className="transition-colors p-2 rounded-lg hover:bg-black/10"
          style={{ color: textColor }}
        >
          <Search size={20} />
        </button>
      </motion.div>
    </motion.div>
  );
}

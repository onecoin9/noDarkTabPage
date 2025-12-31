import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import type { SearchEngine } from '../types';

// 星星粒子组件
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

function SparkleEffect({ show, onComplete }: { show: boolean; onComplete: () => void }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    if (show) {
      const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#a855f7', '#3b82f6', '#f97316'];
      const newParticles: Particle[] = [];
      for (let i = 0; i < 12; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 60 - 30,
          y: Math.random() * 60 - 30,
          size: Math.random() * 6 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.2,
        });
      }
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);
  
  if (!show || particles.length === 0) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{ 
            opacity: 0, 
            scale: 1, 
            x: p.x, 
            y: p.y,
          }}
          transition={{ 
            duration: 0.5, 
            delay: p.delay,
            ease: 'easeOut',
          }}
          className="absolute left-1/2 top-1/2"
          style={{ 
            width: p.size, 
            height: p.size, 
            backgroundColor: p.color,
            borderRadius: '50%',
            boxShadow: `0 0 ${p.size}px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}

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
  const [showSparkle, setShowSparkle] = useState(false);
  const settings = useAppStore((s) => s.settings);
  const setSearchEngine = useAppStore((s) => s.setSearchEngine);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLButtonElement>(null);
  const [selectorWidth, setSelectorWidth] = useState(0);

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

  // 测量选择器宽度
  useEffect(() => {
    if (selectorRef.current) {
      setSelectorWidth(selectorRef.current.offsetWidth);
    }
  }, [settings.searchEngine]);

  const handleSparkleComplete = useCallback(() => {
    setShowSparkle(false);
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
    if (engine !== settings.searchEngine) {
      setShowSparkle(true);
    }
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
            ref={selectorRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-black/10 transition-colors relative"
            style={{ color: textColor }}
          >
            <motion.img 
              key={settings.searchEngine}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              src={engineIcons[settings.searchEngine]} 
              alt={engineNames[settings.searchEngine]}
              className="w-5 h-5"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <motion.span 
              key={`name-${settings.searchEngine}`}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium"
            >
              {engineNames[settings.searchEngine]}
            </motion.span>
            <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            
            {/* 星星动画效果 */}
            <SparkleEffect show={showSparkle} onComplete={handleSparkleComplete} />
          </button>

          {/* 下拉菜单 - 宽度与选择器对齐 */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 py-1 rounded-xl shadow-xl overflow-hidden z-50"
                style={{
                  backgroundColor: bgColor,
                  width: selectorWidth > 0 ? `${selectorWidth}px` : 'auto',
                  minWidth: '100px',
                }}
              >
                {engines.map((engine, index) => (
                  <motion.button
                    key={engine}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleSelectEngine(engine)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${
                      settings.searchEngine === engine 
                        ? isLight ? 'bg-black/10' : 'bg-white/10'
                        : isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'
                    }`}
                    style={{ color: textColor }}
                  >
                    <img 
                      src={engineIcons[engine]} 
                      alt={engineNames[engine]}
                      className="w-4 h-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span className="text-sm truncate">{engineNames[engine]}</span>
                  </motion.button>
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
          placeholder="探索世界ing"
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

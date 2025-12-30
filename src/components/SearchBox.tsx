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

export function SearchBox() {
  const [query, setQuery] = useState('');
  const searchEngine = useAppStore((s) => s.settings.searchEngine);
  const setSearchEngine = useAppStore((s) => s.setSearchEngine);

  const handleSearch = () => {
    if (!query.trim()) return;
    window.open(searchUrls[searchEngine] + encodeURIComponent(query), '_blank');
    setQuery('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-full px-5 py-2 shadow-lg hover:shadow-xl transition-shadow">
        <select
          value={searchEngine}
          onChange={(e) => setSearchEngine(e.target.value as SearchEngine)}
          className="bg-transparent text-gray-600 text-sm outline-none cursor-pointer pr-2"
        >
          {Object.entries(engineNames).map(([key, name]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="搜索互联网..."
          className="flex-1 bg-transparent text-gray-800 text-base outline-none px-3 py-2"
        />
        
        <button
          onClick={handleSearch}
          className="text-gray-500 hover:text-gray-700 transition-colors p-2"
        >
          <Search size={20} />
        </button>
      </div>
    </motion.div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, ChevronRight, ChevronDown, X, Plus } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import type { Bookmark } from '../types';

interface BookmarkPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookmarkPanel({ isOpen, onClose }: BookmarkPanelProps) {
  const bookmarks = useAppStore((s) => s.bookmarks);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['未分类']));

  // 按分类分组书签
  const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
    const category = bookmark.category || '未分类';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(bookmark);
    return acc;
  }, {} as Record<string, Bookmark[]>);

  const categories = Object.keys(groupedBookmarks).sort();

  const toggleFolder = (category: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedFolders(newExpanded);
  };

  const openAllInFolder = (category: string) => {
    const urls = groupedBookmarks[category].map(b => b.url);
    urls.forEach(url => window.open(url, '_blank'));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* 侧边栏 */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 z-50 flex flex-col shadow-2xl"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <Folder size={20} className="text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">书签文件夹</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* 书签列表 */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {categories.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  <Folder size={48} className="mx-auto mb-2 opacity-50" />
                  <p>还没有书签</p>
                  <p className="text-sm mt-1">点击右下角编辑按钮添加</p>
                </div>
              ) : (
                categories.map((category) => {
                  const isExpanded = expandedFolders.has(category);
                  const items = groupedBookmarks[category];

                  return (
                    <div key={category} className="space-y-1">
                      {/* 文件夹标题 */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFolder(category)}
                          className="flex-1 flex items-center gap-2 px-3 py-2 hover:bg-slate-700/50 rounded-lg text-white transition-colors group"
                        >
                          {isExpanded ? (
                            <ChevronDown size={16} className="text-slate-400" />
                          ) : (
                            <ChevronRight size={16} className="text-slate-400" />
                          )}
                          <Folder size={16} className="text-indigo-400" />
                          <span className="flex-1 text-left text-sm font-medium">
                            {category}
                          </span>
                          <span className="text-xs text-slate-500">
                            {items.length}
                          </span>
                        </button>
                        {items.length > 1 && (
                          <button
                            onClick={() => openAllInFolder(category)}
                            className="px-2 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
                            title="打开全部"
                          >
                            <Plus size={14} />
                          </button>
                        )}
                      </div>

                      {/* 书签列表 */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-6 space-y-1">
                              {items.map((bookmark) => (
                                <a
                                  key={bookmark.id}
                                  href={bookmark.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700/50 rounded-lg text-slate-300 hover:text-white transition-colors group"
                                >
                                  {bookmark.icon.startsWith('http') ? (
                                    <img
                                      src={bookmark.icon}
                                      alt={bookmark.title}
                                      className="w-4 h-4 rounded"
                                    />
                                  ) : (
                                    <span className="text-base">{bookmark.icon}</span>
                                  )}
                                  <span className="flex-1 text-sm truncate">
                                    {bookmark.title}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>

            {/* 底部提示 */}
            <div className="p-4 border-t border-slate-700/50 text-xs text-slate-500">
              <p>💡 在书签设置中可以为书签添加分类</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

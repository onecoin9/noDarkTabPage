import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, ChevronRight, ChevronDown, X, Plus, ExternalLink } from 'lucide-react';

interface BookmarkPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChromeBookmark {
  id: string;
  title: string;
  url?: string;
  children?: ChromeBookmark[];
  dateAdded?: number;
}

export function BookmarkPanel({ isOpen, onClose }: BookmarkPanelProps) {
  const [bookmarks, setBookmarks] = useState<ChromeBookmark[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [isExtension, setIsExtension] = useState(false);

  useEffect(() => {
    // 检查是否在扩展环境中
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      setIsExtension(true);
      loadChromeBookmarks();
    }
  }, [isOpen]);

  const loadChromeBookmarks = async () => {
    try {
      const tree = await chrome.bookmarks.getTree();
      if (tree && tree[0] && tree[0].children) {
        setBookmarks(tree[0].children);
        // 默认展开第一层
        const firstLevelIds = tree[0].children.map((b: ChromeBookmark) => b.id);
        setExpandedFolders(new Set(firstLevelIds));
      }
    } catch (error) {
      console.error('读取浏览器书签失败:', error);
    }
  };

  const toggleFolder = (id: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedFolders(newExpanded);
  };

  const openAllInFolder = (bookmark: ChromeBookmark) => {
    const collectUrls = (node: ChromeBookmark): string[] => {
      if (node.url) return [node.url];
      if (node.children) {
        return node.children.flatMap(child => collectUrls(child));
      }
      return [];
    };

    const urls = collectUrls(bookmark);
    urls.forEach(url => window.open(url, '_blank'));
  };

  const renderBookmark = (bookmark: ChromeBookmark, level: number = 0) => {
    const isFolder = !bookmark.url && bookmark.children && bookmark.children.length > 0;
    const isExpanded = expandedFolders.has(bookmark.id);
    const hasChildren = bookmark.children && bookmark.children.length > 0;

    if (isFolder) {
      return (
        <div key={bookmark.id} style={{ marginLeft: `${level * 12}px` }}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFolder(bookmark.id)}
              className="flex-1 flex items-center gap-2 px-3 py-2 hover:bg-slate-700/50 rounded-lg text-white transition-colors group"
            >
              {isExpanded ? (
                <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
              ) : (
                <ChevronRight size={16} className="text-slate-400 flex-shrink-0" />
              )}
              <Folder size={16} className="text-indigo-400 flex-shrink-0" />
              <span className="flex-1 text-left text-sm font-medium truncate">
                {bookmark.title || '未命名'}
              </span>
              <span className="text-xs text-slate-500">
                {bookmark.children?.length || 0}
              </span>
            </button>
            {hasChildren && bookmark.children!.some(c => c.url) && (
              <button
                onClick={() => openAllInFolder(bookmark)}
                className="px-2 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
                title="打开全部"
              >
                <Plus size={14} />
              </button>
            )}
          </div>

          <AnimatePresence>
            {isExpanded && hasChildren && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {bookmark.children!.map(child => renderBookmark(child, level + 1))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // 书签项
    if (bookmark.url) {
      return (
        <a
          key={bookmark.id}
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700/50 rounded-lg text-slate-300 hover:text-white transition-colors group"
          style={{ marginLeft: `${level * 12}px` }}
        >
          <img
            src={`https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=16`}
            alt=""
            className="w-4 h-4 flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><text y="12" font-size="12">🔗</text></svg>';
            }}
          />
          <span className="flex-1 text-sm truncate">
            {bookmark.title || bookmark.url}
          </span>
          <ExternalLink size={12} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </a>
      );
    }

    return null;
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
                <h2 className="text-lg font-semibold text-white">
                  {isExtension ? '浏览器书签' : '书签文件夹'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* 书签列表 */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {!isExtension ? (
                <div className="text-center text-slate-400 py-8 px-4">
                  <Folder size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="font-medium mb-2">需要浏览器扩展权限</p>
                  <p className="text-sm leading-relaxed">
                    此功能需要作为浏览器扩展运行才能访问浏览器书签。
                  </p>
                  <p className="text-sm mt-2 text-slate-500">
                    请将项目安装为 Chrome/Edge 扩展
                  </p>
                </div>
              ) : bookmarks.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  <Folder size={48} className="mx-auto mb-2 opacity-50" />
                  <p>加载书签中...</p>
                </div>
              ) : (
                bookmarks.map(bookmark => renderBookmark(bookmark, 0))
              )}
            </div>

            {/* 底部提示 */}
            <div className="p-4 border-t border-slate-700/50 text-xs text-slate-500">
              {isExtension ? (
                <p>💡 点击文件夹右侧的 + 可打开该文件夹内所有书签</p>
              ) : (
                <p>💡 在网页模式下无法访问浏览器书签</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

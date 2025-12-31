import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, ChevronRight, ChevronDown, X, Plus, ExternalLink, Settings as SettingsIcon, RefreshCw } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';

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

// 解析 XBEL 格式
function parseXBEL(xmlText: string): ChromeBookmark[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  
  const parseNode = (node: Element, idCounter: { value: number }): ChromeBookmark | null => {
    if (node.tagName === 'bookmark') {
      const href = node.getAttribute('href');
      const title = node.querySelector('title')?.textContent || href || '未命名';
      return {
        id: `bookmark-${idCounter.value++}`,
        title,
        url: href || undefined,
      };
    }
    
    if (node.tagName === 'folder') {
      const title = node.querySelector(':scope > title')?.textContent || '未命名文件夹';
      const children: ChromeBookmark[] = [];
      
      Array.from(node.children).forEach(child => {
        if (child.tagName === 'bookmark' || child.tagName === 'folder') {
          const parsed = parseNode(child, idCounter);
          if (parsed) children.push(parsed);
        }
      });
      
      return {
        id: `folder-${idCounter.value++}`,
        title,
        children,
      };
    }
    
    return null;
  };
  
  const idCounter = { value: 0 };
  const root = doc.querySelector('xbel');
  if (!root) return [];
  
  const bookmarks: ChromeBookmark[] = [];
  Array.from(root.children).forEach(child => {
    if (child.tagName === 'bookmark' || child.tagName === 'folder') {
      const parsed = parseNode(child, idCounter);
      if (parsed) bookmarks.push(parsed);
    }
  });
  
  return bookmarks;
}

export function BookmarkPanel({ isOpen, onClose }: BookmarkPanelProps) {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [bookmarks, setBookmarks] = useState<ChromeBookmark[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [isExtension, setIsExtension] = useState(false);
  const [mode, setMode] = useState<'extension' | 'webdav'>('extension');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [uploadedXBEL, setUploadedXBEL] = useState<string | null>(null);

  useEffect(() => {
    // 检查是否在扩展环境中
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
      setIsExtension(true);
      setMode('extension');
    } else if (settings.webdavUrl) {
      setMode('webdav');
    }
  }, [settings.webdavUrl]);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'extension' && isExtension) {
        loadChromeBookmarks();
      } else if (mode === 'webdav') {
        if (uploadedXBEL) {
          loadFromXBELText(uploadedXBEL);
        } else if (settings.webdavUrl) {
          loadWebDAVBookmarks();
        }
      }
    }
  }, [isOpen, mode, uploadedXBEL]);

  const loadChromeBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tree = await chrome.bookmarks.getTree();
      if (tree && tree[0] && tree[0].children) {
        setBookmarks(tree[0].children);
        const firstLevelIds = tree[0].children.map((b: ChromeBookmark) => b.id);
        setExpandedFolders(new Set(firstLevelIds));
      }
    } catch (err) {
      setError('读取浏览器书签失败');
      console.error('读取浏览器书签失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFromXBELText = (xmlText: string) => {
    try {
      setLoading(true);
      setError(null);
      const parsed = parseXBEL(xmlText);
      setBookmarks(parsed);
      
      // 默认展开第一层
      const firstLevelIds = parsed.map(b => b.id);
      setExpandedFolders(new Set(firstLevelIds));
    } catch (err) {
      setError('解析 XBEL 文件失败');
      console.error('解析 XBEL 失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadWebDAVBookmarks = async () => {
    if (!settings.webdavUrl) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // 构建请求 URL
      let fetchUrl = settings.webdavUrl;
      if (settings.webdavUseCorsProxy && settings.webdavCorsProxyUrl) {
        fetchUrl = settings.webdavCorsProxyUrl + encodeURIComponent(settings.webdavUrl);
      }
      
      const headers: HeadersInit = {
        'Accept': 'application/xml, text/xml',
      };
      
      // 如果有认证信息且不使用代理（代理会处理认证）
      if (!settings.webdavUseCorsProxy && settings.webdavUsername && settings.webdavPassword) {
        const auth = btoa(`${settings.webdavUsername}:${settings.webdavPassword}`);
        headers['Authorization'] = `Basic ${auth}`;
      }
      
      const response = await fetch(fetchUrl, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const xmlText = await response.text();
      loadFromXBELText(xmlText);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '加载书签失败';
      setError(errorMsg + (errorMsg.includes('NetworkError') ? ' (CORS 跨域问题，请启用代理)' : ''));
      console.error('加载 WebDAV 书签失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setUploadedXBEL(text);
      loadFromXBELText(text);
    };
    reader.readAsText(file);
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
                  {mode === 'extension' ? '浏览器书签' : 'WebDAV 书签'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {mode === 'webdav' && (
                  <button
                    onClick={loadWebDAVBookmarks}
                    disabled={loading}
                    className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                    title="刷新"
                  >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                  </button>
                )}
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="设置"
                >
                  <SettingsIcon size={18} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* 设置面板 */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-b border-slate-700/50"
                >
                  <div className="p-4 space-y-3 bg-slate-800/50">
                    <div>
                      <label className="text-slate-400 text-xs mb-1 block">书签来源</label>
                      <div className="flex gap-2">
                        {isExtension && (
                          <button
                            onClick={() => setMode('extension')}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                              mode === 'extension'
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                          >
                            浏览器
                          </button>
                        )}
                        <button
                          onClick={() => setMode('webdav')}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                            mode === 'webdav'
                              ? 'bg-indigo-500 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          WebDAV
                        </button>
                      </div>
                    </div>
                    
                    {mode === 'webdav' && (
                      <>
                        <div>
                          <label className="text-slate-400 text-xs mb-1 block">上传 XBEL 文件</label>
                          <input
                            type="file"
                            accept=".xbel,.xml"
                            onChange={handleFileUpload}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-indigo-500 file:text-white file:text-xs hover:file:bg-indigo-600"
                          />
                          <p className="text-slate-500 text-xs mt-1">从浏览器导出的 XBEL 格式书签文件</p>
                        </div>
                        
                        <div className="border-t border-slate-600 pt-3">
                          <p className="text-slate-400 text-xs mb-2">或使用 WebDAV 同步</p>
                        </div>
                        
                        <div>
                          <label className="text-slate-400 text-xs mb-1 block">XBEL 文件 URL</label>
                          <input
                            type="text"
                            value={settings.webdavUrl || ''}
                            onChange={(e) => updateSettings({ webdavUrl: e.target.value })}
                            placeholder="https://dav.jianguoyun.com/dav/Floccus/bookmarks.xbel"
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        
                        <div>
                          <label className="flex items-center gap-2 text-slate-400 text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.webdavUseCorsProxy || false}
                              onChange={(e) => updateSettings({ webdavUseCorsProxy: e.target.checked })}
                              className="rounded"
                            />
                            <span>使用 CORS 代理（解决跨域问题）</span>
                          </label>
                        </div>
                        
                        {settings.webdavUseCorsProxy && (
                          <div>
                            <label className="text-slate-400 text-xs mb-1 block">CORS 代理地址</label>
                            <input
                              type="text"
                              value={settings.webdavCorsProxyUrl || ''}
                              onChange={(e) => updateSettings({ webdavCorsProxyUrl: e.target.value })}
                              placeholder="https://corsproxy.io/?"
                              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                            />
                            <p className="text-slate-500 text-xs mt-1">
                              推荐：corsproxy.io、cors-anywhere.herokuapp.com
                            </p>
                          </div>
                        )}
                        
                        <div>
                          <label className="text-slate-400 text-xs mb-1 block">用户名（可选）</label>
                          <input
                            type="text"
                            value={settings.webdavUsername || ''}
                            onChange={(e) => updateSettings({ webdavUsername: e.target.value })}
                            placeholder="username"
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 text-xs mb-1 block">密码（可选）</label>
                          <input
                            type="password"
                            value={settings.webdavPassword || ''}
                            onChange={(e) => updateSettings({ webdavPassword: e.target.value })}
                            placeholder="password"
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 书签列表 */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {error ? (
                <div className="text-center text-red-400 py-8 px-4">
                  <p className="font-medium mb-2">加载失败</p>
                  <p className="text-sm">{error}</p>
                  <button
                    onClick={() => mode === 'webdav' ? loadWebDAVBookmarks() : loadChromeBookmarks()}
                    className="mt-3 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
                  >
                    重试
                  </button>
                </div>
              ) : loading ? (
                <div className="text-center text-slate-400 py-8">
                  <RefreshCw size={32} className="mx-auto mb-2 animate-spin" />
                  <p>加载书签中...</p>
                </div>
              ) : !isExtension && mode === 'extension' ? (
                <div className="text-center text-slate-400 py-8 px-4">
                  <Folder size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="font-medium mb-2">需要浏览器扩展权限</p>
                  <p className="text-sm leading-relaxed mb-3">
                    浏览器书签功能需要作为扩展运行。
                  </p>
                  <button
                    onClick={() => setMode('webdav')}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm transition-colors"
                  >
                    使用 WebDAV 模式
                  </button>
                </div>
              ) : mode === 'webdav' && !settings.webdavUrl ? (
                <div className="text-center text-slate-400 py-8 px-4">
                  <Folder size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="font-medium mb-2">未配置 WebDAV</p>
                  <p className="text-sm leading-relaxed mb-3">
                    请点击右上角设置按钮配置 XBEL 文件地址
                  </p>
                </div>
              ) : bookmarks.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  <Folder size={48} className="mx-auto mb-2 opacity-50" />
                  <p>没有书签</p>
                </div>
              ) : (
                bookmarks.map(bookmark => renderBookmark(bookmark, 0))
              )}
            </div>

            {/* 底部提示 */}
            <div className="p-4 border-t border-slate-700/50 text-xs text-slate-500">
              {mode === 'extension' ? (
                <p>💡 点击文件夹右侧的 + 可打开该文件夹内所有书签</p>
              ) : uploadedXBEL ? (
                <p>✅ 已加载本地 XBEL 文件</p>
              ) : (
                <p>💡 支持上传 XBEL 文件或通过 WebDAV 同步</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

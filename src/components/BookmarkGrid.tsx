import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Settings, Trash2 } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import type { Bookmark } from '../types';

// 预设图标
const presetIcons = [
  '🔍', '💻', '📺', '📧', '📱', '🎵', '🛒', '📝',
  '🎮', '📚', '🎬', '💬', '📷', '🎨', '💼', '🏠',
  '⚙️', '🔔', '📅', '💡', '🔒', '🌐', '⭐', '❤️',
  '🚀', '💰', '📊', '🎯', '🔥', '✨', '🌙', '☀️',
];

// 常用网站预设图标
const websiteIcons: Record<string, string> = {
  'google': 'https://www.google.com/favicon.ico',
  'github': 'https://github.com/favicon.ico',
  'youtube': 'https://www.youtube.com/favicon.ico',
  'twitter': 'https://twitter.com/favicon.ico',
  'facebook': 'https://www.facebook.com/favicon.ico',
  'instagram': 'https://www.instagram.com/favicon.ico',
  'linkedin': 'https://www.linkedin.com/favicon.ico',
  'reddit': 'https://www.reddit.com/favicon.ico',
  'netflix': 'https://www.netflix.com/favicon.ico',
  'spotify': 'https://www.spotify.com/favicon.ico',
  'amazon': 'https://www.amazon.com/favicon.ico',
  'bilibili': 'https://www.bilibili.com/favicon.ico',
  'zhihu': 'https://www.zhihu.com/favicon.ico',
  'weibo': 'https://weibo.com/favicon.ico',
  'taobao': 'https://www.taobao.com/favicon.ico',
  'jd': 'https://www.jd.com/favicon.ico',
  'notion': 'https://www.notion.so/favicon.ico',
  'figma': 'https://www.figma.com/favicon.ico',
  'dribbble': 'https://dribbble.com/favicon.ico',
  'discord': 'https://discord.com/favicon.ico',
  'slack': 'https://slack.com/favicon.ico',
  'telegram': 'https://telegram.org/favicon.ico',
};

interface BookmarkItemProps {
  bookmark: Bookmark;
  index: number;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
}

function BookmarkItem({ bookmark, index, onEdit }: Omit<BookmarkItemProps, 'onDelete'>) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
      className="relative group"
      onMouseEnter={() => setShowSettings(true)}
      onMouseLeave={() => setShowSettings(false)}
    >
      <motion.a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -5, scale: 1.02 }}
        className="flex flex-col items-center gap-2 p-5 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20 text-white cursor-pointer transition-all hover:bg-white/25 hover:shadow-lg relative overflow-hidden"
      >
        {bookmark.icon.startsWith('http') ? (
          <img src={bookmark.icon} alt={bookmark.title} className="w-10 h-10 rounded-lg" />
        ) : (
          <span className="text-4xl">{bookmark.icon}</span>
        )}
        <span className="text-sm font-medium text-center truncate w-full">{bookmark.title}</span>
        
        {/* 设置图标 - 融入卡片右下角 */}
        <AnimatePresence>
          {showSettings && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(bookmark);
              }}
              className="absolute bottom-2 right-2 text-white/40 hover:text-white/80 transition-colors"
            >
              <Settings size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.a>
    </motion.div>
  );
}

interface EditModalProps {
  bookmark: Bookmark | null;
  isNew: boolean;
  onSave: (bookmark: Omit<Bookmark, 'id'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

function EditModal({ bookmark, isNew, onSave, onDelete, onClose }: EditModalProps) {
  const [title, setTitle] = useState(bookmark?.title || '');
  const [url, setUrl] = useState(bookmark?.url || '');
  const [icon, setIcon] = useState(bookmark?.icon || '🔗');
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    
    onSave({
      id: bookmark?.id,
      title: title.trim(),
      url: url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`,
      icon: icon || '🔗',
    });
  };

  // 自动获取 favicon
  const fetchFavicon = () => {
    if (url) {
      try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        setIcon(`https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`);
      } catch {
        // ignore
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">
            {isNew ? '添加书签' : '编辑书签'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 图标选择 */}
          <div>
            <label className="text-slate-400 text-sm mb-2 block">图标</label>
            <div className="flex gap-2 mb-2">
              <div 
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors border border-slate-600"
              >
                {icon.startsWith('http') ? (
                  <img src={icon} alt="icon" className="w-8 h-8 rounded" />
                ) : (
                  <span className="text-3xl">{icon}</span>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="emoji 或图片 URL"
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={fetchFavicon}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                >
                  自动获取网站图标
                </button>
              </div>
            </div>
            
            {/* 图标选择器 */}
            <AnimatePresence>
              {showIconPicker && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-slate-800 rounded-xl p-3 mt-2 border border-slate-600">
                    <p className="text-slate-400 text-xs mb-2">Emoji 图标</p>
                    <div className="grid grid-cols-8 gap-1 mb-3">
                      {presetIcons.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setIcon(emoji);
                            setShowIconPicker(false);
                          }}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors ${
                            icon === emoji ? 'bg-indigo-500/30 ring-1 ring-indigo-500' : ''
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <p className="text-slate-400 text-xs mb-2">常用网站</p>
                    <div className="grid grid-cols-6 gap-1">
                      {Object.entries(websiteIcons).map(([name, iconUrl]) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            setIcon(iconUrl);
                            setShowIconPicker(false);
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                          title={name}
                        >
                          <img src={iconUrl} alt={name} className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div>
            <label className="text-slate-400 text-sm mb-1 block">名称</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="网站名称"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="text-slate-400 text-sm mb-1 block">网址</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors"
            >
              保存
            </button>
          </div>
          
          {/* 删除按钮 - 仅编辑时显示 */}
          {!isNew && onDelete && (
            <button
              type="button"
              onClick={() => {
                if (bookmark && confirm('确定删除这个书签吗？')) {
                  onDelete(bookmark.id);
                  onClose();
                }
              }}
              className="w-full mt-3 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              删除书签
            </button>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
}

export function BookmarkGrid() {
  const bookmarks = useAppStore((s) => s.bookmarks);
  const addBookmark = useAppStore((s) => s.addBookmark);
  const updateBookmark = useAppStore((s) => s.updateBookmark);
  const removeBookmark = useAppStore((s) => s.removeBookmark);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleSave = (data: Omit<Bookmark, 'id'> & { id?: string }) => {
    if (data.id) {
      updateBookmark(data.id, data);
    } else {
      addBookmark(data);
    }
    setEditingBookmark(null);
    setIsAddingNew(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {bookmarks.map((bookmark, index) => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              index={index}
              onEdit={setEditingBookmark}
            />
          ))}
          
          {/* 添加按钮 - 始终显示 */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsAddingNew(true)}
            className="flex flex-col items-center justify-center gap-2 p-5 bg-white/5 backdrop-blur-sm rounded-2xl border-2 border-dashed border-white/20 text-white/40 hover:bg-white/10 hover:border-white/40 hover:text-white/70 transition-all"
          >
            <Plus size={28} />
            <span className="text-xs">添加</span>
          </motion.button>
        </div>
      </motion.div>

      {/* 编辑弹窗 */}
      <AnimatePresence>
        {(editingBookmark || isAddingNew) && (
          <EditModal
            bookmark={editingBookmark}
            isNew={isAddingNew}
            onSave={handleSave}
            onDelete={removeBookmark}
            onClose={() => {
              setEditingBookmark(null);
              setIsAddingNew(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

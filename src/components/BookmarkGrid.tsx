import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Settings } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import type { Bookmark } from '../types';

interface BookmarkItemProps {
  bookmark: Bookmark;
  index: number;
  isEditMode: boolean;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
}

function BookmarkItem({ bookmark, index, isEditMode, onEdit, onDelete }: BookmarkItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.preventDefault();
      onEdit(bookmark);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
      className="relative group"
    >
      <motion.a
        href={isEditMode ? undefined : bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        whileHover={{ y: isEditMode ? 0 : -5, scale: 1.02 }}
        className={`flex flex-col items-center gap-2 p-5 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20 text-white cursor-pointer transition-all hover:bg-white/25 hover:shadow-lg ${
          isEditMode ? 'ring-2 ring-indigo-500/50' : ''
        }`}
      >
        {bookmark.icon.startsWith('http') ? (
          <img src={bookmark.icon} alt={bookmark.title} className="w-10 h-10 rounded-lg" />
        ) : (
          <span className="text-4xl">{bookmark.icon}</span>
        )}
        <span className="text-sm font-medium text-center truncate w-full">{bookmark.title}</span>
      </motion.a>
      
      {/* 编辑模式下显示删除按钮 */}
      {isEditMode && (
        <button
          onClick={() => onDelete(bookmark.id)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </motion.div>
  );
}

interface EditModalProps {
  bookmark: Bookmark | null;
  isNew: boolean;
  onSave: (bookmark: Omit<Bookmark, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

function EditModal({ bookmark, isNew, onSave, onClose }: EditModalProps) {
  const [title, setTitle] = useState(bookmark?.title || '');
  const [url, setUrl] = useState(bookmark?.url || '');
  const [icon, setIcon] = useState(bookmark?.icon || '🔗');

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
        className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700"
      >
        <h3 className="text-xl font-semibold text-white mb-4">
          {isNew ? '添加书签' : '编辑书签'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm mb-1 block">图标</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="emoji 或图片 URL"
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={fetchFavicon}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm"
              >
                自动获取
              </button>
            </div>
            {icon && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-slate-400 text-sm">预览:</span>
                {icon.startsWith('http') ? (
                  <img src={icon} alt="icon" className="w-8 h-8 rounded" />
                ) : (
                  <span className="text-2xl">{icon}</span>
                )}
              </div>
            )}
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
  const [isEditMode, setIsEditMode] = useState(false);
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
        {/* 编辑模式切换按钮 */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              isEditMode 
                ? 'bg-indigo-500 text-white' 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Settings size={18} />
            {isEditMode ? '完成编辑' : '编辑书签'}
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {bookmarks.map((bookmark, index) => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              index={index}
              isEditMode={isEditMode}
              onEdit={setEditingBookmark}
              onDelete={removeBookmark}
            />
          ))}
          
          {/* 添加按钮 */}
          {isEditMode && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setIsAddingNew(true)}
              className="flex flex-col items-center justify-center gap-2 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-dashed border-white/30 text-white/60 hover:bg-white/15 hover:border-white/50 hover:text-white transition-all"
            >
              <Plus size={32} />
              <span className="text-sm">添加</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* 编辑弹窗 */}
      <AnimatePresence>
        {(editingBookmark || isAddingNew) && (
          <EditModal
            bookmark={editingBookmark}
            isNew={isAddingNew}
            onSave={handleSave}
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

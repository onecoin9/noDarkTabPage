import { useState } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { Plus, Trash2, Edit2, ExternalLink, ArrowUpLeft, ArrowUp, ArrowUpRight, ArrowLeft, Move, ArrowRight, ArrowDownLeft, ArrowDown, ArrowDownRight } from 'lucide-react';
import type { BookmarkPosition } from '../../types';

export function BookmarkSettings() {
  const bookmarks = useAppStore((s) => s.bookmarks);
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const addBookmark = useAppStore((s) => s.addBookmark);
  const removeBookmark = useAppStore((s) => s.removeBookmark);
  const updateBookmark = useAppStore((s) => s.updateBookmark);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ icon: '🔗', title: '', url: '' });

  const handleAdd = () => {
    if (!form.title.trim() || !form.url.trim()) return;
    addBookmark({
      icon: form.icon || '🔗',
      title: form.title.trim(),
      url: form.url.startsWith('http') ? form.url : `https://${form.url}`,
    });
    setForm({ icon: '🔗', title: '', url: '' });
    setIsAdding(false);
  };

  const handleUpdate = (id: string) => {
    if (!form.title.trim() || !form.url.trim()) return;
    updateBookmark(id, {
      icon: form.icon,
      title: form.title.trim(),
      url: form.url.startsWith('http') ? form.url : `https://${form.url}`,
    });
    setEditingId(null);
    setForm({ icon: '🔗', title: '', url: '' });
  };

  const startEdit = (bookmark: typeof bookmarks[0]) => {
    setEditingId(bookmark.id);
    setForm({ icon: bookmark.icon, title: bookmark.title, url: bookmark.url });
  };

  const emojiPresets = ['🔗', '🌐', '💻', '📧', '📺', '🎵', '🛒', '📝', '🎮', '📱', '💬', '🔍'];

  return (
    <div className="space-y-8">
      {/* 书签位置 */}
      <section>
        <h3 className="text-lg font-medium text-white mb-4">书签位置</h3>
        <PositionSelector
          value={settings.bookmarkPosition || 'center'}
          onChange={(pos) => updateSettings({ bookmarkPosition: pos })}
        />
      </section>

      {/* 显示选项 */}
      <section>
        <h3 className="text-lg font-medium text-white mb-4">显示选项</h3>
        <ToggleOption
          label="显示书签标题"
          checked={settings.showBookmarkTitle}
          onChange={(v) => updateSettings({ showBookmarkTitle: v })}
        />
      </section>

      {/* 书签管理 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">书签管理</h3>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white text-sm transition-colors"
          >
            <Plus size={16} />
            添加书签
          </button>
        </div>

        {/* 添加表单 */}
        {isAdding && (
          <div className="mb-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="space-y-3">
              <div>
                <label className="text-slate-400 text-sm mb-2 block">图标</label>
                <div className="flex gap-2 flex-wrap">
                  {emojiPresets.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setForm({ ...form, icon: emoji })}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                        form.icon === emoji
                          ? 'bg-indigo-500 scale-110'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">标题</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="网站名称"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">网址</label>
                <input
                  type="text"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => { setIsAdding(false); setForm({ icon: '🔗', title: '', url: '' }); }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white text-sm transition-colors"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 书签列表 */}
        <div className="space-y-2">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl group"
            >
              {editingId === bookmark.id ? (
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.icon}
                      onChange={(e) => setForm({ ...form, icon: e.target.value })}
                      className="w-12 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-center"
                    />
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="flex-1 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => { setEditingId(null); setForm({ icon: '🔗', title: '', url: '' }); }}
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 text-xs"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => handleUpdate(bookmark.id)}
                      className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 rounded text-white text-xs"
                    >
                      保存
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-2xl">{bookmark.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{bookmark.title}</div>
                    <div className="text-slate-500 text-xs truncate">{bookmark.url}</div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button
                      onClick={() => startEdit(bookmark)}
                      className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => removeBookmark(bookmark.id)}
                      className="p-1.5 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {bookmarks.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            暂无书签，点击上方按钮添加
          </div>
        )}
      </section>
    </div>
  );
}

function ToggleOption({ 
  label, 
  checked, 
  onChange 
}: { 
  label: string; 
  checked: boolean; 
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl cursor-pointer">
      <span className="text-slate-300">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-indigo-500' : 'bg-slate-600'
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  );
}

function PositionSelector({
  value,
  onChange,
}: {
  value: BookmarkPosition;
  onChange: (pos: BookmarkPosition) => void;
}) {
  const positions: { pos: BookmarkPosition; icon: React.ReactNode }[] = [
    { pos: 'top-left', icon: <ArrowUpLeft size={16} /> },
    { pos: 'top-center', icon: <ArrowUp size={16} /> },
    { pos: 'top-right', icon: <ArrowUpRight size={16} /> },
    { pos: 'center-left', icon: <ArrowLeft size={16} /> },
    { pos: 'center', icon: <Move size={16} /> },
    { pos: 'center-right', icon: <ArrowRight size={16} /> },
    { pos: 'bottom-left', icon: <ArrowDownLeft size={16} /> },
    { pos: 'bottom-center', icon: <ArrowDown size={16} /> },
    { pos: 'bottom-right', icon: <ArrowDownRight size={16} /> },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 w-fit">
      {positions.map(({ pos, icon }) => (
        <button
          key={pos}
          onClick={() => onChange(pos)}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            value === pos
              ? 'bg-indigo-500 text-white shadow-lg scale-105'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

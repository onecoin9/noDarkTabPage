import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Download, Upload } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import type { BackgroundConfig } from '../types';

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
];

export function SettingsPanel() {
  const settingsOpen = useAppStore((s) => s.settingsOpen);
  const toggleSettings = useAppStore((s) => s.toggleSettings);
  const settings = useAppStore((s) => s.settings);
  const setBackground = useAppStore((s) => s.setBackground);
  const setCustomCss = useAppStore((s) => s.setCustomCss);
  const addBookmark = useAppStore((s) => s.addBookmark);
  const exportConfig = useAppStore((s) => s.exportConfig);
  const importConfig = useAppStore((s) => s.importConfig);

  const [newBookmark, setNewBookmark] = useState({ icon: '', title: '', url: '' });
  const [cssInput, setCssInput] = useState(settings.customCss);

  const handleAddBookmark = () => {
    if (!newBookmark.icon || !newBookmark.title || !newBookmark.url) {
      alert('请填写完整信息');
      return;
    }
    addBookmark(newBookmark);
    setNewBookmark({ icon: '', title: '', url: '' });
    alert('添加成功！');
  };

  const handleApplyCss = () => {
    setCustomCss(cssInput);
    alert('CSS 已应用！');
  };

  const handleExport = () => {
    const config = exportConfig();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newtab-config-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const success = importConfig(event.target?.result as string);
      if (success) {
        alert('配置导入成功！');
        setCssInput(useAppStore.getState().settings.customCss);
      } else {
        alert('导入失败，请检查文件格式');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleBgChange = (value: string) => {
    const bg: BackgroundConfig = { type: 'gradient', value };
    setBackground(bg);
  };

  return (
    <AnimatePresence>
      {settingsOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSettings}
            className="fixed inset-0 bg-black/30 z-40"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-96 h-full bg-white/95 backdrop-blur-xl shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800">设置</h2>
                <button onClick={toggleSettings} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <section className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">背景</h3>
                <div className="grid grid-cols-2 gap-3">
                  {gradients.map((gradient) => (
                    <button
                      key={gradient}
                      onClick={() => handleBgChange(gradient)}
                      className={`h-16 rounded-xl transition-all hover:scale-105 ${
                        settings.background.value === gradient
                          ? 'ring-2 ring-indigo-500 ring-offset-2'
                          : ''
                      }`}
                      style={{ background: gradient }}
                    />
                  ))}
                </div>
              </section>

              <section className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">添加书签</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="图标 (Emoji)"
                    value={newBookmark.icon}
                    onChange={(e) => setNewBookmark({ ...newBookmark, icon: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="标题"
                    value={newBookmark.title}
                    onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="网址 (https://...)"
                    value={newBookmark.url}
                    onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleAddBookmark}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    <Plus size={18} /> 添加
                  </button>
                </div>
              </section>

              <section className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Custom CSS</h3>
                <textarea
                  value={cssInput}
                  onChange={(e) => setCssInput(e.target.value)}
                  placeholder="/* 在这里输入自定义 CSS */"
                  className="w-full h-40 px-4 py-3 border border-gray-200 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleApplyCss}
                  className="w-full mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  应用 CSS
                </button>
              </section>

              <section>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">数据同步</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleExport}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    <Download size={18} /> 导出配置
                  </button>
                  <label className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                    <Upload size={18} /> 导入配置
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

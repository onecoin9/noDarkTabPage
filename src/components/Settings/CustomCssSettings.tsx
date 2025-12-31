import { useState } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { Code, Copy, Check, RotateCcw } from 'lucide-react';

const cssExamples = [
  {
    name: '隐藏时钟秒数',
    code: `/* 隐藏秒数 */
.clock-seconds { display: none; }`,
  },
  {
    name: '书签悬停放大',
    code: `/* 书签悬停放大效果 */
.bookmark-item:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}`,
  },
  {
    name: '毛玻璃效果增强',
    code: `/* 增强毛玻璃效果 */
.backdrop-blur-md {
  backdrop-filter: blur(20px) saturate(180%);
}`,
  },
  {
    name: '自定义滚动条',
    code: `/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.2);
  border-radius: 3px;
}`,
  },
];

export function CustomCssSettings() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (code: string, name: string) => {
    navigator.clipboard.writeText(code);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleInsert = (code: string) => {
    const newCss = settings.customCss 
      ? `${settings.customCss}\n\n${code}`
      : code;
    updateSettings({ customCss: newCss });
  };

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Code size={20} className="text-indigo-400" />
          <h3 className="text-lg font-medium text-white">自定义 CSS</h3>
        </div>
        <p className="text-slate-400 text-sm mb-4">
          使用 CSS 自定义页面样式。修改会实时生效。
        </p>
        
        <textarea
          value={settings.customCss}
          onChange={(e) => updateSettings({ customCss: e.target.value })}
          placeholder={`/* 在这里输入自定义 CSS */

/* 示例：修改时钟颜色 */
.clock { color: #ff6b6b; }

/* 示例：隐藏某个元素 */
.element { display: none; }`}
          className="w-full h-64 px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl font-mono text-sm text-slate-300 resize-y focus:outline-none focus:border-indigo-500"
          spellCheck={false}
        />

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => updateSettings({ customCss: '' })}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm transition-colors"
          >
            <RotateCcw size={14} />
            清空
          </button>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-medium text-white mb-4">CSS 示例</h3>
        <p className="text-slate-400 text-sm mb-4">
          点击示例可以快速插入到编辑器中
        </p>
        
        <div className="space-y-3">
          {cssExamples.map((example) => (
            <div
              key={example.name}
              className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{example.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(example.code, example.name)}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 text-xs transition-colors"
                  >
                    {copied === example.name ? <Check size={12} /> : <Copy size={12} />}
                    {copied === example.name ? '已复制' : '复制'}
                  </button>
                  <button
                    onClick={() => handleInsert(example.code)}
                    className="px-2 py-1 bg-indigo-500 hover:bg-indigo-600 rounded text-white text-xs transition-colors"
                  >
                    插入
                  </button>
                </div>
              </div>
              <pre className="text-slate-400 text-xs font-mono overflow-x-auto">
                {example.code}
              </pre>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-medium text-white mb-4">使用提示</h3>
        <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 space-y-2">
          <div className="text-slate-400 text-sm">
            💡 CSS 修改会实时生效，无需刷新页面
          </div>
          <div className="text-slate-400 text-sm">
            ⚠️ 错误的 CSS 可能导致页面显示异常，可以清空恢复
          </div>
          <div className="text-slate-400 text-sm">
            🔍 使用浏览器开发者工具 (F12) 查看元素类名
          </div>
        </div>
      </section>
    </div>
  );
}

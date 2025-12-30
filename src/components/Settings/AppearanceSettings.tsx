import { useAppStore } from '../../stores/useAppStore';
import type { SearchEngine, BookmarkDisplayMode } from '../../types';

export function AppearanceSettings() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-medium text-white mb-4">搜索引擎</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(['google', 'baidu', 'bing', 'duckduckgo'] as SearchEngine[]).map((engine) => (
            <button
              key={engine}
              onClick={() => updateSettings({ searchEngine: engine })}
              className={`p-3 rounded-xl border transition-all ${
                settings.searchEngine === engine
                  ? 'border-indigo-500 bg-indigo-500/20 text-white'
                  : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500'
              }`}
            >
              {engine === 'google' && 'Google'}
              {engine === 'baidu' && '百度'}
              {engine === 'bing' && 'Bing'}
              {engine === 'duckduckgo' && 'DuckDuckGo'}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-medium text-white mb-4">书签显示</h3>
        <div className="grid grid-cols-3 gap-3">
          {(['grid', 'list', 'icon'] as BookmarkDisplayMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => updateSettings({ bookmarkDisplayMode: mode })}
              className={`p-3 rounded-xl border transition-all ${
                settings.bookmarkDisplayMode === mode
                  ? 'border-indigo-500 bg-indigo-500/20 text-white'
                  : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500'
              }`}
            >
              {mode === 'grid' && '网格'}
              {mode === 'list' && '列表'}
              {mode === 'icon' && '图标'}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-medium text-white mb-4">显示选项</h3>
        <div className="space-y-3">
          <ToggleOption
            label="显示书签标题"
            checked={settings.showBookmarkTitle}
            onChange={(v) => updateSettings({ showBookmarkTitle: v })}
          />
          <ToggleOption
            label="显示搜索建议"
            checked={settings.showSearchSuggestions}
            onChange={(v) => updateSettings({ showSearchSuggestions: v })}
          />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-medium text-white mb-4">自定义 CSS</h3>
        <textarea
          value={settings.customCss}
          onChange={(e) => updateSettings({ customCss: e.target.value })}
          placeholder="/* 在这里输入自定义 CSS */"
          className="w-full h-40 px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl font-mono text-sm text-slate-300 resize-y focus:outline-none focus:border-indigo-500"
        />
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

import { useAppStore } from '../../stores/useAppStore';
import type { SearchEngine, BookmarkDisplayMode, BookmarkPosition } from '../../types';
import { Search, Grid3X3, ArrowUpLeft, ArrowUp, ArrowUpRight, ArrowLeft, Move, ArrowRight, ArrowDownLeft, ArrowDown, ArrowDownRight } from 'lucide-react';

const colorPresets = [
  '#000000', '#ffffff', '#dc2626', '#f97316', '#3b82f6', '#22c55e', '#8b5cf6', '#ec4899'
];

export function AppearanceSettings() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);

  const getRadiusLabel = (radius: number) => {
    if (radius === 0) return '直角';
    if (radius < 16) return '小圆角';
    if (radius < 9999) return '圆角';
    return '全圆角';
  };

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
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Search size={20} />
          搜索框样式
        </h3>
        
        <div className="space-y-6">
          {/* 不透明度 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-400 text-sm">搜索框不透明度</label>
              <span className="text-indigo-400 font-medium">{settings.searchBoxOpacity}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={settings.searchBoxOpacity}
              onChange={(e) => updateSettings({ searchBoxOpacity: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>5%</span>
              <span>透明</span>
              <span>清晰</span>
              <span>100%</span>
            </div>
          </div>

          {/* 颜色 */}
          <div>
            <label className="text-slate-400 text-sm mb-3 block">搜索框颜色</label>
            <div className="flex gap-2 flex-wrap">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  onClick={() => updateSettings({ searchBoxColor: color })}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    settings.searchBoxColor === color
                      ? 'border-white scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {settings.searchBoxColor === color && (
                    <span className={`text-lg ${color === '#ffffff' || color === '#f97316' ? 'text-black' : 'text-white'}`}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 圆角 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-400 text-sm flex items-center gap-2">
                <Grid3X3 size={16} />
                搜索框圆角
              </label>
              <span className="text-indigo-400 font-medium">{getRadiusLabel(settings.searchBoxRadius)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="9999"
              step="1"
              value={settings.searchBoxRadius}
              onChange={(e) => updateSettings({ searchBoxRadius: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>直角</span>
              <span>圆角</span>
              <span>全圆</span>
            </div>
          </div>
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
        <h3 className="text-lg font-medium text-white mb-4">书签位置</h3>
        <PositionSelector
          value={settings.bookmarkPosition || 'center'}
          onChange={(pos) => updateSettings({ bookmarkPosition: pos })}
        />
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

// 位置选择器组件 - 9宫格
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

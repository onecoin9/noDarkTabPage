import { useAppStore } from '../../stores/useAppStore';
import type { BackgroundType } from '../../types';

const gradients = [
  { name: '紫色梦幻', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: '粉色浪漫', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: '天空蓝', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: '清新绿', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { name: '日落橙', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: '薰衣草', value: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
  { name: '深海蓝', value: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' },
  { name: '暗夜紫', value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
];

const unsplashCategories = [
  { name: '随机', value: '' },
  { name: '自然', value: 'nature' },
  { name: '城市', value: 'city' },
  { name: '科技', value: 'technology' },
  { name: '极简', value: 'minimal' },
  { name: '太空', value: 'space' },
];

export function WallpaperSettings() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);

  const setBackgroundType = (type: BackgroundType) => {
    updateSettings({
      background: { ...settings.background, type },
    });
  };

  const setGradient = (value: string) => {
    updateSettings({
      background: { ...settings.background, type: 'gradient', value },
    });
  };

  const setUnsplashCategory = (category: string) => {
    updateSettings({
      background: { 
        ...settings.background, 
        type: 'unsplash', 
        unsplashCategory: category,
        value: `https://source.unsplash.com/random/1920x1080${category ? `?${category}` : ''}`,
      },
    });
  };

  const setCustomUrl = (url: string) => {
    updateSettings({
      background: { ...settings.background, type: 'custom', value: url },
    });
  };

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-medium text-white mb-4">壁纸类型</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(['gradient', 'unsplash', 'bing', 'custom'] as BackgroundType[]).map((type) => (
            <button
              key={type}
              onClick={() => setBackgroundType(type)}
              className={`p-3 rounded-xl border transition-all ${
                settings.background.type === type
                  ? 'border-indigo-500 bg-indigo-500/20 text-white'
                  : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500'
              }`}
            >
              {type === 'gradient' && '渐变色'}
              {type === 'unsplash' && 'Unsplash'}
              {type === 'bing' && 'Bing 每日'}
              {type === 'custom' && '自定义'}
            </button>
          ))}
        </div>
      </section>

      {settings.background.type === 'gradient' && (
        <section>
          <h3 className="text-lg font-medium text-white mb-4">选择渐变</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gradients.map((g) => (
              <button
                key={g.value}
                onClick={() => setGradient(g.value)}
                className={`h-20 rounded-xl border-2 transition-all ${
                  settings.background.value === g.value
                    ? 'border-white scale-105'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ background: g.value }}
              >
                <span className="text-white text-sm font-medium drop-shadow-lg">
                  {g.name}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {settings.background.type === 'unsplash' && (
        <section>
          <h3 className="text-lg font-medium text-white mb-4">图片分类</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {unsplashCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setUnsplashCategory(cat.value)}
                className={`p-3 rounded-xl border transition-all ${
                  settings.background.unsplashCategory === cat.value
                    ? 'border-indigo-500 bg-indigo-500/20 text-white'
                    : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {settings.background.type === 'custom' && (
        <section>
          <h3 className="text-lg font-medium text-white mb-4">图片地址</h3>
          <input
            type="text"
            value={settings.background.value}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-slate-300 focus:outline-none focus:border-indigo-500"
          />
        </section>
      )}

      <section>
        <h3 className="text-lg font-medium text-white mb-4">效果调整</h3>
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm mb-2 block">
              模糊度: {settings.background.blur || 0}px
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={settings.background.blur || 0}
              onChange={(e) => updateSettings({
                background: { ...settings.background, blur: Number(e.target.value) },
              })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-slate-400 text-sm mb-2 block">
              亮度: {settings.background.brightness || 100}%
            </label>
            <input
              type="range"
              min="20"
              max="100"
              value={settings.background.brightness || 100}
              onChange={(e) => updateSettings({
                background: { ...settings.background, brightness: Number(e.target.value) },
              })}
              className="w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

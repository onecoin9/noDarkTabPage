import { useState } from 'react';
import { RefreshCw, Download } from 'lucide-react';
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

// Supabase Edge Function URL for Wallhaven proxy
const WALLHAVEN_PROXY_URL = 'https://gbfdfpxlltnvnrsayrou.supabase.co/functions/v1/wallhaven';

const wallhavenCategories = [
  { name: '热门榜', value: 'toplist' },
  { name: '随机', value: 'random' },
  { name: '最新', value: 'date_added' },
  { name: '浏览量', value: 'views' },
  { name: '收藏数', value: 'favorites' },
  { name: '风景', value: 'landscape' },
  { name: '极简', value: 'minimalist' },
  { name: '一般', value: 'general' },
];

export function WallpaperSettings() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wallhavenCategory, setWallhavenCategory] = useState('toplist');

  const setBackgroundType = (type: BackgroundType) => {
    // 切换类型时设置默认值
    let newBackground = { ...settings.background, type };
    
    if (type === 'gradient' && !newBackground.value?.startsWith('linear-gradient')) {
      newBackground.value = gradients[0].value;
    } else if (type === 'bing') {
      newBackground.value = 'bing';
    } else if (type === 'unsplash') {
      newBackground.value = 'https://source.unsplash.com/random/1920x1080';
    } else if (type === 'wallhaven') {
      // 切换到 wallhaven 时自动获取一张
      updateSettings({ background: newBackground });
      fetchWallhavenImage('toplist');
      return;
    }
    
    updateSettings({ background: newBackground });
  };

  const setGradient = (value: string) => {
    updateSettings({
      background: { ...settings.background, type: 'gradient', value },
    });
  };

  const setUnsplashCategory = (category: string) => {
    const timestamp = Date.now(); // 添加时间戳避免缓存
    updateSettings({
      background: { 
        ...settings.background, 
        type: 'unsplash', 
        unsplashCategory: category,
        value: `https://source.unsplash.com/random/1920x1080${category ? `?${category}` : ''}?t=${timestamp}`,
      },
    });
  };

  const setCustomUrl = (url: string) => {
    updateSettings({
      background: { ...settings.background, type: 'custom', value: url },
    });
  };

  const fetchWallhavenImage = async (category: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${WALLHAVEN_PROXY_URL}?category=${category}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.url) {
        updateSettings({
          background: { 
            ...settings.background, 
            type: 'wallhaven', 
            value: data.url,
            wallhavenCategory: category,
          },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取壁纸失败');
    } finally {
      setLoading(false);
    }
  };

  const handleWallhavenCategory = (category: string) => {
    setWallhavenCategory(category);
    fetchWallhavenImage(category);
  };

  const refreshUnsplash = () => {
    const category = settings.background.unsplashCategory || '';
    const timestamp = Date.now();
    updateSettings({
      background: { 
        ...settings.background, 
        value: `https://source.unsplash.com/random/1920x1080${category ? `?${category}` : ''}?t=${timestamp}`,
      },
    });
  };

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-medium text-white mb-4">壁纸类型</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(['gradient', 'wallhaven', 'unsplash', 'bing', 'custom'] as BackgroundType[]).map((type) => (
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
              {type === 'wallhaven' && 'Wallhaven'}
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

      {settings.background.type === 'wallhaven' && (
        <section>
          <h3 className="text-lg font-medium text-white mb-4">Wallhaven 壁纸</h3>
          <p className="text-slate-400 text-sm mb-4">精选高质量壁纸</p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
            {wallhavenCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleWallhavenCategory(cat.value)}
                disabled={loading}
                className={`p-3 rounded-xl border transition-all ${
                  wallhavenCategory === cat.value
                    ? 'border-indigo-500 bg-indigo-500/20 text-white'
                    : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchWallhavenImage(wallhavenCategory)}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full p-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl transition-colors"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            {loading ? '加载中...' : '换一张壁纸'}
          </button>

          {settings.background.value && settings.background.type === 'wallhaven' && (
            <div className="mt-4">
              <p className="text-slate-400 text-sm mb-2">当前壁纸预览：</p>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800">
                <img 
                  src={settings.background.value} 
                  alt="当前壁纸" 
                  className="w-full h-full object-cover"
                />
              </div>
              <a
                href={settings.background.value}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full mt-3 p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
              >
                <Download size={18} />
                下载壁纸
              </a>
            </div>
          )}
        </section>
      )}

      {settings.background.type === 'unsplash' && (
        <section>
          <h3 className="text-lg font-medium text-white mb-4">Unsplash 壁纸</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
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
          <button
            onClick={refreshUnsplash}
            className="flex items-center justify-center gap-2 w-full p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors"
          >
            <RefreshCw size={18} />
            换一张壁纸
          </button>
        </section>
      )}

      {settings.background.type === 'bing' && (
        <section>
          <h3 className="text-lg font-medium text-white mb-4">Bing 每日壁纸</h3>
          <p className="text-slate-400 text-sm">
            自动使用 Bing 每日精选壁纸，每天自动更新。
          </p>
        </section>
      )}

      {settings.background.type === 'custom' && (
        <section>
          <h3 className="text-lg font-medium text-white mb-4">自定义图片</h3>
          <input
            type="text"
            value={settings.background.type === 'custom' ? settings.background.value : ''}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-slate-300 focus:outline-none focus:border-indigo-500"
          />
          <p className="text-slate-500 text-sm mt-2">
            输入图片的完整 URL 地址
          </p>
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

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, MapPin, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { EditableWidget } from '../EditableWidget';
import { fetchWeather, getCityByIP } from '../../lib/weather';

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  wind: number;
  city: string;
}

export function Weather() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const position = settings.weatherPosition || { preset: 'center-left', offsetX: 0, offsetY: -100 };
  const size = settings.weatherSize || 200;

  const loadWeather = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let city = settings.weatherCity;
      
      // 如果城市为空或是默认值，尝试自动定位
      if (!city || city === '北京') {
        const detectedCity = await getCityByIP();
        if (detectedCity) {
          city = detectedCity;
          updateSettings({ weatherCity: detectedCity });
        }
      }
      
      const data = await fetchWeather(city);
      
      if (data) {
        setWeather(data);
      } else {
        setError('获取天气失败');
      }
    } catch (err) {
      setError('网络错误');
      console.error('天气加载失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
    
    // 每30分钟刷新一次
    const interval = setInterval(loadWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [settings.weatherCity]);

  const getWeatherIcon = (icon: string) => {
    const iconSize = Math.round(32 * size / 200);
    switch (icon) {
      case 'sun': return <Sun size={iconSize} className="text-yellow-400" />;
      case 'cloud': return <Cloud size={iconSize} className="text-gray-300" />;
      case 'rain': return <CloudRain size={iconSize} className="text-blue-400" />;
      case 'snow': return <CloudSnow size={iconSize} className="text-blue-200" />;
      default: return <Sun size={iconSize} className="text-yellow-400" />;
    }
  };

  const displayTemp = settings.weatherUnit === 'fahrenheit'
    ? Math.round((weather?.temp || 0) * 9 / 5 + 32)
    : weather?.temp;
  const tempUnit = settings.weatherUnit === 'fahrenheit' ? '°F' : '°C';

  const fontSize = Math.round(size / 200 * 14);
  const tempFontSize = Math.round(size / 200 * 30);

  const content = loading ? (
    <div 
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
      style={{ width: `${size}px` }}
    >
      <div className="animate-pulse flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-full" />
        <div className="space-y-2">
          <div className="w-16 h-4 bg-white/20 rounded" />
          <div className="w-12 h-3 bg-white/20 rounded" />
        </div>
      </div>
    </div>
  ) : error ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
      style={{ width: `${size}px` }}
    >
      <div className="text-center">
        <div className="text-white/60 mb-2" style={{ fontSize: `${fontSize}px` }}>{error}</div>
        <button
          onClick={loadWeather}
          className="flex items-center gap-1 mx-auto px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm transition-colors"
        >
          <RefreshCw size={12} />
          <span>重试</span>
        </button>
      </div>
    </motion.div>
  ) : (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 group"
      style={{ width: `${size}px` }}
    >
      <div className="flex items-center gap-4">
        {weather && getWeatherIcon(weather.icon)}
        <div className="flex-1">
          <div className="font-bold text-white" style={{ fontSize: `${tempFontSize}px` }}>{displayTemp}{tempUnit}</div>
          <div className="text-white/60 flex items-center gap-1" style={{ fontSize: `${fontSize}px` }}>
            <MapPin size={12} />
            <span>{weather?.city} · {weather?.description}</span>
          </div>
        </div>
        <button
          onClick={loadWeather}
          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/20 rounded-lg transition-all"
          title="刷新天气"
        >
          <RefreshCw size={14} className="text-white/60" />
        </button>
      </div>
      <div className="flex gap-4 mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-1 text-white/60" style={{ fontSize: `${fontSize}px` }}>
          <span>💧</span><span>{weather?.humidity}%</span>
        </div>
        <div className="flex items-center gap-1 text-white/60" style={{ fontSize: `${fontSize}px` }}>
          <Wind size={14} /><span>{weather?.wind}级</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <EditableWidget
      name="天气"
      position={position}
      onPositionChange={(pos) => updateSettings({ weatherPosition: pos })}
      size={size}
      minSize={100}
      maxSize={400}
      onSizeChange={(size) => updateSettings({ weatherSize: size })}
    >
      {content}
    </EditableWidget>
  );
}

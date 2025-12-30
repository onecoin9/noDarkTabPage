import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudSnow, Wind } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  wind: number;
}

export function Weather() {
  const settings = useAppStore((s) => s.settings);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟天气数据（实际项目中应该调用天气 API）
    const mockWeather = () => {
      const weathers = [
        { temp: 22, description: '晴', icon: 'sun', humidity: 45, wind: 12 },
        { temp: 18, description: '多云', icon: 'cloud', humidity: 60, wind: 8 },
        { temp: 15, description: '小雨', icon: 'rain', humidity: 80, wind: 15 },
        { temp: 5, description: '雪', icon: 'snow', humidity: 70, wind: 20 },
      ];
      return weathers[Math.floor(Math.random() * weathers.length)];
    };

    setTimeout(() => {
      setWeather(mockWeather());
      setLoading(false);
    }, 500);
  }, [settings.weatherCity]);

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun':
        return <Sun size={32} className="text-yellow-400" />;
      case 'cloud':
        return <Cloud size={32} className="text-gray-300" />;
      case 'rain':
        return <CloudRain size={32} className="text-blue-400" />;
      case 'snow':
        return <CloudSnow size={32} className="text-blue-200" />;
      default:
        return <Sun size={32} className="text-yellow-400" />;
    }
  };

  const displayTemp = settings.weatherUnit === 'fahrenheit'
    ? Math.round((weather?.temp || 0) * 9 / 5 + 32)
    : weather?.temp;

  const tempUnit = settings.weatherUnit === 'fahrenheit' ? '°F' : '°C';

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
      >
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full" />
          <div className="space-y-2">
            <div className="w-16 h-4 bg-white/20 rounded" />
            <div className="w-12 h-3 bg-white/20 rounded" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
    >
      <div className="flex items-center gap-4">
        {weather && getWeatherIcon(weather.icon)}
        <div>
          <div className="text-3xl font-bold text-white">
            {displayTemp}{tempUnit}
          </div>
          <div className="text-white/60 text-sm">
            {settings.weatherCity} · {weather?.description}
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-1 text-white/60 text-sm">
          <span>💧</span>
          <span>{weather?.humidity}%</span>
        </div>
        <div className="flex items-center gap-1 text-white/60 text-sm">
          <Wind size={14} />
          <span>{weather?.wind} km/h</span>
        </div>
      </div>
    </motion.div>
  );
}

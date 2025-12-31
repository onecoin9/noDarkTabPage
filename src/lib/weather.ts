// 和风天气 API
// 免费订阅用户可以使用 devapi.qweather.com
// 付费订阅用户使用 api.qweather.com
const QWEATHER_KEY = '6a25640bff4e4fbbbbd174f11f84ef47'; // 和风天气 API Key
const QWEATHER_API = 'https://devapi.qweather.com';
const QWEATHER_GEO_API = 'https://geoapi.qweather.com'; // 城市搜索使用独立域名

interface QWeatherNowResponse {
  code: string;
  updateTime: string;
  fxLink: string;
  now: {
    obsTime: string;
    temp: string;
    feelsLike: string;
    icon: string;
    text: string;
    wind360: string;
    windDir: string;
    windScale: string;
    windSpeed: string;
    humidity: string;
    precip: string;
    pressure: string;
    vis: string;
    cloud: string;
    dew: string;
  };
}

interface QWeatherGeoResponse {
  code: string;
  location: Array<{
    name: string;
    id: string;
    lat: string;
    lon: string;
    adm2: string;
    adm1: string;
    country: string;
    tz: string;
    utcOffset: string;
    isDst: string;
    type: string;
    rank: string;
    fxLink: string;
  }>;
}

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  wind: number;
  city: string;
  feelsLike?: number;
}

// 和风天气图标代码到我们的图标映射
function getWeatherIcon(iconCode: string): string {
  const code = parseInt(iconCode);
  
  // 晴天 100
  if (code === 100) return 'sun';
  
  // 多云 101-103
  if (code >= 101 && code <= 103) return 'cloud';
  
  // 阴天 104
  if (code === 104) return 'cloud';
  
  // 雨 300-399
  if (code >= 300 && code <= 399) return 'rain';
  
  // 雪 400-499
  if (code >= 400 && code <= 499) return 'snow';
  
  // 雾霾等 500-599
  if (code >= 500 && code <= 599) return 'cloud';
  
  return 'sun';
}

// 通过城市名获取城市 ID
async function getCityId(cityName: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${QWEATHER_GEO_API}/v2/city/lookup?location=${encodeURIComponent(cityName)}&key=${QWEATHER_KEY}&lang=zh`
    );
    
    const data: QWeatherGeoResponse = await response.json();
    
    console.log('城市查询响应:', data); // 调试日志
    
    if (data.code === '200' && data.location && data.location.length > 0) {
      return data.location[0].id;
    }
    
    console.error('城市查询失败，返回码:', data.code);
    return null;
  } catch (error) {
    console.error('获取城市ID失败:', error);
    return null;
  }
}

// 获取天气数据
export async function fetchWeather(city: string): Promise<WeatherData | null> {
  try {
    console.log('开始获取天气，城市:', city); // 调试日志
    
    // 先获取城市ID
    const cityId = await getCityId(city);
    if (!cityId) {
      console.error('未找到城市:', city);
      return null;
    }
    
    console.log('城市ID:', cityId); // 调试日志
    
    // 获取实时天气
    const response = await fetch(
      `${QWEATHER_API}/v7/weather/now?location=${cityId}&key=${QWEATHER_KEY}&lang=zh`
    );
    
    const data: QWeatherNowResponse = await response.json();
    
    console.log('天气查询响应:', data); // 调试日志
    
    if (data.code === '200' && data.now) {
      const now = data.now;
      return {
        temp: parseInt(now.temp),
        description: now.text,
        icon: getWeatherIcon(now.icon),
        humidity: parseInt(now.humidity),
        wind: parseInt(now.windScale),
        city: city,
        feelsLike: parseInt(now.feelsLike),
      };
    }
    
    console.error('天气查询失败，返回码:', data.code);
    return null;
  } catch (error) {
    console.error('获取天气失败:', error);
    return null;
  }
}

// 通过 IP 获取城市（使用和风天气的 IP 定位）
export async function getCityByIP(): Promise<string | null> {
  try {
    const response = await fetch(
      `${QWEATHER_GEO_API}/v2/city/lookup?location=auto_ip&key=${QWEATHER_KEY}&lang=zh`
    );
    
    const data: QWeatherGeoResponse = await response.json();
    
    console.log('IP定位响应:', data); // 调试日志
    
    if (data.code === '200' && data.location && data.location.length > 0) {
      // 清理城市名称，移除可能的前缀
      let cityName = data.location[0].name;
      // 移除 "ip" 或 "lp" 等前缀
      cityName = cityName.replace(/^(ip|lp)/i, '');
      return cityName;
    }
    
    return null;
  } catch (error) {
    console.error('IP定位失败:', error);
    return null;
  }
}

// 使用浏览器地理位置 API
export async function getCityByGeolocation(): Promise<string | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const location = `${longitude},${latitude}`;
          
          const response = await fetch(
            `${QWEATHER_GEO_API}/v2/city/lookup?location=${location}&key=${QWEATHER_KEY}&lang=zh`
          );
          
          const data: QWeatherGeoResponse = await response.json();
          
          if (data.code === '200' && data.location && data.location.length > 0) {
            resolve(data.location[0].name);
          } else {
            resolve(null);
          }
        } catch (error) {
          console.error('地理位置解析失败:', error);
          resolve(null);
        }
      },
      () => {
        resolve(null);
      },
      { timeout: 5000 }
    );
  });
}

// 检查 API Key 是否配置
export function isApiKeyConfigured(): boolean {
  const key = QWEATHER_KEY as string;
  return key.length > 0 && key !== 'your_qweather_key_here';
}

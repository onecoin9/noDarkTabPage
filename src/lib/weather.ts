// 高德天气 API
const AMAP_KEY = '4d2bdae36b024db9f8f62b0bb1c8ff7c'; // 这是示例 key，建议用户自己申请

interface AmapWeatherResponse {
  status: string;
  count: string;
  info: string;
  infocode: string;
  lives?: Array<{
    province: string;
    city: string;
    adcode: string;
    weather: string;
    temperature: string;
    winddirection: string;
    windpower: string;
    humidity: string;
    reporttime: string;
  }>;
}

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  wind: number;
  city: string;
}

// 天气描述到图标的映射
function getWeatherIcon(description: string): string {
  if (description.includes('晴')) return 'sun';
  if (description.includes('云') || description.includes('阴')) return 'cloud';
  if (description.includes('雨') || description.includes('雷')) return 'rain';
  if (description.includes('雪')) return 'snow';
  if (description.includes('雾') || description.includes('霾')) return 'cloud';
  return 'sun';
}

// 获取天气数据
export async function fetchWeather(city: string): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `https://restapi.amap.com/v3/weather/weatherInfo?city=${encodeURIComponent(city)}&key=${AMAP_KEY}&extensions=base`
    );
    
    const data: AmapWeatherResponse = await response.json();
    
    if (data.status === '1' && data.lives && data.lives.length > 0) {
      const live = data.lives[0];
      return {
        temp: parseInt(live.temperature),
        description: live.weather,
        icon: getWeatherIcon(live.weather),
        humidity: parseInt(live.humidity),
        wind: parseInt(live.windpower.replace(/[^\d]/g, '')) || 0,
        city: live.city,
      };
    }
    
    return null;
  } catch (error) {
    console.error('获取天气失败:', error);
    return null;
  }
}

// 通过 IP 获取城市
export async function getCityByIP(): Promise<string | null> {
  try {
    const response = await fetch(
      `https://restapi.amap.com/v3/ip?key=${AMAP_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === '1' && data.city) {
      // 如果返回的是 adcode，需要转换为城市名
      return data.city;
    }
    
    return null;
  } catch (error) {
    console.error('获取城市失败:', error);
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
          const response = await fetch(
            `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=${AMAP_KEY}`
          );
          
          const data = await response.json();
          
          if (data.status === '1' && data.regeocode?.addressComponent?.city) {
            resolve(data.regeocode.addressComponent.city);
          } else {
            resolve(null);
          }
        } catch (error) {
          console.error('逆地理编码失败:', error);
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

import { useState, useEffect } from 'react';

interface TimeInfo {
  time: string;
  date: string;
}

export function useTime(showSeconds: boolean = false): TimeInfo {
  const [timeInfo, setTimeInfo] = useState<TimeInfo>(() => getTimeInfo(showSeconds));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeInfo(getTimeInfo(showSeconds));
    }, 1000);

    return () => clearInterval(interval);
  }, [showSeconds]);

  return timeInfo;
}

function getTimeInfo(showSeconds: boolean): TimeInfo {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  const time = showSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;
  
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekday = days[now.getDay()];
  
  const date = `${year}年${month}月${day}日 ${weekday}`;
  
  return { time, date };
}

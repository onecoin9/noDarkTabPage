import { useState, useEffect } from 'react';
import type { TimeFormat } from '../types';

interface TimeInfo {
  time: string;
  date: string;
}

export function useTime(
  showSeconds: boolean = false, 
  format: TimeFormat = '24h',
  separator: string = ':'
): TimeInfo {
  const [timeInfo, setTimeInfo] = useState<TimeInfo>(() => getTimeInfo(showSeconds, format, separator));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeInfo(getTimeInfo(showSeconds, format, separator));
    }, 1000);

    return () => clearInterval(interval);
  }, [showSeconds, format, separator]);

  return timeInfo;
}

function getTimeInfo(showSeconds: boolean, format: TimeFormat, separator: string): TimeInfo {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  let period = '';
  if (format === '12h') {
    period = hours >= 12 ? ' PM' : ' AM';
    hours = hours % 12 || 12;
  }
  
  const hoursStr = String(hours).padStart(2, '0');
  const time = showSeconds 
    ? `${hoursStr}${separator}${minutes}${separator}${seconds}${period}`
    : `${hoursStr}${separator}${minutes}${period}`;
  
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekday = days[now.getDay()];
  
  const date = `${year}年${month}月${day}日 ${weekday}`;
  
  return { time, date };
}

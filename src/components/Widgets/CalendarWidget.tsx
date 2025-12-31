import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { EditableWidget } from '../EditableWidget';

export function CalendarWidget() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  
  const position = settings.calendarPosition || { preset: 'center-right', offsetX: 0, offsetY: 100 };
  const size = settings.calendarSize || 240;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} />);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = 
      today.getDate() === i && 
      today.getMonth() === month && 
      today.getFullYear() === year;
    
    days.push(
      <div
        key={i}
        className={`text-center py-1 text-sm rounded-lg ${
          isToday
            ? 'bg-indigo-500 text-white font-bold'
            : 'text-white/70 hover:bg-white/10'
        }`}
      >
        {i}
      </div>
    );
  }

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
                      '七月', '八月', '九月', '十月', '十一月', '十二月'];

  const content = (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20" style={{ width: `${size}px` }}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded">
          <ChevronLeft size={16} className="text-white/60" />
        </button>
        <span className="text-white font-medium text-sm">
          {year}年 {monthNames[month]}
        </span>
        <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded">
          <ChevronRight size={16} className="text-white/60" />
        </button>
      </div>

      {/* 星期 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
          <div key={day} className="text-center text-xs text-white/40">
            {day}
          </div>
        ))}
      </div>

      {/* 日期 */}
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );

  return (
    <EditableWidget
      name="日历"
      position={position}
      onPositionChange={(pos) => updateSettings({ calendarPosition: pos })}
      size={size}
      minSize={200}
      maxSize={400}
      onSizeChange={(size) => updateSettings({ calendarSize: size })}
    >
      {content}
    </EditableWidget>
  );
}

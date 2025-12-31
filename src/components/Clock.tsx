import { motion } from 'framer-motion';
import { useTime } from '../hooks/useTime';
import { useAppStore } from '../stores/useAppStore';
import { EditableWidget } from './EditableWidget';
import type { ClockFontFamily } from '../types';

// 获取字体 CSS
function getFontFamily(font: ClockFontFamily): string {
  const fontMap: Record<ClockFontFamily, string> = {
    system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    serif: 'Georgia, "Times New Roman", serif',
    mono: '"SF Mono", "Fira Code", "Consolas", monospace',
    rounded: '"SF Pro Rounded", "Nunito", system-ui, sans-serif',
    elegant: '"Playfair Display", Georgia, serif',
    digital: '"Orbitron", "Share Tech Mono", monospace',
  };
  return fontMap[font];
}

export function Clock() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const clockStyle = settings.clockStyle || {
    fontFamily: 'system' as ClockFontFamily,
    fontWeight: 200,
    color: '#ffffff',
    opacity: 100,
    shadow: true,
    separator: ':' as const,
  };
  
  const { time, date } = useTime(settings.showSeconds, settings.timeFormat, clockStyle.separator);
  const fontSize = settings.clockFontSize || 80;
  const position = settings.clockPosition || { preset: 'center', offsetX: 0, offsetY: -80 };

  // 移动端自动缩小字体
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const responsiveFontSize = isMobile ? Math.min(fontSize, 48) : fontSize;

  return (
    <EditableWidget
      name="时钟"
      position={position}
      onPositionChange={(pos) => updateSettings({ clockPosition: pos })}
      size={fontSize}
      minSize={40}
      maxSize={200}
      onSizeChange={(size) => updateSettings({ clockFontSize: size })}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div 
          className="tracking-tight"
          style={{ 
            fontSize: `${responsiveFontSize}px`,
            fontFamily: getFontFamily(clockStyle.fontFamily),
            fontWeight: clockStyle.fontWeight,
            color: clockStyle.color,
            opacity: clockStyle.opacity / 100,
            textShadow: clockStyle.shadow ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
          }}
        >
          {time}
        </div>
        {settings.showDate && (
          <div 
            className="mt-2 md:mt-3"
            style={{ 
              fontSize: `${Math.max(responsiveFontSize * 0.2, 14)}px`,
              fontFamily: getFontFamily(clockStyle.fontFamily),
              fontWeight: Math.max(clockStyle.fontWeight - 100, 100),
              color: clockStyle.color,
              opacity: (clockStyle.opacity / 100) * 0.9,
            }}
          >
            {date}
          </div>
        )}
      </motion.div>
    </EditableWidget>
  );
}

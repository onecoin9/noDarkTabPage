import { motion } from 'framer-motion';
import { useTime } from '../hooks/useTime';
import { useAppStore } from '../stores/useAppStore';
import { EditableWidget } from './EditableWidget';

export function Clock() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const { time, date } = useTime(settings.showSeconds, settings.timeFormat);
  const fontSize = settings.clockFontSize || 80;
  const position = settings.clockPosition || { preset: 'center', offsetX: 0, offsetY: -80 };

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
          className="font-extralight tracking-tight text-white drop-shadow-lg"
          style={{ fontSize: `${fontSize}px` }}
        >
          {time}
        </div>
        {settings.showDate && (
          <div 
            className="text-white/90 mt-3 font-light"
            style={{ fontSize: `${Math.max(fontSize * 0.2, 16)}px` }}
          >
            {date}
          </div>
        )}
      </motion.div>
    </EditableWidget>
  );
}

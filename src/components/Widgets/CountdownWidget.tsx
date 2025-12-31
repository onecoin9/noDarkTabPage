import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../stores/useAppStore';
import { EditableWidget } from '../EditableWidget';

export function CountdownWidget() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const position = settings.countdownPosition || { preset: 'center-left', offsetX: 0, offsetY: 100 };
  const size = settings.countdownSize || 240;
  
  const [target, setTarget] = useState('');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    if (!target) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const targetTime = new Date(target).getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  const content = (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20" style={{ width: `${size}px` }}>
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="datetime-local"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none"
          />
          <button
            onClick={() => target && setIsEditing(false)}
            disabled={!target}
            className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
          >
            开始倒计时
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-white/60 text-xs mb-2">倒计时</div>
          <div className="grid grid-cols-4 gap-2">
            <TimeBlock value={countdown.days} label="天" />
            <TimeBlock value={countdown.hours} label="时" />
            <TimeBlock value={countdown.minutes} label="分" />
            <TimeBlock value={countdown.seconds} label="秒" />
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-3 text-xs text-white/40 hover:text-white/60"
          >
            修改时间
          </button>
        </div>
      )}
    </div>
  );

  return (
    <EditableWidget
      name="倒计时"
      position={position}
      onPositionChange={(pos) => updateSettings({ countdownPosition: pos })}
      size={size}
      minSize={200}
      maxSize={400}
      onSizeChange={(size) => updateSettings({ countdownSize: size })}
    >
      {content}
    </EditableWidget>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white/10 rounded-lg p-2">
      <motion.div
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-xl font-bold text-white"
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <div className="text-xs text-white/50">{label}</div>
    </div>
  );
}

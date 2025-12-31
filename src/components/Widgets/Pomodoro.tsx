import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { EditableWidget } from '../EditableWidget';

export function Pomodoro() {
  const pomodoro = useAppStore((s) => s.pomodoro);
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const startPomodoro = useAppStore((s) => s.startPomodoro);
  const pausePomodoro = useAppStore((s) => s.pausePomodoro);
  const resetPomodoro = useAppStore((s) => s.resetPomodoro);
  const tickPomodoro = useAppStore((s) => s.tickPomodoro);
  const position = settings.pomodoroPosition || { preset: 'center-left', offsetX: 0, offsetY: 100 };
  const size = settings.pomodoroSize || 200;

  useEffect(() => {
    if (!pomodoro.isRunning) return;
    const interval = setInterval(tickPomodoro, 1000);
    return () => clearInterval(interval);
  }, [pomodoro.isRunning, tickPomodoro]);

  const minutes = Math.floor(pomodoro.timeLeft / 60);
  const seconds = pomodoro.timeLeft % 60;
  const progress = pomodoro.mode === 'work'
    ? 1 - pomodoro.timeLeft / (pomodoro.workDuration * 60)
    : pomodoro.mode === 'break'
    ? 1 - pomodoro.timeLeft / (pomodoro.breakDuration * 60)
    : 1 - pomodoro.timeLeft / (pomodoro.longBreakDuration * 60);

  const modeText = { work: '专注中', break: '短休息', longBreak: '长休息' };
  const modeColor = { work: 'text-red-400', break: 'text-green-400', longBreak: 'text-blue-400' };

  const fontSize = Math.round(size / 200 * 14);
  const timeFontSize = Math.round(size / 200 * 30);
  const circleSize = Math.round(size / 200 * 128);
  const circleRadius = Math.round(circleSize / 2 - 8);
  const iconSize = Math.round(size / 200 * 20);

  return (
    <EditableWidget
      name="番茄钟"
      position={position}
      onPositionChange={(pos) => updateSettings({ pomodoroPosition: pos })}
      size={size}
      minSize={100}
      maxSize={400}
      onSizeChange={(size) => updateSettings({ pomodoroSize: size })}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
        style={{ width: `${size}px` }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/80" style={{ fontSize: `${fontSize}px` }}>🍅 番茄钟</span>
          <span className={`${modeColor[pomodoro.mode]}`} style={{ fontSize: `${fontSize}px` }}>{modeText[pomodoro.mode]}</span>
        </div>

        <div className="relative mx-auto mb-4" style={{ width: `${circleSize}px`, height: `${circleSize}px` }}>
          <svg className="w-full h-full transform -rotate-90">
            <circle 
              cx={circleSize/2} 
              cy={circleSize/2} 
              r={circleRadius} 
              fill="none" 
              stroke="rgba(255,255,255,0.1)" 
              strokeWidth="8" 
            />
            <circle
              cx={circleSize/2} 
              cy={circleSize/2} 
              r={circleRadius} 
              fill="none"
              stroke={pomodoro.mode === 'work' ? '#f87171' : '#4ade80'}
              strokeWidth="8" 
              strokeLinecap="round"
              strokeDasharray={`${progress * 2 * Math.PI * circleRadius} ${2 * Math.PI * circleRadius}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-bold text-white" style={{ fontSize: `${timeFontSize}px` }}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button 
            onClick={pomodoro.isRunning ? pausePomodoro : startPomodoro} 
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            {pomodoro.isRunning ? <Pause size={iconSize} className="text-white" /> : <Play size={iconSize} className="text-white" />}
          </button>
          <button 
            onClick={resetPomodoro} 
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <RotateCcw size={iconSize} className="text-white" />
          </button>
        </div>

        <div className="text-center mt-3 text-white/60" style={{ fontSize: `${fontSize}px` }}>
          今日完成: {pomodoro.sessionsCompleted} 个番茄
        </div>
      </motion.div>
    </EditableWidget>
  );
}

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';

export function Pomodoro() {
  const pomodoro = useAppStore((s) => s.pomodoro);
  const startPomodoro = useAppStore((s) => s.startPomodoro);
  const pausePomodoro = useAppStore((s) => s.pausePomodoro);
  const resetPomodoro = useAppStore((s) => s.resetPomodoro);
  const tickPomodoro = useAppStore((s) => s.tickPomodoro);

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

  const modeText = {
    work: '专注中',
    break: '短休息',
    longBreak: '长休息',
  };

  const modeColor = {
    work: 'text-red-400',
    break: 'text-green-400',
    longBreak: 'text-blue-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/80 text-sm">🍅 番茄钟</span>
        <span className={`text-sm ${modeColor[pomodoro.mode]}`}>
          {modeText[pomodoro.mode]}
        </span>
      </div>

      {/* 进度环 */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke={pomodoro.mode === 'work' ? '#f87171' : '#4ade80'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${progress * 352} 352`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex justify-center gap-3">
        <button
          onClick={pomodoro.isRunning ? pausePomodoro : startPomodoro}
          className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
        >
          {pomodoro.isRunning ? (
            <Pause size={20} className="text-white" />
          ) : (
            <Play size={20} className="text-white" />
          )}
        </button>
        <button
          onClick={resetPomodoro}
          className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
        >
          <RotateCcw size={20} className="text-white" />
        </button>
      </div>

      {/* 完成次数 */}
      <div className="text-center mt-3 text-white/60 text-sm">
        今日完成: {pomodoro.sessionsCompleted} 个番茄
      </div>
    </motion.div>
  );
}

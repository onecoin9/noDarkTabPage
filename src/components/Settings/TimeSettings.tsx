import { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../../stores/useAppStore';

// 带刻度线的滑块组件
interface TickSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  tickCount?: number;
}

function TickSlider({ value, min, max, step = 1, onChange, tickCount = 20 }: TickSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleMove = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = x / rect.width;
    let newValue = min + percent * (max - min);
    newValue = Math.round(newValue / step) * step;
    newValue = Math.max(min, Math.min(max, newValue));
    onChange(newValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // 生成刻度线
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => {
    const isMajor = i % 5 === 0;
    return { index: i, isMajor };
  });

  return (
    <div className="relative pt-6 pb-2">
      {/* 刻度轨道 */}
      <div
        ref={trackRef}
        className="relative h-8 cursor-pointer select-none"
        onMouseDown={handleMouseDown}
      >
        {/* 刻度线 */}
        <div className="absolute inset-x-0 top-0 h-6 flex justify-between">
          {ticks.map(({ index, isMajor }) => (
            <div
              key={index}
              className={`w-px ${isMajor ? 'h-5 bg-slate-400' : 'h-3 bg-slate-600'}`}
            />
          ))}
        </div>

        {/* 水平基准线 */}
        <div className="absolute left-0 right-0 top-5 h-px bg-slate-500" />

        {/* 三角形滑块 */}
        <div
          className="absolute top-0 -translate-x-1/2 transition-all duration-75"
          style={{ left: `${percentage}%` }}
        >
          {/* 三角形 */}
          <div 
            className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-indigo-500"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
          />
          {/* 垂直线 */}
          <div className="w-px h-4 bg-indigo-500 mx-auto" />
        </div>
      </div>
    </div>
  );
}

export function TimeSettings() {
  const settings = useAppStore((s) => s.settings);
  const pomodoro = useAppStore((s) => s.pomodoro);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const setPomodoroSettings = useAppStore((s) => s.setPomodoroSettings);

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-medium text-white mb-4">时间显示</h3>
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm mb-2 block">时间格式</label>
            <div className="flex gap-3">
              <button
                onClick={() => updateSettings({ timeFormat: '24h' })}
                className={`flex-1 p-3 rounded-xl border transition-all ${
                  settings.timeFormat === '24h'
                    ? 'border-indigo-500 bg-indigo-500/20 text-white'
                    : 'border-slate-600 bg-slate-800/50 text-slate-300'
                }`}
              >
                24 小时制
              </button>
              <button
                onClick={() => updateSettings({ timeFormat: '12h' })}
                className={`flex-1 p-3 rounded-xl border transition-all ${
                  settings.timeFormat === '12h'
                    ? 'border-indigo-500 bg-indigo-500/20 text-white'
                    : 'border-slate-600 bg-slate-800/50 text-slate-300'
                }`}
              >
                12 小时制
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-400 text-sm">时钟字体大小</label>
              <span className="text-indigo-400 font-mono font-medium">{settings.clockFontSize || 80}px</span>
            </div>
            <TickSlider
              value={settings.clockFontSize || 80}
              min={40}
              max={150}
              step={5}
              onChange={(v) => updateSettings({ clockFontSize: v })}
              tickCount={22}
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>40</span>
              <span>80</span>
              <span>120</span>
              <span>150</span>
            </div>
          </div>

          <ToggleOption
            label="显示秒数"
            checked={settings.showSeconds}
            onChange={(v) => updateSettings({ showSeconds: v })}
          />
          <ToggleOption
            label="显示日期"
            checked={settings.showDate}
            onChange={(v) => updateSettings({ showDate: v })}
          />
        </div>
      </section>

      {settings.showPomodoro && (
        <section>
          <h3 className="text-lg font-medium text-white mb-4">番茄钟设置</h3>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm mb-2 block">
                工作时长: {pomodoro.workDuration} 分钟
              </label>
              <input
                type="range"
                min="15"
                max="60"
                step="5"
                value={pomodoro.workDuration}
                onChange={(e) => setPomodoroSettings({ 
                  workDuration: Number(e.target.value),
                  timeLeft: Number(e.target.value) * 60,
                })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-2 block">
                短休息: {pomodoro.breakDuration} 分钟
              </label>
              <input
                type="range"
                min="3"
                max="15"
                value={pomodoro.breakDuration}
                onChange={(e) => setPomodoroSettings({ breakDuration: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-2 block">
                长休息: {pomodoro.longBreakDuration} 分钟
              </label>
              <input
                type="range"
                min="10"
                max="30"
                step="5"
                value={pomodoro.longBreakDuration}
                onChange={(e) => setPomodoroSettings({ longBreakDuration: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ToggleOption({ 
  label, 
  checked, 
  onChange 
}: { 
  label: string; 
  checked: boolean; 
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl cursor-pointer">
      <span className="text-slate-300">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-indigo-500' : 'bg-slate-600'
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  );
}

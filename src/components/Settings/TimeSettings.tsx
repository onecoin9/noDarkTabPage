import { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { Monitor, Type } from 'lucide-react';
import type { ClockFontFamily } from '../../types';

type ClockSettingsTab = 'display' | 'font';

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

  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => {
    const isMajor = i % 5 === 0;
    return { index: i, isMajor };
  });

  return (
    <div className="relative pt-6 pb-2">
      <div
        ref={trackRef}
        className="relative h-8 cursor-pointer select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-x-0 top-0 h-6 flex justify-between">
          {ticks.map(({ index, isMajor }) => (
            <div
              key={index}
              className={`w-px ${isMajor ? 'h-5 bg-slate-400' : 'h-3 bg-slate-600'}`}
            />
          ))}
        </div>
        <div className="absolute left-0 right-0 top-5 h-px bg-slate-500" />
        <div
          className="absolute top-0 -translate-x-1/2 transition-all duration-75"
          style={{ left: `${percentage}%` }}
        >
          <div 
            className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-indigo-500"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
          />
          <div className="w-px h-4 bg-indigo-500 mx-auto" />
        </div>
      </div>
    </div>
  );
}

// 颜色预设
const colorPresets = [
  '#ffffff', '#f8fafc', '#e2e8f0', '#94a3b8',
  '#fef3c7', '#fde68a', '#fbbf24', '#f59e0b',
  '#d1fae5', '#6ee7b7', '#34d399', '#10b981',
  '#dbeafe', '#93c5fd', '#60a5fa', '#3b82f6',
  '#ede9fe', '#c4b5fd', '#a78bfa', '#8b5cf6',
  '#fce7f3', '#f9a8d4', '#f472b6', '#ec4899',
];

// 字体选项
const fontOptions: { value: ClockFontFamily; label: string; preview: string }[] = [
  { value: 'system', label: '系统默认', preview: 'Aa' },
  { value: 'serif', label: '衬线体', preview: 'Aa' },
  { value: 'mono', label: '等宽体', preview: '00' },
  { value: 'rounded', label: '圆体', preview: 'Aa' },
  { value: 'elegant', label: '优雅体', preview: 'Aa' },
  { value: 'digital', label: '数码体', preview: '88' },
];

// 字重选项
const weightOptions = [
  { value: 100, label: 'Thin' },
  { value: 200, label: 'ExtraLight' },
  { value: 300, label: 'Light' },
  { value: 400, label: 'Regular' },
  { value: 500, label: 'Medium' },
  { value: 600, label: 'SemiBold' },
  { value: 700, label: 'Bold' },
  { value: 800, label: 'ExtraBold' },
  { value: 900, label: 'Black' },
];

// 分隔符选项
const separatorOptions: { value: ':' | '.' | ' '; label: string }[] = [
  { value: ':', label: '冒号 :' },
  { value: '.', label: '点号 .' },
  { value: ' ', label: '空格' },
];

export function TimeSettings() {
  const settings = useAppStore((s) => s.settings);
  const pomodoro = useAppStore((s) => s.pomodoro);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const setPomodoroSettings = useAppStore((s) => s.setPomodoroSettings);
  const [activeTab, setActiveTab] = useState<ClockSettingsTab>('display');

  const clockStyle = settings.clockStyle || {
    fontFamily: 'system',
    fontWeight: 200,
    color: '#ffffff',
    opacity: 100,
    shadow: true,
    separator: ':',
  };

  const updateClockStyle = (updates: Partial<typeof clockStyle>) => {
    updateSettings({ clockStyle: { ...clockStyle, ...updates } });
  };

  return (
    <div className="space-y-6">
      {/* 时钟设置标签页 */}
      <section>
        <h3 className="text-lg font-medium text-white mb-4">时钟设置</h3>
        
        {/* 标签切换 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('display')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'display'
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Monitor size={16} />
            Display
          </button>
          <button
            onClick={() => setActiveTab('font')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'font'
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Type size={16} />
            Font
          </button>
        </div>

        {/* Display 设置 */}
        {activeTab === 'display' && (
          <div className="space-y-6">
            {/* 时间格式 */}
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

            {/* 分隔符 */}
            <div>
              <label className="text-slate-400 text-sm mb-2 block">时间分隔符</label>
              <div className="flex gap-2">
                {separatorOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateClockStyle({ separator: opt.value })}
                    className={`px-4 py-2 rounded-xl border transition-all ${
                      clockStyle.separator === opt.value
                        ? 'border-indigo-500 bg-indigo-500/20 text-white'
                        : 'border-slate-600 bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 字体大小 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-400 text-sm">字体大小</label>
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
            </div>

            {/* 显示选项 */}
            <div className="space-y-3">
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
              <ToggleOption
                label="显示阴影"
                checked={clockStyle.shadow}
                onChange={(v) => updateClockStyle({ shadow: v })}
              />
            </div>
          </div>
        )}

        {/* Font 设置 */}
        {activeTab === 'font' && (
          <div className="space-y-6">
            {/* 字体选择 */}
            <div>
              <label className="text-slate-400 text-sm mb-3 block">字体</label>
              <div className="grid grid-cols-3 gap-2">
                {fontOptions.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => updateClockStyle({ fontFamily: font.value })}
                    className={`p-3 rounded-xl border transition-all text-center ${
                      clockStyle.fontFamily === font.value
                        ? 'border-indigo-500 bg-indigo-500/20 text-white'
                        : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div 
                      className="text-2xl mb-1"
                      style={{ fontFamily: getFontFamily(font.value) }}
                    >
                      {font.preview}
                    </div>
                    <div className="text-xs opacity-70">{font.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 字重 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-400 text-sm">字重</label>
                <span className="text-indigo-400 font-medium">
                  {weightOptions.find(w => w.value === clockStyle.fontWeight)?.label || 'Regular'}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="900"
                step="100"
                value={clockStyle.fontWeight}
                onChange={(e) => updateClockStyle({ fontWeight: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Thin</span>
                <span>Regular</span>
                <span>Bold</span>
                <span>Black</span>
              </div>
            </div>

            {/* 颜色 */}
            <div>
              <label className="text-slate-400 text-sm mb-3 block">颜色</label>
              <div className="grid grid-cols-8 gap-2">
                {colorPresets.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateClockStyle({ color })}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      clockStyle.color === color
                        ? 'border-white scale-110 ring-2 ring-indigo-500'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {/* 自定义颜色 */}
              <div className="flex items-center gap-3 mt-3">
                <label className="text-slate-500 text-sm">自定义:</label>
                <input
                  type="color"
                  value={clockStyle.color}
                  onChange={(e) => updateClockStyle({ color: e.target.value })}
                  className="w-10 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={clockStyle.color}
                  onChange={(e) => updateClockStyle({ color: e.target.value })}
                  className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white font-mono"
                />
              </div>
            </div>

            {/* 不透明度 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-400 text-sm">不透明度</label>
                <span className="text-indigo-400 font-medium">{clockStyle.opacity}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={clockStyle.opacity}
                onChange={(e) => updateClockStyle({ opacity: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* 预览 */}
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <label className="text-slate-500 text-xs mb-2 block">预览</label>
              <div 
                className="text-center py-4"
                style={{
                  fontFamily: getFontFamily(clockStyle.fontFamily),
                  fontWeight: clockStyle.fontWeight,
                  color: clockStyle.color,
                  opacity: clockStyle.opacity / 100,
                  fontSize: '48px',
                  textShadow: clockStyle.shadow ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                12{clockStyle.separator}34{settings.showSeconds ? `${clockStyle.separator}56` : ''}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 番茄钟设置 */}
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

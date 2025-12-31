import { useAppStore } from '../../stores/useAppStore';

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
              <span className="text-indigo-400 font-medium">{settings.clockFontSize || 80}px</span>
            </div>
            <input
              type="range"
              min="40"
              max="150"
              value={settings.clockFontSize || 80}
              onChange={(e) => updateSettings({ clockFontSize: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>小</span>
              <span>中</span>
              <span>大</span>
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

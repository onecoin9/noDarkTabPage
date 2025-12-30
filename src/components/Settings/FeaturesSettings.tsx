import { useAppStore } from '../../stores/useAppStore';

export function FeaturesSettings() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-medium text-white mb-4">功能开关</h3>
        <p className="text-slate-400 text-sm mb-4">选择要在主页显示的功能模块</p>
        
        <div className="space-y-3">
          <ToggleOption
            label="天气显示"
            description="显示当前城市的天气信息"
            checked={settings.showWeather}
            onChange={(v) => updateSettings({ showWeather: v })}
          />
          <ToggleOption
            label="每日一言"
            description="显示每日诗词或名言"
            checked={settings.showQuote}
            onChange={(v) => updateSettings({ showQuote: v })}
          />
          <ToggleOption
            label="待办事项"
            description="显示待办事项列表"
            checked={settings.showTodo}
            onChange={(v) => updateSettings({ showTodo: v })}
          />
          <ToggleOption
            label="番茄钟"
            description="显示番茄工作法计时器"
            checked={settings.showPomodoro}
            onChange={(v) => updateSettings({ showPomodoro: v })}
          />
        </div>
      </section>

      {settings.showWeather && (
        <section>
          <h3 className="text-lg font-medium text-white mb-4">天气设置</h3>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm mb-2 block">城市</label>
              <input
                type="text"
                value={settings.weatherCity}
                onChange={(e) => updateSettings({ weatherCity: e.target.value })}
                placeholder="输入城市名称"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-slate-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-2 block">温度单位</label>
              <div className="flex gap-3">
                <button
                  onClick={() => updateSettings({ weatherUnit: 'celsius' })}
                  className={`flex-1 p-3 rounded-xl border transition-all ${
                    settings.weatherUnit === 'celsius'
                      ? 'border-indigo-500 bg-indigo-500/20 text-white'
                      : 'border-slate-600 bg-slate-800/50 text-slate-300'
                  }`}
                >
                  摄氏度 (°C)
                </button>
                <button
                  onClick={() => updateSettings({ weatherUnit: 'fahrenheit' })}
                  className={`flex-1 p-3 rounded-xl border transition-all ${
                    settings.weatherUnit === 'fahrenheit'
                      ? 'border-indigo-500 bg-indigo-500/20 text-white'
                      : 'border-slate-600 bg-slate-800/50 text-slate-300'
                  }`}
                >
                  华氏度 (°F)
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ToggleOption({ 
  label, 
  description,
  checked, 
  onChange 
}: { 
  label: string;
  description?: string;
  checked: boolean; 
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800/70 transition-colors">
      <div>
        <div className="text-white font-medium">{label}</div>
        {description && <div className="text-slate-400 text-sm mt-0.5">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
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

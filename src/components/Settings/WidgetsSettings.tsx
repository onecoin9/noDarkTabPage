import { useAppStore } from '../../stores/useAppStore';

export function WidgetsSettings() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);

  const widgets = [
    { key: 'showWeather', label: '天气', icon: '🌤️', description: '显示当前天气信息' },
    { key: 'showPomodoro', label: '番茄钟', icon: '🍅', description: '专注工作计时器' },
    { key: 'showTodo', label: '待办事项', icon: '✅', description: '管理你的任务列表' },
    { key: 'showQuote', label: '每日一言', icon: '📜', description: '每日诗词名言' },
    { key: 'showCountdown', label: '倒计时', icon: '⏰', description: '重要日期倒计时' },
    { key: 'showNote', label: '便签', icon: '📝', description: '快速记录笔记' },
    { key: 'showCalendar', label: '日历', icon: '📅', description: '查看日期' },
  ] as const;

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-medium text-white mb-2">小组件管理</h3>
        <p className="text-slate-400 text-sm mb-4">选择要在主页显示的小组件</p>
        
        <div className="space-y-3">
          {widgets.map((widget) => (
            <label
              key={widget.key}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{widget.icon}</span>
                <div>
                  <div className="text-white font-medium">{widget.label}</div>
                  <div className="text-slate-400 text-sm">{widget.description}</div>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ [widget.key]: !settings[widget.key as keyof typeof settings] })}
                className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                  settings[widget.key as keyof typeof settings] ? 'bg-indigo-500' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings[widget.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-medium text-white mb-4">布局设置</h3>
        <p className="text-slate-400 text-sm mb-4">
          小组件会自动排列在页面两侧。在大屏幕上，天气和番茄钟显示在左侧，待办事项显示在右侧。
        </p>
        <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <div className="text-slate-500 text-sm">
            💡 提示：未来版本将支持拖拽自定义布局
          </div>
        </div>
      </section>
    </div>
  );
}

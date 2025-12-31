import { useAppStore } from '../../stores/useAppStore';
import { PanelLeft, PanelRight } from 'lucide-react';
import type { PositionPreset } from '../../types';

export function WidgetsSettings() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);

  const widgets = [
    { 
      key: 'showWeather', 
      label: '天气', 
      icon: '🌤️', 
      description: '显示当前天气信息',
      positionKey: 'weatherPosition',
      sizeKey: 'weatherSize',
    },
    { 
      key: 'showPomodoro', 
      label: '番茄钟', 
      icon: '🍅', 
      description: '专注工作计时器',
      positionKey: 'pomodoroPosition',
      sizeKey: 'pomodoroSize',
    },
    { 
      key: 'showTodo', 
      label: '待办事项', 
      icon: '✅', 
      description: '管理你的任务列表',
      positionKey: 'todoPosition',
      sizeKey: 'todoSize',
    },
    { 
      key: 'showQuote', 
      label: '每日一言', 
      icon: '📜', 
      description: '每日诗词名言',
      positionKey: 'quotePosition',
      sizeKey: 'quoteSize',
    },
    { key: 'showCountdown', label: '倒计时', icon: '⏰', description: '重要日期倒计时' },
    { key: 'showNote', label: '便签', icon: '📝', description: '快速记录笔记' },
    { key: 'showCalendar', label: '日历', icon: '📅', description: '查看日期' },
  ] as const;

  // 获取当前侧栏位置
  const getSide = (positionKey: string): 'left' | 'right' | 'center' => {
    const position = settings[positionKey as keyof typeof settings] as { preset: PositionPreset } | undefined;
    if (!position) return 'left';
    if (position.preset.includes('left')) return 'left';
    if (position.preset.includes('right')) return 'right';
    return 'center';
  };

  // 切换侧栏位置
  const toggleSide = (positionKey: string, currentSide: 'left' | 'right' | 'center') => {
    const position = settings[positionKey as keyof typeof settings] as { preset: PositionPreset; offsetX: number; offsetY: number };
    const newSide = currentSide === 'left' ? 'right' : 'left';
    
    // 保持垂直位置，只改变水平位置
    let newPreset: PositionPreset;
    if (position.preset.includes('top')) {
      newPreset = newSide === 'left' ? 'top-left' : 'top-right';
    } else if (position.preset.includes('bottom')) {
      newPreset = newSide === 'left' ? 'bottom-left' : 'bottom-right';
    } else {
      newPreset = newSide === 'left' ? 'center-left' : 'center-right';
    }
    
    updateSettings({ 
      [positionKey]: { 
        ...position, 
        preset: newPreset,
        offsetX: 0, // 重置水平偏移
      } 
    });
  };

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-medium text-white mb-2">小组件管理</h3>
        <p className="text-slate-400 text-sm mb-4">选择要显示的小组件，并设置它们的位置和大小</p>
        
        <div className="space-y-3">
          {widgets.map((widget) => {
            const isEnabled = settings[widget.key as keyof typeof settings];
            const hasPosition = 'positionKey' in widget;
            const side = hasPosition ? getSide(widget.positionKey!) : 'left';
            const size = hasPosition ? (settings[widget.sizeKey as keyof typeof settings] as number || 200) : 200;
            
            return (
              <div
                key={widget.key}
                className="p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800/70 transition-colors"
              >
                {/* 主行：图标、名称、开关 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{widget.icon}</span>
                    <div>
                      <div className="text-white font-medium">{widget.label}</div>
                      <div className="text-slate-400 text-sm">{widget.description}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ [widget.key]: !isEnabled })}
                    className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                      isEnabled ? 'bg-indigo-500' : 'bg-slate-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        isEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* 展开设置：侧栏选择和大小 */}
                {isEnabled && hasPosition && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4">
                    {/* 侧栏选择 */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">显示位置</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleSide(widget.positionKey!, side)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                            side === 'left'
                              ? 'bg-indigo-500 text-white'
                              : 'bg-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          <PanelLeft size={14} />
                          <span className="text-xs">左侧</span>
                        </button>
                        <button
                          onClick={() => toggleSide(widget.positionKey!, side)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                            side === 'right'
                              ? 'bg-indigo-500 text-white'
                              : 'bg-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          <PanelRight size={14} />
                          <span className="text-xs">右侧</span>
                        </button>
                      </div>
                    </div>

                    {/* 大小调整 */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">大小</span>
                        <span className="text-indigo-400 text-sm font-medium">{size}px</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="400"
                        step="20"
                        value={size}
                        onChange={(e) => updateSettings({ [widget.sizeKey!]: Number(e.target.value) })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>100px</span>
                        <span>250px</span>
                        <span>400px</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-medium text-white mb-4">使用提示</h3>
        <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 space-y-2">
          <div className="text-slate-400 text-sm">
            💡 点击右下角的 <span className="text-indigo-400">编辑按钮</span> 进入编辑模式
          </div>
          <div className="text-slate-400 text-sm">
            🖱️ 拖动小组件顶部的标签可以自由移动位置
          </div>
          <div className="text-slate-400 text-sm">
            📐 拖动小组件右下角的圆点可以调整大小
          </div>
        </div>
      </section>
    </div>
  );
}

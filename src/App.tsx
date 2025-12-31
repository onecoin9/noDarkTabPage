import {
  Clock,
  SearchBox,
  BookmarkGrid,
  SettingsButton,
  Background,
  CustomCss,
  EditModeButton,
  SettingsModal,
  Pomodoro,
  TodoList,
  Weather,
  DailyQuote,
  WidgetContainer,
  CountdownWidget,
  NoteWidget,
  CalendarWidget,
} from './components';
import { useAppStore } from './stores/useAppStore';
import type { PositionPreset } from './types';

// 根据位置获取样式类
function getPositionClasses(position: PositionPreset): string {
  const positionMap: Record<PositionPreset, string> = {
    'top-left': 'items-start justify-start',
    'top-center': 'items-start justify-center',
    'top-right': 'items-start justify-end',
    'center-left': 'items-center justify-start',
    'center': 'items-center justify-center',
    'center-right': 'items-center justify-end',
    'bottom-left': 'items-end justify-start',
    'bottom-center': 'items-end justify-center',
    'bottom-right': 'items-end justify-end',
  };
  return positionMap[position] || positionMap['center'];
}

function App() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const bookmarkPosition = settings.bookmarkPosition || 'center';

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />
      <CustomCss />
      <SettingsButton />
      <EditModeButton />
      <SettingsModal />

      {/* 左侧小组件 */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 space-y-4 z-20 hidden lg:flex flex-col">
        {settings.showWeather && <Weather />}
        {settings.showPomodoro && <Pomodoro />}
        {settings.showCalendar && (
          <WidgetContainer
            id="calendar"
            title="日历"
            icon="📅"
            onClose={() => updateSettings({ showCalendar: false })}
          >
            <CalendarWidget />
          </WidgetContainer>
        )}
      </div>

      {/* 右侧小组件 */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col space-y-4">
        {settings.showTodo && <TodoList />}
        {settings.showCountdown && (
          <WidgetContainer
            id="countdown"
            title="倒计时"
            icon="⏰"
            onClose={() => updateSettings({ showCountdown: false })}
          >
            <CountdownWidget />
          </WidgetContainer>
        )}
        {settings.showNote && (
          <WidgetContainer
            id="note"
            title="便签"
            icon="📝"
            onClose={() => updateSettings({ showNote: false })}
          >
            <NoteWidget />
          </WidgetContainer>
        )}
      </div>

      {/* 时钟 - 自己管理位置 */}
      <Clock />
      
      {/* 每日一言 */}
      {settings.showQuote && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 translate-y-8 z-10">
          <DailyQuote />
        </div>
      )}
      
      {/* 搜索框 - 自己管理位置 */}
      <SearchBox />

      {/* 书签区域 - 可配置位置 */}
      <div className={`fixed inset-0 flex p-8 md:p-16 z-10 pointer-events-none ${getPositionClasses(bookmarkPosition)}`}>
        <div className="pointer-events-auto">
          <BookmarkGrid />
        </div>
      </div>

      {/* 移动端小组件 */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 flex gap-4 overflow-x-auto z-20 pb-2">
        {settings.showWeather && <Weather />}
        {settings.showPomodoro && <Pomodoro />}
      </div>
    </div>
  );
}

export default App;

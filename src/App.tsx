import {
  Clock,
  SearchBox,
  BookmarkGrid,
  SettingsButton,
  Background,
  CustomCss,
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

function App() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-10 relative">
      <Background />
      <CustomCss />
      <SettingsButton />
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

      {/* 主内容 */}
      <main className="w-full max-w-4xl flex flex-col items-center gap-8 z-10">
        <Clock />
        
        {settings.showQuote && <DailyQuote />}
        
        <SearchBox />
        
        <BookmarkGrid />
      </main>

      {/* 移动端小组件 */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 flex gap-4 overflow-x-auto z-20 pb-2">
        {settings.showWeather && <Weather />}
        {settings.showPomodoro && <Pomodoro />}
      </div>
    </div>
  );
}

export default App;

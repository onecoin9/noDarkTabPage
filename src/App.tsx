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
} from './components';
import { useAppStore } from './stores/useAppStore';

function App() {
  const settings = useAppStore((s) => s.settings);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-10 relative">
      <Background />
      <CustomCss />
      <SettingsButton />
      <SettingsModal />

      {/* 左侧小组件 */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 space-y-4 z-20 hidden lg:block">
        {settings.showWeather && <Weather />}
        {settings.showPomodoro && <Pomodoro />}
      </div>

      {/* 右侧小组件 */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
        {settings.showTodo && <TodoList />}
      </div>

      {/* 主内容 */}
      <main className="w-full max-w-4xl flex flex-col items-center gap-8 z-10">
        <Clock />
        
        {settings.showQuote && <DailyQuote />}
        
        <SearchBox />
        
        <BookmarkGrid />
      </main>

      {/* 移动端小组件 */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 flex gap-4 overflow-x-auto z-20">
        {settings.showWeather && <Weather />}
        {settings.showPomodoro && <Pomodoro />}
      </div>
    </div>
  );
}

export default App;

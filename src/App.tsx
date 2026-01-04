import {
  Clock,
  SearchBox,
  BookmarkGrid,
  BookmarkPanelButton,
  SettingsButton,
  Background,
  CustomCss,
  EditModeButton,
  SettingsModal,
  Pomodoro,
  TodoList,
  Weather,
  DailyQuote,
} from './components';
import { CalendarWidget } from './components/Widgets/CalendarWidget';
import { CountdownWidget } from './components/Widgets/CountdownWidget';
import { NoteWidget } from './components/Widgets/NoteWidget';
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
  const bookmarkPosition = settings.bookmarkPosition || 'center';

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      <Background />
      <CustomCss />
      
      {/* 设置和编辑按钮 - 移动端隐藏 */}
      <div className="hidden md:block">
        <SettingsButton />
        <EditModeButton />
        <BookmarkPanelButton />
      </div>
      
      <SettingsModal />

      {/* 移动端：时钟和搜索框居中布局 */}
      <div className="md:hidden flex flex-col items-center justify-center min-h-screen px-4 gap-8">
        <Clock />
        <SearchBox />
      </div>

      {/* 桌面端：原有布局 */}
      <div className="hidden md:block">
        <Clock />
        
        {settings.showQuote && <DailyQuote />}
        
        <SearchBox />

        {/* 小组件 */}
        {settings.showWeather && <Weather />}
        {settings.showPomodoro && <Pomodoro />}
        {settings.showTodo && <TodoList />}
        {settings.showCountdown && <CountdownWidget />}
        {settings.showNote && <NoteWidget />}
        {settings.showCalendar && <CalendarWidget />}
      </div>

      {/* 书签区域 - 仅桌面端 */}
      <div className={`hidden md:flex fixed inset-0 p-4 md:p-8 lg:p-16 z-10 pointer-events-none ${getPositionClasses(bookmarkPosition)}`}>
        <div className="pointer-events-auto">
          <BookmarkGrid />
        </div>
      </div>
    </div>
  );
}

export default App;

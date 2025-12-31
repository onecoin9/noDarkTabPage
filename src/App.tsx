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
    <div className="min-h-screen relative overflow-hidden">
      <Background />
      <CustomCss />
      <SettingsButton />
      <EditModeButton />
      <BookmarkPanelButton />
      <SettingsModal />

      {/* 时钟 */}
      <div className="md:block">
        <Clock />
      </div>
      
      {/* 每日一言 */}
      {settings.showQuote && (
        <div className="md:block">
          <DailyQuote />
        </div>
      )}
      
      {/* 搜索框 */}
      <div className="md:block">
        <SearchBox />
      </div>

      {/* 小组件 - 现在都是可拖拽的 */}
      {settings.showWeather && (
        <div className="md:block">
          <Weather />
        </div>
      )}
      {settings.showPomodoro && (
        <div className="md:block">
          <Pomodoro />
        </div>
      )}
      {settings.showTodo && (
        <div className="md:block">
          <TodoList />
        </div>
      )}
      {settings.showCountdown && (
        <div className="md:block">
          <CountdownWidget />
        </div>
      )}
      {settings.showNote && (
        <div className="md:block">
          <NoteWidget />
        </div>
      )}
      {settings.showCalendar && (
        <div className="md:block">
          <CalendarWidget />
        </div>
      )}

      {/* 书签区域 */}
      <div className={`fixed inset-0 flex p-4 md:p-8 lg:p-16 z-10 pointer-events-none ${getPositionClasses(bookmarkPosition)}`}>
        <div className="pointer-events-auto">
          <BookmarkGrid />
        </div>
      </div>
    </div>
  );
}

export default App;

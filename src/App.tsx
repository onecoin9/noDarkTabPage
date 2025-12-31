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
  const bookmarkPosition = settings.bookmarkPosition || 'center';

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />
      <CustomCss />
      <SettingsButton />
      <EditModeButton />
      <SettingsModal />

      {/* 时钟 */}
      <Clock />
      
      {/* 每日一言 */}
      {settings.showQuote && <DailyQuote />}
      
      {/* 搜索框 */}
      <SearchBox />

      {/* 小组件 - 现在都是可拖拽的 */}
      {settings.showWeather && <Weather />}
      {settings.showPomodoro && <Pomodoro />}
      {settings.showTodo && <TodoList />}

      {/* 书签区域 */}
      <div className={`fixed inset-0 flex p-8 md:p-16 z-10 pointer-events-none ${getPositionClasses(bookmarkPosition)}`}>
        <div className="pointer-events-auto">
          <BookmarkGrid />
        </div>
      </div>
    </div>
  );
}

export default App;

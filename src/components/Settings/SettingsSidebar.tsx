import { 
  Palette, 
  Image, 
  Clock, 
  Database, 
  Info,
  Sparkles,
  LayoutGrid,
  Cloud,
  Bookmark,
  Code
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import type { SettingsTab } from '../../types';

interface MenuItem {
  id: SettingsTab;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { id: 'appearance', label: '外观设置', icon: <Palette size={18} /> },
  { id: 'bookmarks', label: '书签设置', icon: <Bookmark size={18} /> },
  { id: 'wallpaper', label: '壁纸设置', icon: <Image size={18} /> },
  { id: 'widgets', label: '小组件', icon: <LayoutGrid size={18} /> },
  { id: 'time', label: '时间设置', icon: <Clock size={18} /> },
  { id: 'customcss', label: '自定义 CSS', icon: <Code size={18} /> },
  { id: 'data', label: '数据管理', icon: <Database size={18} /> },
  { id: 'sync', label: '云同步', icon: <Cloud size={18} /> },
  { id: 'about', label: '关于', icon: <Info size={18} /> },
];

export function SettingsSidebar() {
  const settingsTab = useAppStore((s) => s.settingsTab);
  const setSettingsTab = useAppStore((s) => s.setSettingsTab);

  return (
    <div className="w-56 bg-slate-800/50 border-r border-slate-700/50 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2 text-white">
          <Sparkles size={24} className="text-indigo-400" />
          <span className="font-semibold">Constantine's Tab</span>
        </div>
      </div>
      
      {/* 菜单 */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSettingsTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              settingsTab === item.id
                ? 'bg-indigo-500/20 text-indigo-400'
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      
      {/* 底部版本信息 */}
      <div className="p-4 border-t border-slate-700/50 text-xs text-slate-500">
        <div>版本 v2.0.0</div>
        <div>更新 2025-12-31</div>
      </div>
    </div>
  );
}

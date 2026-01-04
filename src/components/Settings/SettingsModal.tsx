import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { SettingsSidebar } from './SettingsSidebar';
import { AppearanceSettings } from './AppearanceSettings';
import { BookmarkSettings } from './BookmarkSettings';
import { WallpaperSettings } from './WallpaperSettings';
import { WidgetsSettings } from './WidgetsSettings';
import { TimeSettings } from './TimeSettings';
import { CustomCssSettings } from './CustomCssSettings';
import { DataSettings } from './DataSettings';
import { CloudSyncSettings } from './CloudSyncSettings';
import { AboutSettings } from './AboutSettings';

export function SettingsModal() {
  const settingsOpen = useAppStore((s) => s.settingsOpen);
  const settingsTab = useAppStore((s) => s.settingsTab);
  const toggleSettings = useAppStore((s) => s.toggleSettings);

  const renderContent = () => {
    switch (settingsTab) {
      case 'appearance':
        return <AppearanceSettings />;
      case 'bookmarks':
        return <BookmarkSettings />;
      case 'wallpaper':
        return <WallpaperSettings />;
      case 'widgets':
        return <WidgetsSettings />;
      case 'time':
        return <TimeSettings />;
      case 'customcss':
        return <CustomCssSettings />;
      case 'data':
        return <DataSettings />;
      case 'sync':
        return <CloudSyncSettings />;
      case 'about':
        return <AboutSettings />;
      default:
        return <AppearanceSettings />;
    }
  };

  return (
    <AnimatePresence>
      {settingsOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSettings}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-0 lg:top-[5%] lg:bottom-[5%] lg:left-1/2 lg:-translate-x-1/2 lg:w-[1200px] lg:max-w-[90vw] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl z-50 flex overflow-hidden border border-slate-700/50"
          >
            {/* 侧边栏 */}
            <SettingsSidebar />
            
            {/* 内容区 */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* 头部 */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
                <h2 className="text-xl font-semibold text-white">设置</h2>
                <button
                  onClick={toggleSettings}
                  className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* 内容 */}
              <div className="flex-1 overflow-y-auto p-6">
                {renderContent()}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

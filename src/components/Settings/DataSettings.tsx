import { Download, Upload, Trash2 } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';

export function DataSettings() {
  const exportConfig = useAppStore((s) => s.exportConfig);
  const importConfig = useAppStore((s) => s.importConfig);
  const resetToDefault = useAppStore((s) => s.resetToDefault);

  const handleExport = () => {
    const config = exportConfig();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newtab-config-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const success = importConfig(event.target?.result as string);
      if (success) {
        alert('配置导入成功！');
      } else {
        alert('导入失败，请检查文件格式');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (confirm('确定要重置所有设置吗？这将清除所有自定义配置。')) {
      resetToDefault();
      alert('已重置为默认设置');
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-medium text-white mb-4">数据备份</h3>
        <p className="text-slate-400 text-sm mb-4">
          导出配置文件可以备份你的所有设置，包括书签、壁纸、待办事项等。
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 p-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors"
          >
            <Download size={20} />
            导出配置文件
          </button>
          
          <label className="w-full flex items-center justify-center gap-2 p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors cursor-pointer">
            <Upload size={20} />
            导入配置文件
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-medium text-white mb-4">数据统计</h3>
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="书签数量" value={useAppStore.getState().bookmarks.length} />
          <StatCard label="待办事项" value={useAppStore.getState().todos.length} />
          <StatCard label="番茄完成" value={useAppStore.getState().pomodoro.sessionsCompleted} />
          <StatCard label="存储大小" value="~10KB" />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-medium text-white mb-4">危险操作</h3>
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded-xl transition-colors"
        >
          <Trash2 size={20} />
          重置所有设置
        </button>
        <p className="text-slate-500 text-sm mt-2">
          此操作不可撤销，建议先导出配置文件备份。
        </p>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-4 bg-slate-800/50 rounded-xl">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  );
}

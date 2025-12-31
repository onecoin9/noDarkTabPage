# Constantine's Tab - 完整文档

> 📍 **文档位置**: `docs/README.md`  
> 🏠 **返回**: [项目首页](../README.md)

一个现代化的浏览器新标签页扩展，使用 React + TypeScript + Vite 构建。

## 📚 文档导航

- [开发清单](TODO.md) - 功能开发进度和待办事项
- [功能对比分析](功能对比分析.md) - 与其他新标签页项目的对比
- [天气 API 配置](api/WEATHER_API.md) - 和风天气 API 设置指南
- [云同步配置](api/CLOUD_SYNC.md) - Supabase 云端同步设置
- [截图目录](screenshots/) - 项目截图和演示图片

## ✨ 功能特性

- ⏰ 实时时钟和日期显示（支持自定义字体、颜色、大小）
- 🔍 多引擎搜索 (Google/百度/Bing/DuckDuckGo)
- 🔖 快捷书签管理（拖拽排序、自定义图标）
- 🌤️ 实时天气（和风天气 API）
- 🍅 番茄钟计时器
- ✅ 待办事项管理
- 📜 每日一言
- 🎨 多种壁纸源 (Bing/Unsplash/Wallhaven)
- 💅 Custom CSS 支持
- ☁️ 云端同步 (Supabase + GitHub/Google OAuth)
- 💾 配置导入/导出
- 🎬 流畅动效 (Framer Motion)
- 🎯 所有组件可拖拽定位和调整大小

## 🛠️ 技术栈

- React 19 + TypeScript
- Vite 7
- TailwindCSS 4
- Zustand (状态管理)
- Framer Motion (动效)
- Lucide React (图标)

## 🚀 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 构建浏览器扩展
npm run build:extension
```

## 📦 安装为浏览器扩展

### Chrome / Edge

1. 运行 `npm run build:extension`
2. 打开 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `dist` 文件夹

### Firefox

1. 将 `public/manifest-firefox.json` 复制到 `dist/manifest.json`
2. 打开 `about:debugging#/runtime/this-firefox`
3. 点击"临时加载附加组件"
4. 选择 `dist/manifest.json`

## 📁 项目结构

```
src/
├── components/     # UI 组件
│   ├── Clock.tsx
│   ├── SearchBox.tsx
│   ├── BookmarkGrid.tsx
│   ├── SettingsPanel.tsx
│   └── ...
├── hooks/          # 自定义 Hooks
├── stores/         # Zustand 状态管理
├── types/          # TypeScript 类型定义
└── App.tsx         # 主应用组件
```

## 📄 许可证

MIT License

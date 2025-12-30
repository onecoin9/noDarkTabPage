# 新标签页 v2.0

一个现代化的浏览器新标签页扩展，使用 React + TypeScript + Vite 构建。

## ✨ 功能特性

- ⏰ 实时时钟和日期显示
- 🔍 多引擎搜索 (Google/百度/Bing)
- 🔖 快捷书签管理
- 🎨 多种渐变背景
- 💅 Custom CSS 支持
- 💾 配置导入/导出
- 🎬 流畅动效 (Framer Motion)

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

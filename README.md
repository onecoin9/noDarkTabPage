# Constantine's Tab - 魔法新标签页 ✨

> 一个功能丰富、高度可定制的浏览器新标签页扩展

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-green.svg)](package.json)

## 🌟 特性

- ⏰ **智能时钟** - 支持字体、颜色、大小完全自定义
- 🔍 **多引擎搜索** - Google/百度/Bing/DuckDuckGo 一键切换
- 🔖 **书签管理** - 拖拽排序、图标自定义、9 宫格定位
- 🖼️ **多源壁纸** - Bing 每日/Wallhaven/Unsplash/自定义
- 🧩 **丰富小组件** - 天气/番茄钟/待办/日历/便签/倒计时
- 🎨 **Custom CSS** - 完全自定义样式
- ☁️ **云端同步** - Supabase + GitHub/Google OAuth
- 📱 **响应式设计** - 支持各种屏幕尺寸

## 📸 预览

![主界面](docs/screenshots/TODO/1767165569758.png)

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📚 文档

- [完整文档](docs/README.md) - 项目详细说明
- [文档索引](docs/INDEX.md) - 快速导航
- [项目结构](docs/PROJECT_STRUCTURE.md) - 文件组织说明
- [开发清单](docs/TODO.md) - 功能开发进度
- [功能对比](docs/功能对比分析.md) - 与其他项目对比
- [天气 API 配置](docs/api/WEATHER_API.md) - 和风天气 API 设置
- [云同步配置](docs/api/CLOUD_SYNC.md) - Supabase 云同步设置

## ⚙️ 配置

### 天气 API

1. 访问 [和风天气开发平台](https://dev.qweather.com/) 获取 API Key
2. 在 `src/lib/weather.ts` 中配置你的 API Key
3. 详见 [天气 API 配置文档](docs/api/WEATHER_API.md)

### 云端同步

项目已集成 Supabase 云端同步功能：

- Supabase URL: `https://gbfdfpxlltnvnrsayrou.supabase.co`
- 支持 GitHub 和 Google OAuth 登录
- 详见 [云同步配置文档](docs/api/CLOUD_SYNC.md)

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **状态管理**: Zustand
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **拖拽**: @dnd-kit
- **后端**: Supabase

## 📦 浏览器扩展

### Chrome/Edge

1. 运行 `npm run build`
2. 打开浏览器扩展管理页面
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `dist` 文件夹

### Firefox

1. 运行 `npm run build`
2. 打开 `about:debugging#/runtime/this-firefox`
3. 点击"临时载入附加组件"
4. 选择 `dist/manifest-firefox.json`

## 🌐 在线访问

- **GitHub Pages**: https://onecoin9.github.io/noDarkTabPage/
- **自定义域名**: https://constantine9.ggff.net

## 📝 开发进度

查看 [TODO.md](docs/TODO.md) 了解详细的功能开发进度。

### 已完成 ✅

- 时钟深度自定义（字体/颜色/字重/大小）
- 所有组件可拖拽定位和调整大小
- 真实天气 API 集成（和风天气）
- 云端同步（Supabase + OAuth）
- 多源壁纸系统
- 7 种小组件

### 开发中 🚧

- AI 搜索引擎集成
- 书签分组管理
- 多日天气预报

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [GitHub 仓库](https://github.com/onecoin9/noDarkTabPage)
- [问题反馈](https://github.com/onecoin9/noDarkTabPage/issues)

---

**Made with ❤️ by Constantine**

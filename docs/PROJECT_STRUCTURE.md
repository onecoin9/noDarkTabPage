# 📁 项目结构说明

> Constantine's Tab 项目文件组织结构

## 🗂️ 根目录结构

```
new-tab-app/
├── docs/                       # 📚 文档目录
│   ├── api/                   # API 配置文档
│   ├── screenshots/           # 截图资源
│   ├── INDEX.md              # 文档索引
│   ├── README.md             # 完整文档
│   ├── TODO.md               # 开发清单
│   └── 功能对比分析.md        # 功能对比
├── public/                     # 静态资源
│   ├── manifest.json         # Chrome 扩展配置
│   ├── manifest-firefox.json # Firefox 扩展配置
│   ├── magic-book.svg        # 网站图标
│   └── CNAME                 # 自定义域名
├── src/                        # 源代码
│   ├── components/           # React 组件
│   ├── hooks/                # 自定义 Hooks
│   ├── lib/                  # 工具库
│   ├── stores/               # 状态管理
│   ├── types/                # TypeScript 类型
│   ├── App.tsx               # 主应用
│   ├── main.tsx              # 入口文件
│   └── index.css             # 全局样式
├── .github/                    # GitHub 配置
│   └── workflows/            # CI/CD 工作流
├── dist/                       # 构建输出（自动生成）
├── node_modules/               # 依赖包（自动生成）
├── README.md                   # 项目首页
├── package.json                # 项目配置
├── tsconfig.json               # TypeScript 配置
├── vite.config.ts              # Vite 配置
├── eslint.config.js            # ESLint 配置
└── .gitignore                  # Git 忽略配置
```

## 📚 文档目录 (docs/)

```
docs/
├── api/                        # API 配置文档
│   ├── WEATHER_API.md         # 和风天气 API 配置
│   └── CLOUD_SYNC.md          # Supabase 云同步配置
├── screenshots/                # 截图资源
│   ├── CLOUD_SYNC/            # 云同步相关截图
│   ├── TODO/                  # 开发进度截图
│   └── 功能对比分析/           # 功能对比截图
├── INDEX.md                    # 📍 文档索引（快速导航）
├── README.md                   # 完整项目文档
├── TODO.md                     # 功能开发清单
├── 功能对比分析.md              # 与其他项目对比
└── PROJECT_STRUCTURE.md        # 📍 当前文件 - 项目结构说明
```

## 💻 源代码目录 (src/)

```
src/
├── components/                 # React 组件
│   ├── Settings/              # 设置面板组件
│   │   ├── SettingsModal.tsx
│   │   ├── SettingsSidebar.tsx
│   │   ├── AppearanceSettings.tsx
│   │   ├── BookmarkSettings.tsx
│   │   ├── WallpaperSettings.tsx
│   │   ├── WidgetsSettings.tsx
│   │   ├── FeaturesSettings.tsx
│   │   ├── TimeSettings.tsx
│   │   ├── CustomCssSettings.tsx
│   │   ├── DataSettings.tsx
│   │   ├── SyncSettings.tsx
│   │   └── AboutSettings.tsx
│   ├── Widgets/               # 小组件
│   │   ├── Weather.tsx
│   │   ├── Pomodoro.tsx
│   │   ├── TodoList.tsx
│   │   ├── DailyQuote.tsx
│   │   ├── Countdown.tsx
│   │   ├── Notes.tsx
│   │   └── Calendar.tsx
│   ├── Background.tsx         # 背景壁纸
│   ├── BookmarkGrid.tsx       # 书签网格
│   ├── Clock.tsx              # 时钟
│   ├── CustomCss.tsx          # 自定义 CSS
│   ├── EditableWidget.tsx     # 可编辑组件包装器
│   ├── EditModeButton.tsx     # 编辑模式按钮
│   ├── ResizableWrapper.tsx   # 可调整大小包装器
│   ├── SearchBox.tsx          # 搜索框
│   ├── SettingsButton.tsx     # 设置按钮
│   └── index.ts               # 组件导出
├── hooks/                      # 自定义 Hooks
│   ├── useTime.ts             # 时间 Hook
│   └── useLocalStorage.ts     # 本地存储 Hook
├── lib/                        # 工具库
│   ├── supabase.ts            # Supabase 客户端
│   ├── weather.ts             # 和风天气 API
│   ├── wallhaven.ts           # Wallhaven API
│   └── quotes.ts              # 名言库
├── stores/                     # Zustand 状态管理
│   └── useAppStore.ts         # 全局状态
├── types/                      # TypeScript 类型定义
│   └── index.ts               # 类型导出
├── App.tsx                     # 主应用组件
├── main.tsx                    # 应用入口
└── index.css                   # 全局样式（Tailwind）
```

## 🔧 配置文件说明

| 文件                 | 说明                    |
| -------------------- | ----------------------- |
| `package.json`       | 项目依赖和脚本配置      |
| `tsconfig.json`      | TypeScript 编译配置     |
| `tsconfig.app.json`  | 应用 TypeScript 配置    |
| `tsconfig.node.json` | Node.js TypeScript 配置 |
| `vite.config.ts`     | Vite 构建工具配置       |
| `eslint.config.js`   | ESLint 代码检查配置     |
| `.gitignore`         | Git 忽略文件配置        |
| `index.html`         | HTML 入口文件           |

## 📦 构建输出 (dist/)

构建后生成的文件，可直接作为浏览器扩展使用：

```
dist/
├── assets/                     # 打包后的 JS/CSS
│   ├── index-[hash].js
│   └── index-[hash].css
├── manifest.json               # Chrome 扩展配置
├── manifest-firefox.json       # Firefox 扩展配置
├── magic-book.svg              # 图标
├── index.html                  # 入口页面
└── CNAME                       # GitHub Pages 域名
```

## 🎯 关键文件位置

### 需要配置的文件

- **和风天气 API Key**: `src/lib/weather.ts` (第 4 行)
- **Supabase 配置**: `src/lib/supabase.ts`
- **Wallhaven API Key**: `src/lib/wallhaven.ts`
- **Google OAuth**: `src/lib/supabase.ts`

### 样式相关

- **全局样式**: `src/index.css`
- **Tailwind 配置**: 内联在 `src/index.css`
- **自定义 CSS**: 用户在设置面板中输入

### 数据存储

- **本地存储**: 浏览器 localStorage
- **云端存储**: Supabase PostgreSQL
- **状态管理**: Zustand (`src/stores/useAppStore.ts`)

## 📝 文档维护规范

### 添加新功能时

1. 更新 `docs/TODO.md` - 标记功能完成状态
2. 更新 `docs/README.md` - 添加功能说明
3. 如需配置，在 `docs/api/` 添加配置文档
4. 添加截图到 `docs/screenshots/` 对应目录

### 文档命名规范

- **英文文档**: 大写字母开头，下划线分隔 (e.g., `WEATHER_API.md`)
- **中文文档**: 直接使用中文 (e.g., `功能对比分析.md`)
- **截图文件**: 时间戳命名 (e.g., `1767165569758.png`)

### 截图目录规范

```
docs/screenshots/
├── CLOUD_SYNC/         # 云同步功能截图
├── TODO/               # 开发进度相关截图
├── 功能对比分析/        # 功能对比相关截图
└── [新功能]/           # 新功能截图（按功能分类）
```

## 🔍 快速查找

| 我想找...     | 位置                                 |
| ------------- | ------------------------------------ |
| 项目说明      | `README.md`                          |
| 完整文档      | `docs/README.md`                     |
| 开发清单      | `docs/TODO.md`                       |
| 功能对比      | `docs/功能对比分析.md`               |
| 天气 API 配置 | `docs/api/WEATHER_API.md`            |
| 云同步配置    | `docs/api/CLOUD_SYNC.md`             |
| 时钟组件      | `src/components/Clock.tsx`           |
| 搜索框组件    | `src/components/SearchBox.tsx`       |
| 书签组件      | `src/components/BookmarkGrid.tsx`    |
| 天气组件      | `src/components/Widgets/Weather.tsx` |
| 全局状态      | `src/stores/useAppStore.ts`          |
| 类型定义      | `src/types/index.ts`                 |

---

**返回**: [文档索引](INDEX.md) | [项目首页](../README.md)

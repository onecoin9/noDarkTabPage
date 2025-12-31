# 📚 文档索引

> Constantine's Tab 项目文档导航

## 📖 主要文档

### 项目概览

- [README.md](README.md) - 项目完整文档
- [TODO.md](TODO.md) - 功能开发清单和进度
- [功能对比分析.md](功能对比分析.md) - 与其他项目的功能对比
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - 项目结构说明

### API 配置

- [天气 API 配置](api/WEATHER_API.md) - 和风天气 API 设置指南
- [云同步配置](api/CLOUD_SYNC.md) - Supabase 云端同步设置

### 资源文件

- [截图目录](screenshots/) - 项目截图和演示图片
  - `screenshots/CLOUD_SYNC/` - 云同步相关截图
  - `screenshots/TODO/` - 功能开发相关截图
  - `screenshots/功能对比分析/` - 功能对比相关截图

## 🗂️ 文档结构

```
docs/
├── INDEX.md                    # 📍 当前文件 - 文档索引
├── README.md                   # 项目完整文档
├── TODO.md                     # 功能开发清单
├── 功能对比分析.md              # 功能对比分析
├── PROJECT_STRUCTURE.md        # 项目结构说明
├── api/                        # API 配置文档
│   ├── WEATHER_API.md         # 天气 API
│   └── CLOUD_SYNC.md          # 云同步
└── screenshots/                # 截图目录
    ├── CLOUD_SYNC/            # 云同步截图
    ├── TODO/                  # 开发截图
    └── 功能对比分析/           # 对比截图
```

## 🔍 快速查找

### 我想了解...

- **项目功能** → [README.md](README.md)
- **项目结构** → [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- **开发进度** → [TODO.md](TODO.md)
- **与其他项目对比** → [功能对比分析.md](功能对比分析.md)
- **配置天气功能** → [天气 API 配置](api/WEATHER_API.md)
- **配置云同步** → [云同步配置](api/CLOUD_SYNC.md)
- **查看截图** → [screenshots/](screenshots/)

### 我想配置...

- **和风天气 API** → [api/WEATHER_API.md](api/WEATHER_API.md)
- **Supabase 云同步** → [api/CLOUD_SYNC.md](api/CLOUD_SYNC.md)
- **Wallhaven 壁纸** → 已配置在 `src/lib/wallhaven.ts`
- **Google OAuth** → 已配置在 `src/lib/supabase.ts`

### 我想开发...

- **查看待办功能** → [TODO.md](TODO.md)
- **了解技术栈** → [README.md](README.md)
- **参考其他项目** → [功能对比分析.md](功能对比分析.md)

## 📝 文档更新日志

- **2025-12-31**: 重组文档结构，创建 docs 目录
- **2025-12-31**: 添加天气 API 配置文档
- **2025-12-31**: 更新功能对比分析（添加 TabMark）
- **2025-12-31**: 更新 TODO 清单（时钟自定义功能完成）

---

**返回**: [项目首页](../README.md) | [完整文档](README.md)

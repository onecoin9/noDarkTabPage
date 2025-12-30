# 云端同步方案

## 推荐方案：Supabase

**Supabase** 是一个开源的 Firebase 替代品，提供：

- 免费的 PostgreSQL 数据库
- 用户认证（邮箱、Google、GitHub 登录）
- 实时数据同步
- 免费额度足够个人使用

### 为什么选择 Supabase？

| 特性       | Supabase        | Firebase  | 自建服务器 |
| ---------- | --------------- | --------- | ---------- |
| 免费额度   | ✅ 500MB 数据库 | ✅ 有限   | ❌ 需付费  |
| 开源       | ✅              | ❌        | -          |
| 学习成本   | 低              | 低        | 高         |
| 数据所有权 | ✅ 可导出       | ❌        | ✅         |
| 中国访问   | ⚠️ 需代理       | ⚠️ 需代理 | ✅         |

---

## 实现步骤

### 1. 创建 Supabase 项目

1. 访问 https://supabase.com/
2. 注册账号（可用 GitHub 登录）
3. 创建新项目
4. 记录 `Project URL` 和 `anon key`

### 2. 创建数据库表

在 Supabase SQL Editor 运行：

```sql
-- 用户配置表
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  bookmarks JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  todos JSONB DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 启用 RLS（行级安全）
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己的数据
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);
```

### 3. 安装依赖

```bash
npm install @supabase/supabase-js
```

### 4. 配置 Supabase 客户端

创建 `src/lib/supabase.ts`：

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 5. 实现同步功能

```typescript
// 保存到云端
async function saveToCloud(userId: string, data: any) {
  const { error } = await supabase.from("user_settings").upsert({
    user_id: userId,
    bookmarks: data.bookmarks,
    settings: data.settings,
    todos: data.todos,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

// 从云端加载
async function loadFromCloud(userId: string) {
  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data;
}
```

---

## 其他方案

### 方案 B：GitHub Gist

使用 GitHub Gist 存储配置文件：

- 优点：免费、无需额外服务
- 缺点：需要 GitHub 账号、API 限制

### 方案 C：WebDAV

使用坚果云等支持 WebDAV 的网盘：

- 优点：数据完全自己控制
- 缺点：配置复杂

### 方案 D：本地文件同步

使用 OneDrive/Google Drive 同步配置文件：

- 优点：简单、免费
- 缺点：需要手动导入导出

---

## 下一步

如果你想实现云端同步，请告诉我：

1. **你有 Supabase 账号吗？** 如果没有，我可以指导你注册
2. **你想支持哪些登录方式？** 邮箱/Google/GitHub
3. **是否需要实时同步？** 还是手动同步即可

我会根据你的选择帮你实现完整的云端同步功能。

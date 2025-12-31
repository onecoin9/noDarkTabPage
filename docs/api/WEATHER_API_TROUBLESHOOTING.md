# 天气 API 故障排查

> 和风天气 API 常见问题及解决方案

## ✅ 已解决的问题

### 问题：获取天气失败

**原因**: 城市搜索 API 使用了错误的域名

**错误配置**:

```typescript
const QWEATHER_API = "https://devapi.qweather.com";
// 城市搜索也使用这个域名 ❌
```

**正确配置**:

```typescript
const QWEATHER_API = "https://devapi.qweather.com"; // 天气数据
const QWEATHER_GEO_API = "https://geoapi.qweather.com"; // 城市搜索 ✅
```

### 和风天气 API 域名说明

| API 类型 | 免费版域名            | 付费版域名            | 用途                 |
| -------- | --------------------- | --------------------- | -------------------- |
| 城市搜索 | `geoapi.qweather.com` | `geoapi.qweather.com` | 查询城市 ID、IP 定位 |
| 天气数据 | `devapi.qweather.com` | `api.qweather.com`    | 实时天气、预报等     |

## 🔧 API 端点

### 1. 城市搜索 API

**端点**: `https://geoapi.qweather.com/v2/city/lookup`

**参数**:

- `location`: 城市名称、经纬度或 `auto_ip`
- `key`: API Key
- `lang`: 语言（zh/en）

**示例**:

```bash
# 搜索城市
https://geoapi.qweather.com/v2/city/lookup?location=北京&key=YOUR_KEY&lang=zh

# IP 定位
https://geoapi.qweather.com/v2/city/lookup?location=auto_ip&key=YOUR_KEY&lang=zh

# 经纬度定位
https://geoapi.qweather.com/v2/city/lookup?location=116.41,39.92&key=YOUR_KEY&lang=zh
```

### 2. 实时天气 API

**端点**: `https://devapi.qweather.com/v7/weather/now`

**参数**:

- `location`: 城市 ID（从城市搜索 API 获取）
- `key`: API Key
- `lang`: 语言（zh/en）

**示例**:

```bash
https://devapi.qweather.com/v7/weather/now?location=101010100&key=YOUR_KEY&lang=zh
```

## 🐛 调试方法

### 1. 检查浏览器控制台

打开浏览器开发者工具（F12），查看 Console 标签页的日志：

```javascript
// 正常情况下会看到：
开始获取天气，城市: 北京
城市查询响应: {code: "200", location: [...]}
城市ID: 101010100
天气查询响应: {code: "200", now: {...}}

// 如果失败会看到：
城市查询失败，返回码: 401  // API Key 错误
城市查询失败，返回码: 404  // 城市未找到
天气查询失败，返回码: 403  // 权限不足
```

### 2. 检查网络请求

在开发者工具的 Network 标签页查看：

1. 找到 `geoapi.qweather.com` 的请求
2. 检查状态码是否为 200
3. 查看响应内容中的 `code` 字段

### 3. 测试 API Key

使用 curl 或浏览器直接访问：

```bash
# Windows PowerShell
curl "https://geoapi.qweather.com/v2/city/lookup?location=北京&key=YOUR_KEY&lang=zh"

# 或在浏览器中直接访问
https://geoapi.qweather.com/v2/city/lookup?location=北京&key=YOUR_KEY&lang=zh
```

## 📋 返回码说明

| 返回码 | 说明             | 解决方案               |
| ------ | ---------------- | ---------------------- |
| 200    | 成功             | -                      |
| 204    | 无数据           | 检查城市名称是否正确   |
| 400    | 请求错误         | 检查参数格式           |
| 401    | 认证失败         | 检查 API Key 是否正确  |
| 402    | 超过访问次数     | 等待配额重置或升级套餐 |
| 403    | 无访问权限       | 检查 API 权限设置      |
| 404    | 查询的数据不存在 | 检查城市 ID 或名称     |
| 429    | 超过限流阈值     | 降低请求频率           |
| 500    | 服务器错误       | 稍后重试               |

## ✅ 验证配置

### 1. 检查 API Key

打开 `src/lib/weather.ts`，确认：

```typescript
const QWEATHER_KEY = "你的API_Key"; // ✅ 已配置
const QWEATHER_API = "https://devapi.qweather.com"; // ✅ 天气数据
const QWEATHER_GEO_API = "https://geoapi.qweather.com"; // ✅ 城市搜索
```

### 2. 重新构建

修改配置后需要重新构建：

```bash
npm run build
```

### 3. 清除缓存

如果问题仍然存在：

1. 清除浏览器缓存
2. 硬刷新页面（Ctrl+Shift+R）
3. 重新加载扩展

## 🔗 相关文档

- [和风天气开发文档](https://dev.qweather.com/docs/)
- [城市搜索 API](https://dev.qweather.com/docs/api/geoapi/)
- [实时天气 API](https://dev.qweather.com/docs/api/weather/weather-now/)
- [返回码说明](https://dev.qweather.com/docs/resource/status-code/)

## 💡 常见问题

### Q: 为什么 IP 定位不准确？

A: IP 定位基于网络服务商的 IP 地址库，可能不够精确。建议：

1. 在设置中手动输入城市名称
2. 使用浏览器地理位置 API（需要用户授权）

### Q: 免费版有什么限制？

A: 和风天气免费版限制：

- 每天 1000 次调用
- 只能访问基础数据
- 使用 `devapi.qweather.com` 域名

### Q: 如何升级到付费版？

A:

1. 访问 [和风天气控制台](https://console.qweather.com/)
2. 升级订阅套餐
3. 修改代码中的域名为 `api.qweather.com`

---

**返回**: [天气 API 配置](WEATHER_API.md) | [文档索引](../INDEX.md)

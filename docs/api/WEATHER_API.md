# 和风天气 API 配置说明

## 获取 API Key

1. 访问 [和风天气开发平台](https://dev.qweather.com/)
2. 注册账号并登录
3. 进入控制台 → 应用管理 → 创建应用
4. 选择「Web API」类型
5. 免费订阅即可获得每天 1000 次调用额度

## 配置步骤

1. 打开 `src/lib/weather.ts` 文件
2. 找到第 4 行：
   ```typescript
   const QWEATHER_KEY = "your_qweather_key_here";
   ```
3. 将 `your_qweather_key_here` 替换为你的 API Key：
   ```typescript
   const QWEATHER_KEY = "你的API_Key";
   ```
4. 保存文件并重新构建项目

## API 说明

- **免费版额度**：1000 次/天
- **数据更新频率**：本项目设置为 30 分钟自动刷新一次
- **支持功能**：
  - ✅ 实时天气
  - ✅ IP 自动定位
  - ✅ 城市搜索
  - ✅ 体感温度
  - ✅ 湿度、风力等详细信息

## 注意事项

- 免费版使用 `devapi.qweather.com` 域名
- 付费版使用 `api.qweather.com` 域名
- 请勿将 API Key 提交到公开仓库
- 建议使用环境变量管理 API Key

## 环境变量配置（推荐）

如果你想使用环境变量：

1. 创建 `.env` 文件：

   ```
   VITE_QWEATHER_KEY=你的API_Key
   ```

2. 修改 `src/lib/weather.ts`：

   ```typescript
   const QWEATHER_KEY =
     import.meta.env.VITE_QWEATHER_KEY || "your_qweather_key_here";
   ```

3. 将 `.env` 添加到 `.gitignore`

## 相关链接

- [和风天气开发文档](https://dev.qweather.com/docs/)
- [API 使用指南](https://dev.qweather.com/docs/api/)
- [城市搜索 API](https://dev.qweather.com/docs/api/geoapi/)
- [实时天气 API](https://dev.qweather.com/docs/api/weather/weather-now/)

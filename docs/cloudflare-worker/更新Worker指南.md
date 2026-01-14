# 更新 Cloudflare Worker 指南

## 问题描述

当前的 Cloudflare Worker 只能处理 `/chat/completions` 端点，但模型列表获取需要 `/models` 端点。

## 解决方案

更新 Worker 以支持两个端点：
1. **`/chat/completions`** - 用于生成内容
2. **`/models`** - 用于获取模型列表

## 更新步骤

### 1. 修改 Worker 代码

打开你的 Cloudflare Worker，将代码替换为 `worker_updated.js` 中的内容：

```javascript
// worker_updated.js - 完整代码见文件
```

### 2. 重新部署

```bash
# 如果使用 wrangler CLI
wrangler deploy

# 或者在 Cloudflare Dashboard 中手动更新
```

### 3. 获取新的 Worker URL

部署后，你会得到一个类似这样的 URL：
```
https://your-worker.your-subdomain.workers.dev
```

### 4. 在 Mark2Web 中配置

1. 打开 Mark2Web 应用
2. 进入 Settings → Providers
3. 找到 Xiaomi Mimo
4. 填入你的 Worker URL 到 **Proxy URL** 字段：
   ```
   https://your-worker.your-subdomain.workers.dev
   ```

## 测试更新

### 测试模型获取
1. 在 Settings 中点击 Xiaomi Mimo 的 "Fetch Models" 按钮
2. 应该显示 `mimo-v2-flash`

### 测试生成
1. 上传一个 Markdown 文件
2. 选择 Xiaomi Mimo 作为提供者
3. 点击生成
4. 应该能正常生成网页

## 故障排除

### 仍然看到 CORS 错误？
- 确保 Worker URL 填写正确（末尾不要有斜杠）
- 检查 Worker 是否部署成功
- 查看 Worker 的日志

### 模型列表为空？
- 检查 API Key 是否正确
- 查看 Worker 日志中的错误信息
- 确保 Worker 有访问 `api.xiaomimimo.com` 的权限

### 生成失败？
- 确认 Worker 支持流式响应
- 检查 API Key 是否有效
- 查看浏览器控制台和 Worker 日志

## 新旧 Worker 对比

| 功能 | 旧 Worker | 新 Worker |
|------|-----------|-----------|
| Chat Completions | ✅ | ✅ |
| Model Fetching | ❌ | ✅ |
| Streaming | ✅ | ✅ |
| Error Handling | 基础 | 增强 |

## 下一步

更新完成后，Mark2Web 应该能够：
- ✅ 显示真实的 Xiaomi Mimo 模型列表
- ✅ 使用代理 URL 进行内容生成
- ✅ 避免 CORS 错误

如果还有问题，请提供：
1. Worker 日志
2. 浏览器控制台截图
3. Mark2Web 中的配置截图

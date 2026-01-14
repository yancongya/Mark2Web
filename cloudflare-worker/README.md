# Cloudflare Worker 部署说明

## 文件说明

- `worker.js` - 完整的Cloudflare Worker源码（推荐使用）
- `wrangler.toml` - Wrangler CLI配置文件

## 快速部署

### 方式1：使用Wrangler CLI（推荐）

```bash
# 1. 安装Wrangler
npm install -g wrangler

# 2. 登录Cloudflare
wrangler login

# 3. 部署Worker
cd cloudflare-worker
wrangler deploy
```

### 方式2：使用Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 Workers & Pages
3. 创建新Worker
4. 复制 `worker.js` 内容到编辑器
5. 点击 "Save and Deploy"

## 配置

部署完成后，将得到的Worker URL（如 `https://your-worker.your-subdomain.workers.dev`）填入Mark2Web的设置中：

1. 打开Mark2Web
2. 进入设置（Settings）
3. 找到 "Xiaomi Mimo Proxy URL" 字段
4. 填入你的Worker URL

## Worker功能

- ✅ 支持GET `/models` - 获取模型列表
- ✅ 支持POST `/chat/completions` - 流式生成内容
- ✅ 自动处理Xiaomi Mimo API的CORS问题
- ✅ 支持OpenAI兼容格式

## 注意事项

- 确保在Cloudflare Dashboard中配置好Xiaomi Mimo API密钥
- Worker会自动转发所有请求到Xiaomi Mimo API
- 无需额外服务器，纯前端即可使用
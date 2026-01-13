# 小米 Mimo API 代理 - Cloudflare Worker

这个 Cloudflare Worker 用于解决小米 Mimo API 的 CORS 限制问题，让你的 Mark2Web 应用可以在浏览器中直接访问小米 Mimo API。

## 🚀 **快速部署（3分钟）**

### **方法 1: 通过 Cloudflare Dashboard（最简单）**

1. **登录 Cloudflare**
   - 访问 https://dash.cloudflare.com
   - 登录你的账号（没有就注册一个，免费）

2. **创建 Worker**
   - 左侧菜单 → **Workers & Pages**
   - 点击 **Create Application** → **Create Worker**
   - 输入名称：`xiaomimimo-proxy`
   - 点击 **Deploy**

3. **粘贴代码**
   - 点击 **Edit Code**
   - 删除默认代码
   - 复制 `worker.js` 的全部内容
   - 点击 **Save and Deploy**

4. **获取 URL**
   - 部署后你会得到一个 URL，例如：
   - `https://xiaomimimo-proxy.your-subdomain.workers.dev`
   - **复制这个 URL！**

---

### **方法 2: 使用 Wrangler CLI（推荐开发者）**

```bash
# 1. 安装 Wrangler
npm install -g wrangler

# 2. 登录 Cloudflare
wrangler login

# 3. 进入 worker 目录
cd cloudflare-worker

# 4. 部署
wrangler deploy

# 5. 获取 URL（会自动显示）
```

---

## 📋 **配置 Mark2Web**

部署成功后，在 Mark2Web 中配置：

### **设置 → 模型服务商 → 小米 Mimo**

| 字段 | 填写内容 | 示例 |
|------|----------|------|
| **Provider ID** | `xiaomi-mimo` | - |
| **Type** | `openai` | - |
| **Label** | `小米 Mimo` | - |
| **Base URL** | `https://api.xiaomimimo.com` | - |
| **Proxy URL** | **你的 Worker URL** | `https://xiaomimimo-proxy.workers.dev` |
| **API Key** | 你的小米 Mimo API Key | `sk-xxx...` |
| **Model ID** | `mimo-v2-flash` | `mimo-v2-flash` |

---

## 🔍 **测试 Worker**

### **方法 1: 使用浏览器**

访问你的 Worker URL：
```
https://xiaomimimo-proxy.workers.dev
```
应该返回错误信息（因为没有 POST 数据），这说明 Worker 正在运行！

### **方法 2: 使用 curl**

```bash
curl -X POST https://xiaomimimo-proxy.workers.dev \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mimo-v2-flash",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

### **方法 3: 使用 Wrangler 日志**

```bash
# 查看实时日志
wrangler tail

# 在另一个终端测试
wrangler deploy
```

---

## 🔧 **高级配置**

### **绑定自定义域名**

1. 在 Cloudflare Dashboard → **Workers & Pages**
2. 选择你的 Worker → **Triggers** 标签
3. 点击 **Add Custom Domain**
4. 输入域名：`proxy.yourdomain.com`
5. 点击 **Add Domain**

现在你可以使用：
```
https://proxy.yourdomain.com
```

### **添加密钥（可选）**

如果你想保护你的 Worker：

```bash
# 添加环境变量
wrangler secret put API_KEY
```

然后在代码中使用：
```javascript
const API_KEY = API_KEY; // 自动注入
```

---

## 📊 **监控和分析**

### **查看使用统计**
- Cloudflare Dashboard → **Workers & Pages** → 你的 Worker
- 查看：请求数、带宽、错误率

### **查看错误日志**
```bash
wrangler tail --format=pretty
```

---

## 💰 **费用**

Cloudflare Workers **免费额度**：
- **100,000 请求/天**
- **10 GB 带宽/月**

对于个人使用完全足够！

---

## 🛠️ **故障排除**

### **问题 1: "Method not allowed"**
- ✅ 确保使用 POST 请求
- ✅ 检查 URL 是否正确

### **问题 2: "Missing Authorization header"**
- ✅ 在 Mark2Web 中填写正确的 API Key
- ✅ 确保请求头包含 `Authorization: Bearer xxx`

### **问题 3: "CORS error"**
- ✅ Worker 代码已包含 CORS 头
- ✅ 检查 Worker 是否正常部署

### **问题 4: "Worker not found"**
- ✅ 检查 Worker URL 是否正确
- ✅ 确保 Worker 已部署（不是保存但未部署）

---

## 📞 **获取帮助**

如果遇到问题：

1. **检查 Worker 日志**：
   ```bash
   wrangler tail
   ```

2. **测试 Worker 响应**：
   ```bash
   curl -X POST https://your-worker.workers.dev \
     -H "Authorization: Bearer test" \
     -d '{"model":"test","messages":[]}'
   ```

3. **查看 Cloudflare 状态**：https://www.cloudflarestatus.com/

---

## 🎉 **部署成功后**

你的 Mark2Web 应用现在可以：
- ✅ 在浏览器中直接使用小米 Mimo
- ✅ 生成代码、测试连接
- ✅ 享受 Cloudflare 的全球加速

**恭喜！你的纯前端应用现在具备了完整的小米 Mimo 支持！** 🚀

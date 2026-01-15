# Cloudflare + Vercel 快速配置指南

## 快速步骤概览

### 1. 在 Cloudflare 添加域名
- 登录 Cloudflare → Add Site → 输入域名 → 选择免费计划

### 2. 更新域名服务器
- 从 Cloudflare 获取 DNS 服务器地址
- 在域名注册商处更新为 Cloudflare 的 DNS 服务器

### 3. 在 Vercel 添加自定义域名
- 进入项目设置 → Domains → 添加您的域名
- 获取 Vercel 提供的 DNS 记录

### 4. 在 Cloudflare 设置 DNS 记录
- 添加 Vercel 提供的 A 记录和 CNAME 记录
- 确保代理状态为橙色云（启用 Cloudflare 代理）

---

## DNS 记录配置示例

假设您的域名为 `example.com`：

### A 记录（根域名）
```
Type: A
Name: @
Content: [Vercel 提供的 IP 地址]
TTL: Auto
Proxy status: 橙色云 (Proxied)
```

### CNAME 记录（www 子域名）
```
Type: CNAME
Name: www
Content: cname.vercel-dns.com
TTL: Auto
Proxy status: 橙色云 (Proxied)
```

---

## 验证步骤

1. **等待 DNS 传播**（可能需要几小时）
2. **检查 Vercel 仪表板** - 域名应显示为 "Configured"
3. **访问您的域名** - 应该正确加载网站

---

## 常见问题快速解决

### 域名未生效
- 检查 DNS 记录是否正确
- 确认域名服务器已更新
- 等待 DNS 传播完成

### SSL 证书问题
- 在 Cloudflare 中设置 SSL 模式为 "Full (strict)"
- 在 Vercel 中重置 SSL 证书

### 代理问题
- 确保 DNS 记录的代理状态为橙色云
- 检查是否启用了 Cloudflare 的 CDN 功能

---

## 优势一览

✅ **全球 CDN** - 更快的加载速度  
✅ **安全保护** - DDoS 防护和安全增强  
✅ **SSL 证书** - 自动 HTTPS  
✅ **性能优化** - 缓存和压缩  
✅ **分析数据** - 详细的流量统计  

---

## 重要提示

⚠️ DNS 更改可能需要 24-48 小时完全生效  
⚠️ 备份原始 DNS 设置以备回滚  
⚠️ 确保在域名注册商处正确设置 DNS 服务器  
⚠️ 检查 Cloudflare 代理状态是否正确设置
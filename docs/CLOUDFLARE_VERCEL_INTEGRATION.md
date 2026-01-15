# Cloudflare + Vercel 集成指南

本指南将详细介绍如何将您的域名通过 Cloudflare 进行 DNS 管理，并将 Vercel 项目连接到该域名。

## 第一步：在 Cloudflare 上添加您的域名

### 1. 注册并登录 Cloudflare
- 访问 [Cloudflare官网](https://www.cloudflare.com)
- 注册账户并登录

### 2. 添加站点
- 点击 "Add a Site"
- 输入您的域名（例如：example.com）
- 点击 "Add Site"

### 3. 选择计划
- 选择免费计划（Free Plan）
- 点击 "Continue"

## 第二步：更新您的域名注册商处的 DNS 服务器

### 1. 获取 Cloudflare 的 DNS 服务器地址
在 Cloudflare 控制面板中，您会看到类似这样的 DNS 服务器地址：
- `ella.ns.cloudflare.com`
- `joe.ns.cloudflare.com`

### 2. 在域名注册商处更新 DNS 服务器
- 登录到您的域名注册商（如阿里云、GoDaddy、Namecheap 等）
- 找到域名管理或 DNS 设置
- 将原来的 DNS 服务器替换为 Cloudflare 提供的 DNS 服务器
- 保存更改

### 3. 等待 DNS 传播
- DNS 更改可能需要 24-48 小时完全生效
- 您可以在 Cloudflare 控制面板中查看状态

## 第三步：在 Vercel 中添加自定义域名

### 1. 访问 Vercel 仪表板
- 登录到 [Vercel 仪表板](https://vercel.com/dashboard)
- 选择您的 Mark2Web 项目

### 2. 添加自定义域名
- 点击 "Settings" 选项卡
- 找到 "Domains" 部分
- 输入您的自定义域名（例如：example.com）
- 点击 "Add"

### 3. 配置 DNS 记录
Vercel 会提供需要在 Cloudflare 中设置的 DNS 记录：

#### 对于根域名 (example.com)：
- 类型：A
- 名称：@ 或留空
- 内容：Vercel 提供的 IP 地址
- 代理状态：橙色云（启用 Cloudflare 代理）

#### 对于 www 子域名 (www.example.com)：
- 类型：CNAME
- 名称：www
- 内容：cname.vercel-dns.com
- 代理状态：橙色云（启用 Cloudflare 代理）

## 第四步：在 Cloudflare 中设置 DNS 记录

### 1. 登录 Cloudflare 控制面板
- 访问 dash.cloudflare.com
- 选择您的域名

### 2. 进入 DNS 设置
- 点击 "DNS" 选项卡

### 3. 添加 DNS 记录
根据 Vercel 提供的信息添加相应的 DNS 记录：

```
A 记录：
- Name: @
- IPv4 Address: [Vercel 提供的 IP 地址]
- Proxy status: 橙色云 (Proxied)

CNAME 记录：
- Name: www
- Target: cname.vercel-dns.com
- Proxy status: 橙色云 (Proxied)
```

## 第五步：验证配置

### 1. 等待 DNS 生效
- DNS 更改可能需要几小时生效
- 您可以使用在线工具检查 DNS 记录是否已更新

### 2. 在 Vercel 中验证
- 返回 Vercel 项目设置
- 在 Domains 部分查看域名状态
- 应该显示为 "Configured" 或 "Ready"

## 高级配置选项

### SSL/TLS 设置
在 Cloudflare 控制面板中：
- 点击 "SSL/TLS" 选项卡
- 选择 "Full (strict)" 模式
- 这将为您的网站提供端到端加密

### 页面规则（可选）
您可以设置页面规则来优化性能：
- 缓存静态资源
- 重定向 HTTP 到 HTTPS
- 设置特定路径的安全级别

### 安全设置
- 在 "Security" 选项卡中调整安全级别
- 配置防火墙规则
- 启用 DDoS 保护

## 故障排除

### 域名未生效
- 检查 DNS 记录是否正确添加
- 确认 DNS 传播已完成
- 检查域名注册商处的 DNS 服务器是否正确

### SSL 证书问题
- 确认 Cloudflare SSL 模式设置正确
- 在 Vercel 中强制 SSL 重置
- 检查是否启用了 HTTPS 重定向

### 性能问题
- 确认 Cloudflare 代理状态为橙色云
- 检查缓存设置
- 验证地理位置设置

## 优势

通过 Cloudflare + Vercel 集成，您可以获得：
- **全球 CDN**：更快的加载速度
- **DDoS 保护**：增强安全性
- **SSL 证书**：自动 HTTPS
- **缓存优化**：更好的性能
- **分析数据**：详细的流量统计

## 注意事项

- 在 DNS 切换期间可能会有短暂的服务中断
- 确保备份原始 DNS 设置以防需要回滚
- Cloudflare 的橙色云代理会处理 SSL 证书
- 某些 Vercel 功能可能需要特定的 DNS 配置

## 支持

如果遇到问题：
- 检查 Vercel 文档：https://vercel.com/docs
- 查看 Cloudflare 文档：https://developers.cloudflare.com
- 联系技术支持
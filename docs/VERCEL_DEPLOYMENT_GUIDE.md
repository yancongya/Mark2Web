# Vercel 部署指南

本指南将详细介绍如何使用 Vercel CLI 工具将 Mark2Web 项目部署到 Vercel 平台。

## 准备工作

### 1. 注册 Vercel 账户
- 访问 [Vercel官网](https://vercel.com) 并注册账户
- 登录到你的 Vercel 账户

### 2. 安装 Vercel CLI
在终端中运行以下命令安装 Vercel CLI：
```bash
npm i -g vercel
```

### 3. 安装项目依赖
确保你已经安装了项目所需的所有依赖：
```bash
cd F:\插件脚本开发\Mark2Web
npm install
```

## 部署步骤

### 方法一：使用 Vercel CLI 部署

1. **登录到 Vercel**
   ```bash
   vercel login
   ```
   这将在浏览器中打开登录页面，按照提示完成登录。

2. **构建项目**
   ```bash
   npm run build
   ```
   这将使用 Vite 构建生产版本的应用程序。

3. **部署到 Vercel**
   ```bash
   vercel
   ```
   
   首次部署时，CLI 会询问一些配置问题：
   - `Set up and deploy?` → 选择 `Y`
   - `Which scope?` → 选择你的账户
   - `Link to existing project?` → 选择 `N` (如果是首次部署)
   - `What's your project's name?` → 输入项目名称（例如：mark2web）
   - `In which directory is your code located?` → 输入 `.` (表示当前目录)

   对于后续问题，通常可以按 Enter 使用默认值。

4. **配置项目设置**
   部署完成后，你可以在 Vercel 仪表板中进一步配置项目：
   - 环境变量设置
   - 自定义域名
   - Git 集成等

### 方法二：连接 Git 仓库自动部署

1. **将项目推送到 Git 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin [你的GitHub/GitLab仓库地址]
   git push -u origin main
   ```

2. **在 Vercel 仪表板中导入项目**
   - 访问 [Vercel 仪表板](https://vercel.com/dashboard)
   - 点击 "Add New..." → "Project"
   - 选择你的 Git 仓库
   - Vercel 会自动检测到 `vercel.json` 配置并设置构建选项
   - 点击 "Deploy" 开始部署

## 环境变量配置

如果你的 Mark2Web 应用需要环境变量（如 API 密钥），可以通过以下方式设置：

### 在部署时设置
```bash
vercel env add
```

### 在 Vercel 仪表板中设置
1. 进入你的项目页面
2. 点击 "Settings" → "Environment Variables"
3. 添加所需的环境变量

## 自定义域名

如果你想使用自定义域名：

1. 在 Vercel 项目页面点击 "Settings"
2. 找到 "Domains" 部分
3. 添加你的自定义域名
4. 按照提示配置 DNS 记录

## 部署后验证

部署完成后，Vercel 会提供一个部署链接，通常是这样的格式：
`https://[project-name]-[username].vercel.app`

你可以访问此链接来验证部署是否成功。

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 `vercel.json` 中的 `distDir` 设置是否正确
   - 确保 `vite.config.ts` 中的构建配置正确

2. **静态资源无法加载**
   - 检查 `vercel.json` 中的路由配置
   - 确保构建输出目录正确

3. **环境变量未生效**
   - 确保在 Vercel 仪表板中正确设置了环境变量
   - 检查变量名称拼写是否正确

### 检查部署状态
```bash
vercel status
```

## 更新部署

当你对代码进行更改后，可以通过以下方式更新部署：

### 手动重新部署
```bash
vercel --prod
```

### 通过 Git 提交自动部署
如果连接了 Git 仓库，每次提交到主分支都会自动触发重新部署。

## 性能优化

Vercel 会自动优化你的应用：
- 自动压缩资源
- CDN 分发
- 图像优化
- 静态资源缓存

## 支持

如果遇到问题，可以：
- 查看 [Vercel 文档](https://vercel.com/docs)
- 在 Vercel 社区论坛提问
- 检查项目中的 `vercel.json` 配置是否正确
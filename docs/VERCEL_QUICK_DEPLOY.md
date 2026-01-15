# Vercel 快速部署指南

## 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mark2web)

点击上面的按钮即可快速部署到 Vercel。

## 手动部署

### 1. 安装 Vercel CLI
```bash
npm i -g vercel
```

### 2. 登录 Vercel
```bash
vercel login
```

### 3. 构建项目
```bash
npm run build
```

### 4. 部署到 Vercel
```bash
vercel
```

## 配置说明

本项目已包含 `vercel.json` 配置文件，无需额外配置：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 环境变量

如果需要设置环境变量（如 API 密钥），请在 Vercel 仪表板中设置：

1. 进入项目设置
2. 选择 "Environment Variables"
3. 添加所需的变量

## 注意事项

- 确保已安装 Node.js 18+
- 部署前请先在本地测试 `npm run build`
- 首次部署可能需要几分钟时间
- 部署完成后，Vercel 会提供一个唯一的 URL 访问你的应用
# Mark2Web 项目概述

## 项目简介

Mark2Web 是一个由多种 LLM (Gemini 2.0 / GPT-4 / Groq / 自定义模型) 驱动的新一代前端原型开发工具。它旨在消除需求文档与功能代码之间的鸿沟，让用户能够通过简单的 Markdown 文档或文本描述快速生成高质量的前端代码。

## 核心功能

### 主要特性
- **✨ 沉浸式 3D 交互**: 基于 GSAP 和 CSS 3D 打造的现代化界面，具备鼠标跟随视差、滚动动画及毛玻璃质感体验
- **📝 文本转 UI**: 将 Markdown PRD 或零散文本瞬间转化为结构化的网页
- **🎨 多格式导出**: 支持生成原生 HTML (单文件)、React (TSX) 组件或 Vue 3 SFC
- **🧠 智能反向工程**: 上传现有代码文件，AI 可自动分析其布局逻辑生成 PRD 或提取纯文本内容为 Markdown
- **🖌️ AI 可视化微调**: 在预览界面直接点击元素，使用自然语言即时修改样式
- **🔌 全模型兼容**: 支持 Google Gemini、OpenAI、Groq、DeepSeek 等多种模型及自定义端点
- **🔄 多版本管理**: 生成和管理多个代码/输出版本，轻松切换和删除
- **🗑️ 版本控制**: 从下拉菜单中直接删除不需要的版本，带有确认对话框

### 技术栈
- **前端框架**: React 19, TypeScript
- **样式方案**: Tailwind CSS (运行时注入)
- **AI 集成**: Google GenAI SDK, OpenAI Compatible REST
- **编辑器**: React Simple Code Editor & PrismJS
- **动画**: GSAP & Tailwind Animate
- **构建工具**: Vite

## 最新功能更新

### 版本管理增强
我们最近对应用程序进行了重要更新，增加了多版本管理和便捷的版本删除功能：

- **独立的下拉菜单状态**: 顶栏版本选择器、预览选项卡版本选择器和源文件下拉菜单现在使用独立的状态变量，互不干扰
- **固定定位下拉菜单**: 所有下拉菜单使用 `fixed` 定位，不会撑开顶栏或影响UI布局
- **版本删除功能**: 所有下拉菜单都包含删除按钮，允许用户删除不需要的版本
- **改进的骨架动画**: 骨架动画现在只在预览选项卡中生成时显示，生成完成后自动隐藏，允许用户切换查看其他版本
- **增强的用户体验**: 点击外部区域可以关闭任何打开的下拉菜单

## 项目结构

```
Mark2Web/
├── components/          # React组件
├── contexts/           # React Context
├── services/           # 业务逻辑
├── docs/               # 文档
├── cloudflare-worker/  # Worker部署文件
├── App.tsx             # 主应用
├── index.tsx           # 入口
├── types.ts            # 类型定义
├── translations.ts     # 翻译
├── package.json        # 依赖
├── vite.config.ts      # 构建配置
└── README.md           # 项目说明
```

## 使用指南

### 快速开始
1. 克隆项目并安装依赖
2. 配置 AI API Key
3. 启动开发服务器
4. 上传 Markdown 文件或粘贴文本需求
5. 生成并管理多个版本的代码输出

### 多版本管理
- 生成多个版本的代码输出
- 通过顶栏下拉菜单切换不同版本
- 从下拉菜单中删除不需要的版本
- 在代码、预览和源代码标签间访问版本

## 部署选项

### 本地开发
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### Cloudflare Worker 代理
项目包含 Cloudflare Worker 配置，用于代理 AI API 请求，提供更好的访问性能。

## 贡献指南

我们欢迎社区贡献！如果您想为项目做出贡献，请：

1. Fork 仓库
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 许可证

MIT License
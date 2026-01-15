
<div align="center">

# ✨ Mark2Web - AI Page Generator

**Turn Markdown & Ideas into Production-Ready Code Instantly**
**瞬间将 Markdown 与创意转化为生产级前端代码**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&style=flat-square)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&style=flat-square)](https://tailwindcss.com/)
[![Powered by Multiple AI Models](https://img.shields.io/badge/AI-Gemini/OpenAI/Groq-8E75B2?logo=google-bard&style=flat-square)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&style=flat-square)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

[English](#english) | [中文说明](#chinese)

---

</div>

<a id="english"></a>

## 🚀 Introduction

**Mark2Web** is a next-generation frontend prototyping tool powered by LLMs (Gemini 2.0 / GPT-4 / Groq / Custom Models). It bridges the gap between requirement documents and functional code.

Simply upload a Markdown file, text description, or paste a screenshot description, and Mark2Web will generate fully styled, single-file HTML, React (TSX), or Vue components using Tailwind CSS. It also features a **Visual AI Editor** that allows you to click any element in the preview and modify it using natural language.

## ✨ Key Features

*   **✨ Immersive 3D Experience**: A modern UI featuring GSAP-powered animations, mouse-following parallax effects, and glassmorphism aesthetics for a premium feel.
*   **📝 Text to UI**: Convert Markdown PRDs or loose text into structured, beautiful webpages instantly.
*   **🎨 Multi-Format Export**: Generate vanilla **HTML**, **React (TSX)** components, or **Vue 3 SFCs** with Tailwind CSS injection.
*   **🧠 Intelligent Reverse Engineering**: Upload existing code files to extract pure content (Code-to-Markdown) or analyze layout logic (Code-to-PRD).
*   **🖌️ Visual AI Editor**: Click any element in the live preview and instruct AI to "Change color to blue" or "Make padding larger" without touching code.
*   **🔌 Universal LLM Support**: Built-in support for **Google Gemini 2.0**, with full compatibility for **OpenAI**, **Groq**, **DeepSeek**, and **Custom Endpoints** via configurable providers.
*   **🔄 Multi-Version Management**: Generate and manage multiple versions of your code/output with easy switching and deletion capabilities.
*   **🗑️ Version Control**: Delete unwanted versions directly from dropdown menus with confirmation dialogs.
*   **📋 Enhanced Navigation**: Improved dropdown menus with fixed positioning that don't interfere with the UI layout.
*   **🛠️ Global Configuration Hub**: Centralized management for API keys, System Instructions, custom style presets, and advanced model settings.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS (with runtime injection)
- **AI Integration**: Google GenAI SDK (`@google/genai`), OpenAI Compatible REST
- **Editor**: React Simple Code Editor & PrismJS
- **Animation**: GSAP & Tailwind Animate
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- An AI API Key (Google Gemini, OpenAI, Groq, or other compatible service)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/mark2web.git
    cd mark2web
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables (Optional)**
    Create a `.env` file in the root directory:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```
    *Note: You can also enter the API key directly in the app's Settings UI.*

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## 📖 Usage Guide

1.  **Input Source**:
    *   **Forward Mode**: Drag & drop Markdown files or paste text requirements to generate UI.
    *   **Reverse Mode**: Upload existing code (.html/.tsx) to extract content or analyze structure.
2.  **Configure AI**: Open the **Settings Panel** to select:
    *   **Model Provider**: Choose from Google Gemini, OpenAI, Groq, or custom endpoints.
    *   **Format**: React, Vue, or HTML.
    *   **Style Preset**: Minimalist, SaaS Dashboard, Landing Page, etc.
    *   **Creativity**: Adjust temperature for strict structure or creative flair.
3.  **Generate & Stream**: Click "Generate Code" and watch the AI construct your page in real-time.
4.  **Multi-Version Management**:
    *   **Switch Versions**: Use dropdown menus in the header to switch between different generated versions.
    *   **Delete Versions**: Remove unwanted versions with the trash icon in dropdown menus (requires multiple versions).
    *   **View All Tabs**: Access versions from Code, Preview, and Source tabs.
5.  **Interactive Refinement**:
    *   **Visual Edit**: Toggle the editor, select elements, and use natural language prompt to tweak styles.
    *   **Code Edit**: Manually refine the code in the built-in editor with syntax highlighting.
6.  **Export**:
    *   Download the source code file.
    *   Capture a full-page "Long Screenshot".
    *   Export as PDF for documentation.

---

## ☁️ Deployment

### Deploy to Vercel

The easiest way to deploy Mark2Web is to use Vercel, the creators of Next.js and popular hosting platform for React applications.

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mark2web)

**Manual Deployment Steps:**
1. Install the Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Run the build command: `npm run build`
4. Deploy to Vercel: `vercel`

For detailed deployment instructions, see [docs/VERCEL_DEPLOYMENT_GUIDE.md](./docs/VERCEL_DEPLOYMENT_GUIDE.md).

---

<a id="chinese"></a>

## 🚀 项目简介

**Mark2Web** 是一个由多种 LLM (Gemini 2.0 / GPT-4 / Groq / 自定义模型) 驱动的新一代前端原型开发工具。它旨在消除需求文档与功能代码之间的鸿沟。

只需上传 Markdown 文档、文本描述，Mark2Web 就能利用 Tailwind CSS 生成风格精美、结构完整的 HTML、React (TSX) 或 Vue 组件。它还内置了强大的 **AI 可视化编辑器**，支持"所见即所得"的自然语言修改，并具有多版本管理和便捷的版本删除功能。

## ✨ 核心功能

*   **✨ 沉浸式 3D 交互**: 基于 GSAP 和 CSS 3D 打造的现代化落地页，具备鼠标跟随视差、滚动动画及毛玻璃质感体验。
*   **📝 文本转 UI**: 将 Markdown PRD 或零散文本瞬间转化为结构化的网页。
*   **🎨 多格式导出**: 支持生成原生 **HTML** (单文件)、**React (TSX)** 组件或 **Vue 3 SFC**。
*   **🧠 智能反向工程**: 上传现有代码文件，AI 可自动分析其布局逻辑生成 PRD (Code-to-Spec)，或提取纯文本内容为 Markdown。
*   **🖌️ AI 可视化微调**: 在预览界面直接点击元素，使用自然语言（如"把背景改成渐变蓝"）即时修改样式，无需手动改代码。
*   **🔌 全模型兼容**: 原生集成 **Google Gemini 2.0**，同时支持 **OpenAI (GPT-4o)**、**Groq**、**DeepSeek** 等兼容协议模型及自定义端点。
*   **🔄 多版本管理**: 生成和管理多个代码/输出版本，轻松切换和删除。
*   **🗑️ 版本控制**: 从下拉菜单中直接删除不需要的版本，带有确认对话框。
*   **📋 增强导航**: 改进的下拉菜单，固定定位，不影响UI布局。
*   **🛠️ 全局配置中心**: 集中管理 API 密钥、系统级指令 (System Prompt)、自定义设计风格预设及输出约束。

## 🛠️ 技术栈

- **前端框架**: React 19, TypeScript
- **样式方案**: Tailwind CSS (运行时注入)
- **AI 集成**: Google GenAI SDK (`@google/genai`) & OpenAI Compatible REST
- **编辑器**: React Simple Code Editor & PrismJS
- **动画**: GSAP & Tailwind Animate
- **构建工具**: Vite

## 🚀 快速开始

### 环境要求

- Node.js 18+
- AI API Key (Google Gemini, OpenAI, Groq 或其他兼容服务)

### 安装步骤

1.  **克隆项目**
    ```bash
    git clone https://github.com/yourusername/mark2web.git
    cd mark2web
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **配置环境变量 (可选)**
    在根目录创建 `.env` 文件：
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```
    *注意：您也可以直接在应用的"配置管理"界面中输入 API Key。*

4.  **启动开发服务器**
    ```bash
    npm run dev
    ```

## 📖 使用指南

1.  **导入源**:
    *   **正向模式**: 拖拽 Markdown 文档或粘贴文本需求，准备生成 UI。
    *   **反向模式**: 上传现有代码文件 (.html/.tsx) 以提取内容或分析布局。
2.  **参数配置**: 在右侧侧边栏配置：
    *   **模型提供商**: 选择 Google Gemini, OpenAI, Groq 或自定义端点。
    *   **输出格式**: 选择 React, Vue 或 HTML。
    *   **风格预设**: 选择 SaaS 仪表盘、营销页、极简风等。
    *   **创造力**: 调整 Temperature 以控制 AI 的自由度。
3.  **实时生成**: 点击"开始生成"，AI 将实时流式输出完整代码，支持多版本历史回溯。
4.  **多版本管理**:
    *   **切换版本**: 使用标题栏中的下拉菜单在不同生成的版本之间切换。
    *   **删除版本**: 使用下拉菜单中的垃圾箱图标删除不需要的版本（需要多个版本时才显示）。
    *   **查看所有标签**: 从代码、预览和源代码标签访问版本。
5.  **交互式打磨**:
    *   **可视化模式**: 开启 Visual Edit，选中元素让 AI 进行局部样式调整。
    *   **代码模式**: 在内置编辑器中手动修改代码，实时预览。
6.  **多维导出**:
    *   下载源码文件。
    *   生成全网页长截图 (Long Screenshot)。
    *   导出 PDF 文档。

---

## ☁️ 部署

### 部署到 Vercel

部署 Mark2Web 最简单的方法是使用 Vercel，这是 Next.js 的创建者和 React 应用的流行托管平台。

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mark2web)

**手动部署步骤：**
1. 安装 Vercel CLI: `npm i -g vercel`
2. 登录 Vercel: `vercel login`
3. 运行构建命令: `npm run build`
4. 部署到 Vercel: `vercel`

有关详细的部署说明，请参阅 [docs/VERCEL_DEPLOYMENT_GUIDE.md](./docs/VERCEL_DEPLOYMENT_GUIDE.md)。

---

## 🔄 最新更新

### 版本管理增强
我们最近对应用程序进行了重要更新，增加了多版本管理和便捷的版本删除功能：

*   **独立的下拉菜单状态**: 顶栏版本选择器、预览选项卡版本选择器和源文件下拉菜单现在使用独立的状态变量，互不干扰。
*   **固定定位下拉菜单**: 所有下拉菜单使用 `fixed` 定位，不会撑开顶栏或影响UI布局。
*   **版本删除功能**: 所有下拉菜单都包含删除按钮，允许用户删除不需要的版本。
*   **改进的骨架动画**: 骨架动画现在只在预览选项卡中生成时显示，生成完成后自动隐藏，允许用户切换查看其他版本。
*   **增强的用户体验**: 点击外部区域可以关闭任何打开的下拉菜单。

---

<div align="center">

**Mark2Web** © 2024-2026. Built with ❤️ and AI.

</div>

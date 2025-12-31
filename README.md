
<div align="center">

# ✨ MarkWeb - AI Page Generator

**Turn Markdown & Ideas into Production-Ready Code Instantly**  
**瞬间将 Markdown 与创意转化为生产级前端代码**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&style=flat-square)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&style=flat-square)](https://tailwindcss.com/)
[![Powered by Gemini](https://img.shields.io/badge/AI-Google%20Gemini-8E75B2?logo=google-bard&style=flat-square)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&style=flat-square)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

[English](#english) | [中文说明](#chinese)

---

</div>

<a id="english"></a>

## 🚀 Introduction

**MarkWeb** is a next-generation frontend prototyping tool powered by LLMs (Gemini 2.0 / GPT-4). It bridges the gap between requirement documents and functional code. 

Simply upload a Markdown file, text description, or paste a screenshot description, and MarkWeb will generate fully styled, single-file HTML, React (TSX), or Vue components using Tailwind CSS. It also features a **Visual AI Editor** that allows you to click any element in the preview and modify it using natural language.

## ✨ Key Features

*   **📝 Text to UI**: Convert Markdown PRDs or loose text into structured, beautiful webpages.
*   **🎨 Multi-Format Export**: Generate vanilla **HTML**, **React (TSX)** components, or **Vue 3 SFCs**.
*   **🖌️ Visual AI Editor**: Click any element in the live preview and instruct AI to "Change color to blue" or "Make padding larger".
*   **🧠 Reverse Engineering**: Upload existing code to extract content (to Markdown) or analyze layout (to PRD).
*   **📱 Responsive Preview**: Real-time simulation of Mobile, Tablet, Desktop, and Print (A4) viewports.
*   **🔌 Model Agnostic**: Native support for **Google Gemini**, with compatibility for **OpenAI**, **Groq**, and **DeepSeek**.
*   **🛠️ Deep Customization**: Configure "System Instructions", design styles, and refinement levels.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS (with runtime injection)
- **AI Integration**: Google GenAI SDK (`@google/genai`) & OpenAI Compatible REST
- **Editor**: React Simple Code Editor & PrismJS
- **Animation**: GSAP & Tailwind Animate

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API Key (or OpenAI/Groq Key)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/markweb.git
    cd markweb
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

1.  **Select Source**: Upload a `.md` file or paste text requirements.
2.  **Configure**: Open the sidebar settings to choose:
    *   **Format**: HTML, React, or Vue.
    *   **Style**: Minimalist, Corporate, Landing Page, etc.
    *   **Level**: Wireframe vs. High-End visual.
3.  **Generate**: Click "Generate Code".
4.  **Refine**:
    *   Use the **Visual Edit** toggle to click elements and tweak them with AI.
    *   Manually edit code in the built-in editor.
5.  **Export**: Download the file, copy code, or export as PDF/Image.

---

<a id="chinese"></a>

## 🚀 项目简介

**MarkWeb** 是一个由 LLM (Gemini 2.0 / GPT-4) 驱动的新一代前端原型开发工具。它旨在消除需求文档与功能代码之间的鸿沟。

只需上传 Markdown 文档、文本描述，MarkWeb 就能利用 Tailwind CSS 生成风格精美、结构完整的 HTML、React (TSX) 或 Vue 组件。它还内置了强大的 **AI 可视化编辑器**，支持“所见即所得”的自然语言修改。

## ✨ 核心功能

*   **📝 文本转 UI**: 将 Markdown PRD 或零散文本瞬间转化为结构化的网页。
*   **🎨 多格式导出**: 支持生成原生 **HTML** (单文件)、**React (TSX)** 组件或 **Vue 3 SFC**。
*   **🖌️ AI 可视化编辑**: 在预览图中点击任意元素，告诉 AI “把背景改成红色”或“增加圆角”，即刻生效。
*   **🧠 代码反推 (Reverse Engineering)****: 上传现有代码，反向提取纯文本内容 (Markdown) 或分析布局逻辑 (生成 PRD)。
*   **📱 实时响应式预览**: 内置手机、平板、桌面及 A4 打印视图模拟。
*   **🔌 多模型支持**: 原生支持 **Google Gemini**，并兼容 **OpenAI**、**Groq**、**DeepSeek** (支持联网搜索与深度思考)。
*   **🛠️ 深度定制**: 支持自定义 System Prompt、设计风格预设 (Style Presets) 和优化等级。

## 🛠️ 技术栈

- **前端框架**: React 19, TypeScript
- **样式方案**: Tailwind CSS (运行时注入)
- **AI 集成**: Google GenAI SDK (`@google/genai`) & OpenAI Compatible REST
- **编辑器**: React Simple Code Editor & PrismJS
- **动画**: GSAP & Tailwind Animate

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Google Gemini API Key (或 OpenAI/Groq Key)

### 安装步骤

1.  **克隆项目**
    ```bash
    git clone https://github.com/yourusername/markweb.git
    cd markweb
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
    *注意：您也可以直接在应用的“配置管理”界面中输入 API Key。*

4.  **启动开发服务器**
    ```bash
    npm run dev
    ```

## 📖 使用指南

1.  **导入源文件**: 上传 `.md` 文档或直接粘贴文本需求。
2.  **配置生成参数**: 打开右侧侧边栏设置：
    *   **输出格式**: HTML, React 或 Vue。
    *   **设计风格**: 极简风、商务风、营销落地页等。
    *   **优化等级**: 线框图 (Wireframe) 或 高保真 (High-End)。
3.  **生成**: 点击“开始生成”。
4.  **微调**:
    *   开启 **可视化编辑 (Visual Edit)**，点击元素进行 AI 微调。
    *   在左侧代码编辑器中手动修改。
5.  **导出**: 下载源码文件、复制到剪贴板，或导出为 PDF/长截图。

---

<div align="center">

**MarkWeb** © 2024. Built with ❤️ and AI.

</div>

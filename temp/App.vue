<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blender AI Node Analyzer MCP 配置说明</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'system-ui', 'sans-serif'],
                    },
                    animation: {
                        'fade-in-up': 'fadeInUp 0.5s ease-out',
                        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    },
                    keyframes: {
                        fadeInUp: {
                            '0%': { opacity: '0', transform: 'translateY(10px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' },
                        }
                    }
                }
            }
        }
    </script>
    <style>
        .gradient-bg {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
        }
        .tool-card:hover .tool-icon {
            transform: scale(1.05);
            background-color: #3b82f6;
            color: white;
        }
        .step-number {
            width: 2.5rem;
            height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #3b82f6;
            color: #3b82f6;
        }
        .active-tab {
            border-bottom-width: 3px;
            border-bottom-color: #3b82f6;
            color: #1e40af;
            font-weight: 600;
        }
    </style>
</head>
<body class="font-sans bg-slate-50 text-slate-800 leading-relaxed">
    <!-- 导航栏 -->
    <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div class="container mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-xl font-bold text-slate-900">Blender AI Node Analyzer</h1>
                        <p class="text-sm text-slate-500">MCP 配置说明</p>
                    </div>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#overview" class="text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200">概述</a>
                    <a href="#setup" class="text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200">配置步骤</a>
                    <a href="#tools" class="text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200">可用工具</a>
                    <a href="#troubleshooting" class="text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200">故障排除</a>
                </div>
                <button class="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </div>
    </nav>

    <!-- 主内容区 -->
    <main class="container mx-auto px-4 md:px-6 py-12 max-w-6xl">
        <!-- Hero 区域 -->
        <section id="overview" class="mb-16 md:mb-24 animate-fade-in-up">
            <div class="text-center mb-12">
                <span class="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">技术文档</span>
                <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">MCP 配置说明</h1>
                <p class="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                    本文档详细说明如何配置您的 IDE，以使用 Blender AI Node Analyzer 的本地 MCP 服务器，实现 AI 与 Blender 节点编辑器的无缝交互。
                </p>
            </div>

            <!-- 架构图卡片 -->
            <div class="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-xl p-8 border border-slate-200 mb-12">
                <div class="flex items-center mb-6">
                    <div class="p-3 bg-blue-100 rounded-xl mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-slate-900">架构说明</h2>
                </div>
                <div class="bg-slate-900 text-slate-100 rounded-xl p-6 font-mono text-sm overflow-x-auto">
                    <div class="text-blue-300 mb-2"># 通信流程</div>
                    <div class="ml-4 text-green-300">IDE (Claude Desktop / Cursor / 其他)</div>
                    <div class="ml-8 text-slate-400">↓ (MCP 协议 - stdio)</div>
                    <div class="ml-8 text-amber-300">MCP 适配器 (mcp_adapter.py)</div>
                    <div class="ml-12 text-slate-400">↓ (Socket 连接 - 端口 9876)</div>
                    <div class="ml-12 text-purple-300">Blender 插件 (Socket 服务器)</div>
                    <div class="ml-16 text-slate-400">↓</div>
                    <div class="ml-16 text-cyan-300">Blender API</div>
                </div>
            </div>

            <!-- 前置条件卡片 -->
            <div class="grid md:grid-cols-3 gap-6 mb-12">
                <div class="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">Blender 已安装</h3>
                    <p class="text-slate-600">确保 Blender 已安装并启用了 AI Node Analyzer 插件。</p>
                </div>
                <div class="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                    <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">Python 3.8+</h3>
                    <p class="text-slate-600">需要 Python 3.8 或更高版本的环境支持。</p>
                </div>
                <div class="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                    <div class="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">IDE 支持 MCP</h3>
                    <p class="text-slate-600">您的 IDE（如 Claude Desktop、Cursor 等）需支持 MCP 协议。</p>
                </div>
            </div>
        </section>

        <!-- 配置步骤 -->
        <section id="setup" class="mb-16 md:mb-24">
            <div class="flex items-center mb-10">
                <div class="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                <h2 class="text-3xl font-bold text-slate-900 px-6">配置步骤</h2>
                <div class="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            </div>

            <!-- 步骤导航 -->
            <div class="flex flex-wrap justify-center gap-2 mb-12">
                <button class="px-5 py-3 rounded-lg bg-blue-600 text-white font-medium transition-all duration-300 hover:bg-blue-700 active-tab">步骤 1: 启动 Blender</button>
                <button class="px-5 py-3 rounded-lg bg-white text-slate-700 font-medium border border-slate-300 transition-all duration-300 hover:bg-slate-50 hover:border-slate-400">步骤 2: 配置 IDE</button>
                <button class="px-5 py-3 rounded-lg bg-white text-slate-700 font-medium border border-slate-300 transition-all duration-300 hover:bg-slate-50 hover:border-slate-400">步骤 3: 验证连接</button>
            </div>

            <!-- 步骤内容 -->
            <div class="space-y-10">
                <!-- 步骤 1 -->
                <div class="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                    <div class="flex items-start mb-6">
                        <div class="step-number rounded-full font-bold text-lg mr-4 flex-shrink-0">1</div>
                        <div>
                            <h3 class="text-2xl font-bold text-slate-900 mb-2">启动 Blender 并启用插件</h3>
                            <p class="text-slate-600">确保插件服务器正在运行。</p>
                        </div>
                    </div>
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="bg-slate-50 rounded-xl p-5 border border-slate-200">
                            <h4 class="font-semibold text-slate-900 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                启用插件
                            </h4>
                            <ul class="space-y-2 text-slate-700">
                                <li class="flex items-start">
                                    <span class="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>打开 Blender</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>进入 <code class="bg-slate-200 px-1.5 py-0.5 rounded text-sm">Edit → Preferences → Add-ons</code></span>
                                </li>
                                <li class="flex items-start">
                                    <span class="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>启用 <strong>AI Node Analyzer</strong> 插件</span>
                                </li>
                            </ul>
                        </div>
                        <div class="bg-slate-50 rounded-xl p-5 border border-slate-200">
                            <h4 class="font-semibold text-slate-900 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                验证服务器
                            </h4>
                            <ul class="space-y-2 text-slate-700">
                                <li class="flex items-start">
                                    <span class="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>在节点编辑器中，找到 <strong>AI Node Analyzer</strong> 面板</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span>确保 <strong>AI Node MCP</strong> 面板中的服务器状态为 <span class="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">运行在端口 9876</span></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 步骤 2 -->
                <div class="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                    <div class="flex items-start mb-6">
                        <div class="step-number rounded-full font-bold text-lg mr-4 flex-shrink-0">2</div>
                        <div>
                            <h3 class="text-2xl font-bold text-slate-900 mb-2">配置您的 IDE</h3>
                            <p class="text-slate-600">根据您使用的 IDE 添加 MCP 服务器配置。</p>
                        </div>
                    </div>

                    <!-- IDE 选项卡 -->
                    <div class="mb-8">
                        <div class="flex border-b border-slate-200 overflow-x-auto">
                            <button class="px-6 py-3 font-medium text-blue-600 border-b-2 border-blue-600 flex-shrink-0">Claude Desktop</button>
                            <button class="px-6 py-3 font-medium text-slate-600 hover:text-slate-900 flex-shrink-0">Cursor</button>
                            <button class="px-6 py-3 font-medium text-slate-600 hover:text-slate-900 flex-shrink-0">其他 IDE</button>
                        </div>
                        <div class="bg-slate-900 rounded-b-xl rounded-tr-xl p-6 mt-0">
                            <div class="flex items-center justify-between mb-4">
                                <div class="text-slate-300 font-mono text-sm">claude_desktop_config.json</div>
                                <button class="text-slate-400 hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                            <pre class="text-sm text-slate-200 overflow-x-auto"><code>{
  <span class="text-amber-300">"mcpServers"</span>: {
    <span class="text-amber-300">"blender-ai-node-analyzer"</span>: {
      <span class="text-amber-300">"command"</span>: <span class="text-green-400">"python"</span>,
      <span class="text-amber-300">"args"</span>: [
        <span class="text-green-400">"D:\\blender\\Plugin\\addons\\ainode\\mcp_adapter.py"</span>
      ]
    }
  }
}</code></pre>
                            <div class="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-800/50">
                                <div class="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p class="text-blue-200 text-sm"><strong>注意：</strong>请将示例路径 <code class="bg-blue-800/50 px-1.5 py-0.5 rounded">D:\\blender\\Plugin\\addons\\ainode\\mcp_adapter.py</code> 替换为实际的文件路径。Windows 路径请使用双反斜杠 <code>\\</code>。</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-amber-50 border border-amber-200 rounded-xl p-5">
                        <div class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div>
                                <h4 class="font-semibold text-amber-800 mb-1">重要提醒</h4>
                                <p class="text-amber-700 text-sm">保存配置文件后，需要<strong>重启 Claude Desktop</strong> 以使配置生效。对于 Cursor，保存配置后通常会自动加载。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 可用工具 -->
        <section id="tools" class="mb-16 md:mb-24">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-slate-900 mb-4">可用的 MCP 工具</h2>
                <p class="text-lg text-slate-600 max-w-3xl mx-auto">配置成功后，您的 IDE 将能够识别以下 18 个 MCP 工具，涵盖从基础操作到高级分析的完整功能。</p>
            </div>

            <!-- 工具分类导航 -->
            <div class="flex flex-wrap justify-center gap-3 mb-10">
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium transition-all duration-300 hover:bg-blue-700">全部工具 (18)</button>
                <button class="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg font-medium transition-all duration-300 hover:bg-slate-50 hover:border-slate-400">基础操作 (4)</button>
                <button class="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg font-medium transition-all duration-300 hover:bg-slate-50 hover:border-slate-400">节点分析 (5)</button>
                <button class="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg font-medium transition-all duration-300 hover:bg-slate-50 hover:border-slate-400">配置管理 (2)</button>
                <button class="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg font-medium transition-all duration-300 hover:bg-slate-50 hover:border-slate-400">文本注记 (4)</button>
                <button class="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg font-medium transition-all duration-300 hover:bg-slate-50 hover:border-slate-400">过滤与处理 (3)</button>
            </div>

            <!-- 工具网格 -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- 工具卡片示例 1 -->
                <div class="tool-card bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300 group">
                    <div class="flex items-start justify-between mb-4">
                        <div class="tool-icon w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span class="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">基础操作</span>
                    </div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">get_scene_info</h3>
                    <p class="text-slate-600 text-sm mb-4">获取当前 Blender 场景的详细信息，包括对象列表、渲染设置等。</p>
                    <div class="pt-4 border-t border-slate-100">
                        <div class="text-xs text-slate-500 font-medium mb-1">参数</div>
                        <div class="text-sm text-slate-700">无</div>
                    </div>
                </div>

                <!-- 工具卡片示例 2 -->
                <div class="tool-card bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300 group">
                    <div class="flex items-start justify-between mb-4">
                        <div class="tool-icon w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <span class="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full">节点分析</span>
                    </div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">get_selected_nodes_info</h3>
                    <p class="text-slate-600 text-sm mb-4">获取当前在节点编辑器中选中的节点的详细信息，包括类型、设置和连接。</p>
                    <div class="pt-4 border-t border-slate-100">
                        <div class="text-xs text-slate-500 font-medium mb-1">参数</div>
                        <div class="text-sm text-slate-700">无</div>
                    </div>
                </div>

                <!-- 工具卡片示例 3 -->
                <div class="tool-card bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300 group">
                    <div class="flex items-start justify-between mb-4">
                        <div class="tool-icon w-12 h-12 bg-gradient-to-br from-violet-100 to-violet-50 text-violet-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                        <span class="text-xs font-semibold px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full">配置管理</span>
                    </div>
                    <h3 class="text-lg font-semibold text-slate-900 mb-2">get_config_variable</h3>
                    <p class="text-slate-600 text-sm mb-4">读取配置文件中的指定变量，如身份预设、默认问题、系统提示等。</p>
                    <div class="pt-4 border-t border-slate-100">
                        <div class="text-xs text-slate-500 font-medium mb-1">参数</div>
                        <div class="text-sm text-slate-700"><code class="bg-slate-100 px-1.5 py-0.5 rounded">variable_name</code> (string)</div>
                    </div>
                </div>
            </div>

            <div class="text-center mt-10">
                <button class="px-6 py-3 bg-white text-blue-600 font-semibold border border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 inline-flex items-center">
                    查看全部 18 个工具
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
        </section>

        <!-- 故障排除 -->
        <section id="troubleshooting" class="mb-16">
            <div class="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
                <div class="flex items-center mb-8">
                    <div class="p-3 bg-red-500/20 rounded-xl mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 class="text-3xl font-bold">故障排除</h2>
                </div>

                <div class="space-y-6">
                    <!-- 问题 1 -->
                    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center font-bold text-white mr-4">1</div>
                            </div>
                            <div>
                                <h3 class="text-xl font-semibold mb-2">无法连接到 Blender</h3>
                                <p class="text-slate-300 mb-4"><strong>症状：</strong>IDE 提示 "Failed to connect to Blender"</p>
                                <div class="bg-black/30 rounded-lg p-4">
                                    <h4 class="font-medium text-green-400 mb-2">解决方案：</h4>
                                    <ul class="space-y-2 text-slate-300">
                                        <li class="flex items-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>确保 Blender 正在运行</span>
                                        </li>
                                        <li class="flex items-start">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>确保 AI Node Analyzer 插件已启用</span>
                                        </li>
                                        <li class="flex items-start">
                                            <svg xmlns
import React, { useState } from "react";
import { CheckCircle, AlertCircle, Terminal, Cpu, Settings, Code, Filter, FileText, Wrench, Zap, ChevronRight, Copy, ExternalLink, Server, Plug, BookOpen } from "lucide-react";

interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
}

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  code?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const MCPConfigDocumentation: React.FC = () => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const tools: Tool[] = [
    { id: 1, name: "get_scene_info", description: "获取当前 Blender 场景信息", category: "基础操作", icon: <Cpu className="w-5 h-5" /> },
    { id: 2, name: "get_object_info", description: "获取指定对象的详细信息", category: "基础操作", icon: <Cpu className="w-5 h-5" /> },
    { id: 3, name: "get_viewport_screenshot", description: "获取 3D 视口的截图", category: "基础操作", icon: <Cpu className="w-5 h-5" /> },
    { id: 4, name: "execute_code", description: "执行 Blender Python 代码", category: "基础操作", icon: <Code className="w-5 h-5" /> },
    { id: 5, name: "get_selected_nodes_info", description: "获取当前选中节点的详细信息", category: "节点分析", icon: <Filter className="w-5 h-5" /> },
    { id: 6, name: "get_all_nodes_info", description: "获取当前节点树中的所有节点信息", category: "节点分析", icon: <Filter className="w-5 h-5" /> },
    { id: 7, name: "create_analysis_frame", description: "创建分析框架，将选中的节点加入框架", category: "节点分析", icon: <Filter className="w-5 h-5" /> },
    { id: 8, name: "remove_analysis_frame", description: "移除分析框架", category: "节点分析", icon: <Filter className="w-5 h-5" /> },
    { id: 9, name: "get_analysis_frame_nodes", description: "获取分析框架中的节点信息", category: "节点分析", icon: <Filter className="w-5 h-5" /> },
    { id: 10, name: "get_config_variable", description: "读取配置文件中的指定变量", category: "配置管理", icon: <Settings className="w-5 h-5" /> },
    { id: 11, name: "get_all_config_variables", description: "获取所有配置变量", category: "配置管理", icon: <Settings className="w-5 h-5" /> },
    { id: 12, name: "create_text_note", description: "创建文本注记节点", category: "文本注记", icon: <FileText className="w-5 h-5" /> },
    { id: 13, name: "update_text_note", description: "更新当前激活的文本注记节点", category: "文本注记", icon: <FileText className="w-5 h-5" /> },
    { id: 14, name: "get_text_note", description: "获取当前激活的文本注记节点内容", category: "文本注记", icon: <FileText className="w-5 h-5" /> },
    { id: 15, name: "delete_text_note", description: "删除当前激活的文本注记节点", category: "文本注记", icon: <FileText className="w-5 h-5" /> },
    { id: 16, name: "filter_nodes_info", description: "根据精细度过滤节点信息", category: "信息过滤", icon: <Filter className="w-5 h-5" /> },
    { id: 17, name: "get_nodes_info_with_filter", description: "获取节点信息并应用过滤", category: "信息过滤", icon: <Filter className="w-5 h-5" /> },
    { id: 18, name: "clean_markdown_text", description: "清理指定文本的 Markdown 格式", category: "文本处理", icon: <FileText className="w-5 h-5" /> },
  ];

  const steps: Step[] = [
    {
      id: 1,
      title: "启动 Blender 并启用插件",
      description: "打开 Blender，进入 Edit → Preferences → Add-ons，启用 AI Node Analyzer 插件。确保 MCP 面板显示服务器运行在端口 9876。",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      id: 2,
      title: "配置 Claude Desktop",
      description: "打开 Claude Desktop，进入 Settings → Developer，编辑配置文件并添加 MCP 服务器配置。",
      icon: <Terminal className="w-6 h-6" />,
      code: `{
  "mcpServers": {
    "blender-ai-node-analyzer": {
      "command": "python",
      "args": [
        "D:\\\\blender\\\\Plugin\\\\addons\\\\ainode\\\\mcp_adapter.py"
      ]
    }
  }
}`,
    },
    {
      id: 3,
      title: "配置 Cursor",
      description: "打开 Cursor，进入 Settings → MCP Servers，添加新的 MCP 服务器配置。",
      icon: <Terminal className="w-6 h-6" />,
      code: `{
  "name": "blender-ai-node-analyzer",
  "command": "python",
  "args": [
    "D:\\\\blender\\\\Plugin\\\\addons\\\\ainode\\\\mcp_adapter.py"
  ]
}`,
    },
    {
      id: 4,
      title: "验证连接",
      description: "重启 IDE，验证工具列表是否正常加载。尝试调用 get_scene_info 等工具进行测试。",
      icon: <CheckCircle className="w-6 h-6" />,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "无法连接到 Blender",
      answer: "确保 Blender 正在运行，AI Node Analyzer 插件已启用，且 MCP 面板显示'运行在端口 9876'。尝试重启 Blender 插件。",
    },
    {
      question: "工具列表为空",
      answer: "检查 mcp_adapter.py 文件路径是否正确，确保 Python 环境正确，查看适配器日志（stderr 输出）。",
    },
    {
      question: "工具调用失败",
      answer: "确保在正确的上下文中（节点编辑器），检查参数是否正确，查看 Blender 控制台的错误信息。",
    },
    {
      question: "Python 路径问题",
      answer: "使用完整的 Python 可执行文件路径，例如：'C:\\\\Python311\\\\python.exe'。",
    },
  ];

  const copyToClipboard = (text: string, stepId: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepId);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white text-slate-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Server className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  MCP 配置说明
                </h1>
                <p className="text-sm text-slate-500">Blender AI Node Analyzer 本地 MCP 服务器</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#architecture" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">架构</a>
              <a href="#prerequisites" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">前置条件</a>
              <a href="#steps" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">配置步骤</a>
              <a href="#tools" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">工具列表</a>
              <a href="#troubleshooting" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">故障排除</a>
            </nav>
            <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              开始配置
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Plug className="w-4 h-4" />
              MCP 协议集成指南
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              连接 <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">Blender</span> 与您的 IDE
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              本文档详细说明如何配置 IDE 使用 Blender AI Node Analyzer 的本地 MCP 服务器，实现无缝的 AI 辅助节点分析工作流。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3 group">
                快速开始
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-3.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-300 hover:border-blue-400 hover:shadow-lg transition-all duration-300 flex items-center gap-3">
                <ExternalLink className="w-5 h-5" />
                查看架构图
              </button>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section id="architecture" className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
              <Server className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold">架构说明</h2>
          </div>
          <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-6 flex-1">
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <Terminal className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-lg">IDE</h3>
                    <p className="text-slate-600">Claude Desktop / Cursor / 其他</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ChevronRight className="w-6 h-6 text-slate-400 rotate-90 md:rotate-0" />
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <Code className="w-8 h-8 text-indigo-600" />
                  <div>
                    <h3 className="font-bold text-lg">MCP 适配器</h3>
                    <p className="text-slate-600">mcp_adapter.py (stdio 协议)</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ChevronRight className="w-6 h-6 text-slate-400 rotate-90 md:rotate-0" />
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <Plug className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="font-bold text-lg">Blender 插件</h3>
                    <p className="text-slate-600">Socket 服务器 (端口 9876)</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ChevronRight className="w-6 h-6 text-slate-400 rotate-90 md:rotate-0" />
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <Cpu className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-bold text-lg">Blender API</h3>
                    <p className="text-slate-600">最终操作执行层</p>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block flex-1">
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl p-8 border border-blue-200">
                  <h4 className="font-bold text-lg mb-4 text-blue-800">通信流程</h4>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-slate-700">MCP 协议通过 stdio 通信</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-slate-700">Socket 连接端口 9876</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-slate-700">适配器进行协议转换</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-slate-700">最终调用 Blender API</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prerequisites */}
        <section id="prerequisites" className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold">前置条件</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Blender 已安装", desc: "并启用了 AI Node Analyzer 插件", icon: <Cpu className="w-8 h-8" />, color: "from-blue-500 to-cyan-500" },
              { title: "Python 3.8+", desc: "已安装并配置好环境变量", icon: <Terminal className="w-8 h-8" />, color: "from-emerald-500 to-green-500" },
              { title: "IDE 支持 MCP", desc: "如 Claude Desktop、Cursor 等", icon: <Code className="w-8 h-8" />, color: "from-purple-500 to-indigo-500" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className={`inline-flex p-4 bg-gradient-to-r ${item.color} rounded-xl mb-6`}>
                  <div className="text-white">{item.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Configuration Steps */}
        <section id="steps" className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl">
import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Terminal, Cpu, Settings, Code, Filter, FileText, Wrench, Zap, ChevronRight, Copy, ExternalLink, Server, Plug, BookOpen } from 'lucide-react';

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
}

interface TroubleshootingItem {
  id: number;
  symptom: string;
  solution: string;
  icon: React.ReactNode;
}

const MCPConfigDocumentation: React.FC = () => {
  const [copiedPath, setCopiedPath] = useState(null);

  const handleCopyPath = (path) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const architectureSteps: Step[] = [
    { id: 1, title: 'IDE', description: 'Claude Desktop / Cursor / 其他支持 MCP 的 IDE', icon: <Terminal className="w-6 h-6" /> },
    { id: 2, title: 'MCP 适配器', description: '通过 stdio 协议通信的 Python 适配器', icon: <Code className="w-6 h-6" /> },
    { id: 3, title: 'Blender 插件', description: '运行在端口 9876 的 Socket 服务器', icon: <Server className="w-6 h-6" /> },
    { id: 4, title: 'Blender API', description: '最终执行操作的 Blender Python API', icon: <Cpu className="w-6 h-6" /> },
  ];

  const prerequisites: Step[] = [
    { id: 1, title: 'Blender 已安装', description: '并启用了 AI Node Analyzer 插件', icon: <CheckCircle className="w-6 h-6" /> },
    { id: 2, title: 'Python 3.8+', description: '已安装并配置好环境变量', icon: <Code className="w-6 h-6" /> },
    { id: 3, title: 'IDE 支持 MCP', description: '如 Claude Desktop、Cursor 等', icon: <Terminal className="w-6 h-6" /> },
  ];

  const tools: Tool[] = [
    { id: 1, name: 'get_scene_info', description: '获取当前 Blender 场景信息', category: '基础操作', icon: <Cpu className="w-4 h-4" /> },
    { id: 2, name: 'get_object_info', description: '获取指定对象的详细信息', category: '基础操作', icon: <Cpu className="w-4 h-4" /> },
    { id: 3, name: 'get_viewport_screenshot', description: '获取 3D 视口的截图', category: '基础操作', icon: <Cpu className="w-4 h-4" /> },
    { id: 4, name: 'execute_code', description: '执行 Blender Python 代码', category: '基础操作', icon: <Code className="w-4 h-4" /> },
    { id: 5, name: 'get_selected_nodes_info', description: '获取当前选中节点的详细信息', category: '节点分析', icon: <Filter className="w-4 h-4" /> },
    { id: 6, name: 'get_all_nodes_info', description: '获取当前节点树中的所有节点信息', category: '节点分析', icon: <Filter className="w-4 h-4" /> },
    { id: 7, name: 'create_analysis_frame', description: '创建分析框架，将选中的节点加入框架', category: '节点分析', icon: <Filter className="w-4 h-4" /> },
    { id: 8, name: 'remove_analysis_frame', description: '移除分析框架', category: '节点分析', icon: <Filter className="w-4 h-4" /> },
    { id: 9, name: 'get_analysis_frame_nodes', description: '获取分析框架中的节点信息', category: '节点分析', icon: <Filter className="w-4 h-4" /> },
    { id: 10, name: 'get_config_variable', description: '读取配置文件中的指定变量', category: '配置管理', icon: <Settings className="w-4 h-4" /> },
    { id: 11, name: 'get_all_config_variables', description: '获取所有配置变量', category: '配置管理', icon: <Settings className="w-4 h-4" /> },
    { id: 12, name: 'create_text_note', description: '创建文本注记节点', category: '文本注记', icon: <FileText className="w-4 h-4" /> },
    { id: 13, name: 'update_text_note', description: '更新当前激活的文本注记节点', category: '文本注记', icon: <FileText className="w-4 h-4" /> },
    { id: 14, name: 'get_text_note', description: '获取当前激活的文本注记节点内容', category: '文本注记', icon: <FileText className="w-4 h-4" /> },
    { id: 15, name: 'delete_text_note', description: '删除当前激活的文本注记节点', category: '文本注记', icon: <FileText className="w-4 h-4" /> },
    { id: 16, name: 'filter_nodes_info', description: '根据精细度过滤节点信息', category: '节点过滤', icon: <Filter className="w-4 h-4" /> },
    { id: 17, name: 'get_nodes_info_with_filter', description: '获取节点信息并应用过滤', category: '节点过滤', icon: <Filter className="w-4 h-4" /> },
    { id: 18, name: 'clean_markdown_text', description: '清理指定文本的 Markdown 格式', category: '文本处理', icon: <FileText className="w-4 h-4" /> },
  ];

  const troubleshootingItems: TroubleshootingItem[] = [
    { id: 1, symptom: '无法连接到 Blender', solution: '确保 Blender 正在运行且插件已启用，检查端口 9876 状态', icon: <Plug className="w-5 h-5" /> },
    { id: 2, symptom: '工具列表为空', solution: '检查 mcp_adapter.py 文件路径是否正确，确保 Python 环境正确', icon: <Wrench className="w-5 h-5" /> },
    { id: 3, symptom: '工具调用失败', solution: '确保在正确的上下文中（节点编辑器），检查参数是否正确', icon: <AlertCircle className="w-5 h-5" /> },
    { id: 4, symptom: 'Python 路径问题', solution: '使用完整的 Python 可执行文件路径，如 "C:\\Python311\\python.exe"', icon: <Terminal className="w-5 h-5" /> },
  ];

  const configExamples = [
    {
      ide: 'Claude Desktop',
      config: `{
  "mcpServers": {
    "blender-ai-node-analyzer": {
      "command": "python",
      "args": [
        "D:\\\\blender\\\\Plugin\\\\addons\\\\ainode\\\\mcp_adapter.py"
      ]
    }
  }
}`
    },
    {
      ide: 'Cursor',
      config: `{
  "name": "blender-ai-node-analyzer",
  "command": "python",
  "args": [
    "D:\\\\blender\\\\Plugin\\\\addons\\\\ainode\\\\mcp_adapter.py"
  ]
}`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Blender AI Node Analyzer
                </h1>
                <p className="text-sm text-slate-500">MCP 配置说明文档</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                概述
              </button>
              <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                配置指南
              </button>
              <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                工具参考
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                开始配置
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="container mx-auto px-6 py-12">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            MCP 配置说明
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            本文档说明如何配置 IDE 使用 Blender AI Node Analyzer 的本地 MCP 服务器，实现 AI 助手与 Blender 的无缝集成。
          </p>
        </div>

        {/* 架构说明 */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl mr-4">
              <Server className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">架构说明</h2>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {architectureSteps.map((step) => (
                <div key={step.id} className="relative">
                  <div className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-white to-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mb-4">
                      {step.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-slate-900">{step.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                  {step.id < 4 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <ChevronRight className="w-8 h-8 text-slate-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <pre className="text-sm bg-white/80 backdrop-blur-sm rounded-xl p-6 overflow-x-auto">
{`IDE (Claude Desktop / Cursor / 其他)
  ↓ (MCP 协议 - stdio)
MCP 适配器 (mcp_adapter.py)
  ↓ (Socket 连接 - 端口 9876)
Blender 插件 (Socket 服务器)
  ↓
Blender API`}
            </pre>
          </div>
        </section>

        {/* 前置条件 */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl mr-4">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">前置条件</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {prerequisites.map((req) => (
              <div key={req.id} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg">
                    {req.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-slate-900">{req.title}</h3>
                    <p className="text-slate-600">{req.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 配置步骤 */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl mr-4">
              <Settings className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">配置步骤</h2>
          </div>

          <div className="space-y-8">
            {/* 步骤 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-bold text-lg mr-4">
                  1
                </div>
                <h3 className="text-2xl font-bold text-slate-900">启动 Blender 并启用插件</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    </div>
                    <p className="text-slate-700">打开 Blender</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    </div>
                    <p className="text-slate-700">进入 <code className="bg-slate-100 px-2 py-1 rounded text-sm">Edit → Preferences → Add-ons</code></p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    </div>
                    <p className="text-slate-700">启用 <span className="font-semibold text-blue-600">AI Node Analyzer</span> 插件</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center mb-4">
                    <Zap className="w-5 h-5 text-amber-500 mr-2" />
                    <h4 className="font-semibold text-slate-900">重要提示</h4>
                  </div>
                  <p className="text-slate-700 mb-3">在节点编辑器中，找到 <span className="font-medium">AI Node Analyzer</span> 面板</p>
                  <p className="text-slate-700">确保 <span className="font-medium">AI Node MCP</span> 面板中的服务器状态为"运行在端口 9876"</p>
                </div>
              </div>
            </div>

            {/* 步骤 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-bold text-lg mr-4">
                  2
                </div>
                <h3 className="text-2xl font-bold text-slate-900">配置 IDE</h3>
              </div>

              <div className="space-y-8">
                {configExamples.map((example, index) => (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Terminal className="w-5 h-5 text-blue-600 mr-2" />
                        <h4 className="text-xl font-semibold text-slate-900">{example.ide}</h4>
                      </div>
                      <button
                        onClick={() => handleCopyPath(example.config)}
                        className="px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-lg hover:shadow-md transition-all duration-300 flex items-center space-x-2"
                      >
                        <Copy className="w-4 h-4" />
                        <span>{copiedPath === example.config ? '已复制!' : '复制配置'}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <pre className="text-sm bg-slate-900 text-slate-100 rounded-lg p-6 overflow-x-auto">
                        {example.config}
                      </pre>
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-amber-800 font-medium mb-1">注意：</p>
                          <p className="text-sm text-amber-700">
                            请将 <code className="bg-amber-100 px-1 py-0.5 rounded">D:\\blender\\Plugin\\addons\\ainode\\mcp_adapter.py</code> 替换为实际的文件路径
                          </p>
                          <p className="text-sm text-amber-700 mt-1">Windows 路径使用双反斜杠 <code className="bg-amber-100 px-1 py-0.5 rounded">\\</code></p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 可用工具 */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl mr-4">
              <Wrench className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">可用的 MCP 工具</h2>
          </div>

          <div className="mb-6">
            <p className="text-lg text-slate-600 mb-8">
              配置成功后，IDE 将能够识别以下 <span className="font-bold text-blue-600">18 个 MCP 工具</span>：
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div key={tool.id} className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      tool.category === '基础操作' ? 'bg-blue-100 text-blue-600' :
                      tool.category === '节点分析' ? 'bg-emerald-100 text-emerald-600' :
                      tool.category === '配置管理' ? 'bg-amber-100 text-amber-600' :
                      tool.category === '文本注记' ? 'bg-indigo-100 text-indigo-600' :
                      tool.category === '节点过滤' ? 'bg-purple-100 text-purple-600' :
                      'bg-pink-100 text-pink-600'
                    }`}>
                      {tool.icon}
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      tool.category === '基础操作' ? 'bg-blue-50 text-blue-700' :
                      tool.category === '节点分析' ? 'bg-emerald-50 text-emerald-700' :
                      tool.category === '配置管理' ? 'bg-amber-50 text-amber-700' :
                      tool.category === '文本注记' ? 'bg-indigo-50 text-indigo-700' :
                      tool.category === '节点过滤' ? 'bg-purple-50 text-purple-700' :
                      'bg-pink-50 text-pink-700'
                    }`}>
                      {tool.category}
                    </span>
                  </div>
                </div>
                <h4 className="font-mono text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 故障排除 */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-gradient-to-r from-red-100 to-rose-100 rounded-xl mr-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">故障排除</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {troubleshootingItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-red-200 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gradient-to-r from-red-100 to-rose-100 rounded-lg flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-slate-900 mb-2">{item.symptom}</h4>
                    <p className="text-slate-600">{item.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 使用示例 */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-xl mr-4">
              <BookOpen className="w-6 h-6 text-cyan-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">使用示例</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 border border-cyan-200">
              <h4 className="text-xl font-bold text-slate-900 mb-4">示例 1：获取场景信息</h4>
              <div className="bg-white rounded-xl p-6 mb-4">
                <p className="text-slate-700 italic">"请帮我获取当前 Blender 场景的信息"</p>
              </div>
              <p className="text-slate-600">Claude 会自动调用 <code className="bg-cyan-100 px-2 py-1 rounded text-sm font-mono">get_scene_info</code> 工具。</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200">
              <h4 className="text-xl font-bold text-slate-900 mb-4">示例 2：分析选中节点</h4>
              <div className="bg-white rounded-xl p-6 mb-4">
                <p className="text-slate-700 italic">"请分析当前选中的节点"</p>
              </div>
              <p className="text-slate-600">Claude 会调用 <code className="bg-emerald-100 px-2 py-1 rounded text-sm font-mono">get_selected_nodes_info</code> 工具获取节点信息。</p>
            </div>
          </div>
        </section>

        {/* 高级配置 */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-gradient-to-r from-violet-100 to-purple-100 rounded-xl mr-4">
              <Zap className="w-6 h-6 text-violet-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">高级配置</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h4 className="text-xl font-bold text-slate-900 mb-4">自定义端口</h4>
              <p className="text-slate-600 mb-6">如果需要使用不同的端口，可以修改 <code className="bg-slate-100 px-2 py-1 rounded text-sm">mcp_adapter.py</code> 中的端口配置：</p>
              <pre className="text-sm bg-slate-900 text-slate-100 rounded-xl p-6 overflow-x-auto">
{`self.blender_adapter = BlenderMCPAdapter(
    host='localhost',
    port=9877  # 修改为自定义端口
)`}
              </pre>
              <p className="text-slate-600 mt-4">同时在 Blender 插件中修改端口设置。</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h4 className="text-xl font-bold text-slate-900 mb-4">调试模式</h4>
              <p className="text-slate-600 mb-6">要查看详细的调试信息，可以在 IDE 配置中添加环境变量：</p>
              <pre className="text-sm bg-slate-900 text-slate-100 rounded-xl p-6 overflow-x-auto">
{`{
  "command": "python",
  "args": ["D:\\\\blender\\\\Plugin\\\\addons\\\\ainode\\\\mcp_adapter.py"],
  "env": {
    "DEBUG": "1"  // 启用调试模式
  }
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* 相关文档 */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl mr-4">
              <FileText className="w-6 h-6 text-slate-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">相关文档</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="#" className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                    MCP 功能实现总结
                  </h4>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <p className="text-slate-600">详细了解 MCP 功能的技术实现细节和架构设计。</p>
            </a>

            <a href="#" className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Blender 插件文档
                  </h4>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </div>
              <p className="text-slate-600">完整的 Blender 插件使用指南和 API 文档。</p>
            </a>
          </div>
        </section>

        {/* 支持信息 */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">需要帮助？</h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              如果遇到问题，请检查 Blender 控制台的错误信息，查看 IDE 的 MCP 日志，并确保所有前置条件都已满足。
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 font-medium">
                查看详细文档
              </button>
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 font-medium">
                联系支持
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Blender AI Node Analyzer</p>
                <p className="text-sm text-slate-500">MCP 配置文档 v1.0</p>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              © {new Date().getFullYear()} AI Node Analyzer. 保留所有权利。
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MCPConfigDocumentation;
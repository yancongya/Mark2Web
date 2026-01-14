# bl_info: 插件元数据
bl_info = {
    "name": "AI Node Analyzer",
    "author": "Blender AI Expert",
    "version": (1, 0, 0),
    "blender": (4, 2, 0),
    "location": "Node Editor > Sidebar > AI Node Analyzer",
    "description": "使用AI分析Blender节点结构，支持联网检索和自定义知识库",
    "category": "Node",
}

import bpy
import requests
import json
import threading
import webbrowser
from bpy.types import Operator, Panel, AddonPreferences, PropertyGroup
from bpy.props import StringProperty, EnumProperty, BoolProperty, PointerProperty, CollectionProperty

# ==========================================
# 1. 偏好设置 (Preferences) - 安全存储API Key
# ==========================================

class AIAnalyzerPreferences(AddonPreferences):
    bl_idname = __name__

    api_key: StringProperty(
        name="OpenAI API Key",
        description="输入您的OpenAI API密钥",
        subtype='PASSWORD',
        default=""
    )
    
    tavily_key: StringProperty(
        name="Tavily API Key",
        description="输入Tavily搜索API密钥",
        subtype='PASSWORD',
        default=""
    )
    
    exa_key: StringProperty(
        name="Exa API Key",
        description="输入Exa搜索API密钥",
        subtype='PASSWORD',
        default=""
    )
    
    brave_key: StringProperty(
        name="Brave Search API Key",
        description="输入Brave搜索API密钥",
        subtype='PASSWORD',
        default=""
    )

    def draw(self, context):
        layout = self.layout
        box = layout.box()
        box.label(text="API 密钥配置 (安全存储)", icon='KEYINGSET')
        box.prop(self, "api_key")
        
        col = box.column(align=True)
        col.label(text="搜索 API 密钥 (根据面板选择使用):")
        col.prop(self, "tavily_key")
        col.prop(self, "exa_key")
        col.prop(self, "brave_key")
        
        layout.separator()
        layout.label(text="提示: 请确保已安装 requests 库。如果未安装，请在Blender Python环境中运行 'pip install requests'。")

# ==========================================
# 2. 自定义属性组 (Property Groups)
# ==========================================

class KnowledgeBaseItem(PropertyGroup):
    """知识库条目：可以是文本、URL或文件路径"""
    content: StringProperty(name="内容/路径/URL", description="输入文本、文件路径或URL")

# ==========================================
# 3. 核心逻辑类 (Core Logic Class)
# ==========================================

class AIAnalysisEngine:
    """负责解析节点、调用API和处理结果的引擎"""
    
    @staticmethod
    def get_addon_prefs():
        """获取插件偏好设置"""
        return bpy.context.preferences.addons[__name__].preferences

    @staticmethod
    def parse_node_socket(socket, is_input=True):
        """解析节点Socket信息"""
        link_info = "未连接"
        if is_input and socket.is_linked:
            # 查找输入连接的来源
            link = socket.links[0]
            from_node = link.from_node
            from_socket = link.from_socket
            link_info = f"连接自: [{from_node.name}]({from_socket.name})"
        elif not is_input and socket.is_linked:
            # 查找输出连接的目标
            links = socket.links
            targets = [f"[{l.to_node.name}]({l.to_socket.name})" for l in links]
            link_info = f"连接至: {', '.join(targets)}"
            
        return {
            "name": socket.name,
            "type": socket.type,
            "link_status": link_info
        }

    @staticmethod
    def parse_node_recursive(node, indent=0):
        """递归解析节点，如果是节点组则深入内部"""
        prefix = "  " * indent
        node_info = []
        
        # 基础信息
        node_type = node.type
        node_name = node.name
        label = node.label if node.label else "无标签"
        
        info_str = f"{prefix}- 节点类型: {node_type} | 名称: {node_name} | 标签: {label}"
        node_info.append(info_str)
        
        # Socket 信息
        inputs = [AIAnalysisEngine.parse_node_socket(s, True) for s in node.inputs]
        outputs = [AIAnalysisEngine.parse_node_socket(s, False) for s in node.outputs]
        
        if inputs:
            node_info.append(f"{prefix}  输入 Sockets:")
            for inp in inputs:
                node_info.append(f"{prefix}    - {inp['name']} ({inp['type']}): {inp['link_status']}")
        
        if outputs:
            node_info.append(f"{prefix}  输出 Sockets:")
            for out in outputs:
                node_info.append(f"{prefix}    - {out['name']} ({out['type']}): {out['link_status']}")
                
        # 特殊处理节点组 (Node Group)
        if node_type == 'GROUP' and hasattr(node, 'node_tree'):
            node_info.append(f"{prefix}  [开始解析节点组内部结构...]")
            if node.node_tree:
                for sub_node in node.node_tree.nodes:
                    node_info.extend(AIAnalysisEngine.parse_node_recursive(sub_node, indent + 2))
            node_info.append(f"{prefix}  [节点组解析结束]")
            
        return node_info

    @staticmethod
    def analyze_selected_nodes(context):
        """主分析函数：生成结构化文本"""
        space_data = context.space_data
        if not space_data or not space_data.node_tree:
            return "错误: 当前未在节点编辑器中，或没有活动的节点树。"
            
        node_tree = space_data.node_tree
        tree_type = node_tree.type # 'GEOMETRY', 'SHADER', 'COMPOSITOR'
        
        selected_nodes = context.selected_nodes
        if not selected_nodes:
            active_node = context.active_node
            if active_node:
                selected_nodes = [active_node]
            else:
                return "错误: 未选中任何节点。请选中一个或多个节点。"
        
        lines = []
        lines.append(f"=== Blender 节点分析报告 ===")
        lines.append(f"节点树类型: {tree_type}")
        lines.append(f"节点树名称: {node_tree.name}")
        lines.append(f"选中节点数量: {len(selected_nodes)}")
        lines.append("-" * 30)
        
        for node in selected_nodes:
            lines.extend(AIAnalysisEngine.parse_node_recursive(node))
            
        return "\n".join(lines)

    @staticmethod
    def perform_web_search(query, search_type, api_key):
        """执行联网检索"""
        if not api_key:
            return None, "未提供搜索API Key，跳过搜索。"
            
        try:
            if search_type == 'TAVILY':
                response = requests.post(
                    "https://api.tavily.com/search",
                    json={
                        "api_key": api_key,
                        "query": query,
                        "search_depth": "advanced",
                        "include_images": False
                    },
                    timeout=15
                )
                if response.status_code == 200:
                    data = response.json()
                    results = data.get('results', [])
                    if results:
                        # 提取摘要和来源
                        snippets = [f"来源: {r['url']}\n内容: {r['content']}" for r in results[:3]]
                        return "\n\n".join(snippets), "搜索成功"
                return None, "Tavily 搜索无结果或失败。"
                
            elif search_type == 'EXA':
                # Exa API 结构示例 (需要根据实际文档调整)
                headers = {"x-api-key": api_key}
                payload = {"query": query, "numResults": 3}
                response = requests.post("https://api.exa.ai/search", json=payload, headers=headers, timeout=15)
                if response.status_code == 200:
                    data = response.json()
                    # 假设结果结构
                    snippets = [f"来源: {r.get('url')}\n内容: {r.get('text', '')}" for r in data.get('results', [])[:3]]
                    return "\n\n".join(snippets), "搜索成功"
                return None, "Exa 搜索失败。"
                
            elif search_type == 'BRAVE':
                # Brave Search API (通常需要特定的Endpoint)
                headers = {"X-Subscription-Token": api_key}
                response = requests.get(f"https://api.search.brave.com/res/v1/web/search?q={query}", headers=headers, timeout=15)
                if response.status_code == 200:
                    data = response.json()
                    results = data.get('web', {}).get('results', [])
                    snippets = [f"来源: {r.get('url')}\n内容: {r.get('description', '')}" for r in results[:3]]
                    return "\n\n".join(snippets), "搜索成功"
                return None, "Brave 搜索失败。"
                
        except Exception as e:
            return None, f"搜索异常: {str(e)}"
            
        return None, "不支持的搜索类型。"

    @staticmethod
    def process_knowledge_base(kb_items):
        """处理自定义知识库"""
        if not kb_items:
            return ""
            
        kb_content = "\n\n--- 知识库内容 ---\n"
        for item in kb_items:
            content = item.content.strip()
            if not content:
                continue
                
            # 简单判断是URL还是文本/路径
            if content.startswith("http://") or content.startswith("https://"):
                kb_content += f"[URL]: {content}\n"
            else:
                # 假设是文本内容
                kb_content += f"[文本]: {content}\n"
                
        return kb_content

    @staticmethod
    def send_to_ai(node_description, search_results, kb_content, system_prompt, model, api_key):
        """发送请求给OpenAI"""
        if not api_key:
            return None, "未设置 OpenAI API Key"
            
        # 构建 User Message
        user_message = f"节点结构描述:\n{node_description}"
        if search_results:
            user_message += f"\n\n联网检索结果:\n{search_results}"
        if kb_content:
            user_message += f"\n\n自定义知识库:\n{kb_content}"
            
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
        
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        data = {
            "model": model,
            "messages": messages,
            "temperature": 0.7
        }
        
        try:
            response = requests.post(url, json=data, headers=headers, timeout=60)
            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                return content, "AI 分析完成"
            else:
                error_msg = response.json().get('error', {}).get('message', 'Unknown error')
                return None, f"API Error: {error_msg}"
        except Exception as e:
            return None, f"请求异常: {str(e)}"

# ==========================================
# 4. 操作符 (Operators)
# ==========================================

class NODE_OT_AIAnalyze(Operator):
    """点击开始分析节点"""
    bl_idname = "node.ai_analyze"
    bl_label = "分析选中节点"
    bl_description = "解析节点结构并发送给AI进行分析"
    
    # 定义UI面板中使用的属性 (通过context.window_manager传递)
    # 这里的属性需要在调用前由UI设置到window_manager中，或者使用动态属性
    # 为了简化，我们在execute中直接读取UI Panel的属性
    
    def execute(self, context):
        prefs = AIAnalysisEngine.get_addon_prefs()
        
        # 1. 获取UI输入值 (从自定义属性或Panel存储)
        # 注意：Blender Operator很难直接获取Panel的动态属性，
        # 这里我们使用一个技巧：将Panel的属性存储在场景的自定义属性中
        
        scene = context.scene
        wm = context.window_manager
        
        # 获取用户在面板输入的值
        api_key = prefs.api_key
        if not api_key:
            self.report({'ERROR'}, "请先在插件偏好设置或面板中输入 OpenAI API Key")
            return {'CANCELLED'}
            
        model = wm.ai_analyzer_model
        system_prompt = wm.ai_analyzer_prompt
        use_web_search = wm.ai_analyzer_use_web
        search_type = wm.ai_analyzer_search_type
        search_api_key = ""
        
        # 获取对应的搜索Key
        if use_web_search:
            if search_type == 'TAVILY': search_api_key = prefs.tavily_key
            elif search_type == 'EXA': search_api_key = prefs.exa_key
            elif search_type == 'BRAVE': search_api_key = prefs.brave_key
            
            if not search_api_key:
                self.report({'WARNING'}, "启用了联网检索，但未在偏好设置中配置对应的API Key，将跳过搜索")
                use_web_search = False

        # 2. 解析节点 (在主线程执行，因为需要访问Blender数据)
        self.report({'INFO'}, "正在解析节点结构...")
        node_description = AIAnalysisEngine.analyze_selected_nodes(context)
        
        if node_description.startswith("错误"):
            self.report({'ERROR'}, node_description)
            return {'CANCELLED'}
            
        # 3. 准备知识库
        kb_items = wm.ai_analyzer_kb
        kb_content = AIAnalysisEngine.process_knowledge_base(kb_items)
        
        # 4. 定义后台任务函数
        def background_task():
            search_results = None
            
            # 执行联网检索 (如果启用)
            if use_web_search and search_api_key:
                # 生成搜索查询
                search_query = f"Blender {context.space_data.node_tree.type} optimization: " + node_description[:100]
                search_results, status = AIAnalysisEngine.perform_web_search(search_query, search_type, search_api_key)
                if search_results is None:
                    print(f"搜索警告: {status}")
            
            # 发送给AI
            ai_response, status = AIAnalysisEngine.send_to_ai(
                node_description, search_results, kb_content, 
                system_prompt, model, api_key
            )
            
            # 5. 处理结果 (回到主线程更新UI)
            def show_result():
                if ai_response:
                    # 创建一个Text Block来显示结果
                    text_name = "AI_Analysis_Result"
                    text_block = bpy.data.texts.get(text_name) or bpy.data.texts.new(text_name)
                    text_block.clear()
                    text_block.write(f"=== AI 分析结果 ===\n\n")
                    text_block.write(f"模型: {model}\n")
                    text_block.write(f"时间: {bpy.context.scene.frame_current}\n\n")
                    text_block.write(ai_response)
                    if search_results:
                        text_block.write("\n\n--- 搜索来源 ---\n")
                        text_block.write("结果已包含在分析中，请查看上下文。")
                    
                    # 切换到文本编辑器视图 (可选)
                    for area in bpy.context.screen.areas:
                        if area.type == 'TEXT_EDITOR':
                            area.spaces.active.text = text_block
                            break
                    
                    self.report({'INFO'}, "分析完成！结果已写入 Text Block: AI_Analysis_Result")
                else:
                    self.report({'ERROR'}, status)
            
            # 调度主线程更新
            bpy.app.timers.register(show_result)

        # 6. 启动线程
        thread = threading.Thread(target=background_task)
        thread.daemon = True
        thread.start()
        
        self.report({'INFO'}, "AI 分析已开始，请稍候... (结果将显示在Text Block中)")
        return {'FINISHED'}

# ==========================================
# 5. 面板 UI (UI Panel)
# ==========================================

class NODE_PT_AIAnalyzer(Panel):
    """在节点编辑器侧边栏创建面板"""
    bl_label = "AI Node Analyzer"
    bl_idname = "NODE_PT_AIAnalyzer"
    bl_space_type = 'NODE_EDITOR'
    bl_region_type = 'UI'
    bl_category = "AI Node Analyzer"

    def draw(self, context):
        layout = self.layout
        wm = context.window_manager
        prefs = AIAnalysisEngine.get_addon_prefs()
        
        # 检查环境
        if not context.space_data.node_tree:
            layout.label(text="请打开一个节点编辑器", icon='ERROR')
            return

        # 1. API Key 状态
        box = layout.box()
        row = box.row()
        if prefs.api_key:
            row.label(text="OpenAI Key: 已设置", icon='KEY_HLT')
        else:
            row.label(text="OpenAI Key: 未设置", icon='ERROR')
            op = row.operator("wm.url_open", text="获取 Key", icon='URL')
            op.url = "https://platform.openai.com/api-keys"
        
        # 2. 模型选择
        box.prop(wm, "ai_analyzer_model", text="模型")
        
        # 3. 系统提示词
        box.prop(wm, "ai_analyzer_prompt", text="系统提示")
        
        # 4. 联网检索
        col = box.column(align=True)
        col.prop(wm, "ai_analyzer_use_web", text="启用联网检索")
        if wm.ai_analyzer_use_web:
            row = col.row()
            row.prop(wm, "ai_analyzer_search_type", text="引擎")
            # 提示用户去设置Key
            key_status = "未设置"
            if wm.ai_analyzer_search_type == 'TAVILY' and prefs.tavily_key: key_status = "已设置"
            elif wm.ai_analyzer_search_type == 'EXA' and prefs.exa_key: key_status = "已设置"
            elif wm.ai_analyzer_search_type == 'BRAVE' and prefs.brave_key: key_status = "已设置"
            
            if key_status == "未设置":
                col.label(text=f"提示: 请在偏好设置中配置 {wm.ai_analyzer_search_type} Key", icon='INFO')

        # 5. 知识库
        box.label(text="自定义知识库 (URL/文本):")
        kb_list = box.template_list(
            "KB_ItemList", "", 
            wm, "ai_analyzer_kb", 
            wm, "ai_analyzer_kb_index"
        )
        row = box.row(align=True)
        row.operator("ai_analyzer_kb_add", icon='ADD', text="添加")
        row.operator("ai_analyzer_kb_remove", icon='REMOVE', text="删除")
        
        # 6. 主要操作
        layout.separator()
        op = layout.operator("node.ai_analyze", icon='ANALYTICS')
        op.text = "分析选中节点 with AI"

# ==========================================
# 6. 知识库列表 UI (Template List)
# ==========================================

class KB_ItemList(bpy.types.UIList):
    """自定义列表显示"""
    def draw_item(self, context, layout, data, item, icon, active_data, active_propname, index):
        if self.layout_type in {'DEFAULT', 'COMPACT'}:
            layout.prop(item, "content", text="", emboss=False, icon='TEXT')
        elif self.layout_type in {'GRID'}:
            layout.alignment = 'CENTER'
            layout.label(text="", icon='TEXT')

class KB_OT_AddItem(Operator):
    """添加知识库条目"""
    bl_idname = "ai_analyzer_kb_add"
    bl_label = "添加知识库"
    
    def execute(self, context):
        wm = context.window_manager
        item = wm.ai_analyzer_kb.add()
        item.content = "在此输入文本、URL或文件路径"
        wm.ai_analyzer_kb_index = len(wm.ai_analyzer_kb) - 1
        return {'FINISHED'}

class KB_OT_RemoveItem(Operator):
    """删除知识库条目"""
    bl_idname = "ai_analyzer_kb_remove"
    bl_label = "删除知识库"
    
    def execute(self, context):
        wm = context.window_manager
        idx = wm.ai_analyzer_kb_index
        wm.ai_analyzer_kb.remove(idx)
        wm.ai_analyzer_kb_index = min(max(0, idx - 1), len(wm.ai_analyzer_kb) - 1)
        return {'FINISHED'}

# ==========================================
# 7. 注册与注销 (Registration)
# ==========================================

classes = (
    AIAnalyzerPreferences,
    KnowledgeBaseItem,
    NODE_OT_AIAnalyze,
    NODE_PT_AIAnalyzer,
    KB_ItemList,
    KB_OT_AddItem,
    KB_OT_RemoveItem,
)

def register():
    # 注册类
    for cls in classes:
        bpy.utils.register_class(cls)
    
    # 注册全局属性 (Window Manager)
    wm = bpy.types.WindowManager
    
    # 模型选择
    wm.ai_analyzer_model = EnumProperty(
        name="AI Model",
        items=[
            ('gpt-4o', "GPT-4o", "最新的多模态模型，智商最高"),
            ('gpt-4o-mini', "GPT-4o-mini", "速度快，成本低，性价比高"),
            ('gpt-3.5-turbo', "GPT-3.5 Turbo", "旧版模型，仅作兼容"),
        ],
        default='gpt-4o-mini'
    )
    
    # 系统提示词
    wm.ai_analyzer_prompt = StringProperty(
        name="System Prompt",
        description="AI的角色设定",
        default="You are an expert in Blender nodes. Analyze the following node structure and provide insights, optimizations, or explanations. You can use web search or provided knowledge base to answer accurately.",
        subtype='TEXT'
    )
    
    # 联网开关
    wm.ai_analyzer_use_web = BoolProperty(
        name="Enable Web Search",
        description="允许AI联网搜索最新信息",
        default=False
    )
    
    # 搜索引擎选择
    wm.ai_analyzer_search_type = EnumProperty(
        name="Search API",
        items=[
            ('TAVILY', "Tavily (推荐)", "专为LLM优化的搜索API"),
            ('EXA', "Exa", "AI原生搜索"),
            ('BRAVE', "Brave Search", "注重隐私的搜索"),
        ],
        default='TAVILY'
    )
    
    # 知识库列表
    wm.ai_analyzer_kb = CollectionProperty(type=KnowledgeBaseItem)
    wm.ai_analyzer_kb_index = bpy.props.IntProperty()

def unregister():
    # 注销属性
    wm = bpy.types.WindowManager
    del wm.ai_analyzer_model
    del wm.ai_analyzer_prompt
    del wm.ai_analyzer_use_web
    del wm.ai_analyzer_search_type
    del wm.ai_analyzer_kb
    del wm.ai_analyzer_kb_index
    
    # 注销类
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)

if __name__ == "__main__":
    register()
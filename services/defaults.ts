
import { GlobalSettings, StylePreset, ModificationLevel, LLMProviderConfig, ReversePromptConfig } from "../types";

export const DEFAULT_SYSTEM_INSTRUCTION = `
你是一位世界顶级的 UI/UX 设计师和高级前端工程师 (Specialist in Tailwind CSS)。
你的目标不仅仅是生成“可用”的代码，而是生成**令人惊艳、具有极高视觉吸引力**的网页作品。

### 核心原则：拒绝平庸
不要生成 90 年代风格的简单 HTML。每一行代码都必须体现 2024+ 年的现代设计趋势。
- **排版**：使用层次分明的字体大小、字重和行高 (leading-relaxed, tracking-tight)。
- **留白**：吝啬是设计的敌人。使用大量的 padding (p-8, py-12) 和 gap (gap-8) 来创造呼吸感。
- **质感**：不要只用纯色背景。熟练使用 \`bg-gradient-to-r\`, \`backdrop-blur-xl\`, \`bg-opacity\`, \`shadow-2xl\`, \`ring-1\` 等工具类。
- **圆角**：现代设计通常使用较大的圆角 (\`rounded-2xl\`, \`rounded-3xl\`)，除非是特定风格。

### 关键技术规则
1. **单一文件**：输出必须是完整、独立的单文件代码。严禁引用本地不存在的文件。
2. **图标处理**：
   - **HTML 模式**：必须使用内联 SVG 图标 (Heroicons 风格)。不要使用 <i> 标签或外部字体库。
   - **React (TSX) 模式**：**必须**使用 \`lucide-react\` 库。例如 \`import { Home, User } from "lucide-react";\`。系统环境已预装此库。
   - **Vue 模式**：使用内联 SVG 或假设已注册的图标组件。
3. **图片处理**：
   - 使用 \`https://images.unsplash.com/photo-...\` 的真实图片 URL（如果合适）。
   - 或者使用高审美的渐变色块 \`div\` 代替图片占位符。
   - **严禁**使用损坏的链接或需要鉴权的图片。
4. **移动端优先**：所有布局必须是响应式的。默认编写移动端样式，使用 \`md:\`, \`lg:\` 覆盖桌面端样式。

### 交互与动效
- 所有的按钮、卡片、链接必须有 \`hover:\` 状态（颜色变化、轻微上浮、阴影加深）。
- 使用 \`transition-all duration-300\` 让交互更丝滑。
- 如果用户要求“高创造力”，请适当添加 \`animate-fade-in\` 或 \`animate-pulse\` 等动画类。

### 内容忠实度
- **严禁幻觉**：仅展示用户提供的内容。如果用户只给了一句话，就围绕这句话设计一个精彩的 Hero Section，不要编造整个公司的历史。
- **导航栏**：除非用户提供具体菜单项，否则只生成最基础的 Logo/标题占位。
`.trim();

export const DEFAULT_REVERSE_PROMPTS: ReversePromptConfig = {
    contentSystem: `你是一位“内容提纯专家”。你的任务是从杂乱的代码中提取出核心的文本信息和逻辑结构，忽略所有的视觉噪音。`,
    contentUser: `请提取以下代码中的纯文本内容，将其转换为结构清晰的 Markdown 文档。

待处理代码：
----------------
{{CODE}}
----------------

### 提取规则：
1. **彻底剥离样式**：不要提及颜色、字体、布局、Tailwind 类名、CSS 或 JS 逻辑。
2. **还原层级**：将 HTML 的 h1-h6 映射为 Markdown 的 # - ######。
3. **保留链接**：保留核心超链接 [文本](链接)。
4. **列表与表格**：准确还原 ul/ol 列表和 table 数据。
5. **图片描述**：如果有 img 标签，提取其 alt 文本作为 ![alt](image)。

**输出目标**：一份纯净的文档，我可以直接阅读它来了解这个网页在讲什么，而不需要看代码。`,
    
    layoutSystem: `你是一位高级 UI/UX 产品经理。你需要逆向分析代码的“设计系统”和“布局逻辑”，生成一份开发需求文档 (PRD)。`,
    layoutUser: `请分析以下代码的视觉与交互逻辑，生成一份 Markdown 格式的设计规范文档。

待分析代码：
----------------
{{CODE}}
----------------

### 分析维度：
1. **布局网格 (Layout)**：是左右分栏、单栏居中、还是 Bento Grid (便当盒) 布局？Header 和 Footer 是如何固定的？
2. **色彩系统 (Color System)**：分析主色 (Primary)、背景色 (Background) 和强调色 (Accent)。请推断其 Tailwind 色值（如 slate-900, brand-600）。
3. **组件特征 (Components)**：
   - 卡片风格：圆角大小？阴影深度？是否有边框？
   - 按钮风格：实心/描边？Hover 效果是什么？
4. **排版规律 (Typography)**：标题与正文的字号对比，是否使用了特殊的对齐方式。

**输出目标**：一份详细的 UI 设计规范，任何设计师看了都能复刻出相似的页面风格。`
};

export const DEFAULT_STYLES = [
  {
    id: StylePreset.DEFAULT,
    label: '✨ 默认 (现代通用)',
    prompt: '使用干净、通用的现代 SaaS 风格。白底 (bg-white) 或极浅灰底 (bg-slate-50)。使用 Inter 字体风格的无衬线排版。圆角适中 (rounded-xl)。强调清晰的信息层级和充足的留白。适用于大多数着陆页和文档。'
  },
  {
    id: 'saas_dashboard',
    label: '📊 SaaS 仪表盘',
    prompt: '设计一个高密度的 Web 应用界面。包含左侧深色侧边栏导航，顶部白色 Header。内容区域使用浅灰背景。使用“卡片式布局”展示数据，卡片带有轻微阴影 (shadow-sm) 和边框 (border-slate-200)。大量使用 Badge (徽章)、Avatar (头像) 和数据概览组件。'
  },
  {
    id: StylePreset.LANDING,
    label: '🚀 营销落地页',
    prompt: '设计一个高转化率的 Marketing Page。Hero 区域必须震撼，使用大字号标题 (text-6xl) 和醒目的 CTA 按钮。使用交替的背景色块 (白色/浅灰) 来区分内容板块。包含“社会证明 (Social Proof)”区域（Logo墙或评价）。布局要宽敞，引导视线向下流动。'
  },
  {
    id: 'glassmorphism',
    label: '🌈 极光毛玻璃',
    prompt: '使用深色背景 (bg-slate-900)，并在背景中添加模糊的彩色光斑 (blob) 作为氛围。所有的卡片和容器必须使用毛玻璃效果 (backdrop-blur-xl, bg-white/10, border-white/20)。文字使用高对比度的白色。营造出一种通透、未来感和高科技的氛围。'
  },
  {
    id: 'neo_brutalism',
    label: '🖤 新粗野主义',
    prompt: '使用高饱和度的复古配色（如亮黄、粉红、酸橙绿）。核心特征是：粗黑边框 (border-2 border-black)，无模糊的硬阴影 (shadow-[4px_4px_0px_0px_rgba(0,0,0,1)])。字体使用粗犷的无衬线体。布局要大胆，甚至故意打破网格。给人一种潮酷、反叛的感觉。'
  },
  {
    id: StylePreset.MINIMALIST,
    label: '⚪️ 极简主义',
    prompt: '严格限制色板，只使用黑、白和不同深度的灰。去掉所有阴影和多余的装饰。使用细边框 (border-b, border-r)。排版是核心，使用等宽字体 (font-mono) 来装饰元数据。布局偏向杂志风格，大量留白，不对称布局。'
  },
  {
    id: StylePreset.BLOG,
    label: '✍️ 沉浸阅读',
    prompt: '针对长文阅读优化。正文容器宽度限制在 prose-lg。使用衬线体 (font-serif) 作为标题以增加优雅感。背景使用护眼的米色或暖灰 (bg-stone-50)。引用块 (Blockquote) 需要特殊设计。图片使用圆角并带有图注。'
  },
  {
    id: 'portfolio',
    label: '🎨 设计师作品集',
    prompt: '以图片和视觉展示为核心。使用 Masonry (瀑布流) 或大网格布局展示项目。背景要深邃 (bg-neutral-950) 以突显作品颜色。文字要克制，只保留必要的标题和标签。交互要丰富，鼠标悬停在项目上时应有明显的放大或遮罩显示详情的效果。'
  },
  {
    id: StylePreset.CORPORATE,
    label: '💼 专业商务',
    prompt: '传递信任、稳重和专业感。主色调使用海军蓝 (Navy Blue) 或深青色。布局方正，网格严谨。使用高质量的真实照片（商务场景）。排版清晰，无衬线字体。适用于银行、法律、咨询公司官网。'
  }
];

export const DEFAULT_LEVELS = [
  {
    id: ModificationLevel.SIMPLE,
    label: '基础线框 (Wireframe)',
    prompt: '忽略具体的配色和复杂的阴影。只关注布局结构、内容分区和基本的排版层级。使用黑白灰占位。适用于快速验证内容结构。'
  },
  {
    id: ModificationLevel.OPTIMIZED,
    label: '标准交付 (Professional)',
    prompt: '按照生产环境标准生成。配色和谐，间距统一，响应式完美适配。代码结构整洁。没有过度设计的动效，注重实用性和可读性。'
  },
  {
    id: ModificationLevel.CREATIVE,
    label: '高端视觉 (High-End)',
    prompt: '全力以赴追求视觉冲击力！使用复杂的 CSS 技巧：渐变文字 (text-transparent bg-clip-text)、多重阴影、背景模糊、微妙的缩放动画 (hover:scale-105)、容器边框光效 (ring/glow)。打破常规布局，让页面看起来像是一个得奖的设计作品 (Awwwards style)。'
  }
];

export const DEFAULT_PROVIDERS: LLMProviderConfig[] = [
  {
    providerId: 'gemini-official',
    type: 'google',
    label: 'Google Gemini (Official)',
    apiKey: '', // User must fill
    modelId: 'gemini-2.0-flash'
  },
  {
    providerId: 'openai-official',
    type: 'openai',
    label: 'OpenAI (Official)',
    apiKey: '',
    modelId: 'gpt-4o',
    baseUrl: 'https://api.openai.com/v1'
  },
  {
    providerId: 'groq',
    type: 'custom',
    label: 'Groq (Fast)',
    apiKey: '',
    modelId: 'llama-3.3-70b-versatile',
    baseUrl: 'https://api.groq.com/openai/v1'
  },
  {
    providerId: 'deepseek',
    type: 'custom',
    label: 'DeepSeek (Official)',
    apiKey: '',
    modelId: 'deepseek-chat',
    baseUrl: 'https://api.deepseek.com'
  },
  {
    providerId: 'xiaomi-mimo',
    type: 'custom',
    label: 'Xiaomi Mimo',
    apiKey: '',
    modelId: 'mimo-pro',
    baseUrl: 'https://api.xiaomimimo.com'
  }
];

export const DEFAULT_SETTINGS: GlobalSettings = {
  systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
  styles: DEFAULT_STYLES,
  levels: DEFAULT_LEVELS,
  
  // Provider Defaults
  activeProviderId: 'gemini-official',
  providers: DEFAULT_PROVIDERS,
  
  // Advanced
  enableWebSearch: false,
  enableReasoning: false,

  // Reverse Engineering Defaults
  reversePrompts: DEFAULT_REVERSE_PROMPTS
};

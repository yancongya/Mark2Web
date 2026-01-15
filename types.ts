
export enum OutputFormat {
  HTML = 'HTML (Single File)',
  PLAIN_HTML = 'Plain HTML (No CSS)',
  TSX = 'React (TSX Component)',
  VUE = 'Vue 3 (SFC)'
}

// Kept for backward compatibility references, but logic will use string IDs
export enum StylePreset {
  DEFAULT = 'default',
  BLOG = 'blog',
  LANDING = 'landing',
  MINIMALIST = 'minimalist',
  CORPORATE = 'corporate'
}

// Kept for backward compatibility references
export enum ModificationLevel {
  SIMPLE = 'simple',
  OPTIMIZED = 'optimized',
  CREATIVE = 'creative'
}

export type LLMProviderType = 'google' | 'openai' | 'custom' | 'ollama';

export interface LLMProviderConfig {
  providerId: string; // e.g., 'gemini-pro', 'gpt-4', 'deepseek-v3'
  type: LLMProviderType;
  label: string;
  baseUrl?: string; // Optional for Google/OpenAI default, required for Custom
  apiKey: string;
  modelId: string; // The actual model string ID sent to API
  supportsVision?: boolean;
  proxyUrl?: string; // Optional proxy URL for CORS-restricted APIs (e.g., Xiaomi Mimo)
}

export interface PromptPreset {
  id: string;
  label: string; // Display name in dropdown
  description?: string;
  prompt: string; // The actual instruction sent to LLM
}

export interface TechStackPreset {
  id: string; // e.g., 'html', 'react', 'vue'
  label: string; // e.g., 'HTML5', 'React (TSX)', 'Vue 3'
  format: OutputFormat; // Associated output format
  instruction: string; // Tech-specific instructions (replaces ### 关键技术 rules)
}

export interface ReversePromptConfig {
  contentSystem: string;
  contentUser: string;
  layoutSystem: string;
  layoutUser: string;
}

export interface GlobalSettings {
  systemInstruction: string;
  styles: PromptPreset[];
  levels: PromptPreset[];
  techStacks: TechStackPreset[]; // New: Tech stack instructions

  // New Provider Settings
  activeProviderId: string; // ID of the currently selected provider config
  providers: LLMProviderConfig[];

  // Advanced Features
  enableWebSearch: boolean; // Grounding / Networking
  enableReasoning: boolean; // Deep Thinking / Chain of Thought

  // Reverse Engineering Prompts
  reversePrompts: ReversePromptConfig;
}

export interface GenerationConfig {
  format: OutputFormat;
  style: string; // ID of the style preset
  level: string; // ID of the level preset
  customPrompt: string;
  temperature: number; // 0.0 to 1.0
}

export interface FileData {
  id?: string; // Optional for backward compatibility, but useful for versioning
  name: string;
  content: string;
  type: 'markdown' | 'text' | 'html' | 'react' | 'vue'; // Expanded types
  timestamp?: number;
}

export type GenerationMode = 'forward' | 'reverse';
export type ReverseOperationMode = 'content' | 'layout';

export interface GeneratedOutput {
  id: string;
  format: OutputFormat;
  code: string;
  timestamp: number;
  config: GenerationConfig;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  
  // Source Management (Multi-version)
  sources: FileData[]; 
  activeSourceId: string; // ID of the currently selected source version

  // Output Management (Multi-version)
  outputs: GeneratedOutput[];
  activeOutputId?: string; // ID of the currently selected output version
  
  lastConfig?: GenerationConfig;
  mode?: GenerationMode; // Track mode in history
  
  // Legacy support fields (optional)
  fileData?: FileData;
  lastActiveOutputId?: string;
}

// --- Editor Types ---

export interface SelectedElementData {
  tagName: string;
  className: string;
  outerHTML: string;
  innerText: string;
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  path: string;
}

export interface EditorMessage {
  type: 'SELECT_ELEMENT' | 'UPDATE_CONTENT' | 'EXEC_COMMAND';
  payload?: any;
  command?: string;
  value?: string;
}

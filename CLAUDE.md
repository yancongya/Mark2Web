# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MarkWeb** is an AI-powered frontend prototyping tool that converts Markdown/text into production-ready web components using LLMs (primarily Google Gemini). It supports both forward generation (text → code) and reverse engineering (code → analysis).

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture Overview

### Core Application Flow

1. **Input Layer**: File upload (Markdown/text/HTML/React/Vue) → `FileUploader.tsx`
2. **Configuration**: User settings via `ConfigPanel.tsx`
3. **Processing**: LLM service layer (`llmService.ts`, `geminiService.ts`)
4. **Output**: Generated code stored in history with multi-version support
5. **Display**: `ResultViewer.tsx` with preview/code tabs and visual editing

### Key State Management

- **AppContext**: Global settings, theme, language, API configuration
- **History Management**: Multi-project, multi-version system with localStorage persistence
- **Active Project Tracking**: Separate state for active source and output IDs

### Data Flow Architecture

```
User Input → FileUploader → handleFileLoaded() → HistoryItem
HistoryItem → ConfigPanel → handleGenerate() → LLM Service → GeneratedOutput
GeneratedOutput → ResultViewer → Visual Editor / Code Editor
```

### Component Structure

- **App.tsx**: Main orchestrator with state management and event handlers
- **LandingPage.tsx**: 3D animated landing with GSAP
- **ConfigPanel.tsx**: AI configuration, format/style selection, generation controls
- **ResultViewer.tsx**: Tabbed interface for source/preview/code with visual editor
- **HistorySidebar.tsx**: Project history management
- **SettingsModal.tsx**: Global LLM provider and system prompt configuration

### Service Layer

- **llmService.ts**: Main LLM orchestration, supports multiple providers
- **geminiService.ts**: Google GenAI specific implementation
- **defaults.ts**: Default configurations and presets
- **AppContext.tsx**: Global state, settings persistence, theme/language

### Data Models

**HistoryItem**: Contains multiple sources and outputs for versioning
- `sources[]`: Input files (Markdown, text, or code)
- `outputs[]`: Generated code outputs
- `activeSourceId`/`activeOutputId`: Current selection pointers

**GenerationConfig**: Output format, style preset, temperature, custom prompts

**GlobalSettings**: API keys, provider configs, system instructions, reverse prompts

### Key Features Implementation

- **Multi-format Export**: HTML, React TSX, Vue 3 SFC
- **Visual AI Editor**: Click-to-select elements with natural language modifications
- **Reverse Engineering**: Code analysis → Markdown PRD or content extraction
- **Streaming**: Real-time LLM response handling with chunk callbacks
- **Persistence**: localStorage for history, settings, theme, language

### Environment & Dependencies

- **React 19** with TypeScript
- **Vite** for build tooling
- **@google/genai** for AI integration
- **Tailwind CSS** (runtime injection for generated content)
- **GSAP** for animations
- **html-to-image** for screenshot export

### Important Files

- `types.ts`: All TypeScript interfaces and enums
- `translations.ts`: Bilingual UI strings (EN/ZH)
- `vite.config.ts`: Build configuration
- `index.tsx`: React entry point

### Development Notes

- Uses React hooks extensively (useState, useEffect, useCallback, useRef)
- State updates use functional updates for history array manipulation
- LLM streaming uses callback pattern for real-time updates
- Visual editor uses iframe messaging for element selection
- All user data persists in localStorage with versioned keys
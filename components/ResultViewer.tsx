
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Editor from 'react-simple-code-editor';
import { OutputFormat, SelectedElementData, GeneratedOutput, FileData } from '../types';
import { useAppContext } from '../contexts/AppContext';
import * as htmlToImage from 'html-to-image';
import FloatingEditor from './FloatingEditor';
import { modifyElementCode } from '../services/llmService';
import { marked } from 'marked'; // Ensure this is available in importmap

// Declare Prism
declare const Prism: any;

export type TabType = 'source' | 'preview' | string; // string for specific output IDs

interface ResultViewerProps {
  outputs: GeneratedOutput[];
  activeOutputId: string | null;
  onSelectOutput: (id: string) => void;
  onDeleteOutput?: (id: string) => void; // 新增：删除输出版本
  sources?: FileData[];
  activeSourceId?: string | null;
  onSelectSource?: (id: string) => void;
  onRenameSource?: (id: string, newName: string) => void;
  onDeleteSource?: (id: string) => void; // 新增：删除源文件版本

  sourceCode: string;
  fileName: string;
  isGenerating: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  activeTab: TabType; // 'source' or 'preview'
  onTabChange: (tab: TabType) => void;
  onUpdateCode: (id: string, newCode: string) => void;
  onUpdateSource: (newSource: string) => void;
}

// Extended Icons Set
const Icons = {
  File: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Trash: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Preview: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  Code: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  Download: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Copy: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  Check: () => <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Image: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Pdf: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Rotate: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Refresh: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Clock: () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  ChevronDown: ({ className }: { className?: string }) => <svg className={`w-3 h-3 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  Eye: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  EyeOff: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>,

  // Format Specific Icons
  Html: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4l2 16 8 4 8-4 2-16H2z"/><path d="M12 18l-4-1.5L7 9h10"/></svg>,
  React: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"/><path d="M12 2C7 2 3 6.5 3 12s4 10 9 10 9-4.5 9-10S17 2 12 2z"/><path d="M12 2c5 0 9 4.5 9 10s-4 10-9 10-9-4.5-9-10S7 2 12 2z" transform="rotate(60 12 12)"/><path d="M12 2c5 0 9 4.5 9 10s-4 10-9 10-9-4.5-9-10S7 2 12 2z" transform="rotate(120 12 12)"/></svg>,
  Vue: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22L2 4.5h3L12 18 19 4.5h3L12 22z"/><path d="M12 13L7.5 4.5h9L12 13z"/></svg>
};

// ... Injected Scripts (EDITOR_RUNTIME_SCRIPT, SIGNAL_SCRIPT, generatePreviewHtml) remain unchanged ...
// --- Injected Script (Visual Editor Logic) ---
const EDITOR_RUNTIME_SCRIPT = `
<script>
  (function() {
    let hoveredElement = null;
    let selectedElement = null;
    let isEditMode = false;
    const overlayId = 'mw-editor-overlay';

    const style = document.createElement('style');
    style.innerHTML = \`
      #\${overlayId} {
        position: fixed;
        border: 2px solid #3b82f6;
        background: transparent;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
        display: none;
        border-radius: 4px;
        box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.5);
      }
      [contenteditable="true"] { outline: none; }
      @media print {
        #\${overlayId} { display: none !important; }
        body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      }
    \`;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = overlayId;
    document.body.appendChild(overlay);

    function updateOverlay(el) {
        if (!el || !isEditMode) return;
        const rect = el.getBoundingClientRect();
        overlay.style.display = 'block';
        overlay.style.top = rect.top + 'px';
        overlay.style.left = rect.left + 'px';
        overlay.style.width = rect.width + 'px';
        overlay.style.height = rect.height + 'px';
    }

    function getScrollTop() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }

    let debounceTimer;
    function sendUpdate() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            window.parent.postMessage({ 
                type: 'CONTENT_UPDATED', 
                html: document.documentElement.outerHTML,
                scrollTop: getScrollTop()
            }, '*');
        }, 300);
    }

    function enableEditing(el) {
        if (!el) return;
        el.contentEditable = 'true';
        el.focus();
        el.addEventListener('input', () => { updateOverlay(el); sendUpdate(); });
    }

    function disableEditing(el) {
        if (!el) return;
        el.contentEditable = 'false';
    }

    window.addEventListener('message', (event) => {
      const type = event.data.type;
      
      if (type === 'TOGGLE_EDIT_MODE') {
        isEditMode = event.data.enabled;
        if (!isEditMode) {
          overlay.style.display = 'none';
          if(selectedElement) disableEditing(selectedElement);
          selectedElement = null;
        }
      }
      
      if (type === 'HIDE_OVERLAY') {
         overlay.style.display = 'none';
         if(selectedElement) disableEditing(selectedElement);
         selectedElement = null;
      }

      if (type === 'EXEC_COMMAND') {
          if (selectedElement) {
              if (document.activeElement !== selectedElement) selectedElement.focus();
              document.execCommand(event.data.command, false, event.data.value || null);
              sendUpdate();
          }
      }

      if (type === 'UPDATE_ELEMENT' && selectedElement) {
        if (event.data.html) {
             selectedElement.outerHTML = event.data.html;
             overlay.style.display = 'none';
             selectedElement = null;
             sendUpdate();
        } else if (event.data.className) {
            selectedElement.className = event.data.className;
            updateOverlay(selectedElement);
            sendUpdate();
        }
      }
    });

    document.addEventListener('mouseover', (e) => {
      if (!isEditMode) return;
      if (selectedElement) return;
      if (e.target.id === overlayId) return;
      hoveredElement = e.target;
      updateOverlay(hoveredElement);
    });

    window.addEventListener('scroll', () => {
         if (!isEditMode) return;
         if (selectedElement) updateOverlay(selectedElement);
         else if (hoveredElement && !selectedElement) updateOverlay(hoveredElement);
    }, true);

    document.addEventListener('click', (e) => {
      if (!isEditMode) return;
      if (selectedElement && selectedElement.contains(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      if (selectedElement && selectedElement !== e.target) disableEditing(selectedElement);
      selectedElement = e.target;
      updateOverlay(selectedElement);
      enableEditing(selectedElement);
      const rect = selectedElement.getBoundingClientRect();
      window.parent.postMessage({
        type: 'ELEMENT_SELECTED',
        payload: {
          tagName: selectedElement.tagName,
          className: selectedElement.className,
          outerHTML: selectedElement.outerHTML,
          innerText: selectedElement.innerText,
          rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
        }
      }, '*');
    }, true);
  })();
</script>
`;

// Script to signal that the preview has fully mounted
const SIGNAL_SCRIPT = `
<script>
  window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
</script>
`;

const escapeCodeForTemplate = (code: string) => {
    // Only need to break the closing script tag to prevent HTML parsing issues
    return code.replace(/<\/script>/g, '<\\/script>');
};

const generatePreviewHtml = (code: string, format: OutputFormat) => {
    const PRINT_STYLES = `
    <style>
        @media print {
            body { 
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important; 
            }
            #mw-editor-overlay { display: none !important; }
            ::-webkit-scrollbar { display: none; }
        }
    </style>
    `;

    if (format === OutputFormat.HTML || format === OutputFormat.PLAIN_HTML) {
        let res = code;
        if (code.includes('</head>')) {
             res = code.replace('</head>', `${PRINT_STYLES}</head>`);
        } else {
             res = PRINT_STYLES + res;
        }

        if (code.includes('</body>')) {
            res = res.replace('</body>', `${EDITOR_RUNTIME_SCRIPT}${SIGNAL_SCRIPT}</body>`);
        } else {
            res = res + EDITOR_RUNTIME_SCRIPT + SIGNAL_SCRIPT;
        }
        return res;
    }
    
    // REACT
    if (format === OutputFormat.TSX) {
        // --- DETECTION START ---
        if (code.includes('<template>') && code.includes('<script')) {
             return `
             <!DOCTYPE html>
             <html>
             <head><title>Format Mismatch</title></head>
             <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #fff1f2; color: #9f1239;">
                <div style="text-align: center; padding: 20px; border: 1px solid #fda4af; background: white; border-radius: 8px;">
                    <h3 style="margin-top: 0;">⚠️ Format Mismatch</h3>
                    <p>The generated code appears to be <strong>Vue</strong>, but the output format is set to <strong>React</strong>.</p>
                    <p>Please switch output format to Vue or regenerate.</p>
                </div>
                <script>window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');</script>
             </body>
             </html>`;
        }
        // --- DETECTION END ---

        let cleanCode = code;
        cleanCode = cleanCode.replace(/import\s+\{([\s\S]*?)\}\s+from\s+['"]lucide-react['"];?/g, 'const {$1} = window.lucideReact;');
        // Improved regex to handle multiline imports
        cleanCode = cleanCode.replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '').replace(/import\s+['"].*?['"];?/g, '');
        
        let componentName = null;
        const functionMatch = cleanCode.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/);
        if (functionMatch) { componentName = functionMatch[1]; cleanCode = cleanCode.replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/, 'function $1'); }
        
        if (!componentName) {
            const classMatch = cleanCode.match(/export\s+default\s+class\s+([A-Za-z0-9_]+)/);
            if (classMatch) { componentName = classMatch[1]; cleanCode = cleanCode.replace(/export\s+default\s+class\s+([A-Za-z0-9_]+)/, 'class $1'); }
        }

        if (!componentName) {
            const identifierMatch = cleanCode.match(/export\s+default\s+([A-Za-z0-9_]+)\s*;?/);
            if (identifierMatch && !identifierMatch[1].startsWith('{')) { componentName = identifierMatch[1]; cleanCode = cleanCode.replace(/export\s+default\s+([A-Za-z0-9_]+)\s*;?/, ''); }
        }

        if (!componentName && cleanCode.match(/export\s+default\s+(function|\(|{)/)) {
             cleanCode = cleanCode.replace(/export\s+default/, 'const App =');
             componentName = 'App';
        }

        // Catch-all for simple "export default () => ..." arrow functions commonly generated
        if (!componentName && cleanCode.match(/export\s+default\s+\(/)) {
             cleanCode = cleanCode.replace(/export\s+default/, 'const App =');
             componentName = 'App';
        }

        const escapedReactCode = escapeCodeForTemplate(cleanCode);

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js" crossorigin></script>
    <script src="https://unpkg.com/lucide@0.294.0" crossorigin></script>
    <style>body { margin: 0; padding: 0; } .error-overlay { position: fixed; top: 0; left: 0; width: 100%; padding: 20px; background: #fee2e2; color: #991b1b; z-index: 10000; font-family: monospace; border-bottom: 2px solid #7f1d1d; }</style>
    ${PRINT_STYLES}
</head>
<body>
    <div id="root"></div>
    <div id="error-container"></div>
    <script>
      window.onerror = function(message, source, lineno, colno, error) { 
        const container = document.getElementById('error-container'); 
        container.innerHTML = '<div class="error-overlay"><h3>Runtime Error</h3><p>' + message + '</p><small>' + source + ':' + lineno + '</small></div>'; 
        console.error("Preview Error:", message, error);
        window.parent.postMessage({ type: 'PREVIEW_READY' }, '*'); 
      };
      window.lucideReact = {};
      if (window.lucide && window.lucide.icons) {
        Object.keys(window.lucide.icons).forEach(key => {
           window.lucideReact[key] = (props) => {
              const { color = "currentColor", size = 24, strokeWidth = 2, className, ...rest } = props;
              const iconNode = window.lucide.icons[key]; 
              if (!iconNode) return null;
              const [tag, baseAttrs, childrenNodes] = iconNode;
              const createEl = (node, index) => {
                 const [childTag, childAttrs, childChildren] = node;
                 return React.createElement(childTag, { ...childAttrs, key: index }, childChildren ? childChildren.map((c, i) => createEl(c, i)) : null);
              };
              const children = (childrenNodes || []).map((child, i) => createEl(child, i));
              return React.createElement('svg', { ...baseAttrs, width: size, height: size, stroke: color, strokeWidth: strokeWidth, className: className ? ('lucide lucide-' + key + ' ' + className) : ('lucide lucide-' + key), ...rest }, children);
           };
        });
      }
    </script>
    <script type="text/babel" data-presets="react,typescript">
      try {
        const { useState, useEffect, useRef, useCallback, useMemo, useReducer, useContext, createContext } = React;
        ${escapedReactCode}
        
        let RenderComponent;
        if (typeof App !== 'undefined') RenderComponent = App;
        
        if (!RenderComponent) {
            ${componentName && componentName !== 'App' ? `if (typeof ${componentName} !== 'undefined') RenderComponent = ${componentName};` : ''}
        }
        
        if (!RenderComponent) {
            if (typeof Page !== 'undefined') RenderComponent = Page;
            else if (typeof Component !== 'undefined') RenderComponent = Component;
            else if (typeof Hero !== 'undefined') RenderComponent = Hero;
            else if (typeof Main !== 'undefined') RenderComponent = Main;
            else if (typeof LandingPage !== 'undefined') RenderComponent = LandingPage;
            else if (typeof Portfolio !== 'undefined') RenderComponent = Portfolio;
        }

        if (!RenderComponent) throw new Error("Could not find a component to render. Ensure you export default a component.");
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<RenderComponent />);
        window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
      } catch (e) {
        console.error("React Render Error:", e);
        document.getElementById('error-container').innerHTML = '<div class="error-overlay"><h3>Render Error</h3><p>' + e.message + '</p></div>';
        window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
      }
    </script>
    ${EDITOR_RUNTIME_SCRIPT}
</body>
</html>`;
    }
    
    // VUE
    if (format === OutputFormat.VUE) {
        const escapedVueCode = escapeCodeForTemplate(code);
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue3-sfc-loader/dist/vue3-sfc-loader.js"></script>
    <style>body { margin: 0; padding: 0; } .error-overlay { position: fixed; top: 0; left: 0; width: 100%; padding: 20px; background: #fee2e2; color: #991b1b; z-index: 10000; font-family: monospace; border-bottom: 2px solid #7f1d1d; }</style>
    ${PRINT_STYLES}
</head>
<body>
    <div id="app"></div>
    <div id="error-container"></div>
    <script>
        window.onerror = function(message) { document.getElementById('error-container').innerHTML = '<div class="error-overlay"><h3>Error</h3><p>' + message + '</p></div>'; window.parent.postMessage({ type: 'PREVIEW_READY' }, '*'); };
        const { loadModule } = window['vue3-sfc-loader'];
        const options = {
            moduleCache: { vue: Vue },
            async getFile(url) {
                if (url === '/App.vue' || url === './App.vue') return \`${escapedVueCode}\`;
                try {
                    const res = await fetch(url);
                    if ( !res.ok ) throw Object.assign(new Error(res.statusText + ' ' + url), { res });
                    return { getContentData: asBinary => asBinary ? res.arrayBuffer() : res.text() }
                } catch(e) { console.error("Failed to fetch module:", url, e); throw e; }
            },
            addStyle(textContent) { const style = document.createElement('style'); style.textContent = textContent; document.head.appendChild(style); },
            pathResolve({ refPath, relPath }) {
                if ( relPath === 'vue' ) return 'vue';
                if ( relPath.startsWith('.') || relPath.startsWith('/') ) return relPath;
                return \`https://esm.sh/\${relPath}?external=vue\`;
            },
            log(type, ...args) { if (type === 'error') { document.getElementById('error-container').innerHTML = '<div class="error-overlay"><h3>Compilation Error</h3><p>' + args.join(' ') + '</p></div>'; window.parent.postMessage({ type: 'PREVIEW_READY' }, '*'); } }
        }
        const app = Vue.createApp({
            components: { 'App': Vue.defineAsyncComponent(() => loadModule('/App.vue', options).catch(err => { console.error("Vue Load Error:", err); document.getElementById('error-container').innerHTML = '<div class="error-overlay"><h3>Load Error</h3><p>' + err.message + '</p></div>'; throw err; })) },
            template: '<App />'
        });
        app.mount('#app');
        window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
    </script>
    ${EDITOR_RUNTIME_SCRIPT}
</body>
</html>`;
    }
    return code;
};

const ResultViewer: React.FC<ResultViewerProps> = ({
  outputs,
  activeOutputId,
  onSelectOutput,
  onDeleteOutput,
  sources,
  activeSourceId,
  onSelectSource,
  onRenameSource,
  onDeleteSource,
  sourceCode,
  fileName,
  isGenerating,
  isFullscreen,
  onToggleFullscreen,
  activeTab,
  onTabChange,
  onUpdateCode,
  onUpdateSource
}) => {
  const { t } = useAppContext();
  
  // Viewport State for Preview
  const [viewportMode, setViewportMode] = useState('responsive');
  const [width, setWidth] = useState(1000);
  const [height, setHeight] = useState(800);
  const [imageScale, setImageScale] = useState(2); 
  
  // Editor State
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<SelectedElementData | null>(null);
  const [editorPos, setEditorPos] = useState({ top: 0, left: 0 });
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  
  // Split View State
  const [showMdPreview, setShowMdPreview] = useState(false);

  // Loading State
  const [isLoadingPreview, setIsLoadingPreview] = useState(activeTab === 'preview');
  
  // Dropdown state - separate for each location
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);      // Top bar - output tab group dropdown
  const [showPreviewVersionDropdown, setShowPreviewVersionDropdown] = useState(false); // Preview tab version selector
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const previewDropdownRef = useRef<HTMLDivElement>(null);
  const sourceDropdownRef = useRef<HTMLDivElement>(null);

  // Renaming Source State
  const [isRenamingSource, setIsRenamingSource] = useState(false);
  const [tempSourceName, setTempSourceName] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);
  
  // Ref for self-update check
  const isSelfUpdateRef = useRef(false);
  
  // Scroll Persistence
  const lastScrollPosRef = useRef<number>(0);

  // Ref for iframe
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [previewContent, setPreviewContent] = useState('');

  // Copy Feedback
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Derived Values
  const activeOutput = outputs.find(o => o.id === activeOutputId);
  const generatedCode = activeOutput?.code || '';
  const format = activeOutput?.format || OutputFormat.HTML;

  // Allow preview for all formats now (using browser-side compilation for React/Vue)
  const canPreview = true;

  // Compute extensions
  const sourceExt = fileName.endsWith('.md') ? 'markdown' : 'text';
  const codeExt = format === OutputFormat.TSX ? 'tsx' : format === OutputFormat.VUE ? 'markup' : 'markup';
  const displayExt = format === OutputFormat.TSX ? 'TSX' : format === OutputFormat.VUE ? 'VUE' : 'HTML';
  const codeFileName = format === OutputFormat.TSX ? 'App.tsx' : format === OutputFormat.VUE ? 'App.vue' : 'index.html';

  // --- Grouping Logic ---
  const groupedOutputs = useMemo(() => {
    const groups: { [key: string]: GeneratedOutput[] } = {};
    
    // Group
    outputs.forEach(out => {
        if (!groups[out.format]) groups[out.format] = [];
        groups[out.format].push(out);
    });
    
    // Sort each group desc (newest first)
    Object.keys(groups).forEach(key => {
        groups[key].sort((a, b) => b.timestamp - a.timestamp);
    });

    return groups;
  }, [outputs]);

  // Click outside to close dropdowns
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          const target = event.target as Node;
          // Close output tab group dropdown
          if (dropdownRef.current && !dropdownRef.current.contains(target)) {
              setShowVersionDropdown(false);
          }
          // Close preview tab version dropdown
          if (previewDropdownRef.current && !previewDropdownRef.current.contains(target)) {
              setShowPreviewVersionDropdown(false);
          }
          // Close source dropdown
          if (sourceDropdownRef.current && !sourceDropdownRef.current.contains(target)) {
              setShowSourceDropdown(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle renaming focus
  useEffect(() => {
    if (isRenamingSource && renameInputRef.current) {
        renameInputRef.current.focus();
        renameInputRef.current.select();
    }
  }, [isRenamingSource]);

  // Inject script and handle scroll restoration
  useEffect(() => {
    if (isSelfUpdateRef.current) {
        isSelfUpdateRef.current = false;
        return;
    }

    if (activeTab === 'preview') {
        if (isGenerating) {
             setPreviewContent(''); 
             return;
        }

        if (generatedCode) {
            setIsLoadingPreview(true);
            let injected = generatePreviewHtml(generatedCode, format);
            if (lastScrollPosRef.current > 0) {
               injected += `<script>setTimeout(function(){ window.scrollTo(0, ${lastScrollPosRef.current}); }, 10);</script>`;
            }
            setPreviewContent(injected);
            const timer = setTimeout(() => setIsLoadingPreview(false), 5000); 
            return () => clearTimeout(timer);
        } else {
            setPreviewContent('');
        }
    }
  }, [generatedCode, format, activeTab, isGenerating]);

  // Handle Messages from Iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
        if (e.data.type === 'ELEMENT_SELECTED') {
            const payload = e.data.payload as SelectedElementData;
            if (iframeRef.current) {
                setSelectedElement(payload);
                setEditorPos({
                    top: payload.rect.top + payload.rect.height + 8,
                    left: Math.max(0, payload.rect.left)
                });
            }
        } else if (e.data.type === 'CONTENT_UPDATED') {
            if (format !== OutputFormat.HTML && format !== OutputFormat.PLAIN_HTML) return;
            const rawHtml = e.data.html as string;
            isSelfUpdateRef.current = true;
            if (typeof e.data.scrollTop === 'number') lastScrollPosRef.current = e.data.scrollTop;
            const cleanHtml = rawHtml.replace(EDITOR_RUNTIME_SCRIPT.trim(), '').replace(EDITOR_RUNTIME_SCRIPT, '');
            if(activeOutputId) onUpdateCode(activeOutputId, cleanHtml);
        } else if (e.data.type === 'PREVIEW_READY') {
            setIsLoadingPreview(false);
        }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onUpdateCode, format, activeOutputId]);

  // Handle Tab Switching State to avoid Flicker
  useEffect(() => {
      if (activeTab === 'preview') {
          if (generatedCode && !isGenerating) setIsLoadingPreview(true);
      }
  }, [activeTab]);


  // Toggle Edit Mode & Reset Overlay
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'TOGGLE_EDIT_MODE', enabled: isEditMode }, '*');
        if (!isEditMode) {
             setSelectedElement(null);
             iframeRef.current.contentWindow.postMessage({ type: 'HIDE_OVERLAY' }, '*');
        }
    }
  }, [isEditMode, activeTab]);

  useEffect(() => {
    switch(viewportMode) {
        case 'mobile': setWidth(375); setHeight(667); break;
        case 'tablet': setWidth(768); setHeight(1024); break;
        case 'desktop': setWidth(1440); setHeight(900); break;
        case 'a4': setWidth(794); setHeight(1123); break;
        case 'letter': setWidth(816); setHeight(1056); break;
        case 'responsive': setWidth(1000); setHeight(800); break;
    }
  }, [viewportMode]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(text === generatedCode ? 'code' : 'source');
      setTimeout(() => setCopyFeedback(null), 2000);
    });
  };

  const handleDownload = () => {
    const content = activeTab === 'source' ? sourceCode : generatedCode;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab === 'source' ? fileName : codeFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRotate = () => {
    const newWidth = height;
    const newHeight = width;
    setWidth(newWidth);
    setHeight(newHeight);
    setViewportMode('custom');
  };
  
  const handleRefresh = () => {
    if (!generatedCode) return;
    setIsLoadingPreview(true);
    const currentContent = previewContent;
    setPreviewContent('');
    setTimeout(() => setPreviewContent(currentContent), 10);
  };

  const handleCloseEditor = () => {
      setSelectedElement(null);
      iframeRef.current?.contentWindow?.postMessage({ type: 'HIDE_OVERLAY' }, '*');
  };

  const handleAiEdit = async (instruction: string) => {
      if (!selectedElement) return;
      setIsAiProcessing(true);
      try {
        const newHtml = await modifyElementCode(selectedElement.outerHTML, instruction);
        iframeRef.current?.contentWindow?.postMessage({ type: 'UPDATE_ELEMENT', html: newHtml }, '*');
      } catch (err) {
        alert("Failed to modify element");
      } finally {
        setIsAiProcessing(false);
      }
  };

  const handleClassEdit = (newClasses: string) => {
      if (!selectedElement) return;
      iframeRef.current?.contentWindow?.postMessage({ type: 'UPDATE_ELEMENT', className: newClasses }, '*');
  };

  const handleCommand = (command: string, value?: string) => {
      if (!selectedElement) return;
      iframeRef.current?.contentWindow?.postMessage({ type: 'EXEC_COMMAND', command, value }, '*');
  };

  const handleJumpToCode = () => {
      if (selectedElement && activeOutputId) onTabChange(activeOutputId);
  };

  const handleExportPDF = () => {
    if (activeTab === 'preview' && iframeRef.current && iframeRef.current.contentWindow) {
        try {
            iframeRef.current.contentWindow.focus();
            iframeRef.current.contentWindow.print();
        } catch (e) {
            console.error("Print error:", e);
            alert("Export failed. Please try right-clicking the preview and selecting Print.");
        }
    } else {
        alert(t('preview_unavailable'));
    }
  };

  const handleExportImage = async () => {
    if (!iframeRef.current || !iframeRef.current.contentDocument) return;
    try {
        const doc = iframeRef.current.contentDocument;
        const element = doc.documentElement; 
        const width = element.scrollWidth;
        const height = element.scrollHeight;

        const dataUrl = await htmlToImage.toPng(element, {
            backgroundColor: '#ffffff',
            width: width,
            height: height,
            pixelRatio: imageScale,
            filter: (node) => {
                const tagName = (node.tagName || '').toUpperCase();
                if (node.id === 'mw-editor-overlay') return false;
                if (tagName === 'SCRIPT') return false;
                return true;
            },
            style: { width: `${width}px`, height: `${height}px`, transform: 'none', overflow: 'visible' }
        });

        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `preview-${fileName.replace(/\./g, '_')}-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error("Export image failed:", error);
    }
  };

  const highlightCode = (code: string, language: string) => {
    if (typeof Prism === 'undefined') return code;
    let prismLang = language;
    if (language === 'html' || language === 'vue') prismLang = 'markup';
    if (language === 'text') return code; 
    const grammar = Prism.languages[prismLang];
    if (!grammar) return code;
    return Prism.highlight(code, grammar, prismLang);
  };

  const getStatusBarInfo = () => {
    if (activeTab === 'preview') return isEditMode ? t('editor_active') : t('preview');
    const text = activeTab === 'source' ? sourceCode : generatedCode;
    const lines = text.split('\n').length;
    return `Ln ${lines}, Col 1  Spaces: 2  UTF-8  ${activeTab === 'source' ? sourceExt.toUpperCase() : displayExt}`;
  };

  // Refs for scroll sync - separate for source and code editors
  const sourceLineNumbersRef = useRef<HTMLDivElement>(null);
  const sourceEditorContainerRef = useRef<HTMLDivElement>(null);
  const codeLineNumbersRef = useRef<HTMLDivElement>(null);
  const codeEditorContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll sync for source editor
  const handleSourceScroll = () => {
      if (sourceEditorContainerRef.current && sourceLineNumbersRef.current) {
          sourceLineNumbersRef.current.scrollTop = sourceEditorContainerRef.current.scrollTop;
      }
  };

  // Handle scroll sync for code editor
  const handleCodeScroll = () => {
      if (codeEditorContainerRef.current && codeLineNumbersRef.current) {
          codeLineNumbersRef.current.scrollTop = codeEditorContainerRef.current.scrollTop;
      }
  };

  // Helper to render editor with line numbers
  const renderEditorWithLineNumbers = (
    code: string,
    onChange: (val: string) => void,
    language: string,
    lineNumbersRef: React.RefObject<HTMLDivElement>,
    editorContainerRef: React.RefObject<HTMLDivElement>,
    onScroll: () => void
  ) => {
    const lineCount = code.split('\n').length;
    const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

    return (
        <div className="flex flex-1 h-full overflow-hidden bg-white dark:bg-slate-950 font-mono text-[14px]">
            <div
                ref={lineNumbersRef}
                className="flex-shrink-0 flex flex-col items-end bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-[#858585] border-r border-slate-200 dark:border-[#333] select-none py-[10px] px-4 min-w-[50px] text-right overflow-hidden transition-colors"
                style={{ height: '100%', overflow: 'hidden' }}
            >
                {lines.map(n => (
                    <div key={n} className="leading-[1.5] h-[21px]">{n}</div>
                ))}
            </div>
            <div
                ref={editorContainerRef}
                className="flex-1 h-full overflow-auto custom-scrollbar relative"
                onScroll={onScroll}
            >
                 <Editor
                    value={code}
                    onValueChange={onChange}
                    highlight={code => highlightCode(code, language)}
                    padding={10}
                    textareaClassName="focus:outline-none"
                    style={{
                        fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                        fontSize: 14,
                        backgroundColor: 'transparent',
                        minHeight: '100%',
                    }}
                />
            </div>
        </div>
    );
  };

  const getFormatLabel = (fmt: OutputFormat) => {
      switch(fmt) {
          case OutputFormat.HTML: return 'HTML';
          case OutputFormat.PLAIN_HTML: return 'Plain HTML';
          case OutputFormat.TSX: return 'React';
          case OutputFormat.VUE: return 'Vue';
          default: return 'Code';
      }
  };
  
  const getFormatIcon = (fmt: OutputFormat) => {
      switch(fmt) {
          case OutputFormat.HTML: 
          case OutputFormat.PLAIN_HTML: return <Icons.Html />;
          case OutputFormat.TSX: return <Icons.React />;
          case OutputFormat.VUE: return <Icons.Vue />;
          default: return <Icons.Code />;
      }
  };
  
  const getFormatColor = (fmt: OutputFormat) => {
       switch(fmt) {
          case OutputFormat.HTML: 
          case OutputFormat.PLAIN_HTML: return 'text-orange-600 dark:text-orange-400';
          case OutputFormat.TSX: return 'text-blue-600 dark:text-blue-400';
          case OutputFormat.VUE: return 'text-green-600 dark:text-green-400';
          default: return 'text-slate-500';
      }
  };

  // Skeleton logic: show during generation OR during preview loading (but only if actually loading content)
  const showSkeleton = isGenerating || (isLoadingPreview && activeTab === 'preview' && generatedCode);
  
  const finishRename = () => {
      if (tempSourceName.trim() && activeSourceId && onRenameSource) {
          onRenameSource(activeSourceId, tempSourceName.trim());
      }
      setIsRenamingSource(false);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 text-slate-800 dark:text-[#d4d4d4] border border-slate-200 dark:border-[#333] rounded-lg overflow-hidden shadow-xl transition-colors">
      
      {/* Top Tab Bar */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-[#1e1e1e] transition-colors overflow-visible">
        {/* Source Tab (Redesigned with Custom Dropdown) */}
        <div
            className={`relative h-full flex items-center border-r border-slate-200 dark:border-[#1e1e1e] min-w-[160px] max-w-[240px] transition-colors overflow-visible
            ${activeTab === 'source' ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-t-2 border-t-brand-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-[#969696] hover:bg-white dark:hover:bg-[#2a2d2e]'}
            `}
            onClick={() => onTabChange('source')}
        >
            <div className="flex-1 flex items-center gap-2 px-3 py-3 text-xs text-left cursor-pointer h-full select-none overflow-hidden">
                <span className="text-yellow-500 dark:text-yellow-400 font-bold flex-shrink-0">J</span>
                
                <div className="flex items-center gap-1 min-w-0 flex-1 group/title" title={fileName}>
                    {isRenamingSource ? (
                        <input
                            ref={renameInputRef}
                            type="text"
                            value={tempSourceName}
                            onChange={(e) => setTempSourceName(e.target.value)}
                            onBlur={finishRename}
                            onKeyDown={(e) => e.key === 'Enter' && finishRename()}
                            className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-brand-500 rounded px-1 py-0.5 w-full outline-none text-xs"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <button
                            onDoubleClick={(e) => {
                                e.stopPropagation();
                                setTempSourceName(fileName);
                                setIsRenamingSource(true);
                            }}
                            onClick={(e) => {
                                if (sources && sources.length > 1) {
                                    e.stopPropagation();
                                    setShowSourceDropdown(!showSourceDropdown);
                                    onTabChange('source');
                                }
                            }}
                            className="truncate font-medium flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 transition-colors outline-none w-full text-left"
                        >
                            <span className="truncate">{fileName}</span>
                            {sources && sources.length > 1 && (
                                <Icons.ChevronDown className={`w-3 h-3 opacity-50 transition-transform ${showSourceDropdown ? 'rotate-180' : ''}`} />
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Eye Icon - Fixed Display for Markdown files */}
            {fileName.endsWith('.md') && (
                <button 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        setShowMdPreview(!showMdPreview);
                        // Optional: Switch to source tab if not active? 
                        // The user said "not only when selecting this label", implying interaction works regardless
                        if(activeTab !== 'source') onTabChange('source'); 
                    }}
                    className={`mr-2 p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex-shrink-0 ${showMdPreview ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}
                    title={showMdPreview ? "Close Split View" : "Open Split View"}
                >
                    {showMdPreview ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
            )}

            {/* Custom Source Dropdown - Absolute positioning to overlay */}
            {showSourceDropdown && (
                <div ref={sourceDropdownRef} className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-[9999] overflow-hidden flex flex-col animate-fade-in-up">
                     <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                         Version History
                     </div>
                     <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                         {sources?.slice().sort((a,b) => (b.timestamp||0) - (a.timestamp||0)).map((s) => (
                             <div key={s.id} className="flex items-center gap-1 group">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onSelectSource && s.id) onSelectSource(s.id);
                                        setShowSourceDropdown(false);
                                    }}
                                    className={`flex-1 flex items-center gap-3 px-3 py-2 text-xs rounded-md transition-colors text-left
                                        ${s.id === activeSourceId ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}
                                    `}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="truncate font-medium">{s.name}</div>
                                        <div className="text-[10px] opacity-60 font-mono">
                                            {new Date(s.timestamp || 0).toLocaleTimeString()}
                                        </div>
                                    </div>
                                    {s.id === activeSourceId && <Icons.Check />}
                                </button>
                                {/* Delete Button - Only show if there are multiple sources */}
                                {onDeleteSource && sources.length > 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm(`删除源文件 "${s.name}"?`)) {
                                                onDeleteSource(s.id);
                                            }
                                        }}
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                                        title="删除此源文件"
                                    >
                                        <Icons.Trash />
                                    </button>
                                )}
                             </div>
                         ))}
                     </div>
                </div>
            )}
        </div>

        {/* Grouped Output Tabs */}
        {Object.entries(groupedOutputs).map(([formatStr, groupOutputs]) => {
             const formatType = formatStr as OutputFormat;
             const isGroupActive = groupOutputs.some(o => o.id === activeOutputId);
             // Find current active version in this group, or default to latest
             const currentActiveVersion = isGroupActive 
                ? groupOutputs.find(o => o.id === activeOutputId) || groupOutputs[0]
                : groupOutputs[0];
                
             const isTabSelected = isGroupActive && activeTab === 'code';
             const hasMultipleVersions = groupOutputs.length > 1;

             return (
                 <div
                    key={formatStr}
                    className={`relative h-full flex items-center border-r border-slate-200 dark:border-[#1e1e1e] min-w-[120px] transition-colors group overflow-visible
                        ${isTabSelected ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-t-2 border-t-brand-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-[#969696] hover:bg-white dark:hover:bg-[#2a2d2e]'}
                        ${isGroupActive && activeTab === 'preview' ? 'bg-slate-50 dark:bg-slate-800 border-t-2 border-t-brand-500/50' : ''}
                    `}
                >
                    <button 
                         onClick={() => { 
                             if (!isGroupActive) {
                                 onSelectOutput(groupOutputs[0].id); 
                             }
                             onTabChange('code'); 
                         }}
                         className="flex-1 h-full flex flex-col justify-center px-4 py-1 text-xs w-full text-left relative"
                    >
                        <div className="flex items-center gap-2">
                            <span className={getFormatColor(formatType)}>{getFormatIcon(formatType)}</span>
                            <span className="font-semibold">{getFormatLabel(formatType)}</span>
                        </div>
                        
                        {/* Version Badge (Only if active) */}
                        {isGroupActive && (
                            <div className="absolute bottom-[2px] right-[4px] text-[9px] opacity-60 font-mono">
                                v{groupOutputs.length - groupOutputs.findIndex(o => o.id === currentActiveVersion.id)} 
                            </div>
                        )}
                    </button>
                    
                    {/* Version Selector Trigger */}
                    {isGroupActive && hasMultipleVersions && (
                        <div className="relative h-full flex items-center pr-1 border-l border-slate-200 dark:border-slate-700/50 overflow-visible">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowVersionDropdown(!showVersionDropdown);
                                }}
                                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-[#3c3c3c] text-slate-500 cursor-pointer"
                            >
                                <Icons.ChevronDown className={`transition-transform ${showVersionDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            {/* Dropdown Menu for Output Tab Group - Absolute positioning to overlay */}
                            {showVersionDropdown && (
                                <div ref={dropdownRef} className="absolute top-full right-0 mt-1 w-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-[9999] animate-fade-in-up">
                                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                                        {Object.entries(groupedOutputs).map(([fmt, outs]) => (
                                            <div key={fmt} className="mb-2 last:mb-0">
                                                <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50 rounded mt-1 mb-1 flex justify-between items-center">
                                                    <span>{getFormatLabel(fmt as OutputFormat)}</span>
                                                </div>
                                                {outs.map((out, index) => {
                                                    const version = outs.length - index;
                                                    const isActive = out.id === activeOutputId;
                                                    return (
                                                        <div key={out.id} className="flex items-center gap-1 group">
                                                            <button
                                                                onClick={() => {
                                                                    onSelectOutput(out.id);
                                                                    setShowVersionDropdown(false);
                                                                }}
                                                                className={`flex-1 flex items-center gap-3 px-3 py-2 text-xs rounded-md transition-colors text-left
                                                                    ${isActive ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}
                                                                `}
                                                            >
                                                                <span className={getFormatColor(fmt as OutputFormat)}>{getFormatIcon(fmt as OutputFormat)}</span>
                                                                <div className="flex-1 flex justify-between items-center">
                                                                    <span className="font-medium">v{version}</span>
                                                                    <span className="text-[10px] opacity-50 font-mono whitespace-nowrap">
                                                                        {new Date(out.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
                                                                    </span>
                                                                </div>
                                                                {isActive && <Icons.Check />}
                                                            </button>
                                                            {/* Delete Button - Only show if there are multiple versions */}
                                                            {onDeleteOutput && outs.length > 1 && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (confirm(`删除版本 v${version}?`)) {
                                                                            onDeleteOutput(out.id);
                                                                        }
                                                                    }}
                                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                                    title="删除此版本"
                                                                >
                                                                    <Icons.Trash />
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
             );
        })}

        {/* Preview Tab */}
        <button 
            onClick={() => onTabChange('preview')} 
            disabled={!canPreview && !generatedCode && !isGenerating} 
            className={`flex items-center gap-2 px-4 py-3 text-xs border-r border-slate-200 dark:border-[#1e1e1e] min-w-[100px] transition-colors ml-auto md:ml-0 border-l md:border-l-0
                ${activeTab === 'preview' ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-t-2 border-t-brand-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-[#969696] hover:bg-white dark:hover:bg-[#2a2d2e]'} 
                ${(!canPreview || (!generatedCode && !isGenerating)) ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
          <span className="text-green-600 dark:text-green-400"><Icons.Preview /></span>{t('preview')}
        </button>
        
        <div className="hidden md:flex flex-1 bg-slate-100 dark:bg-slate-900 h-full"></div>


        <div className="flex items-center bg-slate-100 dark:bg-slate-900 h-full px-2 gap-1">
             {activeTab !== 'preview' && (
                <button onClick={() => handleCopy(activeTab === 'source' ? sourceCode : generatedCode)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-[#3c3c3c] rounded text-slate-600 dark:text-[#cccccc]">{copyFeedback === activeTab || copyFeedback === (activeTab === 'source' ? 'source' : 'code') ? <Icons.Check /> : <Icons.Copy />}</button>
             )}
             <button onClick={handleDownload} className="p-1.5 hover:bg-slate-200 dark:hover:bg-[#3c3c3c] rounded text-slate-600 dark:text-[#cccccc]"><Icons.Download /></button>
             <button onClick={onToggleFullscreen} className={`p-1.5 hover:bg-slate-200 dark:hover:bg-[#3c3c3c] rounded text-slate-600 dark:text-[#cccccc] ${isFullscreen ? 'text-slate-900 dark:text-white' : ''}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isFullscreen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />}
                </svg>
             </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden bg-white dark:bg-slate-950 flex flex-col transition-colors">
        {isGenerating && (
             <div className="absolute top-0 left-0 w-full h-1 bg-slate-200 dark:bg-[#2d2d2d] overflow-hidden z-20">
                <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite] w-1/3"></div>
             </div>
        )}

        {activeTab === 'source' && (
            <div className="flex h-full w-full">
                {/* Editor Area */}
                <div className={`flex flex-col h-full overflow-hidden ${showMdPreview ? 'w-1/2 border-r border-slate-200 dark:border-[#333]' : 'w-full'}`}>
                    {renderEditorWithLineNumbers(
                        sourceCode,
                        onUpdateSource,
                        sourceExt,
                        sourceLineNumbersRef,
                        sourceEditorContainerRef,
                        handleSourceScroll
                    )}
                </div>

                {/* Preview Area (Split View) */}
                {showMdPreview && (
                    <div className="w-1/2 h-full overflow-auto custom-scrollbar bg-white dark:bg-slate-950 p-8 prose dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: marked.parse(sourceCode) as string }} />
                    </div>
                )}
            </div>
        )}

        {activeTab === 'code' && activeOutputId && (
            renderEditorWithLineNumbers(
                generatedCode,
                (val) => onUpdateCode(activeOutputId, val),
                codeExt,
                codeLineNumbersRef,
                codeEditorContainerRef,
                handleCodeScroll
            )
        )}
        {activeTab === 'code' && !activeOutputId && (
            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-[#6e7681] w-full h-full">
                <Icons.Code />
                <span className="mt-2 text-sm">{t('ready_to_generate')}</span>
            </div>
        )}

        {activeTab === 'preview' && (
            <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950">
                {/* Preview Toolbar */}
                <div className="h-10 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-[#1e1e1e] flex items-center px-4 justify-between select-none transition-colors relative z-20 overflow-visible">
                   <div className="flex items-center gap-3">
                       <select value={viewportMode} onChange={(e) => setViewportMode(e.target.value)} className="bg-white dark:bg-[#333] text-slate-700 dark:text-white text-xs border border-slate-300 dark:border-[#3c3c3c] rounded px-2 py-1 outline-none focus:border-brand-500 hover:bg-slate-50 dark:hover:bg-[#3c3c3c]">
                            <option value="responsive">{t('viewport_responsive')}</option>
                            <option value="mobile">{t('viewport_mobile')}</option>
                            <option value="tablet">{t('viewport_tablet')}</option>
                            <option value="desktop">{t('viewport_desktop')}</option>
                            <option value="a4">{t('viewport_a4')}</option>
                            <option value="letter">{t('viewport_letter')}</option>
                            <option value="custom">{t('viewport_custom')}</option>
                       </select>
                       <div className="flex items-center text-xs text-slate-500 dark:text-gray-400 gap-2">
                           <div className="flex items-center bg-white dark:bg-slate-950 border border-slate-300 dark:border-[#3c3c3c] rounded overflow-hidden">
                               <span className="px-1.5 py-1 bg-slate-100 dark:bg-[#333] border-r border-slate-300 dark:border-[#3c3c3c]">{t('width')}</span>
                               <input type="number" value={width} onChange={(e) => { setWidth(Number(e.target.value)); setViewportMode('custom'); }} className="w-12 bg-transparent text-slate-700 dark:text-white px-1.5 py-1 outline-none text-center appearance-none" disabled={viewportMode === 'responsive'} />
                           </div>
                           <span>×</span>
                           <div className="flex items-center bg-white dark:bg-slate-950 border border-slate-300 dark:border-[#3c3c3c] rounded overflow-hidden">
                               <span className="px-1.5 py-1 bg-slate-100 dark:bg-[#333] border-r border-slate-300 dark:border-[#3c3c3c]">{t('height')}</span>
                               <input type="number" value={height} onChange={(e) => { setHeight(Number(e.target.value)); setViewportMode('custom'); }} className="w-12 bg-transparent text-slate-700 dark:text-white px-1.5 py-1 outline-none text-center appearance-none" disabled={viewportMode === 'responsive'} />
                           </div>
                           <button onClick={handleRotate} title={t('rotate')} disabled={viewportMode === 'responsive'} className="p-1 hover:bg-slate-200 dark:hover:bg-[#3c3c3c] rounded text-slate-600 dark:text-white disabled:opacity-30 disabled:cursor-not-allowed"><Icons.Rotate /></button>
                       </div>
                   </div>

                   {/* VISUAL EDITOR TOGGLE */}
                   {canPreview && (
                       <div className="flex items-center gap-2 border-l border-slate-300 dark:border-[#3c3c3c] pl-3 ml-2">
                           <button 
                             onClick={() => setIsEditMode(!isEditMode)}
                             className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded border transition-colors ${isEditMode ? 'bg-brand-600 border-brand-500 text-white' : 'bg-white dark:bg-[#333] border-slate-300 dark:border-[#3c3c3c] text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-[#3c3c3c]'}`}
                           >
                             <Icons.Edit />
                             {isEditMode ? t('editor_active') : t('editor_enable')}
                           </button>
                           <button 
                                onClick={handleRefresh}
                                className="flex items-center justify-center w-6 h-6 rounded hover:bg-slate-200 dark:hover:bg-[#3c3c3c] text-slate-500 dark:text-white transition-colors"
                                title="Refresh Preview"
                           >
                               <Icons.Refresh />
                           </button>
                       </div>
                   )}

                   {/* Output Switcher for Preview (Custom Dropdown) */}
                   {outputs.length > 0 && activeOutputId && (
                       <div className="relative ml-2 border-l border-slate-300 dark:border-[#3c3c3c] pl-3 overflow-visible" ref={previewDropdownRef}>
                           <button
                                onClick={() => setShowPreviewVersionDropdown(!showPreviewVersionDropdown)}
                                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-[#3c3c3c] text-slate-500 cursor-pointer"
                           >
                               <Icons.ChevronDown className={`transition-transform ${showPreviewVersionDropdown ? 'rotate-180' : ''}`} />
                           </button>

                           {/* Dropdown Menu - Absolute positioning to overlay */}
                           {showPreviewVersionDropdown && (
                               <div ref={previewDropdownRef} className="absolute top-full right-0 mt-1 w-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-[9999] animate-fade-in-up">
                                   <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                                       {Object.entries(groupedOutputs).map(([fmt, outs]) => (
                                           <div key={fmt} className="mb-2 last:mb-0">
                                               <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50 rounded mt-1 mb-1">
                                                   {getFormatLabel(fmt as OutputFormat)}
                                               </div>
                                               {outs.map((out, index) => {
                                                   const version = outs.length - index;
                                                   const isActive = out.id === activeOutputId;
                                                   return (
                                                       <div key={out.id} className="flex items-center gap-1 group">
                                                           <button
                                                               onClick={() => {
                                                                   onSelectOutput(out.id);
                                                                   setShowPreviewVersionDropdown(false);
                                                               }}
                                                               className={`flex-1 flex items-center gap-3 px-3 py-2 text-xs rounded-md transition-colors text-left
                                                                   ${isActive ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}
                                                               `}
                                                           >
                                                               <span className={getFormatColor(fmt as OutputFormat)}>{getFormatIcon(fmt as OutputFormat)}</span>
                                                               <div className="flex-1 flex justify-between items-center">
                                                                   <span className="font-medium">v{version}</span>
                                                                   <span className="text-[10px] opacity-50 font-mono whitespace-nowrap">
                                                                       {new Date(out.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
                                                                   </span>
                                                               </div>
                                                               {isActive && <Icons.Check />}
                                                           </button>
                                                           {/* Delete Button - Only show if there are multiple versions */}
                                                           {onDeleteOutput && outs.length > 1 && (
                                                               <button
                                                                   onClick={(e) => {
                                                                       e.stopPropagation();
                                                                       if (confirm(`删除版本 v${version}?`)) {
                                                                           onDeleteOutput(out.id);
                                                                       }
                                                                   }}
                                                                   className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                                   title="删除此版本"
                                                               >
                                                                   <Icons.Trash />
                                                               </button>
                                                           )}
                                                       </div>
                                                   );
                                               })}
                                           </div>
                                       ))}
                                   </div>
                               </div>
                           )}
                       </div>
                   )}

                   <div className="flex items-center gap-2 ml-auto">
                        <div className="flex items-center gap-1 mr-2" title={t('scale')}>
                             <span className="text-xs text-slate-500 dark:text-gray-500">{t('scale')}:</span>
                             <select value={imageScale} onChange={(e) => setImageScale(Number(e.target.value))} className="bg-white dark:bg-[#333] text-slate-700 dark:text-white text-xs border border-slate-300 dark:border-[#3c3c3c] rounded px-1 py-0.5 outline-none">
                                 <option value={1}>1x</option>
                                 <option value={2}>2x</option>
                                 <option value={3}>3x</option>
                             </select>
                        </div>
                        <button onClick={handleExportImage} className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[#333] hover:bg-slate-50 dark:hover:bg-[#3c3c3c] text-xs text-slate-700 dark:text-white rounded border border-slate-300 dark:border-[#3c3c3c] transition-colors"><Icons.Image />{t('export_image')}</button>
                        <button onClick={handleExportPDF} className="flex items-center gap-1.5 px-3 py-1 bg-brand-600 dark:bg-brand-700 hover:bg-brand-700 dark:hover:bg-brand-600 text-xs text-white rounded border border-brand-700 dark:border-brand-800 transition-colors"><Icons.Pdf />{t('export_pdf')}</button>
                   </div>
                </div>

                {/* Preview Content */}
                <div className={`flex-1 w-full relative bg-slate-100 dark:bg-slate-900 overflow-auto custom-scrollbar ${viewportMode !== 'responsive' ? 'flex p-8' : ''}`}>
                     {canPreview ? (
                         <div 
                            ref={containerRef}
                            style={viewportMode === 'responsive' ? { width: '100%', height: '100%' } : { width: `${width}px`, height: `${height}px`, minWidth: `${width}px`, minHeight: `${height}px` }} 
                            className={`bg-white transition-all duration-300 relative shadow-2xl ${viewportMode !== 'responsive' ? 'm-auto ring-1 ring-black/10 dark:ring-white/10' : ''}`}
                         >
                            {/* Loading Overlay with Skeleton Animation - Always render but control opacity */}
                            <div 
                                className={`absolute inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col transition-opacity duration-300 ease-out overflow-hidden pointer-events-none
                                    ${showSkeleton ? 'opacity-100 pointer-events-auto' : 'opacity-0'}
                                `}
                            >
                                {/* Skeleton Header */}
                                <div className="h-14 border-b border-slate-100 dark:border-slate-800 flex items-center px-6 gap-4">
                                    <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                                    <div className="w-32 h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                                    <div className="ml-auto flex gap-3">
                                        <div className="hidden md:block w-20 h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                                        <div className="hidden md:block w-20 h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                                    </div>
                                </div>
                                
                                {/* Skeleton Content */}
                                <div className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto custom-scrollbar">
                                    {/* Hero Section */}
                                    <div className="w-full aspect-[21/9] rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                                            <div className="w-2/3 h-8 md:h-12 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                                            <div className="w-1/2 h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                                            <div className="mt-4 w-32 h-10 rounded-lg bg-slate-300 dark:bg-slate-700 animate-pulse"></div>
                                        </div>
                                    </div>

                                    {/* Grid Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="h-48 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-3">
                                                <div className="w-10 h-10 rounded bg-slate-200 dark:bg-slate-800 animate-pulse mb-1"></div>
                                                <div className="w-3/4 h-5 rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                                                <div className="w-full h-2 rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                                                <div className="w-5/6 h-2 rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                                                <div className="w-4/6 h-2 rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Status Badge */}
                                <div className="absolute bottom-6 right-6 flex items-center gap-2.5 px-4 py-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-full shadow-xl z-10">
                                        <div className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 tracking-wide">
                                        AI Constructing...
                                        </span>
                                </div>
                            </div>

                            <iframe
                                ref={iframeRef}
                                srcDoc={previewContent}
                                title="Preview"
                                className="w-full h-full border-none bg-white block"
                                sandbox="allow-scripts allow-same-origin allow-modals"
                            />
                            {/* Render Floating Editor inside this relative container so positioning is easier */}
                            {isEditMode && selectedElement && (
                                <FloatingEditor 
                                    selectedElement={selectedElement}
                                    initialPosition={editorPos}
                                    onClose={handleCloseEditor}
                                    onAiEdit={handleAiEdit}
                                    onClassEdit={handleClassEdit}
                                    onCommand={handleCommand}
                                    onJumpToCode={handleJumpToCode}
                                    isProcessing={isAiProcessing}
                                />
                            )}
                        </div>
                     ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-[#6e7681] w-full h-full">
                            <Icons.Code />
                            <span className="mt-2 text-sm">{t('preview_unavailable')}</span>
                        </div>
                     )}
                </div>
            </div>
        )}
      </div>

      {activeTab !== 'preview' && (
        <div className="h-6 bg-[#007acc] text-white text-[11px] flex items-center px-3 justify-between select-none font-sans flex-shrink-0">
           <div className="flex items-center gap-4">
               <span className="flex items-center gap-1 hover:bg-white/10 px-1 rounded cursor-pointer">
                   <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/></svg>
                   master*
               </span>
               <span className="hover:bg-white/10 px-1 rounded cursor-pointer">{generatedCode && activeTab === 'code' ? '0 errors' : ''}</span>
           </div>
           <div className="flex items-center gap-4">
              <span className="hover:bg-white/10 px-1 rounded cursor-pointer">{getStatusBarInfo()}</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default ResultViewer;

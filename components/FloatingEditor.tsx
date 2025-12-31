
import React, { useState, useEffect, useRef } from 'react';
import { SelectedElementData } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface FloatingEditorProps {
  selectedElement: SelectedElementData | null;
  initialPosition: { top: number; left: number };
  onClose: () => void;
  onAiEdit: (instruction: string) => Promise<void>;
  onClassEdit: (newClasses: string) => void;
  onCommand: (command: string, value?: string) => void;
  onJumpToCode: () => void;
  isProcessing: boolean;
}

const FloatingEditor: React.FC<FloatingEditorProps> = ({
  selectedElement,
  initialPosition,
  onClose,
  onAiEdit,
  onClassEdit,
  onCommand,
  onJumpToCode,
  isProcessing
}) => {
  const { t } = useAppContext();
  
  // Panel State
  const [activePanel, setActivePanel] = useState<'ai' | 'style' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [color, setColor] = useState('#000000');

  // Draggable State
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number, y: number } | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Initialize position when element changes, but only if not already moved manually
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition.top, initialPosition.left]);

  // When selection changes, update input if panel is open
  useEffect(() => {
    if (selectedElement && activePanel === 'style') {
      setInputValue(selectedElement.className);
    } else {
      setInputValue('');
    }
  }, [selectedElement, activePanel]);

  // Drag Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current) return;
      
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      
      setPosition(prev => ({
        left: prev.left + dx,
        top: prev.top + dy
      }));
      
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const startDrag = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('textarea')) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePanelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (activePanel === 'ai') {
      await onAiEdit(inputValue);
      setInputValue('');
      setActivePanel(null);
    } else if (activePanel === 'style') {
      onClassEdit(inputValue);
      setActivePanel(null);
    }
  };

  // Helper to prevent focus loss from iframe when clicking toolbar buttons
  const preventFocusLoss = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  if (!selectedElement) return null;

  // Calculate safe position to keep within viewport
  // Limit top to ensure it's visible, allow going slightly off bottom
  const safeLeft = Math.min(Math.max(0, position.left), window.innerWidth - 450);
  const safeTop = Math.max(0, position.top);

  return (
    <div 
      ref={toolbarRef}
      className="fixed z-50 font-sans animate-fade-in-up"
      style={{ top: safeTop, left: safeLeft }}
    >
        {/* Main Toolbar */}
        <div 
            className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 cursor-move select-none ring-1 ring-black/5"
            onMouseDown={startDrag}
        >
             {/* Tag Badge */}
             <div className="bg-brand-600 text-white text-[10px] font-mono px-2 py-1.5 rounded mr-1 flex items-center shadow-sm">
                {selectedElement.tagName.toLowerCase()}
            </div>

            {/* Left: AI & Style Triggers */}
            <div className="flex items-center gap-1 pr-2 border-r border-slate-200 dark:border-slate-700">
                <button
                    onMouseDown={preventFocusLoss}
                    onClick={() => setActivePanel(activePanel === 'ai' ? null : 'ai')}
                    className={`p-1.5 rounded-md transition-colors ${activePanel === 'ai' ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/50 dark:text-brand-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    title={t('editor_ai')}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </button>
                <button
                    onMouseDown={preventFocusLoss}
                    onClick={() => setActivePanel(activePanel === 'style' ? null : 'style')}
                    className={`p-1.5 rounded-md transition-colors ${activePanel === 'style' ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/50 dark:text-brand-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    title={t('editor_style')}
                >
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                </button>
            </div>

            {/* Middle: Rich Text Actions */}
            <div className="flex items-center gap-0.5 px-1">
                {/* B/I/U */}
                <button onMouseDown={preventFocusLoss} onClick={() => onCommand('bold')} className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title={t('editor_bold')}><strong className="font-serif font-bold">B</strong></button>
                <button onMouseDown={preventFocusLoss} onClick={() => onCommand('italic')} className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title={t('editor_italic')}><em className="font-serif italic">I</em></button>
                <button onMouseDown={preventFocusLoss} onClick={() => onCommand('underline')} className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title={t('editor_underline')}><span className="underline">U</span></button>
                
                {/* Separator */}
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>

                {/* Alignment */}
                <button onMouseDown={preventFocusLoss} onClick={() => onCommand('justifyLeft')} className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title={t('editor_align_left')}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" /></svg>
                </button>
                <button onMouseDown={preventFocusLoss} onClick={() => onCommand('justifyCenter')} className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title={t('editor_align_center')}>
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" /></svg>
                </button>
                <button onMouseDown={preventFocusLoss} onClick={() => onCommand('justifyRight')} className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded" title={t('editor_align_right')}>
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" /></svg>
                </button>

                {/* Separator */}
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                
                {/* Colors */}
                <div className="flex items-center gap-1 relative group">
                    <label 
                        className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 cursor-pointer overflow-hidden relative shadow-sm hover:scale-110 transition-transform"
                        title={t('editor_color')}
                        onMouseDown={preventFocusLoss}
                    >
                        <input 
                            type="color" 
                            value={color}
                            onChange={(e) => {
                                setColor(e.target.value);
                                onCommand('foreColor', e.target.value);
                            }}
                            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 border-0"
                        />
                         <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: color }}></div>
                    </label>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-700">
                <button 
                    onMouseDown={preventFocusLoss}
                    onClick={onJumpToCode}
                    className="p-1.5 text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                    title={t('editor_jump')}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </button>
                <button 
                    onMouseDown={preventFocusLoss}
                    onClick={onClose}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title={t('editor_close')}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>

        {/* Expansion Panels (AI Input or Style Input) */}
        {activePanel && (
            <div className="mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-3 w-[300px]">
                 <form onSubmit={handlePanelSubmit}>
                    {activePanel === 'ai' ? (
                        <div>
                             <textarea 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Instruct AI (e.g., 'Make background gradient')"
                                className="w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded p-2 min-h-[80px] focus:ring-1 focus:ring-brand-500 outline-none resize-none mb-2"
                                autoFocus
                             />
                             <div className="flex justify-end">
                                <button type="submit" disabled={isProcessing} className="bg-brand-600 text-white text-xs px-3 py-1.5 rounded hover:bg-brand-700 disabled:opacity-50 flex items-center gap-1">
                                    {isProcessing && <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                    {t('editor_generate')}
                                </button>
                             </div>
                        </div>
                    ) : (
                        <div>
                             <input 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Tailwind classes..."
                                className="w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded p-2 mb-2 focus:ring-1 focus:ring-brand-500 outline-none font-mono"
                                autoFocus
                             />
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-400">Press Enter to apply</span>
                                <button type="submit" className="bg-brand-600 text-white text-xs px-3 py-1.5 rounded hover:bg-brand-700">{t('editor_apply')}</button>
                             </div>
                        </div>
                    )}
                 </form>
            </div>
        )}
    </div>
  );
};

export default FloatingEditor;


import React, { useRef, useState } from 'react';
import { FileData } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface FileUploaderProps {
  onFileLoaded: (data: FileData) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileLoaded }) => {
  const { t } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [textInput, setTextInput] = useState('');

  const handleFile = (file: File) => {
    const isMarkdown = file.name.endsWith('.md') || file.name.endsWith('.txt');
    const isCode = file.name.endsWith('.html') || file.name.endsWith('.tsx') || file.name.endsWith('.vue') || file.name.endsWith('.ts') || file.name.endsWith('.js');

    if (isMarkdown || isCode) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        
        let type: FileData['type'] = 'text';
        if (file.name.endsWith('.md')) type = 'markdown';
        else if (file.name.endsWith('.html')) type = 'html';
        else if (file.name.endsWith('.tsx')) type = 'react';
        else if (file.name.endsWith('.vue')) type = 'vue';
        else if (file.name.endsWith('.ts') || file.name.endsWith('.js')) type = 'react'; // fallback to react for general ts/js

        onFileLoaded({
          name: file.name,
          content,
          type
        });
      };
      reader.readAsText(file);
    } else {
      alert(t('upload_alert'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    onFileLoaded({
      name: 'untitled.txt',
      content: textInput,
      type: 'text'
    });
  };

  return (
    <div className="w-full">
        {/* Mode Switcher */}
        <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-lg mb-6">
            <button 
                onClick={() => setMode('upload')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'upload' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600 dark:text-brand-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
                {t('upload_mode')}
            </button>
            <button 
                 onClick={() => setMode('paste')}
                 className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'paste' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-600 dark:text-brand-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
                {t('paste_mode')}
            </button>
        </div>

        {mode === 'upload' ? (
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer min-h-[200px] flex flex-col items-center justify-center
                ${dragActive 
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30' 
                    : 'border-slate-300 dark:border-slate-700 hover:border-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept=".md,.txt,.html,.tsx,.vue,.ts,.js" 
                onChange={handleChange}
              />
              <div className="flex flex-col items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div>
                  <p className="text-lg font-medium text-slate-700 dark:text-slate-200">{t('upload_title')}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('upload_subtitle')}</p>
                </div>
              </div>
            </div>
        ) : (
             <div className="flex flex-col gap-4 animate-fade-in-up">
                <textarea 
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={t('paste_placeholder')}
                    className="w-full h-[200px] p-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none custom-scrollbar outline-none text-sm font-mono"
                    autoFocus
                />
                <button 
                    onClick={handleTextSubmit}
                    disabled={!textInput.trim()}
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
                >
                    {t('start_editing')}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
            </div>
        )}
    </div>
  );
};

export default FileUploader;

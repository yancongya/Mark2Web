
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import ConfigPanel from './components/ConfigPanel';
import HistorySidebar from './components/HistorySidebar';
import FileUploader from './components/FileUploader';
import ResultViewer, { TabType } from './components/ResultViewer';
import LandingPage from './components/LandingPage';
import SettingsModal from './components/SettingsModal';
import { generateWebPage, reverseEngineerCode } from './services/llmService';
import { GenerationConfig, OutputFormat, FileData, HistoryItem, GeneratedOutput, GenerationMode, ReverseOperationMode } from './types';
import { DEFAULT_STYLES, DEFAULT_LEVELS } from './services/defaults';
import { AppProvider, useAppContext } from './contexts/AppContext';

const AppContent: React.FC = () => {
  const { t, settings } = useAppContext();

  // View State
  const [view, setView] = useState<'landing' | 'app'>('landing');

  // Layout State
  const [showHistory, setShowHistory] = useState(true);
  const [showConfig, setShowConfig] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Viewer State
  const [activeTab, setActiveTab] = useState<TabType>('source');

  // Data State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Active Project Data
  const [activeSourceId, setActiveSourceId] = useState<string | null>(null);
  const [activeOutputId, setActiveOutputId] = useState<string | null>(null);

  // Default config - USE IDs now
  const [draftConfig, setDraftConfig] = useState<GenerationConfig>({
    format: OutputFormat.HTML,
    style: DEFAULT_STYLES[0].id,
    level: DEFAULT_LEVELS[1].id,
    customPrompt: '',
    temperature: 0.5
  });

  // Track previous ID to prevent unwanted resets
  const prevActiveIdRef = useRef<string | null>(null);

  // --- Persistence ---
  useEffect(() => {
    const saved = localStorage.getItem('markweb_history_v2');
    if (saved) {
      try {
        const parsed: any[] = JSON.parse(saved);
        // Migration: Ensure 'sources' array exists for old data
        const migrated: HistoryItem[] = parsed.map(item => {
            if (!item.sources) {
                // Migrate old single fileData to sources array
                const initialSource = { ...item.fileData, id: `src-${item.timestamp}`, timestamp: item.timestamp };
                return {
                    ...item,
                    sources: [initialSource],
                    activeSourceId: initialSource.id
                };
            }
            return item;
        });
        setHistory(migrated);
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
        localStorage.setItem('markweb_history_v2', JSON.stringify(history));
    }
  }, [history]);

  // --- View Switching ---
  const handleStart = () => {
    setView('app');
  };

  const handleGoToLanding = () => {
    setView('landing');
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
        setIsFullscreen(false);
        setShowHistory(true);
        setShowConfig(true);
    } else {
        setIsFullscreen(true);
        setShowHistory(false);
        setShowConfig(false);
    }
  };

  // --- Selection Logic ---
  useEffect(() => {
    if (activeId) {
      const item = history.find(h => h.id === activeId);
      if (item) {
        // Load active source
        if (item.activeSourceId) {
            setActiveSourceId(item.activeSourceId);
        } else if (item.sources.length > 0) {
            setActiveSourceId(item.sources[0].id || null);
        }

        // Load config from last active output if possible, or project default
        if (item.lastConfig) setDraftConfig(item.lastConfig);
        
        // Restore last active output tab if available
        if (item.activeOutputId && item.outputs.some(o => o.id === item.activeOutputId)) {
            setActiveOutputId(item.activeOutputId);
        } else if (item.outputs.length > 0) {
            setActiveOutputId(item.outputs[0].id);
        } else {
            setActiveOutputId(null);
        }

        if (prevActiveIdRef.current !== activeId) {
             // Logic to switch tab on project load based on what's most relevant
             // If we have outputs, show code preview. If only source, show source.
             if (item.outputs.length > 0) {
                const activeOut = item.outputs.find(o => o.id === (item.activeOutputId || item.outputs[0].id));
                const activeOutFormat = activeOut?.format || OutputFormat.HTML;
                const isPreviewable = activeOut && (activeOutFormat === OutputFormat.HTML || activeOutFormat === OutputFormat.PLAIN_HTML);
                setActiveTab(isPreviewable ? 'preview' : 'code');
            } else {
                setActiveTab('source');
            }
        }
      }
    }
    prevActiveIdRef.current = activeId;
  }, [activeId, history]);

  // Update active pointers for persistence
  useEffect(() => {
      if (activeId) {
          setHistory(prev => prev.map(h => {
              if (h.id === activeId) {
                  return {
                      ...h,
                      activeSourceId: activeSourceId || h.activeSourceId,
                      activeOutputId: activeOutputId || h.activeOutputId
                  };
              }
              return h;
          }));
      }
  }, [activeOutputId, activeSourceId, activeId]);

  const handleNewProject = useCallback(() => {
    setActiveId(null);
    prevActiveIdRef.current = null;
    setActiveSourceId(null);
    setActiveOutputId(null);
    setDraftConfig({
      format: OutputFormat.HTML,
      style: DEFAULT_STYLES[0].id,
      level: DEFAULT_LEVELS[1].id,
      customPrompt: '',
      temperature: 0.5
    });
    setActiveTab('source');
  }, []);

  const handleFileLoaded = useCallback((data: FileData) => {
    const isCode = data.type === 'html' || data.type === 'react' || data.type === 'vue';
    const now = Date.now();
    const newId = `proj-${now}`;
    
    // Create Initial Source
    const initialSource: FileData = { 
        ...data, 
        id: `src-${now}`,
        timestamp: now,
    };

    let initialOutputs: GeneratedOutput[] = [];
    let initialSources: FileData[] = [];
    let initialActiveSourceId = '';
    let initialActiveOutputId = '';

    if (isCode) {
        // Code Upload Mode
        const newOutputId = `out-${now}`;
        let format = OutputFormat.HTML;
        if(data.type === 'react') format = OutputFormat.TSX;
        if(data.type === 'vue') format = OutputFormat.VUE;

        const initialOutput: GeneratedOutput = {
            id: newOutputId,
            format: format,
            code: data.content,
            timestamp: now,
            config: draftConfig 
        };
        
        // Placeholder source for code upload
        const placeholderSource: FileData = {
            id: `src-${now}`,
            name: data.name.replace(/\.[^/.]+$/, "") + ".md",
            content: "", // Initial empty content for reverse flow
            type: 'markdown',
            timestamp: now
        };

        initialOutputs = [initialOutput];
        initialSources = [placeholderSource];
        initialActiveSourceId = placeholderSource.id!;
        initialActiveOutputId = newOutputId;
    } else {
        // Text/MD Upload Mode
        initialSource.id = `src-${now}`; // Ensure ID
        initialSources = [initialSource];
        initialActiveSourceId = initialSource.id;
    }

    const newItem: HistoryItem = {
        id: newId,
        timestamp: now,
        sources: initialSources,
        activeSourceId: initialActiveSourceId,
        outputs: initialOutputs,
        activeOutputId: initialActiveOutputId,
        lastConfig: draftConfig,
        mode: isCode ? 'reverse' : 'forward'
    };

    setHistory(prev => [newItem, ...prev]);
    setActiveId(newId);
    setActiveSourceId(initialActiveSourceId);
    if(initialActiveOutputId) setActiveOutputId(initialActiveOutputId);
    
    // Set Tab
    setActiveTab(isCode ? 'preview' : 'source');

  }, [activeId, draftConfig]);

  const handleResetFile = useCallback(() => {
    if (activeId && activeSourceId) {
        setHistory(prev => prev.map(item => {
            if (item.id === activeId) {
                // Remove the active source
                const newSources = item.sources.filter(s => s.id !== activeSourceId);
                // If no sources left, go to empty state
                if (newSources.length === 0) {
                    return { ...item, sources: [], activeSourceId: '' };
                }
                // Fallback to the latest remaining source
                return { ...item, sources: newSources, activeSourceId: newSources[newSources.length - 1].id! };
            }
            return item;
        }));
        // Note: The useEffect will sync activeSourceId state from history update
    } else {
        setActiveSourceId(null);
    }
  }, [activeId, activeSourceId]);

  const handleDeleteHistory = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => {
        const newHistory = prev.filter(item => item.id !== id);
        if(newHistory.length === 0) localStorage.removeItem('markweb_history_v2');
        return newHistory;
    });
    if (activeId === id) {
      handleNewProject();
    }
  }, [activeId, handleNewProject]);

  const handleUpdateCode = (outputId: string, newCode: string) => {
    if (activeId) {
      setHistory(prev => prev.map(item => {
          if (item.id === activeId) {
              return {
                  ...item,
                  outputs: item.outputs.map(o => o.id === outputId ? { ...o, code: newCode } : o)
              };
          }
          return item;
      }));
    }
  };

  const handleUpdateSource = (newSourceContent: string) => {
    if (activeId && activeSourceId) {
        setHistory(prev => prev.map(item => {
            if (item.id === activeId) {
                return {
                    ...item,
                    sources: item.sources.map(s => s.id === activeSourceId ? { ...s, content: newSourceContent } : s)
                };
            }
            return item;
        }));
    }
  };

  const handleRenameSource = (sourceId: string, newName: string) => {
      if (activeId) {
          setHistory(prev => prev.map(item => {
              if (item.id === activeId) {
                  return {
                      ...item,
                      sources: item.sources.map(s => s.id === sourceId ? { ...s, name: newName } : s)
                  };
              }
              return item;
          }));
      }
  };

  const handleDeleteOutput = (outputId: string) => {
      if (!activeId) return;

      setHistory(prev => prev.map(item => {
          if (item.id === activeId) {
              const newOutputs = item.outputs.filter(o => o.id !== outputId);
              let newActiveOutputId = item.activeOutputId;

              // If we deleted the active output, select another one
              if (item.activeOutputId === outputId) {
                  newActiveOutputId = newOutputs.length > 0 ? newOutputs[newOutputs.length - 1].id : null;
              }

              return {
                  ...item,
                  outputs: newOutputs,
                  activeOutputId: newActiveOutputId
              };
          }
          return item;
      }));

      // Update state if we deleted the active output
      setHistory(prev => {
          const currentItem = prev.find(item => item.id === activeId);
          if (currentItem && currentItem.activeOutputId !== activeOutputId) {
              setActiveOutputId(currentItem.activeOutputId);
          }
          return prev;
      });
  };

  const handleDeleteSource = (sourceId: string) => {
      if (!activeId) return;

      setHistory(prev => prev.map(item => {
          if (item.id === activeId) {
              const newSources = item.sources.filter(s => s.id !== sourceId);
              let newActiveSourceId = item.activeSourceId;

              // If we deleted the active source, select another one
              if (item.activeSourceId === sourceId) {
                  newActiveSourceId = newSources.length > 0 ? newSources[newSources.length - 1].id : null;
              }

              return {
                  ...item,
                  sources: newSources,
                  activeSourceId: newActiveSourceId
              };
          }
          return item;
      }));

      // Update state if we deleted the active source
      setHistory(prev => {
          const currentItem = prev.find(item => item.id === activeId);
          if (currentItem && currentItem.activeSourceId !== activeSourceId) {
              setActiveSourceId(currentItem.activeSourceId);
          }
          return prev;
      });
  };

  // --- ACTION: Generate Code (Forward) ---
  const handleGenerate = async () => {
    const activeProject = history.find(h => h.id === activeId);
    const currentSource = activeProject?.sources.find(s => s.id === activeSourceId);
    if (!currentSource) return;

    setIsGenerating(true);
    setActiveTab('preview'); 

    const now = Date.now();
    let currentId = activeId;
    const newOutputId = `out-${now}`;

    // Add new output placeholder
    const newOutput: GeneratedOutput = {
        id: newOutputId,
        timestamp: now,
        format: draftConfig.format,
        config: draftConfig,
        code: '' // Empty start
    };

    setHistory(prev => prev.map(item => 
        item.id === currentId 
        ? { 
            ...item, 
            outputs: [...item.outputs, newOutput],
            activeOutputId: newOutputId,
            lastConfig: draftConfig
          }
        : item
    ));
    setActiveOutputId(newOutputId);

    try {
      const finalCode = await generateWebPage(
        currentSource.content, 
        draftConfig,
        settings, 
        (chunk) => {
          setHistory(prev => prev.map(item => {
            if (item.id === currentId) {
                return {
                    ...item,
                    outputs: item.outputs.map(o => o.id === newOutputId ? { ...o, code: chunk } : o)
                };
            }
            return item;
          }));
        }
      );
      
      // Finalize
      setHistory(prev => prev.map(item => {
        if (item.id === currentId) {
            return {
                ...item,
                outputs: item.outputs.map(o => o.id === newOutputId ? { ...o, code: finalCode } : o)
            };
        }
        return item;
      }));

    } catch (error: any) {
      const msg = error.message || t('error_generation');
      alert(`Generation Failed: ${msg}`);
      setActiveTab('code'); 
    } finally {
      setIsGenerating(false);
    }
  };

  // --- ACTION: Reverse Engineer (Backward) ---
  const handleReverse = async (mode: ReverseOperationMode) => {
      const activeProject = history.find(h => h.id === activeId);
      const currentOutput = activeProject?.outputs.find(o => o.id === activeOutputId);
      if (!currentOutput) return;

      setIsGenerating(true);
      setActiveTab('source'); 

      const now = Date.now();
      const newSourceId = `src-${now}`;
      
      // Determine unique filename
      const baseName = currentOutput.format === OutputFormat.HTML ? 'index' : 'App';
      const suffix = mode === 'layout' ? 'Layout.md' : 'Content.md';
      
      // Create a clean name based on version count
      const versionNum = (activeProject?.sources.length || 0) + 1;
      const newName = `${baseName}_v${versionNum}_${suffix}`;
      
      // Add new Source Placeholder
      const newSource: FileData = {
          id: newSourceId,
          name: newName,
          content: '',
          type: 'markdown',
          timestamp: now
      };

      setHistory(prev => prev.map(item => 
        item.id === activeId 
        ? { 
            ...item, 
            sources: [...item.sources, newSource],
            activeSourceId: newSourceId
          }
        : item
      ));
      
      // Immediately switch focus to the new source so the user sees the stream
      setActiveSourceId(newSourceId);

      try {
          const finalText = await reverseEngineerCode(
              currentOutput.code,
              mode,
              settings,
              (chunk) => {
                  setHistory(prev => prev.map(item => {
                      if (item.id === activeId) {
                          return {
                              ...item,
                              sources: item.sources.map(s => s.id === newSourceId ? { ...s, content: chunk } : s)
                          };
                      }
                      return item;
                  }));
              }
          );
          
          setHistory(prev => prev.map(item => {
              if (item.id === activeId) {
                  return {
                      ...item,
                      sources: item.sources.map(s => s.id === newSourceId ? { ...s, content: finalText } : s)
                  };
              }
              return item;
          }));

      } catch (error: any) {
          alert(`Analysis Failed: ${error.message}`);
      } finally {
          setIsGenerating(false);
      }
  };

  // Helpers
  const activeProject = history.find(h => h.id === activeId);
  const currentSources = activeProject ? activeProject.sources : [];
  const currentOutputs = activeProject ? activeProject.outputs : [];
  const activeSource = currentSources.find(s => s.id === activeSourceId) || null;
  const activeOutput = currentOutputs.find(o => o.id === activeOutputId);
  const generationMode = activeProject?.mode || 'forward';

  // Determine if file is loaded 
  const isFileLoaded = currentSources.length > 0;

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">

      {/* Show Navbar in both landing and app views */}
      {!isFullscreen && (
        <Navbar onLogoClick={handleGoToLanding} currentView={view} />
      )}

      {/* Settings Modal (Global) */}
      <SettingsModal />

      <div className={`flex-1 flex flex-col overflow-hidden relative ${!isFullscreen ? 'pt-16' : 'pt-0'}`}>
        {view === 'landing' ? (
          <LandingPage onStart={handleStart} />
        ) : (
          <div className="flex-1 flex h-full overflow-hidden animate-fade-in-up">
            {/* Left Sidebar - History */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col ${showHistory ? 'w-64 opacity-100' : 'w-0 opacity-0'}`}
            >
               <div className="w-64 h-full flex flex-col">
                  <HistorySidebar
                      history={history}
                      activeId={activeId}
                      onSelect={setActiveId}
                      onNewProject={handleNewProject}
                      onDelete={handleDeleteHistory}
                  />
               </div>
            </div>

            {/* Center Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-100 dark:bg-slate-950 relative">

              {!isFullscreen && (
                  <>
                      <button
                          onClick={() => setShowHistory(!showHistory)}
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-6 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-r-lg shadow-md flex items-center justify-center text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all hover:w-7 group"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              {showHistory ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />}
                          </svg>
                      </button>

                      <button
                          onClick={() => setShowConfig(!showConfig)}
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-6 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-l-lg shadow-md flex items-center justify-center text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all hover:w-7 group"
                      >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              {showConfig ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />}
                          </svg>
                      </button>
                  </>
              )}

              <div className="flex-1 overflow-hidden relative p-4 flex flex-col">
                {!isFileLoaded && !activeId ? (
                    <div className="h-full flex flex-col items-center justify-center p-8">
                      <div className="max-w-md w-full space-y-8 animate-fade-in-up">
                        <div className="text-center">
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('transform_title')}</h2>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            {t('transform_desc')}
                          </p>
                        </div>
                        <FileUploader onFileLoaded={handleFileLoaded} />
                      </div>
                    </div>
                ) : (
                  <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up">
                    <ResultViewer
                      outputs={currentOutputs}
                      activeOutputId={activeOutputId}
                      onSelectOutput={setActiveOutputId}
                      onDeleteOutput={handleDeleteOutput}

                      // Sources Management
                      sources={currentSources}
                      activeSourceId={activeSourceId}
                      onSelectSource={setActiveSourceId}
                      onRenameSource={handleRenameSource}
                      onDeleteSource={handleDeleteSource}
                      sourceCode={activeSource?.content || ''}
                      fileName={activeSource?.name || 'Loading...'}

                      isGenerating={isGenerating}
                      isFullscreen={isFullscreen}
                      onToggleFullscreen={toggleFullscreen}
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                      onUpdateCode={handleUpdateCode}
                      onUpdateSource={handleUpdateSource}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Config */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col ${showConfig ? 'w-80 opacity-100' : 'w-0 opacity-0'}`}
            >
                <div className="w-80 h-full flex flex-col">
                  <ConfigPanel
                      config={draftConfig}
                      setConfig={setDraftConfig}

                      // Pass source selection logic to ConfigPanel
                      sources={currentSources}
                      activeSourceId={activeSourceId}
                      onSelectSource={setActiveSourceId}
                      fileData={activeSource}

                      generatedOutput={activeOutput}
                      onGenerate={handleGenerate}
                      onReverse={handleReverse}
                      isGenerating={isGenerating}
                      onResetFile={handleResetFile}
                      mode={generationMode}
                  />
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;

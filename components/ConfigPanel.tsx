
import React, { useState, useEffect } from 'react';
import { OutputFormat, GenerationConfig, FileData, ReverseOperationMode, GeneratedOutput, GenerationMode } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { constructPrompts, fetchProviderModels } from '../services/llmService';

interface ConfigPanelProps {
  config: GenerationConfig;
  setConfig: React.Dispatch<React.SetStateAction<GenerationConfig>>;
  
  fileData: FileData | null; // Active source
  sources?: FileData[]; // All sources for selection
  activeSourceId?: string | null;
  onSelectSource?: (id: string) => void;

  generatedOutput: GeneratedOutput | undefined; // The active output
  onGenerate: () => void;
  onReverse: (mode: ReverseOperationMode) => void;
  isGenerating: boolean;
  onResetFile: () => void;
  mode?: GenerationMode; 
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  setConfig,
  fileData,
  sources = [],
  activeSourceId,
  onSelectSource,
  generatedOutput,
  onGenerate,
  onReverse,
  isGenerating,
  onResetFile,
  mode = 'forward'
}) => {
  const { t, settings, updateSettings } = useAppContext();
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Modal States
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [previewPrompts, setPreviewPrompts] = useState<{systemInstruction: string, userPrompt: string} | null>(null);

  // Model fetching states
  const [fetchedModels, setFetchedModels] = useState<string[]>([]);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [customModelMode, setCustomModelMode] = useState(false);

  const handleChange = (key: keyof GenerationConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // Auto-fetch models when active provider changes
  useEffect(() => {
    const activeProvider = settings.providers.find(p => p.providerId === settings.activeProviderId);
    if (activeProvider && activeProvider.apiKey) {
      handleFetchModels();
    } else {
      setFetchedModels([]);
    }
  }, [settings.activeProviderId, settings.providers]);

  const handleFetchModels = async () => {
    const activeProvider = settings.providers.find(p => p.providerId === settings.activeProviderId);
    if (!activeProvider) return;
    
    // For Ollama, API Key is optional. For others, it's usually required.
    if (activeProvider.type !== 'ollama' && !activeProvider.apiKey) {
      alert("Please configure API key first in Settings");
      return;
    }

    setIsFetchingModels(true);
    try {
      const result = await fetchProviderModels(activeProvider);
      if (result.models && result.models.length > 0) {
        setFetchedModels(result.models);
        setCustomModelMode(false);

        // Auto-update current model if it's not in the new list
        if (!result.models.includes(activeProvider.modelId)) {
          const updatedProviders = settings.providers.map(p =>
            p.providerId === settings.activeProviderId
              ? { ...p, modelId: result.models[0] }
              : p
          );
          updateSettings({ ...settings, providers: updatedProviders });
        }
      } else {
        setFetchedModels([]);
        alert("No models found for this provider");
      }
    } catch (error: any) {
      console.error("Failed to fetch models:", error);
      alert(`Failed to fetch models:\n${error.message}`);
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleModelChange = (modelId: string) => {
    if (modelId === '__custom__') {
      setCustomModelMode(true);
      return;
    }

    const updatedProviders = settings.providers.map(p =>
      p.providerId === settings.activeProviderId
        ? { ...p, modelId }
        : p
    );
    updateSettings({ ...settings, providers: updatedProviders });
    setCustomModelMode(false);
  };

  const handleCustomModelUpdate = (customModel: string) => {
    const updatedProviders = settings.providers.map(p =>
      p.providerId === settings.activeProviderId
        ? { ...p, modelId: customModel || '__custom__' }
        : p
    );
    updateSettings({ ...settings, providers: updatedProviders });
  };

  const handleCopyConfig = () => {
    const { systemInstruction, userPrompt } = constructPrompts(fileData?.content || '', config, settings);
    const fullPrompt = `${systemInstruction}\n\n---\n\n${userPrompt}`;

    navigator.clipboard.writeText(fullPrompt).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  const handleOpenPromptDebugger = () => {
    const prompts = constructPrompts(fileData?.content || '', config, settings);
    setPreviewPrompts(prompts);
    setShowPromptModal(true);
  };

  // Estimate Tokens
  const estimatedTokenCount = React.useMemo(() => {
      if (!fileData) return 0;
      const { systemInstruction, userPrompt } = constructPrompts(fileData.content, config, settings);
      const fullText = systemInstruction + userPrompt;
      
      const chineseCount = (fullText.match(/[\u4e00-\u9fa5]/g) || []).length;
      const otherCount = fullText.length - chineseCount;
      // Rough estimation: 1 Chinese char = 1 token, 4 English chars = 1 token
      return chineseCount + Math.ceil(otherCount / 4);
  }, [fileData, config, settings]);

  const getTokenStatusColor = (count: number) => {
      if (count > 100000) return 'text-red-500 font-bold';
      if (count > 32000) return 'text-amber-500 font-bold';
      return 'text-slate-500 dark:text-slate-400';
  };

  // Improved Flow Status with Dropdown
  const getFlowStatus = () => {
      if (isGenerating) return (
          <div className="flex items-center justify-center gap-2 py-1 text-xs font-mono text-blue-500 animate-pulse">
              {t('generating')}
          </div>
      );
      
      let outFormat = config.format === OutputFormat.TSX ? 'React' : config.format === OutputFormat.VUE ? 'Vue' : 'HTML';
      if (generatedOutput) {
          outFormat = generatedOutput.format === OutputFormat.TSX ? 'React' : generatedOutput.format === OutputFormat.VUE ? 'Vue' : 'HTML';
      }

      // Sort sources by timestamp desc
      const sortedSources = [...sources].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      return (
          <div className="flex items-center gap-2 text-xs font-mono w-full">
              {/* Source Selector Dropdown */}
              <div className="relative flex-1 min-w-0">
                  <select 
                      value={activeSourceId || ''} 
                      onChange={(e) => onSelectSource && onSelectSource(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 appearance-none cursor-pointer hover:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 truncate pr-6 transition-colors"
                      disabled={sources.length <= 1}
                  >
                      {sortedSources.map((s) => (
                          <option key={s.id} value={s.id}>{s.name} ({new Date(s.timestamp || 0).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})</option>
                      ))}
                  </select>
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                  </div>
              </div>

              <span className="text-slate-300 dark:text-slate-600 flex-shrink-0">{t('flow_to')}</span>
              <span className="text-brand-600 dark:text-brand-400 font-bold flex-shrink-0">{outFormat}</span>
          </div>
      );
  };
  
  // Disable logic: Generating OR file missing OR file content empty
  const isGenerateDisabled = !fileData || !fileData.content.trim() || isGenerating;

  return (
    <>
      <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-80 flex-shrink-0 overflow-hidden transition-colors">
        
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            {t('settings')}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
          
          {/* File Status Indicator */}
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-3 flex flex-col gap-2">
             <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                 <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">{t('current_flow')}</span>
                 {fileData ? (
                     <button onClick={onResetFile} className="text-red-400 hover:text-red-500" title="Delete Active Source">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                     </button>
                 ) : null}
             </div>
             {fileData ? getFlowStatus() : <div className="text-xs text-slate-400 italic text-center py-1">{t('no_file')}</div>}
             
             {/* Token Count Indicator */}
             {fileData && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-1 flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">{t('est_context')}</span>
                    <div className="flex items-center gap-1.5">
                        <span className={`font-mono ${getTokenStatusColor(estimatedTokenCount)}`}>
                            ~{estimatedTokenCount.toLocaleString()} tokens
                        </span>
                        {estimatedTokenCount > 32000 && (
                             <div className="group relative">
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${estimatedTokenCount > 100000 ? 'text-red-500' : 'text-amber-500'}`} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    {t('token_warning_tooltip')}
                                </div>
                             </div>
                        )}
                    </div>
                </div>
             )}
          </div>

          {/* Configurations */}
          <div className={`space-y-4`}>
            {/* Smart Model Selector - Uses actual fetched models */}
            <div className="space-y-1">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('settings_provider_select')}</label>
                    <button
                        onClick={handleFetchModels}
                        disabled={isFetchingModels || (!settings.providers.find(p => p.providerId === settings.activeProviderId)?.apiKey && settings.providers.find(p => p.providerId === settings.activeProviderId)?.type !== 'ollama')}
                        className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                        {isFetchingModels ? (
                            <>
                                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Fetching...
                            </>
                        ) : (
                            <>
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </>
                        )}
                    </button>
                </div>

                {fetchedModels.length > 0 && !customModelMode ? (
                    <select
                        value={settings.providers.find(p => p.providerId === settings.activeProviderId)?.modelId || ''}
                        onChange={(e) => handleModelChange(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-md focus:ring-brand-500 focus:border-brand-500 block p-2 outline-none"
                    >
                        {fetchedModels.map((model) => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                        <option value="__custom__">+ {t('settings_custom_id_placeholder')}</option>
                    </select>
                ) : (
                    <input
                        type="text"
                        value={settings.providers.find(p => p.providerId === settings.activeProviderId)?.modelId || ''}
                        onChange={(e) => handleCustomModelUpdate(e.target.value)}
                        placeholder="Enter model ID or click Refresh to fetch available models"
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-md focus:ring-brand-500 focus:border-brand-500 block p-2 outline-none font-mono"
                    />
                )}
            </div>

            {/* Custom Model Input - Shown when user selects custom option */}
            {customModelMode && (
                <div className="space-y-1 animate-fade-in-up">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('settings_custom_model_id')}</label>
                    <input
                        type="text"
                        placeholder="e.g., custom-model-v1, gpt-4-turbo, etc."
                        onChange={(e) => handleCustomModelUpdate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-md focus:ring-brand-500 focus:border-brand-500 block p-2 outline-none font-mono"
                    />
                </div>
            )}

            {/* Format */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('output_format')}</label>
              <select 
                value={config.format}
                onChange={(e) => handleChange('format', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-md focus:ring-brand-500 focus:border-brand-500 block p-2 outline-none"
              >
                {Object.values(OutputFormat).map((fmt) => (
                  <option key={fmt} value={fmt}>{t(fmt)}</option>
                ))}
              </select>
            </div>

            {/* Style (Dynamic) */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('theme_style')}</label>
              <select 
                value={config.style}
                onChange={(e) => handleChange('style', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-md focus:ring-brand-500 focus:border-brand-500 block p-2 outline-none"
              >
                {settings.styles.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Level (Dynamic) */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('refinement_level')}</label>
              <select 
                value={config.level}
                onChange={(e) => handleChange('level', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-md focus:ring-brand-500 focus:border-brand-500 block p-2 outline-none"
              >
                 {settings.levels.map((l) => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('settings_temperature')}</label>
                    <span className="text-xs font-mono text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-1.5 rounded">{config.temperature.toFixed(1)}</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={config.temperature} 
                    onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Strict</span>
                    <span>Creative</span>
                </div>
            </div>

          </div>

          {/* Custom Prompt */}
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">{t('custom_instructions')}</label>
            <textarea
              value={config.customPrompt}
              onChange={(e) => handleChange('customPrompt', e.target.value)}
              placeholder={t('custom_placeholder')}
              className="w-full h-24 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-md focus:ring-brand-500 focus:border-brand-500 block p-2.5 resize-none outline-none"
            />
          </div>

          {/* Action Buttons: Copy & Debug */}
          <div className="flex gap-2">
              <button
                  onClick={handleCopyConfig}
                  className="flex-1 py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                  title={t('copy_config')}
              >
                  {copyFeedback ? <span className="text-green-600 dark:text-green-400">{t('config_copied')}</span> : t('copy_config')}
              </button>
              
              <button
                  onClick={handleOpenPromptDebugger}
                  className="py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center shadow-sm"
                  title={t('view_full_prompt')}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
              </button>
          </div>

        </div>

        {/* Action Panel - 3 Buttons Strategy */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col gap-2">
          {/* Main Generate Button (Forward) */}
          <button
            onClick={onGenerate}
            disabled={isGenerateDisabled}
            className={`w-full flex items-center justify-center gap-2 text-white font-medium py-3 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all
              ${isGenerateDisabled ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 active:scale-[0.98]'}`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {t('generating')}
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                {t('generate_btn')}
              </>
            )}
          </button>

          {/* Reverse Buttons Grid */}
          <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={() => onReverse('content')}
                disabled={!generatedOutput || isGenerating}
                className={`flex items-center justify-center gap-1 py-2 px-2 text-xs font-medium rounded border transition-all
                    ${(!generatedOutput || isGenerating) ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent cursor-not-allowed' : 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20'}`}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  {t('reverse_content_btn')}
              </button>
              <button
                onClick={() => onReverse('layout')}
                disabled={!generatedOutput || isGenerating}
                className={`flex items-center justify-center gap-1 py-2 px-2 text-xs font-medium rounded border transition-all
                    ${(!generatedOutput || isGenerating) ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent cursor-not-allowed' : 'bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/20'}`}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  {t('reverse_layout_btn')}
              </button>
          </div>
        </div>
      </div>
      
      {/* Prompt Debugger Modal - Kept local as it relies on constructPrompts with current config */}
      {showPromptModal && previewPrompts && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in-up">
           <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
               <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex-shrink-0">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {t('prompt_debug_title')}
                  </h3>
                  <button onClick={() => setShowPromptModal(false)} className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                  </button>
               </div>
               
               <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                   <div>
                       <div className="flex justify-between items-center mb-2">
                           <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">{t('system_instruction')}</label>
                           <button onClick={() => navigator.clipboard.writeText(previewPrompts.systemInstruction)} className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium">{t('copy')}</button>
                       </div>
                       <pre className="w-full bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-[#333] rounded-lg p-4 font-mono text-xs overflow-x-auto whitespace-pre-wrap text-slate-700 dark:text-slate-300 max-h-[300px]">
                           {previewPrompts.systemInstruction}
                       </pre>
                   </div>
                   
                   <div>
                       <div className="flex justify-between items-center mb-2">
                           <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">{t('user_prompt')}</label>
                           <button onClick={() => navigator.clipboard.writeText(previewPrompts.userPrompt)} className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium">{t('copy')}</button>
                       </div>
                       <pre className="w-full bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-[#333] rounded-lg p-4 font-mono text-xs overflow-x-auto whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                           {previewPrompts.userPrompt}
                       </pre>
                   </div>
               </div>
           </div>
        </div>
      )}
    </>
  );
};

export default ConfigPanel;

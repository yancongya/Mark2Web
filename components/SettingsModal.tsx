import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { testProviderConnection, fetchProviderModels } from '../services/llmService';
import { PromptPreset, LLMProviderConfig, TechStackPreset } from '../types';

const SettingsModal: React.FC = () => {
  const { t, settings, updateSettings, resetSettings, isSettingsOpen, setSettingsOpen } = useAppContext();

  // Settings Editor State
  const [activeSettingsTab, setActiveSettingsTab] = useState<'provider' | 'system' | 'styles' | 'levels' | 'tech' | 'reverse'>('provider');
  const [tempSettings, setTempSettings] = useState(settings);

  // Connection Test States
  const [testingIndex, setTestingIndex] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<{index: number, success: boolean, msg: string} | null>(null);

  // Model Fetching States
  const [fetchingModelsIndex, setFetchingModelsIndex] = useState<number | null>(null);
  const [fetchedModels, setFetchedModels] = useState<{[key: number]: string[]}>({});
  const [customModelMode, setCustomModelMode] = useState<{[key: number]: boolean}>({});
  const [visibleKeys, setVisibleKeys] = useState<{[key: number]: boolean}>({});

  // Effect to initialize temp settings when modal opens globally
  useEffect(() => {
    if (isSettingsOpen) {
        setTempSettings(settings);
        setTestResult(null);
        setFetchedModels({});
        setCustomModelMode({});
        setVisibleKeys({});
    }
  }, [isSettingsOpen, settings]);

  const saveSettings = () => {
      updateSettings(tempSettings);
      setSettingsOpen(false);
  };

  const handleResetSettings = () => {
      if (confirm(t('confirm_reset'))) {
          resetSettings();
          setSettingsOpen(false);
      }
  };

  const updatePreset = (type: 'styles' | 'levels', index: number, field: keyof PromptPreset, value: string) => {
      setTempSettings(prev => {
          const list = [...prev[type]];
          list[index] = { ...list[index], [field]: value };
          return { ...prev, [type]: list };
      });
  };

  const updateTechStack = (index: number, field: keyof TechStackPreset, value: string) => {
      setTempSettings(prev => {
          const list = [...prev.techStacks];
          list[index] = { ...list[index], [field]: value };
          return { ...prev, techStacks: list };
      });
  };

  const addPreset = (type: 'styles' | 'levels') => {
      setTempSettings(prev => ({
          ...prev,
          [type]: [
              ...prev[type],
              { id: `${type}_${Date.now()}`, label: 'New Preset', prompt: 'Describe the style/level here...' }
          ]
      }));
  };

  const removePreset = (type: 'styles' | 'levels', index: number) => {
      setTempSettings(prev => {
          const list = [...prev[type]];
          list.splice(index, 1);
          return { ...prev, [type]: list };
      });
  };

  const updateProvider = (index: number, field: keyof LLMProviderConfig, value: string | boolean) => {
      setTempSettings(prev => {
          const list = [...prev.providers];
          list[index] = { ...list[index], [field]: value };
          return { ...prev, providers: list };
      });
  };

  const toggleKeyVisibility = (index: number) => {
      setVisibleKeys(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleTestConnection = async (index: number) => {
      setTestingIndex(index);
      setTestResult(null);
      const provider = tempSettings.providers[index];
      try {
          const result = await testProviderConnection(provider, tempSettings);
          setTestResult({ index, success: true, msg: result.msg });
          if(result.success) {
               alert(`${result.msg}\\n\\n${t('test_response_preview')}:\\n----------------\\n${result.fullResponse?.substring(0, 1000)}...`);
          }
      } catch (e: any) {
          setTestResult({ index, success: false, msg: e.message || t('test_failed') });
      } finally {
          setTestingIndex(null);
      }
  };

  const handleFetchModels = async (index: number) => {
      setFetchingModelsIndex(index);
      const provider = tempSettings.providers[index];
      try {
          const result = await fetchProviderModels(provider);
          const { models, log } = result;
          if (models && models.length > 0) {
              setFetchedModels(prev => ({ ...prev, [index]: models }));
              setCustomModelMode(prev => ({ ...prev, [index]: false }));
              if(!provider.modelId || !models.includes(provider.modelId)) {
                  updateProvider(index, 'modelId', models[0]);
              }
              alert(`✅ Models fetched successfully!\\nFound ${models.length} models.\\n\\nDebug Log:\\n${log}`);
          } else {
              alert(`No models found.\\n\\nDebug Log:\\n${log}`);
          }
      } catch (e: any) {
          let errorMsg = `Failed to fetch models.\\nError: ${e.message}`;
          if (provider.providerId.includes('xiaomi')) {
              errorMsg += `\\n\\n⚠️ Xiaomi Mimo requires Cloudflare Worker proxy!\\n`;
              errorMsg += `1. Update worker using: cloudflare-worker/worker_fixed.js\\n`;
              errorMsg += `2. Deploy to Cloudflare Workers\\n`;
              errorMsg += `3. Enter Worker URL in Proxy URL field above\\n`;
              errorMsg += `4. Try fetching models again`;
          }
          alert(errorMsg);
      } finally {
          setFetchingModelsIndex(null);
      }
  };

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in-up">
       <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
           {/* Header */}
           <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex-shrink-0">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('settings_title')}
              </h3>
              <div className="flex items-center gap-3">
                <button onClick={handleResetSettings} className="px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-transparent hover:border-red-200 transition-colors">
                  {t('settings_reset')}
                </button>
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
                <button onClick={() => setSettingsOpen(false)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-medium transition-colors">
                  {t('settings_cancel')}
                </button>
                <button onClick={saveSettings} className="px-5 py-2 text-sm bg-brand-600 hover:bg-brand-700 text-white rounded font-bold shadow-lg shadow-brand-500/20 transition-all">
                  {t('settings_save')}
                </button>
              </div>
           </div>

           {/* Tabs */}
           <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveSettingsTab('provider')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeSettingsTab === 'provider' ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                {t('settings_tab_provider')}
              </button>
              <button
                onClick={() => setActiveSettingsTab('system')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeSettingsTab === 'system' ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                {t('settings_tab_system')}
              </button>
              <button
                onClick={() => setActiveSettingsTab('styles')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeSettingsTab === 'styles' ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                {t('settings_tab_styles')}
              </button>
              <button
                onClick={() => setActiveSettingsTab('levels')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeSettingsTab === 'levels' ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                {t('settings_tab_levels')}
              </button>
              <button
                onClick={() => setActiveSettingsTab('tech')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeSettingsTab === 'tech' ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                {t('settings_tab_tech')}
              </button>
              <button
                onClick={() => setActiveSettingsTab('reverse')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeSettingsTab === 'reverse' ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
              >
                {t('settings_tab_reverse')}
              </button>
           </div>

           {/* Content */}
           <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-[#151515] flex flex-col">
              {/* PROVIDER SETTINGS */}
              {activeSettingsTab === 'provider' && (
                <div className="h-full overflow-y-auto custom-scrollbar p-6">
                    <div className="max-w-4xl mx-auto space-y-8 pb-10">

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30 flex-shrink-0">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                               {t('settings_provider_desc')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {tempSettings.providers.map((p, idx) => (
                                <div key={p.providerId} className={`border rounded-xl transition-all ${p.providerId === tempSettings.activeProviderId ? 'bg-white dark:bg-[#1e1e1e] border-brand-500 ring-1 ring-brand-500 shadow-md' : 'bg-slate-50 dark:bg-[#1e1e1e] border-slate-200 dark:border-[#333] opacity-80 hover:opacity-100'}`}>
                                    <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setTempSettings({...tempSettings, activeProviderId: p.providerId})}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="activeProvider"
                                                checked={p.providerId === tempSettings.activeProviderId}
                                                onChange={() => {}}
                                                className="w-4 h-4 text-brand-600"
                                            />
                                            <div>
                                                <div className="font-bold text-sm text-slate-900 dark:text-white">{p.label}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{p.modelId} • {p.type}</div>
                                            </div>
                                        </div>
                                        {p.providerId === tempSettings.activeProviderId && <span className="text-xs bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full font-medium">Active</span>}
                                    </div>

                                    {/* Expanded Config */}
                                    {p.providerId === tempSettings.activeProviderId && (
                                        <div className="border-t border-slate-100 dark:border-[#333] p-4 bg-white/50 dark:bg-black/20 rounded-b-xl space-y-4 animate-fade-in-up">
                                            <div className="flex items-end gap-2">
                                                 <div className="flex-1">
                                                     <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">{t('settings_api_key')}</label>
                                                     {p.type === 'ollama' ? (
                                                         <div className="text-sm p-2 bg-slate-100 dark:bg-[#252526] border border-slate-300 dark:border-[#3c3c3c] rounded text-slate-500 dark:text-slate-400 italic">
                                                             API Key not required for Ollama
                                                         </div>
                                                     ) : (
                                                         <div className="flex gap-2">
                                                            <div className="flex-1 relative">
                                                                <input
                                                                    type={visibleKeys[idx] ? "text" : "password"}
                                                                    placeholder="sk-..."
                                                                    value={p.apiKey}
                                                                    onChange={(e) => updateProvider(idx, 'apiKey', e.target.value)}
                                                                    className="w-full text-sm p-2 bg-white dark:bg-[#252526] border border-slate-300 dark:border-[#3c3c3c] rounded focus:ring-1 focus:ring-brand-500 outline-none transition-colors pr-8"
                                                                />
                                                                <button
                                                                    onClick={() => toggleKeyVisibility(idx)}
                                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                                                    title={visibleKeys[idx] ? "Hide Key" : "Show Key"}
                                                                >
                                                                    {visibleKeys[idx] ? (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => handleTestConnection(idx)}
                                                                disabled={testingIndex === idx || (!p.apiKey && p.type !== 'ollama')}
                                                                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium rounded transition-colors disabled:opacity-50"
                                                            >
                                                                {testingIndex === idx ? t('settings_testing') : t('settings_test')}
                                                            </button>
                                                         </div>
                                                     )}
                                                 </div>
                                            </div>

                                            {(p.type === 'custom' || p.type === 'openai' || p.type === 'google' || p.type === 'ollama') && (
                                                 <div>
                                                     <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">{t('settings_base_url')}</label>
                                                     <input
                                                         type="text"
                                                         value={p.baseUrl || ''}
                                                         onChange={(e) => updateProvider(idx, 'baseUrl', e.target.value)}
                                                         placeholder={p.type === 'google' ? "https://generativelanguage.googleapis.com" : (p.type === 'ollama' ? "http://localhost:11434" : "https://api.openai.com/v1")}
                                                         className="w-full text-sm p-2 bg-white dark:bg-[#252526] border border-slate-300 dark:border-[#3c3c3c] rounded focus:ring-1 focus:ring-brand-500 outline-none transition-colors font-mono"
                                                     />
                                                 </div>
                                            )}

                                            {(p.type === 'custom' || p.type === 'openai' || p.type === 'google') && (
                                                 <div className="mt-2">
                                                     <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                                                         {t('settings_proxy_url')}
                                                         {p.providerId.includes('xiaomi') && (
                                                             <span className="ml-2 text-brand-600 dark:text-brand-400 text-[10px] font-normal">
                                                                 (必需: Cloudflare Worker)
                                                             </span>
                                                         )}
                                                     </label>
                                                     <input
                                                         type="text"
                                                         value={p.proxyUrl || ''}
                                                         onChange={(e) => updateProvider(idx, 'proxyUrl', e.target.value)}
                                                         placeholder={p.providerId.includes('xiaomi')
                                                             ? 'https://your-worker.workers.dev'
                                                             : t('settings_proxy_placeholder')}
                                                         className="w-full text-sm p-2 bg-white dark:bg-[#252526] border border-slate-300 dark:border-[#3c3c3c] rounded focus:ring-1 focus:ring-brand-500 outline-none transition-colors font-mono"
                                                     />
                                                     {p.providerId.includes('xiaomi') && !p.proxyUrl && (
                                                         <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded text-xs">
                                                             <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                                                                 ⚠️ 小米 Mimo 需要 Cloudflare Worker 代理
                                                             </p>
                                                             <p className="text-yellow-700 dark:text-yellow-300 mb-1">
                                                                 浏览器无法直接访问 api.xiaomimimo.com
                                                             </p>
                                                             <div className="mt-1 space-y-0.5">
                                                                 <p className="text-yellow-700 dark:text-yellow-300">📁 查看: <code>cloudflare-worker/快速修复部署.md</code></p>
                                                                 <p className="text-yellow-700 dark:text-yellow-300">🚀 使用 <code>worker_fixed.js</code> 部署</p>
                                                                 <p className="text-yellow-700 dark:text-yellow-300">🔧 部署后，将 Worker URL 填入此处</p>
                                                             </div>
                                                         </div>
                                                     )}
                                                 </div>
                                            )}

                                            <div className="flex items-end gap-2">
                                                 <div className="flex-1">
                                                     <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">{t('settings_model_id')}</label>

                                                     {(fetchedModels[idx] && fetchedModels[idx].length > 0 && !customModelMode[idx]) ? (
                                                        <div className="relative">
                                                            <select
                                                                value={fetchedModels[idx].includes(p.modelId) ? p.modelId : '__custom__'}
                                                                onChange={(e) => {
                                                                    if (e.target.value === '__custom__') {
                                                                        setCustomModelMode(prev => ({...prev, [idx]: true}));
                                                                    } else {
                                                                        updateProvider(idx, 'modelId', e.target.value);
                                                                    }
                                                                }}
                                                                className="w-full text-sm p-2 bg-white dark:bg-[#252526] border border-slate-300 dark:border-[#3c3c3c] rounded focus:ring-1 focus:ring-brand-500 outline-none transition-colors appearance-none"
                                                            >
                                                                {fetchedModels[idx].map(m => (
                                                                    <option key={m} value={m}>{m}</option>
                                                                ))}
                                                                <hr />
                                                                <option value="__custom__" className="font-semibold text-brand-600">{t('settings_custom_id_placeholder')}</option>
                                                            </select>
                                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                            </div>
                                                        </div>
                                                     ) : (
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                autoFocus
                                                                value={p.modelId}
                                                                onChange={(e) => updateProvider(idx, 'modelId', e.target.value)}
                                                                className="w-full text-sm p-2 bg-white dark:bg-[#252526] border border-slate-300 dark:border-[#3c3c3c] rounded focus:ring-1 focus:ring-brand-500 outline-none transition-colors pr-8"
                                                                placeholder="e.g. gpt-4"
                                                            />
                                                            {fetchedModels[idx] && fetchedModels[idx].length > 0 && (
                                                                <button
                                                                    onClick={() => setCustomModelMode(prev => ({...prev, [idx]: false}))}
                                                                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-brand-500"
                                                                    title={t('settings_back_to_list')}
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                     )}
                                                 </div>
                                                 <button
                                                    onClick={() => handleFetchModels(idx)}
                                                    disabled={fetchingModelsIndex === idx || (!p.apiKey && p.type !== 'ollama')}
                                                    className="px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium rounded transition-colors disabled:opacity-50 h-[38px]"
                                                    title={t('settings_fetch_models')}
                                                 >
                                                    {fetchingModelsIndex === idx ? (
                                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                    )}
                                                 </button>
                                            </div>

                                            {/* Connection Feedback */}
                                            {testResult && testResult.index === idx && (
                                                <div className={`text-xs px-3 py-2 rounded flex items-center gap-2 ${testResult.success ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                    {testResult.success ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                                    )}
                                                    {testResult.msg}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              )}

              {/* SYSTEM INSTRUCTION SETTINGS */}
              {activeSettingsTab === 'system' && (
                <div className="h-full overflow-y-auto custom-scrollbar p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                               {t('settings_system_desc')}
                            </p>
                        </div>
                        <textarea
                            value={tempSettings.systemInstruction}
                            onChange={(e) => setTempSettings({...tempSettings, systemInstruction: e.target.value})}
                            className="w-full h-[500px] p-4 bg-white dark:bg-[#1e1e1e] border border-slate-300 dark:border-[#333] rounded-lg font-mono text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none text-slate-900 dark:text-slate-300"
                        />
                    </div>
                </div>
              )}

              {/* STYLE/LEVEL PRESETS */}
              {(activeSettingsTab === 'styles' || activeSettingsTab === 'levels') && (
                <div className="h-full overflow-y-auto custom-scrollbar p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30 flex justify-between items-center">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                               {t('settings_presets_desc')}
                            </p>
                            <button
                                onClick={() => addPreset(activeSettingsTab)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-sm transition-colors"
                            >
                                + {t('settings_add_preset')}
                            </button>
                        </div>

                        <div className="space-y-4">
                            {tempSettings[activeSettingsTab].map((preset, index) => (
                                <div key={preset.id} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-[#333] rounded-lg p-4 shadow-sm hover:border-brand-300 transition-colors group">
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">{t('settings_label')}</label>
                                                <input
                                                    type="text"
                                                    value={preset.label}
                                                    onChange={(e) => updatePreset(activeSettingsTab, index, 'label', e.target.value)}
                                                    className="w-full text-sm font-bold bg-transparent border-b border-slate-200 dark:border-[#333] focus:border-brand-500 outline-none py-1 text-slate-900 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">{t('settings_prompt')}</label>
                                                <textarea
                                                    value={preset.prompt}
                                                    onChange={(e) => updatePreset(activeSettingsTab, index, 'prompt', e.target.value)}
                                                    className="w-full text-sm bg-slate-50 dark:bg-[#252526] border border-slate-200 dark:border-[#333] rounded p-2 focus:ring-1 focus:ring-brand-500 outline-none resize-y min-h-[80px] text-slate-700 dark:text-slate-300"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-start pt-6">
                                            <button
                                                onClick={() => removePreset(activeSettingsTab, index)}
                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                title={t('settings_delete')}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              )}

              {/* REVERSE PROMPTS SETTINGS */}
              {activeSettingsTab === 'reverse' && (
                <div className="h-full overflow-y-auto custom-scrollbar p-6">
                    <div className="max-w-4xl mx-auto space-y-8 pb-10">
                         <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                               {t('settings_reverse_desc')}
                            </p>
                        </div>

                        {/* Content Extraction Prompts */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                                Content Extraction
                            </h3>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">{t('settings_reverse_content_sys')}</label>
                                <textarea
                                    value={tempSettings.reversePrompts?.contentSystem || ''}
                                    onChange={(e) => setTempSettings({
                                        ...tempSettings,
                                        reversePrompts: { ...tempSettings.reversePrompts, contentSystem: e.target.value }
                                    })}
                                    className="w-full h-24 p-3 bg-white dark:bg-[#1e1e1e] border border-slate-300 dark:border-[#333] rounded-lg font-mono text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-y text-slate-900 dark:text-slate-300"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">{t('settings_reverse_content_user')} <span className="text-xs font-normal opacity-70">(Use {'{{CODE}}'} placeholder)</span></label>
                                <textarea
                                    value={tempSettings.reversePrompts?.contentUser || ''}
                                    onChange={(e) => setTempSettings({
                                        ...tempSettings,
                                        reversePrompts: { ...tempSettings.reversePrompts, contentUser: e.target.value }
                                    })}
                                    className="w-full h-40 p-3 bg-white dark:bg-[#1e1e1e] border border-slate-300 dark:border-[#333] rounded-lg font-mono text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-y text-slate-900 dark:text-slate-300"
                                />
                            </div>
                        </div>

                        {/* Layout Analysis Prompts */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                                Layout Analysis
                            </h3>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">{t('settings_reverse_layout_sys')}</label>
                                <textarea
                                    value={tempSettings.reversePrompts?.layoutSystem || ''}
                                    onChange={(e) => setTempSettings({
                                        ...tempSettings,
                                        reversePrompts: { ...tempSettings.reversePrompts, layoutSystem: e.target.value }
                                    })}
                                    className="w-full h-24 p-3 bg-white dark:bg-[#1e1e1e] border border-slate-300 dark:border-[#333] rounded-lg font-mono text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-y text-slate-900 dark:text-slate-300"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">{t('settings_reverse_layout_user')} <span className="text-xs font-normal opacity-70">(Use {'{{CODE}}'} placeholder)</span></label>
                                <textarea
                                    value={tempSettings.reversePrompts?.layoutUser || ''}
                                    onChange={(e) => setTempSettings({
                                        ...tempSettings,
                                        reversePrompts: { ...tempSettings.reversePrompts, layoutUser: e.target.value }
                                    })}
                                    className="w-full h-40 p-3 bg-white dark:bg-[#1e1e1e] border border-slate-300 dark:border-[#333] rounded-lg font-mono text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-y text-slate-900 dark:text-slate-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>
              )}

              {/* TECH STACK SETTINGS */}
              {activeSettingsTab === 'tech' && (
                <div className="h-full overflow-y-auto custom-scrollbar p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                               {t('settings_tech_desc')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {tempSettings.techStacks.map((techStack, index) => (
                                <div key={techStack.id} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-[#333] rounded-lg p-4 shadow-sm hover:border-brand-300 transition-colors">
                                    <div className="mb-3">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Format Label</label>
                                        <input
                                            type="text"
                                            value={techStack.label}
                                            readOnly
                                            className="w-full text-sm font-bold bg-slate-50 dark:bg-[#252526] border border-slate-200 dark:border-[#333] rounded px-2 py-1 text-slate-700 dark:text-slate-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Tech Instruction (Key Technical Rules)</label>
                                        <textarea
                                            value={techStack.instruction}
                                            onChange={(e) => updateTechStack(index, 'instruction', e.target.value)}
                                            className="w-full h-48 p-3 bg-slate-50 dark:bg-[#252526] border border-slate-200 dark:border-[#333] rounded-lg font-mono text-sm focus:ring-1 focus:ring-brand-500 outline-none resize-y text-slate-700 dark:text-slate-300"
                                            placeholder="Enter tech-specific instructions for this format..."
                                        />
                                    </div>
                                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                        <span className="font-semibold">Format:</span> {techStack.format} |
                                        <span className="font-semibold ml-2">ID:</span> {techStack.id}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              )}

           </div>
       </div>
    </div>
  );
};

export default SettingsModal;
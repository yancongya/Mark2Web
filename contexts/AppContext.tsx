
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '../translations';
import { GlobalSettings } from '../types';
import { DEFAULT_SETTINGS } from '../services/defaults';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  // New Settings Management
  settings: GlobalSettings;
  updateSettings: (newSettings: GlobalSettings) => void;
  resetSettings: () => void;
  // Export/Import
  exportSettings: () => void;
  importSettings: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Global UI State
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  // Load saved preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) setTheme(savedTheme);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');

    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) setLanguage(savedLang);
    else if (navigator.language.startsWith('zh')) setLanguage('zh');

    // Load Settings
    const savedSettings = localStorage.getItem('markweb_settings_v1');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Merge with defaults to ensure new fields (if any in future) are present, 
        // but prioritize saved values. 
        setSettings({
            ...DEFAULT_SETTINGS,
            ...parsed
        });
      } catch (e) {
        console.error("Failed to load settings", e);
      }
    }
  }, []);

  // Apply theme to HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Persist language
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Persist settings
  const updateSettings = (newSettings: GlobalSettings) => {
      setSettings(newSettings);
      localStorage.setItem('markweb_settings_v1', JSON.stringify(newSettings));
  };

  const resetSettings = () => {
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem('markweb_settings_v1', JSON.stringify(DEFAULT_SETTINGS));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", url);
    downloadAnchorNode.setAttribute("download", `markweb_settings_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    URL.revokeObjectURL(url);
  };

  const importSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = e.target.files && e.target.files[0];
    if (!fileObj) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const json = JSON.parse(event.target?.result as string);
            // Basic validation
            if (json.providers && Array.isArray(json.providers) && json.systemInstruction) {
                // Ensure structural integrity by merging with defaults but preferring imported
                const merged = { ...DEFAULT_SETTINGS, ...json };
                updateSettings(merged);
                alert("Settings imported successfully!");
            } else {
                alert("Invalid settings file format.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to parse settings file.");
        }
        // Reset input value to allow re-importing same file if needed
        e.target.value = '';
    };
    reader.readAsText(fileObj);
  };

  const t = (key: string): string => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  return (
    <AppContext.Provider value={{ 
        theme, 
        toggleTheme, 
        language, 
        setLanguage, 
        t, 
        settings, 
        updateSettings, 
        resetSettings,
        exportSettings,
        importSettings,
        isSettingsOpen,
        setSettingsOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

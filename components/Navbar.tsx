
import React, { useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';

interface NavbarProps {
  onLogoClick: () => void;
  currentView?: 'landing' | 'app';
}

const Navbar: React.FC<NavbarProps> = ({ onLogoClick, currentView = 'app' }) => {
  const { t, theme, toggleTheme, language, setLanguage, exportSettings, importSettings, setSettingsOpen } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScrollTo = (id: string) => {
    if (currentView !== 'landing') {
        onLogoClick(); // Go home first if not there
        setTimeout(() => {
            const el = document.getElementById(id);
            el?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    } else {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="h-16 fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 transition-all duration-300">
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={onLogoClick}
      >
        <div className="bg-gradient-to-tr from-brand-600 to-indigo-600 text-white p-1.5 rounded-lg shadow-sm group-hover:shadow-brand-500/50 transition-all group-hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        </div>
        <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {t('app_title')}
        </span>
      </div>

      {/* Center Links - Only visible on landing */}
      {currentView === 'landing' && (
          <div className="hidden md:flex items-center gap-8">
              <button onClick={() => handleScrollTo('features')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white transition-colors">
                  {t('nav_features')}
              </button>
              <button onClick={() => handleScrollTo('demo')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white transition-colors">
                  {t('nav_demo')}
              </button>
              <button onClick={() => handleScrollTo('workflow')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white transition-colors">
                  {t('nav_workflow')}
              </button>
              <button onClick={() => handleScrollTo('cta-section')} className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors border border-brand-200 dark:border-brand-800 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/10">
                  {t('nav_start')}
              </button>
          </div>
      )}

      <div className="flex items-center gap-3">
        {/* Import/Export Settings */}
        <div className="hidden sm:flex items-center gap-1 mr-2">
            <button 
                onClick={exportSettings}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-full transition-all duration-200 relative group hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
                title={t('settings_export')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {/* Tooltip */}
                <span className="absolute top-full right-0 mt-2 w-max bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none translate-y-1 group-hover:translate-y-0 shadow-lg z-50">
                    {t('settings_export')}
                </span>
            </button>
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-full transition-all duration-200 relative group hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
                title={t('settings_import')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m-4 4v12" />
                </svg>
                 {/* Tooltip */}
                 <span className="absolute top-full right-0 mt-2 w-max bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none translate-y-1 group-hover:translate-y-0 shadow-lg z-50">
                    {t('settings_import')}
                 </span>
            </button>
            <input 
                ref={fileInputRef}
                type="file" 
                accept=".json"
                className="hidden"
                onChange={importSettings}
            />
        </div>

        {/* Separator */}
        <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

        {/* Language */}
        <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 rounded p-1">
            <button 
                onClick={() => setLanguage('en')}
                className={`text-xs px-2 py-1 rounded transition-colors ${language === 'en' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
                EN
            </button>
            <button 
                onClick={() => setLanguage('zh')}
                className={`text-xs px-2 py-1 rounded transition-colors ${language === 'zh' ? 'bg-white dark:bg-slate-600 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
                中
            </button>
        </div>

        {/* Theme */}
        <button 
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            title={t(theme)}
        >
            {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )}
        </button>

         {/* Global Settings (Moved from Sidebar) */}
         <button 
            onClick={() => setSettingsOpen(true)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-full transition-all duration-200 relative group"
            title={t('settings_btn_tooltip')}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

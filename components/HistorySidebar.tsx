
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { HistoryItem } from '../types';

interface HistorySidebarProps {
  history: HistoryItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewProject: () => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  history, 
  activeId, 
  onSelect, 
  onNewProject,
  onDelete
}) => {
  const { t } = useAppContext();

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-64 flex-shrink-0 transition-colors">
      <div className="p-4 flex items-center gap-2">
        <button
          onClick={onNewProject}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium py-2 px-4 rounded-lg shadow-sm hover:opacity-90 transition-opacity text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {t('new_project')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-2">
          {t('history')}
        </h3>
        
        <div className="space-y-1">
          {history.length === 0 ? (
            <div className="text-sm text-slate-400 dark:text-slate-500 px-2 italic text-center py-4">
              {t('empty_history')}
            </div>
          ) : (
            history.map((item) => {
              const displayName = item.sources.length > 0 ? item.sources[0].name : t('untitled_project');

              return (
              <div
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`group flex items-center justify-between p-2.5 rounded-lg text-sm cursor-pointer transition-colors border border-transparent ${
                  activeId === item.id
                    ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm text-brand-600 dark:text-brand-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                   <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 flex-shrink-0 ${activeId === item.id ? 'text-brand-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                   </svg>
                   <div className="truncate flex flex-col items-start">
                     <span className="truncate w-32 block">{displayName}</span>
                     <span className="text-[10px] opacity-70 font-normal">
                       {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     </span>
                   </div>
                </div>
                
                <button
                  onClick={(e) => onDelete(item.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all"
                  title={t('delete')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )})
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorySidebar;

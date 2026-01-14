#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

# 读取文件
file_path = 'components/ResultViewer.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 要替换的部分 - 精确匹配
old_section = '''        <div className=\"hidden md:flex flex-1 bg-slate-100 dark:bg-slate-900 h-full\"></div>
        <div className=\"flex items-center bg-slate-100 dark:bg-slate-900 h-full px-2 gap-1\">
             {activeTab !== 'preview' && (
                <button onClick={() => handleCopy(activeTab === 'source' ? sourceCode : generatedCode)} className=\"p-1.5 hover:bg-slate-200 dark:hover:bg-[#3c3c3c] rounded text-slate-600 dark:text-[#cccccc]\">{copyFeedback === activeTab || copyFeedback === (activeTab === 'source' ? 'source' : 'code') ? <Icons.Check /> : <Icons.Copy />}</button>
             )}
             <button onClick={handleDownload} className=\"p-1.5 hover:bg-slate-200 dark:hover:bg-[#3c3c3c] rounded text-slate-600 dark:text-[#cccccc]\"><Icons.Download /></button>
             <button onClick={onToggleFullscreen} className={`p-1.5 hover:bg-slate-200 dark:hover:bg-[#3c3c3c] rounded text-slate-600 dark:text-[#cccccc] ${isFullscreen ? 'text-slate-900 dark:text-white' : ''}`}>
                <svg className=\"w-4 h-4\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">
                    {isFullscreen ? <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M6 18L18 6M6 6l12 12\" /> : <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4\" />}
                </svg>
             </button>
        </div>'''

new_section = '''        <div className=\"hidden md:flex flex-1 bg-slate-100 dark:bg-slate-900 h-full\"></div>

        {/* Version Selector - Works on all tabs (except preview which has its own) */}
        {outputs.length > 0 && activeOutputId && activeTab !== 'preview' && (
            <div className=\"relative flex items-center h-full px-2 border-l border-slate-200 dark:border-[#1e1e1e]\" ref={dropdownRef}>
                <button
                    onClick={() => setShowVersionDropdown(!showVersionDropdown)}
                    className=\"flex items-center gap-2 px-3 py-1.5 text-xs bg-white dark:bg-[#333] text-slate-700 dark:text-white border border-slate-300 dark:border-[#3c3c3c] rounded hover:bg-slate-50 dark:hover:bg-[#3c3c3c] transition-colors min-w-[120px] justify-between\"
                >
                    {(() => {
                        const activeOut = outputs.find(o => o.id === activeOutputId);
                        const activeFormat = activeOut?.format || OutputFormat.HTML;
                        const activeGroup = groupedOutputs[activeFormat];
                        const activeVersionIndex = activeGroup ? activeGroup.length - activeGroup.findIndex(o => o.id === activeOutputId) : 1;

                        return (
                            <div className=\"flex items-center gap-2\">
                                <span className={getFormatColor(activeFormat)}>{getFormatIcon(activeFormat)}</span>
                                <span className=\"font-semibold\">v{activeVersionIndex}</span>
                            </div>
                        );
                    })()}
                    <Icons.ChevronDown />
                </button>

                {/* Version Dropdown Menu with Delete */}
                {showVersionDropdown && (
                    <div className=\"absolute top-full right-0 mt-1 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-50 animate-fade-in-up\">
                        <div className=\"max-h-[300px] overflow-y-auto custom-scrollbar p-1\">
                            {Object.entries(groupedOutputs).map(([fmt, outs]) => (
                                <div key={fmt} className=\"mb-2 last:mb-0\">
                                    <div className=\"px-2 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50 rounded mt-1 mb-1 flex justify-between items-center\">
                                        <span>{getFormatLabel(fmt as OutputFormat)}</span>
                                    </div>
                                    {outs.map((out, index) => {
                                        const version = outs.length - index;
                                        const isActive = out.id === activeOutputId;
                                        return (
                                            <div key={out.id} className=\"flex items-center gap-1 group\">
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
                                                    <div className=\"flex-1 flex justify-between items-center\">
                                                        <span className=\"font-medium\">v{version}</span>
                                                        <span className=\"text-[10px] opacity-50 font-mono whitespace-nowrap\">
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
                                                        className=\"p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors opacity-0 group-hover:opacity-100\"
                                                        title=\"删除此版本\"
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

        <div className=\"flex items-center bg-slate-100 dark:bg-slate-900 h-full px-2 gap-1\">
             {activeTab !== 'preview' && (
                <button onClick={() => handleCopy(activeTab === 'source' ? sourceCode : generatedCode)} className=\"p-1.5 hover:bg-slate-200 dark:hover:bg-[#3c3c3c] rounded text-slate-600 dark:text-[#cccccc]\">{copyFeedback === activeTab || copyFeedback === (activeTab === 'source' ? 'source' : 'code') ? <Icons.Check /> : <Icons.Copy />}</button>
             )}
             <button onClick={handleDownload} className=\"p-1.5 hover:bg-slate-200 dark:hover:bg-[#3c3c3c] rounded text-slate-600 dark:text-[#cccccc]\"><Icons.Download /></button>
             <button onClick={onToggleFullscreen} className={`p-1.5 hover:bg-slate-200 dark:hover:bg-[#3c3c3c] rounded text-slate-600 dark:text-[#cccccc] ${isFullscreen ? 'text-slate-900 dark:text-white' : ''}`}>
                <svg className=\"w-4 h-4\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">
                    {isFullscreen ? <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M6 18L18 6M6 6l12 12\" /> : <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4\" />}
                </svg>
             </button>
        </div>'''

# 执行替换
if old_section in content:
    content = content.replace(old_section, new_section)
    print("SUCCESS: Replaced top bar version selector")
else:
    print("NOT FOUND: Trying regex...")
    # 使用正则表达式进行更灵活的匹配
    pattern = re.escape(old_section)
    match = re.search(pattern, content, re.MULTILINE)
    if match:
        content = content[:match.start()] + new_section + content[match.end():]
        print("SUCCESS: Replaced via regex")
    else:
        print("ERROR: Still not found")
        print("File content snippet:")
        lines = content.split('\n')
        for i, line in enumerate(lines[1055:1075], start=1056):
            print(f"{i}: {repr(line)}")
        exit(1)

# 写回文件
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("FILE UPDATED")
print("\nNext: Need to implement onDeleteOutput and onDeleteSource in App.tsx")

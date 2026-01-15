import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';

type Mode = 'html' | 'vue' | 'react';

const CODE_SNIPPETS: Record<Mode, string> = {
    html: `<!-- index.html -->
<div class="card">
  <div class="dots">
    <span class="red"/>
    <span class="yel"/>
  </div>
  <h1>Hello HTML</h1>
</div>`,
    vue: `<script setup>
import { ref } from 'vue'
const msg = ref('Vue')
</script>

<template>
  <div class="card">
    <h1>{{ msg }}</h1>
    <input v-model="msg"/>
  </div>
</template>`,
    react: `function App() {
  const [v, set] = useState('React');

  return (
    <div class="card">
      <h1>{v}</h1>
      <input 
        value={v}
        onChange={e => set(e.target.value)}
      />
    </div>
  );
}`
};

const CodeDemoSection: React.FC = () => {
    const { t } = useAppContext();
    const [mode, setMode] = useState<Mode>('html');
    
    // Typing Effect State
    const [displayedCode, setDisplayedCode] = useState('');
    const [typingIndex, setTypingIndex] = useState(0);
    const typingSpeed = 15; // ms per char

    // Visual Animation State
    const [isHovering, setIsHovering] = useState(false);
    const [clicked, setClicked] = useState(false);

    // Calculate progress (0 to 1)
    const progress = typingIndex / (CODE_SNIPPETS[mode].length || 1);

    // Reset typing when mode changes
    useEffect(() => {
        setDisplayedCode('');
        setTypingIndex(0);
        setClicked(false);
    }, [mode]);

    // Typing Loop
    useEffect(() => {
        const fullCode = CODE_SNIPPETS[mode];
        if (typingIndex < fullCode.length) {
            const timeout = setTimeout(() => {
                setDisplayedCode(prev => prev + fullCode.charAt(typingIndex));
                setTypingIndex(prev => prev + 1);
            }, typingSpeed);
            return () => clearTimeout(timeout);
        }
    }, [typingIndex, mode]);

    const handleModeChange = (newMode: Mode) => {
        if (newMode === mode) return;
        setMode(newMode);
    };

    // Highlight logic
    const getHighlightedCode = (code: string) => {
        return code
            .replace(/import|from|export|const|return|function/g, '<span class="text-purple-400 font-bold">$&</span>')
            .replace(/&lt;|&gt;|class=|className=|v-model=|value=|onChange=/g, '<span class="text-blue-400">$&</span>')
            .replace(/'[^']*'|"[^"]*"/g, '<span class="text-green-400">$&</span>')
            .replace(/&lt;\/?[a-zA-Z0-9]+&gt;/g, '<span class="text-red-400">$&</span>')
            .replace(/&lt;|&gt;/g, '<span class="text-slate-500">$&</span>');
    };

    // Progressive rendering helper
    const showAt = (threshold: number) => {
        const isVisible = progress > threshold;
        return `transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90'}`;
    };

    return (
        <section id="demo" className="snap-start py-24 px-6 relative z-10 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-brand-600 dark:text-brand-400 font-bold tracking-wider uppercase text-sm mb-2 block">
                        {t('demo_label')}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                        {t('demo_title')}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        {t('demo_desc')}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-center min-h-[500px]">
                    {/* Left: Code Editor (Typing Effect) */}
                    <div className="lg:w-1/2 flex flex-col w-full">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-4 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg self-start backdrop-blur-sm">
                            {(['html', 'vue', 'react'] as Mode[]).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => handleModeChange(m)}
                                    className={`px-6 py-2 rounded-md text-sm font-bold uppercase transition-all duration-300 ${
                                        mode === m
                                            ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm transform scale-105'
                                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>

                        {/* Code Window */}
                        <div className="flex-1 bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 relative group h-[360px]">
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-800/50">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                <div className="ml-auto text-xs text-slate-500 font-mono">
                                    {mode === 'html' ? 'index.html' : mode === 'vue' ? 'App.vue' : 'App.jsx'}
                                </div>
                            </div>
                            <div className="p-6 overflow-auto custom-scrollbar h-full relative">
                                <pre className="font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-wrap break-words">
                                    <code dangerouslySetInnerHTML={{ 
                                        __html: getHighlightedCode(
                                            displayedCode
                                                .replace(/</g, '&lt;')
                                                .replace(/>/g, '&gt;')
                                        ) 
                                    }} />
                                    {/* Cursor */}
                                    <span className="animate-pulse inline-block w-2 h-4 bg-brand-400 align-middle ml-1"></span>
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Right: Interactive Visual Preview (Progressive) */}
                    <div 
                        className="lg:w-1/2 w-full flex items-center justify-center relative perspective-1000 min-h-[400px]"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        onClick={() => setClicked(!clicked)}
                    >
                        {/* Interactive Animation Container */}
                        <div 
                            className={`relative transition-all duration-700 transform cursor-pointer ${
                                clicked ? 'scale-110 rotate-y-12' : isHovering ? 'scale-105' : 'scale-100'
                            }`}
                        >
                            {/* HTML: Progressive Build */}
                            {mode === 'html' && (
                                <div className="relative w-72 h-80">
                                    {/* Stage 1: Container (0%) */}
                                    <div className={`absolute top-0 left-0 w-full h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-30 p-6 flex flex-col justify-between ${showAt(0.1)}`}>
                                        
                                        {/* Stage 2: Dots (30%) */}
                                        <div className={`flex gap-2 mb-4 ${showAt(0.3)}`}>
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        </div>
                                        
                                        {/* Stage 3: Content (60%) */}
                                        <div className={`space-y-3 flex-1 flex flex-col justify-center ${showAt(0.6)}`}>
                                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Hello HTML</h1>
                                            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-full"></div>
                                            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-5/6"></div>
                                        </div>

                                        <div className="absolute bottom-6 right-6 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs text-slate-500">Static</div>
                                    </div>
                                    
                                    {/* Background Decor */}
                                    <div className={`absolute top-4 left-4 w-full h-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 z-20 ${showAt(0.2)}`}></div>
                                </div>
                            )}

                            {/* Vue: Progressive Build */}
                            {mode === 'vue' && (
                                <div className={`relative w-72 h-80 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-500/30 p-6 flex flex-col gap-6 shadow-2xl shadow-green-500/10 ${showAt(0.1)}`}>
                                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-3 py-1 rounded-full font-bold tracking-wider shadow-lg ${showAt(0.2)}`}>REACTIVE</div>
                                    
                                    <div className="flex-1 flex flex-col items-center justify-center relative">
                                        {/* Stage 2: Source of Truth (Script part typed ~30%) */}
                                        <div className={`w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex flex-col items-center justify-center border-2 border-green-500 shadow-lg z-10 transition-transform duration-300 ${clicked ? 'scale-110' : ''} ${showAt(0.3)}`}>
                                            <span className="text-xs text-slate-400 font-mono mb-1">ref()</span>
                                            <span className="text-green-600 font-bold text-lg">{clicked ? 'Updated!' : 'Vue'}</span>
                                        </div>

                                        {/* Stage 3: Connections (Template part typed ~60%) */}
                                        <svg className={`absolute inset-0 w-full h-full pointer-events-none overflow-visible ${showAt(0.6)}`}>
                                            <path d="M144 40 C 144 80, 72 80, 72 120" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" className="animate-dash" />
                                            <path d="M144 40 C 144 80, 216 80, 216 120" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" className="animate-dash-reverse" />
                                        </svg>

                                        {/* Stage 4: Bound Elements (Template part finished ~90%) */}
                                        <div className={`flex justify-between w-full mt-auto z-10 gap-4 ${showAt(0.8)}`}>
                                            <div className="flex-1 bg-white dark:bg-slate-800 p-3 rounded-lg border border-green-200 dark:border-green-800 text-center shadow-sm">
                                                <span className="text-xs text-slate-400 block mb-1">View</span>
                                                <div className="w-full h-2 bg-green-500/50 rounded-full"></div>
                                            </div>
                                            <div className="flex-1 bg-white dark:bg-slate-800 p-3 rounded-lg border border-green-200 dark:border-green-800 text-center shadow-sm">
                                                <span className="text-xs text-slate-400 block mb-1">Input</span>
                                                <div className="w-full h-2 bg-green-500/50 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* React: Progressive Build */}
                            {mode === 'react' && (
                                <div className="relative w-72 h-80 flex items-center justify-center">
                                    {/* Stage 1: Core Component (Function Def ~20%) */}
                                    <div className={`relative bg-white dark:bg-slate-800 w-40 h-40 rounded-2xl shadow-2xl border-2 border-blue-500 flex flex-col items-center justify-center z-10 backdrop-blur-xl ${showAt(0.2)}`}>
                                         <div className="w-12 h-12 bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-xl mb-2 flex items-center justify-center text-white font-bold shadow-lg transform rotate-12">
                                            R
                                         </div>
                                         <span className="text-slate-900 dark:text-white font-bold">App</span>
                                    </div>

                                    {/* Stage 2: Orbital Rings (State Hook ~50%) */}
                                    <div className={`absolute inset-0 border-2 border-blue-400/30 rounded-full transition-all duration-1000 ${clicked ? 'animate-[spin_2s_linear_infinite]' : 'animate-[spin_10s_linear_infinite]'} ${showAt(0.5)}`}></div>
                                    <div className={`absolute inset-8 border-2 border-indigo-400/30 rounded-full transition-all duration-1000 ${clicked ? 'animate-[spin_3s_linear_infinite_reverse]' : 'animate-[spin_15s_linear_infinite_reverse]'} ${showAt(0.5)}`}></div>

                                    {/* Stage 3: Particles/Return (JSX ~80%) */}
                                    <div className={`absolute top-0 right-10 w-4 h-4 bg-blue-400 rounded-full animate-bounce ${showAt(0.8)}`}></div>
                                    <div className={`absolute bottom-10 left-10 w-3 h-3 bg-indigo-400 rounded-full animate-bounce animation-delay-500 ${showAt(0.85)}`}></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                .animate-dash {
                    animation: dash 2s linear infinite;
                }
                .animate-dash-reverse {
                    animation: dash 2s linear infinite reverse;
                }
                @keyframes dash {
                    to {
                        stroke-dashoffset: 24;
                    }
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
                .rotate-y-12 {
                    transform: rotateY(12deg);
                }
            `}</style>
        </section>
    );
};

export default CodeDemoSection;
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Node Analyzer Settings</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        slate: {
                            850: '#151e2e',
                            900: '#0f172a',
                            950: '#020617',
                        },
                        primary: {
                            400: '#38bdf8',
                            500: '#0ea5e9',
                            600: '#0284c7',
                        }
                    },
                    animation: {
                        'fade-in': 'fadeIn 0.5s ease-out',
                        'slide-up': 'slideUp 0.4s ease-out',
                        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    },
                    keyframes: {
                        fadeIn: {
                            '0%': { opacity: '0' },
                            '100%': { opacity: '1' },
                        },
                        slideUp: {
                            '0%': { transform: 'translateY(10px)', opacity: '0' },
                            '100%': { transform: 'translateY(0)', opacity: '1' },
                        }
                    }
                }
            }
        }
    </script>
    <style>
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #0f172a; 
        }
        ::-webkit-scrollbar-thumb {
            background: #334155; 
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #475569; 
        }
        
        /* Glassmorphism Utilities */
        .glass {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .glass-panel {
            background: rgba(30, 41, 59, 0.6);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(148, 163, 184, 0.1);
        }

        /* Input Focus Glow */
        input:focus, select:focus, textarea:focus {
            box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2), 0 0 15px rgba(56, 189, 248, 0.1);
            border-color: #38bdf8;
            outline: none;
        }

        /* Gradient Text */
        .text-gradient {
            background: linear-gradient(to right, #38bdf8, #818cf8, #c084fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Toggle Switch Custom Style */
        .toggle-checkbox:checked {
            right: 0;
            border-color: #38bdf8;
        }
        .toggle-checkbox:checked + .toggle-label {
            background-color: #38bdf8;
        }
        
        /* Tab Active State */
        .tab-btn.active {
            background: linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(99, 102, 241, 0.1));
            border-bottom: 2px solid #38bdf8;
            color: #e2e8f0;
        }

        /* Glow Effect for Cards */
        .card-glow:hover {
            box-shadow: 0 0 20px rgba(56, 189, 248, 0.15), inset 0 0 1px rgba(255,255,255,0.1);
            transform: translateY(-2px);
        }
    </style>
</head>
<body class="bg-slate-950 text-slate-300 font-sans antialiased overflow-hidden h-screen flex selection:bg-primary-500 selection:text-white">

    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 z-20 shadow-2xl">
        <!-- Logo Area -->
        <div class="h-16 flex items-center px-6 border-b border-slate-800">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20 mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
            <span class="font-bold text-lg text-white tracking-wide">AI Node</span>
        </div>

        <!-- Nav Menu -->
        <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2 mt-2">Settings</div>
            
            <a href="#" class="flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-slate-800 text-white group transition-all duration-200 hover:bg-slate-700 hover:translate-x-1">
                <svg class="w-5 h-5 mr-3 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                General Config
            </a>
            <a href="#" class="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 group">
                <svg class="w-5 h-5 mr-3 text-slate-500 group-hover:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Server Status
            </a>
            <a href="#" class="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 group">
                <svg class="w-5 h-5 mr-3 text-slate-500 group-hover:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Logs
            </a>

            <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2 mt-6">Resources</div>
            <a href="#" class="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 group">
                <svg class="w-5 h-5 mr-3 text-slate-500 group-hover:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                Documentation
            </a>
        </nav>

        <!-- User Profile -->
        <div class="h-16 border-t border-slate-800 flex items-center px-4 bg-slate-900/50">
            <div class="flex-shrink-0 mr-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">AI</div>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white truncate">Analyzer Pro</p>
                <p class="text-xs text-slate-500 truncate">v2.4.1 (Beta)</p>
            </div>
            <button class="text-slate-400 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden relative">
        
        <!-- Header -->
        <header class="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 z-10">
            <div class="flex items-center space-x-4">
                <h1 class="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span class="w-2 h-6 bg-primary-500 rounded-full"></span>
                    <span class="text-gradient">AI Node Analyzer Settings</span>
                </h1>
                <span class="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Operator</span>
            </div>
            
            <div class="flex items-center space-x-4">
                <!-- Search -->
                <div class="relative group">
                    <input type="text" placeholder="Search settings..." class="bg-slate-800/50 border border-slate-700 text-sm rounded-lg pl-9 pr-4 py-1.5 text-slate-200 focus:bg-slate-800 w-48 transition-all focus:w-64 placeholder-slate-500">
                    <svg class="w-4 h-4 absolute left-3 top-2.5 text-slate-500 group-focus-within:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                
                <!-- Action Buttons -->
                <button class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all hover:border-primary-500/50 hover:shadow-[0_0_10px_rgba(56,189,248,0.2)]" title="Reset Settings">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </button>
            </div>
        </header>

        <!-- Scrollable Content Area -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden bg-slate-950 relative">
            <!-- Background Grid Pattern -->
            <div class="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 24px 24px;">
            </div>

            <div class="max-w-5xl mx-auto p-8 space-y-6 relative z-10">
                
                <!-- Section 1: Info Row (Dashboard Style) -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
                    <!-- Blender Version -->
                    <div class="glass-panel rounded-xl p-4 flex items-center space-x-4 hover:scale-[1.02] transition-transform duration-300 border-l-4 border-l-blue-500">
                        <div class="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        </div>
                        <div>
                            <p class="text-xs text-slate-400 font-medium uppercase tracking-wider">Blender Version</p>
                            <p class="text-lg font-bold text-white">4.1.0 Alpha</p>
                        </div>
                    </div>

                    <!-- Node Type -->
                    <div class="glass-panel rounded-xl p-4 flex items-center space-x-4 hover:scale-[1.02] transition-transform duration-300 border-l-4 border-l-indigo-500">
                        <div class="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        </div>
                        <div>
                            <p class="text-xs text-slate-400 font-medium uppercase tracking-wider">Node Type</p>
                            <p class="text-lg font-bold text-white">几何节点</p>
                        </div>
                    </div>

                    <!-- Current Model -->
                    <div class="glass-panel rounded-xl p-4 flex items-center space-x-4 hover:scale-[1.02] transition-transform duration-300 border-l-4 border-l-purple-500">
                        <div class="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div>
                            <p class="text-xs text-slate-400 font-medium uppercase tracking-wider">Current Model</p>
                            <p class="text-lg font-bold text-white truncate max-w-[150px]">gpt-4-turbo-preview</p>
                        </div>
                    </div>
                </div>

                <!-- Section 2: Provider Settings (Card) -->
                <div class="glass rounded-2xl p-6 shadow-2xl shadow-black/20 border border-slate-800/50 animate-slide-up">
                    <div class="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h2 class="text-lg font-bold text-white">AI Service Provider</h2>
                        </div>
                        <span class="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">Configuration</span>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Left Column: Inputs -->
                        <div class="space-y-4">
                            <!-- Provider Select -->
                            <div>
                                <label class="block text-xs font-semibold text-slate-400 mb-2">Provider</label>
                                <div class="relative">
                                    <select class="w-full bg-slate-900/80 border border-slate-700 text-slate-200 rounded-lg px-4 py-2.5 appearance-none cursor-pointer hover:border-slate-600 transition-colors">
                                        <option>DeepSeek</option>
                                        <option>Ollama</option>
                                        <option>BigModel</option>
                                        <option>Generic</option>
                                    </select>
                                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <!-- URL Input -->
                            <div>
                                <label class="block text-xs font-semibold text-slate-400 mb-2">Service URL</label>
                                <div class="flex gap-2">
                                    <input type="text" value="https://api.deepseek.com/v1" class="flex-1 bg-slate-900/80 border border-slate-700 text-slate-200 rounded-lg px-3 py-2.5 font-mono text-xs placeholder-slate-600" placeholder="Enter URL...">
                                    <button class="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition-all hover:text-white hover:border-slate-500" title="Reset URL">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                    </button>
                                </div>
                            </div>

                            <!-- API Key Input -->
                            <div>
                                <label class="block text-xs font-semibold text-slate-400 mb-2">API Key</label>
                                <div class="flex gap-2">
                                    <input type="password" value="sk-xxxxxxxxxxxxxxxxxxxx" class="flex-1 bg-slate-900/80 border border-slate-700 text-slate-200 rounded-lg px-3 py-2.5 font-mono text-xs placeholder-slate-600" placeholder="Enter API Key...">
                                    <button class="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 transition-all hover:text-red-300 hover:border-red-500/50" title="Clear Key">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                            </div>

                            <!-- Model Input & Actions -->
                            <div>
                                <label class="block text-xs font-semibold text-slate-400 mb-2">Model Name</label>
                                <div class="flex gap-2">
                                    <input type="text" value="gpt-4-turbo-preview" class="flex-1 bg-slate-900/80 border border-slate-700 text-slate-200 rounded-lg px-3 py-2.5 font-mono text-xs placeholder-slate-600">
                                    <div class="flex gap-1">
                                        <button class="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition-all hover:text-white hover:border-slate-500 flex items-center gap-1">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                        </button>
                                        <button class="px-3 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 transition-all hover:text-emerald-300 flex items-center gap-1" title="Test Model">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: Status & List -->
                        <div class="flex flex-col gap-4">
                            <!-- Connectivity Status -->
                            <div class="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                                <div class="flex items-center justify-between mb-3">
                                    <span class="text-xs font-semibold text-slate-400">Connectivity</span>
                                    <span class="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-xs font-bold border border-emerald-500/20">
                                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        Available
                                    </span>
                                </div>
                                <button class="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 group">
                                    <svg class="w-4 h-4 text-slate-400 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Test Connectivity
                                </button>
                            </div>

                            <!-- Available Models List -->
                            <div class="bg-slate-900/50 rounded-xl border border-slate-800 flex-1 min-h-[140px] flex flex-col">
                                <div class="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/30 rounded-t-xl">
                                    <span class="text-xs font-semibold text-slate-400 flex items-center gap-2">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                        Available Models
                                    </span>
                                    <button class="text-xs text-primary-400 hover:text-primary-300 font-medium">Refresh</button>
                                </div>
                                <div class="p-2 space-y-1 overflow-y-auto max-h-[100px]">
                                    <div class="text-xs text-slate-500 text-center py-4 italic">No models loaded yet. Click refresh to scan.</div>
                                    <!-- Example Items (Hidden by default logic, but visualized here) -->
                                    <!-- <div class="text-xs bg-slate-800/50 p-2 rounded border border-slate-700/50 text-slate-300 font-mono truncate cursor-pointer hover:bg-slate-700 transition-colors">gpt-4-turbo-preview</div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 3: Tabs & Content (Interactive) -->
                <div class="space-y-4 animate-slide-up" style="animation-delay: 0.1s;">
                    <!-- Tab Navigation -->
                    <div class="flex space-x-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800/50">
                        <button onclick="switchTab('identity')" id="tab-identity" class="tab-btn active flex-1 py-2.5 px-4 text-sm font-medium rounded-lg text-slate-400 hover:text-slate-200 transition-all duration-200 text-center flex items-center justify-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            Identity
                        </button>
                        <button onclick="switchTab('prompts')" id="tab-prompts" class="tab-btn flex-1 py-2.5 px-4 text-sm font-medium rounded-lg text-slate-400 hover:text-slate-200 transition-all duration-200 text-center flex items-center justify-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                            Prompts
                        </button>
                        <button onclick="switchTab('detail')" id="tab-detail" class="tab-btn flex-1 py-2.5 px-4 text-sm font-medium rounded-lg text-slate-400 hover:text-slate-200 transition-all duration-200 text-center flex items-center justify-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            Detail
                        </button>
                    </div>

                    <!-- Tab Content Container -->
                    <div class="relative min-h-[200px]">
                        
                        <!-- Identity Panel -->
                        <div id="panel-identity" class="tab-panel transition-all duration-300">
                            <div class="glass rounded-2xl p-6 border border-slate-800/50">
                                <div class="flex items-center gap-3 mb-5">
                                    <div class="p-2 bg-violet-500/10 rounded-lg text-violet-400">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    </div>
                                    <h3 class="text-lg font-bold text-white">Identity Settings</h3>
                                </div>
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm text-slate-400 mb-2">Identity Preset</label>
                                        <select class="w-full bg-slate-900/80 border border-slate-700 text-slate-200 rounded-lg px-4 py-2.5">
                                            <option>Senior Technical Artist</option>
                                            <option>Junior Developer</option>
                                            <option>Math Expert</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm text-slate-400 mb-2">System Prompt</label>
                                        <textarea class="w-full bg-slate-900/80 border border-slate-700 text-slate-200 rounded-lg px-4 py-3 min-h-[100px] font-mono text-xs leading-relaxed focus:ring-2 focus:ring-violet-500/30" placeholder="You are a helpful assistant..."></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Prompts Panel (Hidden) -->
                        <div id="panel-prompts" class="tab-panel hidden transition-all duration-300">
                            <div class="glass rounded-2xl p-6 border border-slate-800/50">
                                <div class="flex items-center gap-3 mb-5">
                                    <div class="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                                    </div>
                                    <h3 class="text-lg font-bold text-white">Prompt Settings</h3>
                                </div>
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm text-slate-400 mb-2">Default Question Preset</label>
                                        <select class="w-full bg-slate-900/80 border border-slate-700 text-slate-200 rounded-lg px-4 py-2.5">
                                            <option>Explain Node Logic</option>
                                            <option>Optimize Performance</option>
                                            <option>Generate Code</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm text-slate-400 mb-2">Custom Question</label>
                                        <input type="text" class="w-full bg-slate-900/80 border border-slate-700 text-slate-200 rounded-lg px-4 py-2.5" placeholder="Type your custom question...">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Detail Panel (Hidden) -->
                        <div id="panel-detail" class="tab-panel hidden transition-all duration-300">
                            <div class="glass rounded-2xl p-6 border border-slate-800/50">
                                <div class="flex items-center gap-3 mb-5">
                                    <div class="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <h3 class="text-lg font-bold text-white">Detail Control</h3>
                                </div>
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm text-slate-400 mb-2">Output Detail Level</label>
                                        <div class="grid grid-cols-3 gap-2">
                                            <button class="py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white text-sm font-medium transition-all">Simple</button>
                                            <button class="py-2 rounded-lg bg-primary-500/20 border border-primary-500 text-primary-400 text-sm font-medium shadow-[0_0_10px_rgba(14,165,233,0.2)]">Medium</button>
                                            <button class="py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white text-sm font-medium transition-all">Detailed</button>
                                        </div>
                                    </div>
                                    <div class="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                                        <p class="text-xs text-slate-500 mb-1">Current Prompt (Medium)</p>
                                        <p class="text-sm text-slate-300 italic">"Provide a moderately detailed explanation with code snippets if applicable."</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Section 4: Memory & Thinking (Toggle Grid) -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up" style="animation-delay: 0.2s;">
                    <!-- Memory -->
                    <div class="glass rounded-xl p-5 border border-slate-800/50 flex flex-col justify-between hover:border-slate-700 transition-colors">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                                <span class="font-semibold text-slate-200">Memory & Thinking</span>
                            </div>
                            <!-- Toggle Switch -->
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" class="sr-only peer" checked>
                                <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                            </label>
                        </div>
                        <div class="space-y-2">
                            <div class="flex items-center justify-between text-sm text-slate-400">
                                <span>Memory Target (K)</span>
                                <input type="number" value="4" class="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center text-slate-200">
                            </div>
                            <div class="flex items-center gap-4 mt-2">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked class="w-4 h-4 rounded border-slate-600 text-primary-500 focus:ring-primary-500 bg-slate-900">
                                    <span class="text-xs text-slate-400">Deep Thinking</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" class="w-4 h-4 rounded border-slate-600 text-primary-500 focus:ring-primary-500 bg-slate-900">
                                    <span class="text-xs text-slate-400">Web Access</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Backend Server -->
                    <div class="glass rounded-xl p-5 border border-slate-800/50 flex flex-col justify-between hover:border-slate-700 transition-colors">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>
                                <span class="font-semibold text-slate-200">Backend Server</span>
                            </div>
                            <span class="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Running</span>
                        </div>
                        <div class="flex gap-3 items-end">
                            <div class="flex-1">
                                <label class="block text-xs text-slate-500 mb-1">Port</label>
                                <input type="text" value="8080" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono">
                            </div>
                            <button class="h-[42px] px-4 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)] flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Stop
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Section 5: Config Management (Footer Actions) -->
                <div class="mt-8 pt-6 border-t border-slate-800 flex flex-wrap gap-3 justify-end animate-slide-up" style="animation-delay: 0.3s;">
                    <button class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg border border-slate-700 transition-all hover:border-slate-500 flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        Reload Config
                    </button>
                    <button class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg border border-slate-700 transition-all hover:border-slate-500 flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                        Save Config
                    </button>
                    <button class="px-5 py-2.5 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-400 font-medium rounded-lg border border-red-500/30 transition-all hover:border-red-500/50 flex items-center gap-2 shadow-[0_0_10px_rgba(239,68,68,0.1)] hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        Reset Defaults
                    </button>
                </div>

            </div>
        </div>
    </main>

    <script>
        function switchTab(tabName) {
            // 1. Reset all tab buttons
            const buttons = document.querySelectorAll('.tab-btn');
            buttons.forEach(btn => {
                btn.classList.remove('active', 'bg-slate-800', 'text-white');
                btn.classList.add('text-slate-400');
            });

            // 2. Highlight active button
            const activeBtn = document.getElementById('tab-' + tabName);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }

            // 3. Hide all panels
            const panels = document.querySelectorAll('.tab-panel');
            panels.forEach(panel => {
                panel.classList.add('hidden');
            });

            // 4. Show active panel
            const activePanel = document.getElementById('panel-' + tabName);
            if (activePanel) {
                activePanel.classList.remove('hidden');
                // Trigger reflow for animation
                void activePanel.offsetWidth;
                activePanel.classList.add('animate-fade-in');
            }
        }
    </script>
</body>
</html>
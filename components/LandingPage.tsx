
import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';

// GSAP declarations for CDN usage
declare var gsap: any;
declare var ScrollTrigger: any;

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { t } = useAppContext();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 3D Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse Glow State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle 3D Tilt on Hero Card
  const handleHeroMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-10deg to 10deg)
    const xRot = ((y - rect.height / 2) / rect.height) * -10;
    const yRot = ((x - rect.width / 2) / rect.width) * 10;

    setTilt({ x: xRot, y: yRot });
  };

  const handleHeroMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Handle Global Mouse Move for Glow Effect
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);

  useLayoutEffect(() => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && containerRef.current) {
        gsap.registerPlugin(ScrollTrigger);
        
        const scroller = containerRef.current;
        const ctx = gsap.context(() => {
            
            // 1. Initial Hero Entry (Time-based, no scroll)
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            
            tl.fromTo(".hero-text-item", 
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.15 }
            )
            .fromTo(".hero-card-wrapper",
                { y: 60, opacity: 0, rotateX: 10 },
                { y: 0, opacity: 1, rotateX: 0, duration: 1.2, ease: "back.out(1.5)" },
                "-=0.8"
            );

            // 2. Scroll Triggered Animations for Features
            // Batch process feature cards for a cascading effect
            const cards = gsap.utils.toArray(".feature-card");
            if (cards.length > 0) {
                 gsap.fromTo(cards, 
                    { y: 60, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: "#features",
                            scroller: scroller,
                            start: "top 85%", // Triggers earlier to ensure visibility on jump
                            toggleActions: "play none none none" // Persist: Don't hide when scrolling back
                        }
                    }
                );
            }

            // 3. Workflow Steps - Slide in from alternating sides
            const steps = gsap.utils.toArray(".workflow-step");
            steps.forEach((step: any, i: number) => {
                const direction = i % 2 === 0 ? -50 : 50;
                gsap.fromTo(step,
                    { x: direction, opacity: 0 },
                    {
                        x: 0, 
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: step,
                            scroller: scroller,
                            start: "top 85%",
                            toggleActions: "play none none none" // Persist: Don't hide when scrolling back
                        }
                    }
                );
            });

             // 4. Parallax Background Bubbles
             // Simple movement based on scroll position
             gsap.to(".bg-blob-1", {
                 y: 200,
                 scrollTrigger: {
                     trigger: ".parallax-trigger",
                     scroller: scroller,
                     start: "top top",
                     end: "bottom bottom",
                     scrub: 2
                 }
             });
             gsap.to(".bg-blob-2", {
                 y: -150,
                 scrollTrigger: {
                     trigger: ".parallax-trigger",
                     scroller: scroller,
                     start: "top top",
                     end: "bottom bottom",
                     scrub: 3
                 }
             });

        }, containerRef);

        return () => ctx.revert();
    }
  }, []);

  return (
    <div 
        ref={containerRef} 
        className="landing-container w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans custom-scrollbar scroll-smooth relative snap-y snap-proximity scroll-pt-16"
    >
      
      {/* Background Ambience & Parallax Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden parallax-trigger">
          <div className="bg-blob-1 absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-[100px] animate-blob"></div>
          <div className="bg-blob-2 absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="bg-blob-3 absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
          
          {/* Noise & Grid Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-5 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Hero Section */}
      <section className="snap-start relative min-h-[90vh] flex items-center justify-center pt-24 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
            
            {/* Left: Text Content */}
            <div className="lg:w-1/2 text-left z-10 space-y-8">
                <div className="hero-text-item inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-widest border border-brand-200 dark:border-brand-800 shadow-sm backdrop-blur-sm">
                   <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                    </span>
                   {t('landing_hero_tag')}
                </div>
                
                <h1 className="hero-text-item text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                   {t('landing_hero_title_1')} <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-purple-600 to-brand-600 dark:from-brand-400 dark:via-purple-400 dark:to-brand-400 bg-300% animate-gradient">
                     {t('landing_hero_title_2')}
                   </span>
                </h1>
                
                <p className="hero-text-item text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                   {t('landing_hero_desc')}
                </p>
                
                <div className="hero-text-item flex flex-wrap gap-4">
                   <button 
                     onClick={onStart}
                     className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-lg font-bold rounded-xl shadow-2xl hover:shadow-brand-500/25 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                   >
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                      <span className="relative flex items-center gap-2">
                        {t('landing_cta_start')}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                   </button>
                   
                   <button 
                     onClick={() => document.getElementById('features')?.scrollIntoView({behavior: 'smooth'})}
                     className="px-8 py-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white text-lg font-semibold rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105"
                   >
                      {t('landing_cta_explore')}
                   </button>
                </div>

                <div className="hero-text-item flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                            </div>
                        ))}
                    </div>
                    <span>Trusted by 1,000+ developers</span>
                </div>
            </div>

            {/* Right: Interactive 3D Card */}
            <div 
                className="lg:w-1/2 relative z-10 hero-card-wrapper perspective-1000 flex justify-center lg:justify-end"
                onMouseMove={handleHeroMouseMove}
                onMouseLeave={handleHeroMouseLeave}
            >
                <div 
                    ref={cardRef}
                    className="relative w-full max-w-lg transition-transform duration-100 ease-out transform-style-3d cursor-pointer"
                    style={{ 
                        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    }}
                >
                    {/* Decorative Elements sticking out in 3D */}
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl z-20 shadow-lg transform translate-z-20 animate-float"></div>
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-brand-400 to-cyan-500 rounded-full z-0 blur-xl opacity-60 animate-pulse-slow"></div>
                    
                    {/* The Code Window */}
                    <div className="bg-slate-900/95 dark:bg-slate-900/95 rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 backdrop-blur-xl relative z-10 transform translate-z-10 ring-1 ring-white/10">
                        {/* Fake Mac Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-800/50">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                            </div>
                            <div className="text-xs text-slate-400 font-mono flex items-center gap-2 opacity-70">
                                LandingPage.tsx
                            </div>
                            <div className="w-10"></div>
                        </div>
                        
                        {/* Code Content */}
                        <div className="p-6 overflow-x-auto relative group">
                            {/* Hover effect for code */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50 pointer-events-none"></div>
                            
                            <pre className="text-sm font-mono leading-relaxed relative z-10">
                              <code>
                                 <span className="text-purple-400">import</span> React <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>;<br/><br/>
                                 <span className="text-slate-500 italic">// AI Generated Component</span><br/>
                                 <span className="text-purple-400">export const</span> <span className="text-yellow-300">FutureUI</span> = () =&gt; &#123;<br/>
                                 &nbsp;&nbsp;<span className="text-purple-400">return</span> (<br/>
                                 &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-red-400">motion.div</span><br/>
                                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-sky-300">animate</span>=&#123;&#123; <span className="text-orange-300">y</span>: <span className="text-blue-300">0</span> &#125;&#125;<br/>
                                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-sky-300">className</span>=<span className="text-green-400">"text-6xl font-bold"</span><br/>
                                 &nbsp;&nbsp;&nbsp;&nbsp;&gt;<br/>
                                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-red-400">h1</span>&gt;<br/>
                                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hello World<br/>
                                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-red-400">h1</span>&gt;<br/>
                                 &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-red-400">motion.div</span>&gt;<br/>
                                 &nbsp;&nbsp;);<br/>
                                 &#125;
                              </code>
                           </pre>
                        </div>
                    </div>

                    {/* Reflection/Shine Effect */}
                    <div 
                        className="absolute inset-0 rounded-2xl pointer-events-none z-30 opacity-20 mix-blend-overlay"
                        style={{
                            background: `linear-gradient(120deg, transparent 40%, white 50%, transparent 60%)`,
                            backgroundSize: '200% 100%',
                            backgroundPosition: `${50 + (tilt.y * 2)}% center` 
                        }}
                    ></div>
                </div>
            </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="snap-start py-24 px-6 relative z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <span className="text-brand-600 dark:text-brand-400 font-bold tracking-wider uppercase text-sm mb-2 block">{t('features_title')}</span>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">{t('features_subtitle')}</h2>
            </div>

            <div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]"
                onMouseMove={(e) => {
                    const cards = document.querySelectorAll('.feature-card');
                    cards.forEach(card => {
                        const rect = card.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
                        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
                    });
                }}
            >
                {/* Feature 1: Multi-Format */}
                <div className="feature-card md:col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                     <div className="relative z-10 h-full flex flex-col justify-between">
                         <div>
                             <h3 className="text-2xl font-bold mb-2">{t('feature_multiformat_title')}</h3>
                             <p className="text-indigo-100 max-w-sm">{t('feature_multiformat_desc')}</p>
                         </div>
                         <div className="flex gap-3">
                             {['.tsx', '.vue', '.html'].map((ext) => (
                                 <span key={ext} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-sm font-mono border border-white/10 hover:bg-white/30 transition-colors cursor-default">
                                     {ext}
                                 </span>
                             ))}
                         </div>
                     </div>
                     <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform group-hover:scale-150 transition-transform duration-700"></div>
                     <svg className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/10 rotate-12 transition-transform duration-500 group-hover:rotate-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                </div>

                {/* Feature 2: Visual Editor */}
                <div className="feature-card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 relative overflow-hidden group hover:border-brand-500/50 transition-all duration-300">
                     {/* Glow Overlay */}
                     <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                            background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.1), transparent 40%)`
                        }}
                     ></div>

                     <div className="absolute top-4 right-4 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                     </div>
                     <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white relative z-10">{t('feature_visual_title')}</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 relative z-10">{t('feature_visual_desc')}</p>
                     <div className="absolute bottom-4 left-4 right-4 bg-slate-100 dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:translate-y-[-5px] transition-transform duration-300">
                         <div className="text-xs text-brand-600 mb-1 font-semibold flex items-center gap-1">
                             <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                             {t('feature_visual_prompt_label')}
                         </div>
                         <div className="text-xs text-slate-500 italic">"{t('feature_visual_prompt_text')}"</div>
                     </div>
                </div>

                {/* Feature 3: Tailwind Integration */}
                <div className="feature-card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 relative overflow-hidden group hover:border-sky-500/50 transition-all duration-300">
                     {/* Glow Overlay */}
                     <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                            background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(14, 165, 233, 0.1), transparent 40%)`
                        }}
                     ></div>

                     <div className="absolute top-4 right-4 w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center text-sky-600 group-hover:rotate-12 transition-transform duration-300">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
                     </div>
                     <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white relative z-10">{t('feature_tailwind_title')}</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 relative z-10">
                        {t('feature_tailwind_desc')}
                     </p>
                     <div className="mt-8 flex flex-wrap gap-2 relative z-10">
                        {['flex', 'grid-cols-3', 'p-4', 'shadow-lg', 'rounded-xl'].map(cls => (
                            <span key={cls} className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-sky-500 font-mono border border-transparent hover:border-sky-400 transition-colors cursor-help">
                                {cls}
                            </span>
                        ))}
                     </div>
                </div>

                 {/* Feature 4: Real-time Preview */}
                 <div className="feature-card md:col-span-2 bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden border border-slate-700 group">
                     <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
                     <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 h-full">
                         <div className="flex-1">
                             <h3 className="text-2xl font-bold mb-2">{t('feature_realtime_title')}</h3>
                             <p className="text-slate-400 mb-6">{t('feature_realtime_desc')}</p>
                             <button onClick={onStart} className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-lg text-sm font-semibold transition-all hover:scale-105 shadow-lg shadow-brand-500/20">{t('feature_try_now')}</button>
                         </div>
                         <div className="flex-1 w-full max-w-sm">
                             <div className="bg-slate-800 rounded-lg p-2 border border-slate-700 shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500 hover:scale-105">
                                 <div className="h-4 bg-slate-700 rounded mb-2 w-1/3"></div>
                                 <div className="h-32 bg-slate-700/50 rounded border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-500 text-xs flex-col gap-2">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                     </svg>
                                     {t('feature_preview_area')}
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
            </div>
         </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="snap-start py-24 px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                  <span className="text-brand-600 dark:text-brand-400 font-bold tracking-wider uppercase text-sm bg-brand-50 dark:bg-brand-900/20 px-3 py-1 rounded-full">{t('workflow_label')}</span>
                  <h2 className="text-3xl md:text-5xl font-bold mt-4 text-slate-900 dark:text-white">{t('workflow_title')}</h2>
              </div>

              <div className="space-y-12 relative">
                  {/* Connector Line */}
                  <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-200 via-brand-200 to-slate-200 dark:from-slate-800 dark:via-brand-900 dark:to-slate-800 -translate-x-1/2 hidden md:block"></div>

                  {[
                      { title: t('workflow_step1_title'), desc: t('workflow_step1_desc'), icon: "1" },
                      { title: t('workflow_step2_title'), desc: t('workflow_step2_desc'), icon: "2" },
                      { title: t('workflow_step3_title'), desc: t('workflow_step3_desc'), icon: "3" },
                      { title: t('workflow_step4_title'), desc: t('workflow_step4_desc'), icon: "4" }
                  ].map((step, i) => (
                      <div key={i} className={`workflow-step flex flex-col md:flex-row items-center gap-8 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''} group`}>
                          <div className={`flex-1 md:text-right ${i % 2 !== 0 ? 'md:text-left' : ''}`}>
                              {i % 2 === 0 && (
                                  <>
                                     <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{step.title}</h3>
                                     <p className="text-slate-500 dark:text-slate-400 mt-2">{step.desc}</p>
                                  </>
                              )}
                          </div>
                          
                          <div className="relative z-10">
                             <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 group-hover:border-brand-500 group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-xl text-xl font-bold text-slate-400 group-hover:text-brand-600">
                                 {step.icon}
                             </div>
                          </div>

                          <div className={`flex-1 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                              {i % 2 !== 0 && (
                                  <>
                                     <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{step.title}</h3>
                                     <p className="text-slate-500 dark:text-slate-400 mt-2">{step.desc}</p>
                                  </>
                              )}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* CTA Footer - Redesigned to match glassmorphism aesthetics */}
      <section id="cta-section" className="snap-start py-24 px-6 relative overflow-hidden bg-brand-50 dark:bg-slate-900 border-t border-brand-100 dark:border-slate-800">
          <div className="absolute inset-0 pointer-events-none">
             {/* Subtle animated gradient background for light/dark consistency */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white/50 dark:to-black/20"></div>
             <div className="absolute -top-[50%] -left-[20%] w-[100%] h-[100%] bg-brand-400/10 blur-[100px] rounded-full animate-blob"></div>
             <div className="absolute top-[20%] -right-[20%] w-[80%] h-[80%] bg-purple-400/10 blur-[100px] rounded-full animate-blob animation-delay-2000"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight text-slate-900 dark:text-white">{t('ready_title')}</h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">{t('ready_desc')}</p>
              <button 
                onClick={onStart}
                className="group px-10 py-5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-brand-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                  {t('launch_editor')}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
              </button>
          </div>
      </section>

      {/* Simple Footer */}
      <footer className="snap-start py-8 bg-slate-100 dark:bg-slate-950 text-slate-500 text-center text-sm border-t border-slate-200 dark:border-slate-900">
          <p>© {new Date().getFullYear()} MarkWeb. {t('footer_copyright')}</p>
      </footer>

    </div>
  );
};

export default LandingPage;

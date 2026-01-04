
import React, { useState, useEffect } from 'react';
import { AppTab, UserStatus } from './types.ts';
import HomeView from './components/HomeView.tsx';
import ChatView from './components/ChatView.tsx';
import ToolsView from './components/ToolsView.tsx';
import AssetsView from './components/AssetsView.tsx';
import SubscriptionView from './components/SubscriptionView.tsx';
import VoiceCompanionView from './components/VoiceCompanionView.tsx';

/**
 * SpiritualBeacon: 极具通灵感的灯塔 LOGO
 * 设计升级：更加几何化、深邃，象征着在财务迷雾中的指引。
 */
const SpiritualBeacon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    {/* 背景光晕层 */}
    <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-[40px] animate-sacred-rotate"></div>
    <div className="absolute inset-0 bg-cyan-400/5 rounded-full blur-[60px] animate-spiritual-breath" style={{ animationDelay: '1s' }}></div>
    
    <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="towerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="baseGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* 顶部光源 */}
      <circle cx="50" cy="28" r="16" fill="rgba(99, 102, 241, 0.15)" className="animate-pulse" />
      <circle cx="50" cy="28" r="4" fill="white" filter="url(#glow)">
        <animate attributeName="r" values="3.5;5;3.5" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* 灯塔塔尖 */}
      <path d="M42 34H58L54 26H46L42 34Z" fill="white" />
      
      {/* 塔身 - 极简柱状 */}
      <path d="M44 85L47 38H53L56 85H44Z" fill="url(#baseGrad)" />
      
      {/* 细节装饰 - 横向线条 */}
      <rect x="46.5" y="45" width="7" height="1.5" fill="rgba(255,255,255,0.1)" />
      <rect x="46" y="55" width="8" height="1.5" fill="rgba(255,255,255,0.1)" />
      <rect x="45.5" y="65" width="9" height="1.5" fill="rgba(255,255,255,0.1)" />

      {/* 底部基座 */}
      <rect x="35" y="85" width="30" height="4" rx="2" fill="#1e1b4b" />
      <rect x="30" y="89" width="40" height="2" rx="1" fill="#020617" />
    </svg>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [bootStatus, setBootStatus] = useState<'loading' | 'exiting' | 'done'>('loading');
  const [phraseIndex, setPhraseIndex] = useState(0);
  
  const [userStatus, setUserStatus] = useState<UserStatus>(() => {
    const saved = localStorage.getItem('user_status');
    return saved ? JSON.parse(saved) : { isPro: false, referralCount: 0 };
  });

  const [privacyAgreed, setPrivacyAgreed] = useState(() => localStorage.getItem('privacy_agreed') === 'true');

  const empathyPhrases = [
    "每一个无法安睡的灵魂，这里有你的港湾",
    "不要自责，你只是掉进了一个加密的陷阱",
    "在这里，你可以放下所有伪装与面子",
    "我们用最隐秘的陪伴，陪你夺回生活的控制权",
    "直面恐惧，加密破局，你从不孤单"
  ];

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setPhraseIndex(prev => (prev < empathyPhrases.length - 1 ? prev + 1 : 0));
    }, 3000);

    const bootDelay = 3500;
    setTimeout(() => setBootStatus('exiting'), bootDelay - 800);
    setTimeout(() => setBootStatus('done'), bootDelay);

    return () => clearInterval(phraseInterval);
  }, []);

  const handleRefShare = () => {
    setUserStatus(prev => ({ ...prev, referralCount: Math.min(prev.referralCount + 1, 3) }));
  };

  if (bootStatus !== 'done') {
    return (
      <div className={`fixed inset-0 z-[9999] bg-[#020617] flex flex-col items-center justify-center transition-all duration-1000 ${bootStatus === 'exiting' ? 'opacity-0 scale-110 blur-xl' : ''}`}>
        <div className="flex flex-col items-center w-full max-w-sm px-10 text-center space-y-12">
          <SpiritualBeacon className="w-40 h-40" />
          <div className="h-16 flex items-center justify-center">
            <p key={phraseIndex} className="text-slate-400 text-[13px] font-light animate-empathy leading-relaxed italic px-6">
              “{empathyPhrases[phraseIndex]}”
            </p>
          </div>
          <h1 className="text-4xl font-black text-white tracking-[0.4em] uppercase">
             <span className="text-spiritual-shine">债策</span>
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-100 max-w-md mx-auto relative overflow-hidden shadow-2xl font-sans">
      {!privacyAgreed && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/98 backdrop-blur-3xl animate-fadeIn">
          <div className="bg-white rounded-[48px] p-10 w-full max-w-sm shadow-2xl space-y-8 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-[32px] flex items-center justify-center mx-auto relative">
               <SpiritualBeacon className="w-14 h-14" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-900">最隐秘的陪伴</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                在这里，您的故事将被灯塔照亮并完全加密。我们为您提供破局的工具与心理的支撑。
              </p>
            </div>
            <button onClick={() => { localStorage.setItem('privacy_agreed', 'true'); setPrivacyAgreed(true); }} className="w-full bg-slate-900 text-white py-5 rounded-[28px] font-black text-xs uppercase tracking-widest shadow-xl">接受陪伴并进入</button>
          </div>
        </div>
      )}

      <header className="px-6 py-6 flex items-center justify-between border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <SpiritualBeacon className="w-8 h-8" />
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-white tracking-tighter">债策</h1>
            <span className="text-[7px] font-black text-indigo-500 uppercase tracking-widest">Digital Sanctuary</span>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab(AppTab.PRO)} 
          className={`text-[9px] px-4 py-2 rounded-xl font-black uppercase transition-all shadow-lg ${userStatus.isPro ? 'bg-emerald-500 text-emerald-950 shadow-emerald-500/20' : 'bg-indigo-600 shadow-indigo-500/20'}`}
        >
          {userStatus.isPro ? '专家模式' : '升级破局'}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-4 scroll-hide relative">
        {activeTab === AppTab.HOME && <HomeView onStartChat={() => setActiveTab(AppTab.CHAT)} userStatus={userStatus} onShare={handleRefShare} />}
        {activeTab === AppTab.CHAT && <ChatView isPro={userStatus.isPro} onNavigateToPro={() => setActiveTab(AppTab.PRO)} />}
        {activeTab === AppTab.HEAL && <VoiceCompanionView />}
        {activeTab === AppTab.ASSETS && <AssetsView />}
        {activeTab === AppTab.TOOLS && <ToolsView isPro={userStatus.isPro} />}
        {activeTab === AppTab.PRO && <SubscriptionView onSubscribe={() => setUserStatus(prev => ({ ...prev, isPro: true }))} />}
      </main>

      <div className="fixed bottom-6 left-6 right-6 max-w-[360px] mx-auto z-50">
        <nav className="glass-morphism border border-white/10 p-3 flex justify-between items-center rounded-[44px] shadow-2xl">
          <NavButton active={activeTab === AppTab.HOME} onClick={() => setActiveTab(AppTab.HOME)} icon="🗼" label="灯塔" />
          <NavButton active={activeTab === AppTab.CHAT} onClick={() => setActiveTab(AppTab.CHAT)} icon="🤲" label="陪伴" />
          <NavButton active={activeTab === AppTab.HEAL} onClick={() => setActiveTab(AppTab.HEAL)} icon="🌬️" label="慰藉" />
          <NavButton active={activeTab === AppTab.ASSETS} onClick={() => setActiveTab(AppTab.ASSETS)} icon="💎" label="资产" />
          <NavButton active={activeTab === AppTab.TOOLS} onClick={() => setActiveTab(AppTab.TOOLS)} icon="🛡️" label="工具" />
        </nav>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all flex-1 py-1 ${active ? 'text-indigo-400' : 'text-slate-500'}`}>
    <span className="text-xl">{icon}</span>
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default App;

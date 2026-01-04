
import React, { useState, useEffect } from 'react';
import { AppTab, UserStatus } from './types.ts';
import HomeView from './components/HomeView.tsx';
import ChatView from './components/ChatView.tsx';
import ToolsView from './components/ToolsView.tsx';
import AssetsView from './components/AssetsView.tsx';
import SubscriptionView from './components/SubscriptionView.tsx';
import VoiceCompanionView from './components/VoiceCompanionView.tsx';

/**
 * SpiritualBeacon: 神秘灯塔 LOGO
 */
const SpiritualBeacon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-[50px] animate-pulse"></div>
    <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="beaconGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="towerGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <radialGradient id="beamGrad" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx="28" fill="#020617" />
      <g className="origin-[50px_30px] animate-[sacredRotate_8s_linear_infinite]">
        <path d="M50 30 L-10 -20 L110 -20 Z" fill="url(#beamGrad)" />
      </g>
      <path d="M30 85 H70 L65 80 H35 L30 85 Z" fill="white" fillOpacity="0.3" />
      <path d="M44 80 L48 35 H52 L56 80 Z" fill="url(#towerGrad)" />
      <path d="M40 35 H60 L54 28 C52 24 48 24 46 28 L40 35 Z" fill="white" />
      <circle cx="50" cy="27" r="3.5" fill="white" filter="url(#beaconGlow)">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="4s" repeatCount="indefinite" />
      </circle>
    </svg>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [bootStatus, setBootStatus] = useState<'loading' | 'exiting' | 'done'>('loading');
  const [phraseIndex, setPhraseIndex] = useState(0);
  
  const [userStatus, setUserStatus] = useState<UserStatus>(() => {
    const saved = localStorage.getItem('user_status');
    return saved ? JSON.parse(saved) : { isPro: false, referralCount: 0, isLifetimeFree: false };
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

    const bootDelay = 4000;
    setTimeout(() => setBootStatus('exiting'), bootDelay - 800);
    setTimeout(() => setBootStatus('done'), bootDelay);

    return () => clearInterval(phraseInterval);
  }, []);

  const handleRefShare = () => {
    const updated = { ...userStatus, referralCount: Math.min(userStatus.referralCount + 1, 3) };
    setUserStatus(updated);
    localStorage.setItem('user_status', JSON.stringify(updated));
  };

  const handleUpdateStatus = (newStatus: UserStatus) => {
    setUserStatus(newStatus);
    localStorage.setItem('user_status', JSON.stringify(newStatus));
  };

  if (bootStatus !== 'done') {
    return (
      <div className={`fixed inset-0 z-[9999] bg-[#020617] flex flex-col items-center justify-center transition-all duration-1000 ${bootStatus === 'exiting' ? 'opacity-0 scale-110 blur-xl' : ''}`}>
        <div className="flex flex-col items-center w-full max-w-sm px-10 text-center space-y-20">
          <SpiritualBeacon className="w-44 h-44 drop-shadow-[0_0_50px_rgba(79,70,229,0.2)]" />
          <div className="space-y-10">
            <div className="h-12 flex items-center justify-center">
              <p key={phraseIndex} className="text-slate-400 text-[13px] font-medium animate-empathy leading-relaxed italic px-8">
                “{empathyPhrases[phraseIndex]}”
              </p>
            </div>
            <div className="space-y-4">
              <h1 className="text-6xl font-black text-white tracking-[0.3em] uppercase">
                <span className="text-spiritual-shine">债策</span>
              </h1>
              <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-[11px] text-slate-200 font-black tracking-[0.6em] uppercase">黑暗中提灯 · 废墟中重建</p>
                <div className="h-[2px] w-12 bg-indigo-500/50 rounded-full mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-100 max-w-md mx-auto relative overflow-hidden shadow-2xl font-sans">
      {!privacyAgreed && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/98 backdrop-blur-3xl animate-fadeIn">
          <div className="bg-white rounded-[48px] p-10 w-full max-sm shadow-2xl space-y-8 text-center">
            <div className="w-24 h-24 bg-indigo-50 rounded-[32px] flex items-center justify-center mx-auto relative">
               <SpiritualBeacon className="w-16 h-16" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-900">最隐秘的陪伴</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                在这里，您的故事将被灯塔照亮并完全加密。我们为您提供破局的工具与心理的支撑。
              </p>
            </div>
            <button onClick={() => { localStorage.setItem('privacy_agreed', 'true'); setPrivacyAgreed(true); }} className="w-full bg-slate-900 text-white py-5 rounded-[28px] font-black text-xs uppercase tracking-widest shadow-xl">接受陪伴并进入</button>
          </div>
        </div>
      )}

      <header className="px-6 py-6 flex items-center justify-between border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <SpiritualBeacon className="w-10 h-10" />
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-white tracking-tighter">债策</h1>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-spiritual-shine">黑暗中提灯 · 废墟中重建</span>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab(AppTab.PRO)} 
          className={`text-[9px] px-4 py-2 rounded-xl font-black uppercase transition-all shadow-lg ${userStatus.isLifetimeFree ? 'bg-amber-500 text-amber-950 shadow-amber-500/20' : userStatus.isPro ? 'bg-emerald-500 text-emerald-950 shadow-emerald-500/20' : 'bg-indigo-600 shadow-indigo-500/20'}`}
        >
          {userStatus.isLifetimeFree ? '终生荣誉' : userStatus.isPro ? '专家模式' : '升级破局'}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-4 scroll-hide relative">
        {activeTab === AppTab.HOME && <HomeView onStartChat={() => setActiveTab(AppTab.CHAT)} userStatus={userStatus} onShare={handleRefShare} onSetLifetimeFree={handleUpdateStatus} />}
        {activeTab === AppTab.CHAT && <ChatView isPro={userStatus.isPro} onNavigateToPro={() => setActiveTab(AppTab.PRO)} />}
        {activeTab === AppTab.HEAL && <VoiceCompanionView />}
        {activeTab === AppTab.ASSETS && <AssetsView />}
        {activeTab === AppTab.TOOLS && <ToolsView isPro={userStatus.isPro} />}
        {activeTab === AppTab.PRO && <SubscriptionView onSubscribe={(tier) => handleUpdateStatus({...userStatus, isPro: true, tier})} />}
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

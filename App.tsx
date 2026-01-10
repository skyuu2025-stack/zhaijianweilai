
import React, { useState, useEffect } from 'react';
import { AppTab, UserStatus } from './types.ts';
import HomeView from './components/HomeView.tsx';
import ChatView from './components/ChatView.tsx';
import ToolsView from './components/ToolsView.tsx';
import AssetsView from './components/AssetsView.tsx';
import SubscriptionView from './components/SubscriptionView.tsx';
import VoiceCompanionView from './components/VoiceCompanionView.tsx';
import TermsPrivacyView from './components/TermsPrivacyView.tsx';

const SpiritualBeacon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-[40px] animate-pulse"></div>
    <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="28" fill="#020617" />
      <circle cx="50" cy="50" r="40" stroke="#4f46e5" strokeWidth="1" strokeDasharray="4 4" className="animate-[spin_20s_linear_infinite]" />
      <path d="M50 25 L45 75 H55 L50 25 Z" fill="white" />
      <circle cx="50" cy="22" r="4" fill="white" className="animate-pulse" />
    </svg>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [showSettings, setShowSettings] = useState(false);
  const [bootStatus, setBootStatus] = useState<'loading' | 'done'>('loading');
  
  const [userStatus, setUserStatus] = useState<UserStatus>(() => {
    const saved = localStorage.getItem('user_status_v3');
    return saved ? JSON.parse(saved) : { isPro: false, referralCount: 0, isLifetimeFree: false };
  });

  const [privacyAgreed, setPrivacyAgreed] = useState(() => localStorage.getItem('privacy_agreed_v3') === 'true');

  useEffect(() => {
    const timer = setTimeout(() => setBootStatus('done'), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateStatus = (newStatus: UserStatus) => {
    setUserStatus(newStatus);
    localStorage.setItem('user_status_v3', JSON.stringify(newStatus));
  };

  const clearUserData = (isFullDelete: boolean = false) => {
    const msg = isFullDelete ? '这将永久注销您的本地账号并删除所有加密账单，确定吗？' : '确定要清除所有加密缓存吗？';
    if (confirm(msg)) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (bootStatus === 'loading') {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#020617] flex flex-col items-center justify-center">
        <SpiritualBeacon className="w-32 h-32 mb-8 animate-fadeIn" />
        <div className="space-y-2 text-center animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <h1 className="text-2xl font-black text-white tracking-[0.4em] uppercase">债策</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.6em]">Encrypted Financial Defense</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#020617] text-slate-100 max-w-md mx-auto relative overflow-hidden font-sans">
      {/* 隐私协议遮罩 */}
      {!privacyAgreed && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 bg-slate-950/98 backdrop-blur-3xl animate-fadeIn">
          <div className="bg-white rounded-[44px] p-10 w-full space-y-8 text-center shadow-2xl border border-white/5">
            <div className="w-20 h-20 bg-indigo-50 rounded-[30px] flex items-center justify-center mx-auto shadow-inner">
               <SpiritualBeacon className="w-12 h-12" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900">欢迎来到债策</h3>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                继续使用即代表您同意我们的<span className="text-indigo-600 font-bold">《服务协议》</span>与<span className="text-indigo-600 font-bold">《隐私政策》</span>。所有数据均采用端到端加密技术。
              </p>
            </div>
            <button onClick={() => { localStorage.setItem('privacy_agreed_v3', 'true'); setPrivacyAgreed(true); }} className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">开启加密旅程</button>
          </div>
        </div>
      )}

      {/* 顶部导航 */}
      <header className="px-6 py-6 flex items-center justify-between border-b border-white/5 bg-[#020617]/50 backdrop-blur-xl sticky top-0 z-40 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <div className="flex items-center gap-3">
          <SpiritualBeacon className="w-8 h-8" />
          <h1 className="text-lg font-black text-white tracking-tight">债策</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab(AppTab.PRO)} 
            className={`text-[9px] px-4 py-2 rounded-xl font-black uppercase transition-all shadow-lg ${userStatus.isPro ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-600 text-white'}`}
          >
            {userStatus.isPro ? 'Expert Active' : '升级专家版'}
          </button>
          <button onClick={() => setShowSettings(true)} className="p-2 bg-white/5 rounded-xl text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          </button>
        </div>
      </header>

      {/* 主视图 */}
      <main className="flex-1 overflow-y-auto px-4 pt-4 scroll-hide relative pb-32">
        {activeTab === AppTab.HOME && <HomeView onStartChat={() => setActiveTab(AppTab.CHAT)} userStatus={userStatus} onShare={() => {}} onSetLifetimeFree={handleUpdateStatus} />}
        {activeTab === AppTab.CHAT && <ChatView isPro={userStatus.isPro} onNavigateToPro={() => setActiveTab(AppTab.PRO)} />}
        {activeTab === AppTab.HEAL && <VoiceCompanionView />}
        {activeTab === AppTab.ASSETS && <AssetsView />}
        {activeTab === AppTab.TOOLS && <ToolsView isPro={userStatus.isPro} />}
        {activeTab === AppTab.PRO && <SubscriptionView onSubscribe={(tier) => handleUpdateStatus({...userStatus, isPro: true, tier})} />}
      </main>

      {/* 设置 */}
      {showSettings && (
        <div className="fixed inset-0 z-[500] bg-slate-950/95 backdrop-blur-3xl animate-fadeIn p-8">
          <div className="flex flex-col h-full space-y-10 max-w-sm mx-auto">
             <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white">账户与安全</h3>
                <button onClick={() => setShowSettings(false)} className="text-slate-600 p-2">✕</button>
             </div>
             
             <div className="space-y-4">
                <SettingsLink icon="🔒" title="隐私政策" onClick={() => { setShowSettings(false); setActiveTab(AppTab.TOOLS); }} />
                <SettingsLink icon="📄" title="服务协议" onClick={() => { setShowSettings(false); setActiveTab(AppTab.TOOLS); }} />
                <SettingsLink icon="📧" title="联系支持" onClick={() => window.open('mailto:support@zhaice.app')} />
                
                <div className="pt-6 space-y-3">
                   <button onClick={() => clearUserData(false)} className="w-full bg-white/5 text-slate-400 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest border border-white/5">清除本地缓存</button>
                   <button onClick={() => clearUserData(true)} className="w-full bg-red-500/10 text-red-500 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest border border-red-500/20">注销账号并抹除数据</button>
                </div>
             </div>

             <div className="mt-auto text-center space-y-2 opacity-30 pb-12">
                <p className="text-[10px] font-black uppercase tracking-widest">Version 2.6.0 (Stable-Audit)</p>
                <p className="text-[9px] font-medium tracking-[0.4em]">BEACON STRATEGY © 2027</p>
             </div>
          </div>
        </div>
      )}

      {/* 底部导航 */}
      <div className="fixed bottom-6 left-6 right-6 max-w-[360px] mx-auto z-50">
        <nav className="glass-morphism p-2 flex justify-between items-center rounded-[40px] shadow-2xl border border-white/10">
          <NavButton active={activeTab === AppTab.HOME} onClick={() => setActiveTab(AppTab.HOME)} icon="🏠" label="首页" />
          <NavButton active={activeTab === AppTab.CHAT} onClick={() => setActiveTab(AppTab.CHAT)} icon="💬" label="咨询" />
          <NavButton active={activeTab === AppTab.HEAL} onClick={() => setActiveTab(AppTab.HEAL)} icon="🎧" label="陪护" />
          <NavButton active={activeTab === AppTab.ASSETS} onClick={() => setActiveTab(AppTab.ASSETS)} icon="📈" label="资产" />
          <NavButton active={activeTab === AppTab.TOOLS} onClick={() => setActiveTab(AppTab.TOOLS)} icon="🛠️" label="工具" />
        </nav>
      </div>
    </div>
  );
};

const SettingsLink = ({ icon, title, onClick }: any) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-6 bg-white/5 rounded-[28px] border border-white/5 active:scale-95 transition-all">
    <div className="flex items-center gap-5">
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-bold text-slate-200">{title}</span>
    </div>
    <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
  </button>
);

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all flex-1 py-2.5 rounded-[30px] ${active ? 'bg-white/10 text-white' : 'text-slate-600'}`}>
    <span className="text-lg">{icon}</span>
    <span className="text-[9px] font-black uppercase tracking-tight">{label}</span>
  </button>
);

export default App;

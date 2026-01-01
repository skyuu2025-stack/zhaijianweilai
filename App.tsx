
import React, { useState } from 'react';
import { AppTab, UserStatus } from './types';
import HomeView from './components/HomeView';
import ChatView from './components/ChatView';
import ToolsView from './components/ToolsView';
import HabitsView from './components/HabitsView';
import AssetsView from './components/AssetsView';
import SubscriptionView from './components/SubscriptionView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [userStatus, setUserStatus] = useState<UserStatus>({ isPro: false });

  const handleSubscribe = (tier: string) => {
    setUserStatus({ isPro: true, tier: tier as any, expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 });
    setActiveTab(AppTab.HOME);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.HOME: return <HomeView onStartChat={() => setActiveTab(AppTab.CHAT)} isPro={userStatus.isPro} />;
      case AppTab.CHAT: return <ChatView isPro={userStatus.isPro} onNavigateToPro={() => setActiveTab(AppTab.PRO)} />;
      case AppTab.TOOLS: return <ToolsView isPro={userStatus.isPro} />;
      case AppTab.HABITS: return <HabitsView />;
      case AppTab.ASSETS: return <AssetsView />;
      case AppTab.PRO: return <SubscriptionView onSubscribe={handleSubscribe} />;
      default: return <HomeView onStartChat={() => setActiveTab(AppTab.CHAT)} isPro={userStatus.isPro} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 max-w-md mx-auto relative overflow-hidden shadow-2xl border-x border-slate-200">
      {/* Header */}
      <header className="p-4 glass-morphism sticky top-0 z-20 flex items-center justify-between border-b border-blue-50">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-blue-700">债见未来</h1>
            {userStatus.isPro && (
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                PRO
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] text-emerald-600 font-medium uppercase tracking-tighter">AES-256 加密连接已开启</span>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab(AppTab.PRO)}
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
            userStatus.isPro 
            ? 'bg-amber-100 text-amber-700' 
            : 'bg-blue-600 text-white shadow-md active:scale-95'
          }`}
        >
          {userStatus.isPro ? '会员权益' : '升级专业版'}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4 scroll-hide">
        {renderContent()}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass-morphism border-t border-slate-200 px-4 py-3 flex justify-between items-center z-20">
        <NavButton 
          active={activeTab === AppTab.HOME} 
          onClick={() => setActiveTab(AppTab.HOME)} 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
          label="首页"
        />
        <NavButton 
          active={activeTab === AppTab.CHAT} 
          onClick={() => setActiveTab(AppTab.CHAT)} 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
          label="树洞"
        />
        <NavButton 
          active={activeTab === AppTab.ASSETS} 
          onClick={() => setActiveTab(AppTab.ASSETS)} 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="资产"
        />
        <NavButton 
          active={activeTab === AppTab.TOOLS} 
          onClick={() => setActiveTab(AppTab.TOOLS)} 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
          label="工具"
        />
        <NavButton 
          active={activeTab === AppTab.HABITS} 
          onClick={() => setActiveTab(AppTab.HABITS)} 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
          label="习惯"
        />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors flex-1 ${active ? 'text-blue-600' : 'text-slate-400'}`}>
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;

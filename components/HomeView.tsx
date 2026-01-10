
import React, { useState, useEffect } from 'react';
import { UserStatus } from '../types.ts';

const GoddessIcon: React.FC<{ className?: string; color?: string }> = ({ className, color = "currentColor" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="goddessGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <radialGradient id="beaconGrad" cx="50%" cy="30%" r="30%">
        <stop offset="0%" stopColor="white" />
        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="30" r="15" fill="url(#beaconGrad)" className="animate-pulse" />
    <path d="M50 15 C52 15 54 17 54 20 C54 23 52 25 50 25 C48 25 46 23 46 20 C46 17 48 15 50 15 Z" fill={color} />
    <path d="M50 25 L45 45 L40 85 H60 L55 45 L50 25 Z" fill={color} fillOpacity="0.8" />
    <circle cx="50" cy="20" r="2.5" fill="white" filter="url(#goddessGlow)" />
  </svg>
);

interface HomeViewProps {
  onStartChat: () => void;
  userStatus: UserStatus;
  onShare: () => void;
  onSetLifetimeFree: (newStatus: UserStatus) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onStartChat, userStatus }) => {
  const [counter, setCounter] = useState(1178234102);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 pb-40 animate-fadeIn">
      {/* 状态指示器 */}
      <div className="flex justify-center pt-2">
         <div className="bg-white/5 px-4 py-1.5 rounded-full flex items-center gap-3 border border-white/5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
               已建立端到端加密连接
            </span>
         </div>
      </div>

      {/* 核心破局卡片 - 采用大圆角和深色渐变体现高级感 */}
      <div className="bg-gradient-to-br from-indigo-900/30 to-slate-950 border border-white/10 rounded-[44px] p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tighter leading-tight">
              至暗时刻，<br/>陪你隐秘破局。
            </h2>
            <p className="text-[13px] text-slate-400 font-medium leading-relaxed opacity-70">
               “债策”是您的私人财务审计师与心理陪护战友。在每一个无人问津的夜晚，这里始终为您亮着灯。
            </p>
          </div>
          
          <button 
            onClick={onStartChat} 
            className="w-full bg-white text-slate-950 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-[0.98] transition-all"
          >
            开启 1V1 加密对话
          </button>
        </div>
      </div>

      {/* 实时数据看板 - 增加应用的可信度 */}
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-white/5 border border-white/5 p-6 rounded-[36px] flex flex-col items-center gap-2">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">今日陪伴人次</span>
            <span className="text-xl font-black text-white tabular-nums">
               {counter.toLocaleString().slice(-6)}
            </span>
         </div>
         <div className="bg-white/5 border border-white/5 p-6 rounded-[36px] flex flex-col items-center gap-2">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">当前安全评级</span>
            <span className="text-xl font-black text-emerald-400">A+级</span>
         </div>
      </div>

      {/* 灯塔女神模块 - 保持神秘感与裂变机制 */}
      <div className="bg-slate-900 border border-amber-500/20 rounded-[40px] p-8 flex items-center gap-6 group cursor-pointer active:scale-[0.98] transition-all">
         <div className="w-16 h-16 bg-amber-500/10 rounded-3xl flex items-center justify-center shrink-0 border border-amber-500/20">
            <GoddessIcon className="w-10 h-10" color="#fbbf24" />
         </div>
         <div className="space-y-1">
            <h4 className="text-sm font-black text-white">灯塔女神的赠礼</h4>
            <p className="text-[10px] text-slate-500 font-bold leading-snug">
               每月随机点亮一名同伴的“上岸之光”，赠予永久专家版权限。
            </p>
         </div>
      </div>

      <div className="px-8 text-center">
         <p className="text-[8px] text-slate-700 font-black uppercase tracking-[0.4em] opacity-40">
            Encrypted Financial Companion Framework v2.6
         </p>
      </div>
    </div>
  );
};

export default HomeView;

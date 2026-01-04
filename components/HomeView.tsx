
import React, { useState } from 'react';
import { UserStatus } from '../types.ts';

interface HomeViewProps {
  onStartChat: () => void;
  userStatus: UserStatus;
  onShare: () => void;
}

interface CaseStudy {
  id: string;
  tag: string;
  title: string;
  shortDesc: string;
  logic: {
    steps: string[];
    legalBasis: string;
    proTip: string;
  };
}

const HomeView: React.FC<HomeViewProps> = ({ onStartChat, userStatus, onShare }) => {
  const [showShareToast, setShowShareToast] = useState(false);
  const [activeCase, setActiveCase] = useState<CaseStudy | null>(null);

  const handleShare = async () => {
    const currentUrl = window.location.href.startsWith('http') ? window.location.href : 'https://zhaice.app';
    const shareData = {
      title: '债策 - 心理陪伴与加密破局',
      text: '我在这里找到了久违的平静，推荐给正在泥潭中挣扎的你。',
      url: currentUrl,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        onShare();
      } else {
        throw new Error('Share not supported');
      }
    } catch (err) {
      const textToCopy = `${shareData.text} 链接：${shareData.url}`;
      await navigator.clipboard.writeText(textToCopy);
      setShowShareToast(true);
      onShare();
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  const CASE_STUDIES: CaseStudy[] = [
    { 
      id: 'zhang', tag: '破局实战', title: '张哥：从绝望到体面', shortDesc: '面对 714 高利贷，从准备轻生到法律反制...',
      logic: {
        steps: ['心理重建', '信息加密', '法律隔离', '主动坦白'],
        legalBasis: '《民法典》第670条。',
        proTip: '坏账不是人生的污点。'
      }
    },
    { 
      id: 'li', tag: '陪伴上岸', title: '小李：不再孤单的 60 期', shortDesc: '五个银行的压力，在 AI 陪伴下逐一协商...',
      logic: {
        steps: ['策略拟定', '话术模拟', '情绪支持', '协议落地'],
        legalBasis: '《信用卡业务监督管理办法》第70条。',
        proTip: '不要害怕电话。'
      }
    }
  ];

  const progress = (userStatus.referralCount / 3) * 100;

  return (
    <div className="space-y-8 pb-40 animate-fadeIn relative">
      {showShareToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-indigo-600 text-white px-6 py-3 rounded-full font-black shadow-2xl flex items-center gap-2 animate-bounce">
          <span>🔗 专属邀请已加密复制</span>
        </div>
      )}

      {/* 核心卡片 */}
      <div className="bg-[#0f172a]/80 border border-white/5 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] animate-sacred-rotate"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-500/20 rounded-full mb-8 border border-white/10">
             <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
             <span className="text-[11px] font-black tracking-widest uppercase text-indigo-200">11.7 亿同伴的心理避风港</span>
          </div>
          <h2 className="text-[34px] font-black mb-6 tracking-tighter leading-[1.1]">至暗时刻，<br/>给你最隐秘的陪伴。</h2>
          <p className="opacity-50 text-[13px] leading-relaxed mb-12 font-medium">
            债策：主打“心理陪伴”与“加密破局”的 AI 助手。只在黑暗中提灯。
          </p>
          <button onClick={onStartChat} className="bg-indigo-600 text-white px-10 py-5 rounded-[24px] font-black text-sm w-full shadow-[0_15px_35px_rgba(79,70,229,0.3)] active:scale-95 transition-all">开启 1V1 加密深度陪伴</button>
        </div>
      </div>

      <div className={`relative group animate-fadeIn`}>
        <div 
          onClick={handleShare}
          className={`relative glass-morphism border ${userStatus.isPro ? 'border-emerald-500/30' : 'border-indigo-500/20'} rounded-[40px] p-8 space-y-6 shadow-2xl cursor-pointer active:scale-[0.98] transition-all duration-500`}
        >
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-3">
                <div className="relative">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${userStatus.isPro ? 'bg-emerald-500/20' : 'bg-indigo-500/20'}`}>
                    {userStatus.isPro ? '🌟' : '🤲'}
                   </div>
                   {!userStatus.isPro && (
                     <div className="absolute -top-3 -right-3 bg-amber-500 text-white text-[8px] font-black px-2 py-1 rounded-md shadow-lg animate-labelJump border border-white/20 whitespace-nowrap shine-effect">
                       FREE
                     </div>
                   )}
                </div>
                <div>
                   <h4 className="font-black text-white text-lg tracking-tight">
                     {userStatus.isPro ? '专家权益已激活' : '寻找共鸣伙伴'}
                   </h4>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                     {userStatus.isPro ? '感谢您的信任' : '转发 3 人 · 免费使用 7 天'}
                   </p>
                </div>
             </div>
          </div>

          {!userStatus.isPro && (
            <div className="space-y-3">
              <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                 <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="space-y-6">
        <h3 className="font-black text-slate-400 text-[11px] flex items-center gap-3 px-3 uppercase tracking-[0.3em] opacity-80">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
          陪伴见证 · 破局重生
        </h3>
        <div className="flex gap-5 overflow-x-auto scroll-hide px-1 pb-4 snap-x snap-mandatory">
          {CASE_STUDIES.map(cs => (
            <div key={cs.id} className="bg-[#0f172a]/80 border border-white/5 p-8 rounded-[44px] min-w-[280px] snap-center flex flex-col gap-6 shadow-xl active:scale-[0.99] cursor-pointer">
              <div className="bg-[#1e293b] self-start px-5 py-2 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{cs.tag}</div>
              <h4 className="text-xl font-black text-white">{cs.title}</h4>
              <p className="text-[13px] text-slate-500 leading-relaxed font-medium opacity-70 line-clamp-2">{cs.shortDesc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;

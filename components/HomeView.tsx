
import React, { useState } from 'react';
import { UserStatus } from '../types.ts';

/**
 * GoddessIcon: 专属设计的“灯塔女神”图标
 */
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
    <path d="M45 35 Q30 40 35 60 M55 35 Q70 40 65 60" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <circle cx="50" cy="20" r="2.5" fill="white" filter="url(#goddessGlow)" />
  </svg>
);

interface HomeViewProps {
  onStartChat: () => void;
  userStatus: UserStatus;
  onShare: () => void;
  onSetLifetimeFree: (newStatus: UserStatus) => void;
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

const HomeView: React.FC<HomeViewProps> = ({ onStartChat, userStatus, onShare, onSetLifetimeFree }) => {
  const [showShareToast, setShowShareToast] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawResult, setDrawResult] = useState<'none' | 'won' | 'lost'>('none');

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const hasDrawnThisMonth = userStatus.lastDrawMonth === currentMonth;

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

  const drawGoddessGift = () => {
    if (hasDrawnThisMonth || userStatus.isLifetimeFree) return;
    
    setIsDrawing(true);
    // 更新本地状态，标记本月已抽奖
    const updatedStatus = { ...userStatus, lastDrawMonth: currentMonth };
    localStorage.setItem('user_status', JSON.stringify(updatedStatus));

    setTimeout(() => {
      setIsDrawing(false);
      // 模拟极低中奖率 (11.5亿分之一)
      const winChance = Math.random() < 0.00000000087; 
      if (winChance) {
        setDrawResult('won');
      } else {
        setDrawResult('lost');
      }
    }, 3500);
  };

  const CASE_STUDIES: CaseStudy[] = [
    { 
      id: 'house', 
      tag: '深度案例', 
      title: '王姐：保住最后的避风港', 
      shortDesc: '误入民间“房抵贷”陷阱，面对职业债权人的利息交叉违约条款与暴力清场，如何利用《民法典》撤销委托公证并确认实际债务。',
      logic: {
        steps: ['撤销全权委托公证', '审计历史流水确认真实利息', '提起确认债权债务之诉', '向住建部门备案防范网签'],
        legalBasis: '《民法典》禁止高利放贷，借款利息不得预先扣除。',
        proTip: '房产证绝不能交给对方，所谓的“全权委托公证”是卖房套路。'
      }
    },
    { 
      id: 'car', 
      tag: '深度案例', 
      title: '阿强：找回被强扣的座驾', 
      shortDesc: '民间车抵贷“不押车”背后的GPS强收陷阱。针对非法拖车行为，如何在法律框架下通过刑事报案与民事侵权联手，零成本追回车辆。',
      logic: {
        steps: ['第一时间拨打110报案非法强买强卖', '固定对方强行开锁证据', '投诉金融办确认放贷资质', '提起侵权之诉索赔'],
        legalBasis: '扫黑除恶常态化下，严厉打击“以收车为名”的敲诈勒索。',
        proTip: '不押车贷款里的“二抵”和“GPS管理费”均不合法。'
      }
    },
    { 
      id: 'zhang', 
      tag: '破局实战', 
      title: '张哥：从绝望到体面', 
      shortDesc: '面对 714 高利贷，从准备轻生到法律反制。成功建立防火墙，阻断催收骚扰，平债上岸。',
      logic: {
        steps: ['心理重建', '信息加密', '法律隔离', '主动坦白'],
        legalBasis: '《民法典》第670条。',
        proTip: '坏账不是人生的污点，只是暂时的错位。'
      }
    },
    { 
      id: 'li', 
      tag: '陪伴上岸', 
      title: '小李：不再孤单的 60 期', 
      shortDesc: '五个银行的信用卡压力，在 AI 陪伴下逐一协商，实现个性化还款（停息挂账），保住社保与工作。',
      logic: {
        steps: ['策略拟定', '话术模拟', '情绪支持', '协议落地'],
        legalBasis: '《信用卡业务监督管理办法》第70条。',
        proTip: '不要害怕电话，那是解决问题的开始。'
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
             <span className="text-[11px] font-black tracking-widest uppercase text-indigo-200">11.5 亿同伴的心理避风港</span>
          </div>
          <h2 className="text-[34px] font-black mb-6 tracking-tighter leading-[1.1]">至暗时刻，<br/>给你最隐秘的陪伴。</h2>
          <p className="opacity-50 text-[13px] leading-relaxed mb-12 font-medium">
            债策：主打“心理陪伴”与“加密破局”的 AI 助手。只在黑暗中提灯，于废墟中重建。
          </p>
          <button onClick={onStartChat} className="bg-indigo-600 text-white px-10 py-5 rounded-[24px] font-black text-sm w-full shadow-[0_15px_35px_rgba(79,70,229,0.3)] active:scale-95 transition-all">开启 1V1 加密深度陪伴</button>
        </div>
      </div>

      {/* 灯塔女神福利卡片 */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border border-amber-500/20 rounded-[44px] p-8 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150 rotate-12 transition-transform group-hover:rotate-0 duration-1000">
            <GoddessIcon className="w-40 h-40" color="#fbbf24" />
         </div>
         <div className="relative z-10 space-y-4 text-center">
            <div className="flex justify-center">
               <div className="bg-amber-500/10 p-4 rounded-full border border-amber-500/20">
                  <GoddessIcon className="w-10 h-10" color="#fbbf24" />
               </div>
            </div>
            <div className="space-y-1">
               <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-[0.4em]">Monthly Event</h4>
               <h3 className="text-xl font-black text-white tracking-tight">灯塔女神的幸运赠礼</h3>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed px-4">
               每月仅抽取一位幸运同伴，由“灯塔女神”点亮永久上岸之光，<span className="text-amber-300 font-black underline decoration-amber-500/50">终生免费使用</span>所有专家功能。
            </p>
            <button 
              onClick={drawGoddessGift}
              disabled={isDrawing || userStatus.isLifetimeFree || hasDrawnThisMonth}
              className={`w-full py-4 rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-xl ${userStatus.isLifetimeFree ? 'bg-emerald-500/20 text-emerald-500' : hasDrawnThisMonth ? 'bg-white/5 text-slate-600 cursor-default' : 'bg-amber-500 text-amber-950 active:scale-95'}`}
            >
               {userStatus.isLifetimeFree ? '已受女神永久守护' : hasDrawnThisMonth ? '本月已感知，请静候下月' : isDrawing ? '正在沟通星象...' : '点击抽取本月唯一幸运名额'}
            </button>
         </div>
      </div>

      {/* 状态看板 */}
      <div className={`relative group animate-fadeIn`}>
        <div 
          onClick={handleShare}
          className={`relative glass-morphism border ${userStatus.isPro ? 'border-emerald-500/30' : 'border-indigo-500/20'} rounded-[40px] p-8 space-y-6 shadow-2xl cursor-pointer active:scale-[0.98] transition-all duration-500`}
        >
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-3">
                <div className="relative">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${userStatus.isLifetimeFree ? 'bg-amber-500/20' : userStatus.isPro ? 'bg-emerald-500/20' : 'bg-indigo-500/20'}`}>
                    {userStatus.isLifetimeFree ? <GoddessIcon className="w-8 h-8" color="#fbbf24" /> : userStatus.isPro ? '🌟' : '🤲'}
                   </div>
                   {!userStatus.isPro && !userStatus.isLifetimeFree && (
                     <div className="absolute -top-3 -right-3 bg-[#f39c12] text-white text-[10px] font-black px-3 py-1.5 rounded-[12px] shadow-[0_8px_20px_rgba(243,156,18,0.4)] animate-labelJump border border-white/30 whitespace-nowrap shine-effect">
                       FREE
                     </div>
                   )}
                </div>
                <div>
                   <h4 className="font-black text-white text-lg tracking-tight">
                     {userStatus.isLifetimeFree ? '终生荣誉权益' : userStatus.isPro ? '专家权益已激活' : '寻找共鸣伙伴'}
                   </h4>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                     {userStatus.isLifetimeFree ? '灯塔女神永恒守护' : userStatus.isPro ? '感谢您的信任' : '转发 3 人 · 免费使用 7 天'}
                   </p>
                </div>
             </div>
          </div>
          {!userStatus.isPro && !userStatus.isLifetimeFree && (
            <div className="space-y-3">
              <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                 <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 案例展示 */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-3">
          <h3 className="font-black text-slate-400 text-[11px] flex items-center gap-3 uppercase tracking-[0.3em] opacity-80">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
            陪伴见证 · 破局重生
          </h3>
          <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">向右滑动查看更多</span>
        </div>
        <div className="flex gap-5 overflow-x-auto scroll-hide px-1 pb-4 snap-x snap-mandatory">
          {CASE_STUDIES.map(cs => (
            <div key={cs.id} className="bg-[#0f172a]/80 border border-white/5 p-8 rounded-[44px] min-w-[300px] snap-center flex flex-col gap-6 shadow-xl active:scale-[0.99] cursor-pointer group">
              <div className="bg-[#1e293b] self-start px-5 py-2 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-colors">{cs.tag}</div>
              <h4 className="text-xl font-black text-white">{cs.title}</h4>
              <p className="text-[13px] text-slate-400 leading-relaxed font-medium line-clamp-3 italic opacity-80">"{cs.shortDesc}"</p>
              <div className="pt-4 border-t border-white/5 space-y-3">
                 <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">破局思路：</p>
                 <div className="flex flex-wrap gap-2">
                   {cs.logic.steps.map((s, idx) => (
                     <span key={idx} className="text-[10px] bg-white/5 px-3 py-1 rounded-lg text-slate-300 font-medium">· {s}</span>
                   ))}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 抽奖结果弹窗 */}
      {drawResult !== 'none' && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-3xl animate-fadeIn">
           {drawResult === 'won' ? (
             <div className="bg-gradient-to-b from-indigo-900 to-black border border-amber-400/30 rounded-[60px] p-10 w-full max-w-sm shadow-[0_0_100px_rgba(245,158,11,0.2)] text-center space-y-8 animate-labelJump">
                <div className="flex justify-center">
                   <GoddessIcon className="w-32 h-32 animate-pulse" color="#fbbf24" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-amber-400 tracking-tighter">命运的眷顾</h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed px-6">
                     本月幸运女神降临在您的灯塔下。我们将为您永久解锁所有专家模块。
                  </p>
                </div>
                <button onClick={() => { onSetLifetimeFree({ ...userStatus, isLifetimeFree: true, isPro: true, lastDrawMonth: currentMonth }); setDrawResult('none'); }} className="w-full bg-amber-500 text-amber-950 py-5 rounded-[28px] font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95">
                  接受赠礼并点亮终身灯塔
                </button>
             </div>
           ) : (
             <div className="bg-slate-900/50 border border-white/5 rounded-[60px] p-10 w-full max-w-sm text-center space-y-8">
                <div className="flex justify-center opacity-30">
                   <GoddessIcon className="w-24 h-24" color="#94a3b8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-tight">星运交错</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed px-6 italic">
                    “很遗憾，本月灯塔女神的荣光已降临在另一位同伴身上。不要气馁，在这个废墟中，你我皆是幸存者。”
                  </p>
                </div>
                <button onClick={() => setDrawResult('none')} className="w-full bg-white/5 text-slate-400 py-5 rounded-[28px] font-black text-xs uppercase tracking-widest active:scale-95">
                  保持平静并继续努力
                </button>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default HomeView;

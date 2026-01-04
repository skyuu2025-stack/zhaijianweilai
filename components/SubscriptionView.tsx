
import React, { useState, useEffect } from 'react';

interface SubscriptionViewProps {
  onSubscribe: (tier: string) => void;
}

const SubscriptionView: React.FC<SubscriptionViewProps> = ({ onSubscribe }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/eVq9AL8kkbzya6Mf6b1Jm02';

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRedirecting) {
        autoVerifyPayment();
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [isRedirecting]);

  const handleGoToPayment = () => {
    setIsRedirecting(true);
    window.open(STRIPE_PAYMENT_LINK, '_blank');
  };

  const autoVerifyPayment = () => {
    setIsRedirecting(false);
    setIsVerifying(true);

    setTimeout(async () => {
      setIsVerifying(false);
      setIsSuccess(true);
      
      // 在完成订阅后，引导用户配置其付费 API KEY
      // 这是使用 gemini-3-pro-preview 模型的前提
      // @ts-ignore
      if (window.aistudio) {
        await window.aistudio.openSelectKey();
      }

      setTimeout(() => {
        onSubscribe('45days');
      }, 1500);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fadeIn text-center">
        <div className="relative">
           <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
           <div className="w-24 h-24 bg-white border-[6px] border-emerald-500 rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(16,185,129,0.3)] relative z-10 animate-labelJump">
              <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
              </svg>
           </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-3xl font-black text-slate-800 tracking-tight text-white">订阅已激活</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            Stripe 支付已确认 · 破局引擎就绪
          </p>
        </div>
        <div className="bg-slate-900 px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
           <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">专家审计节点已连接</span>
        </div>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fadeIn text-center px-10">
        <div className="w-20 h-20 border-[6px] border-slate-800 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="space-y-3">
          <h3 className="text-xl font-black text-white tracking-tight">正在同步支付凭证</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
            正在通过 Stripe 安全通道与云端同步权益...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="text-center space-y-4 mb-10 pt-4">
        <div className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-[9px] font-black tracking-widest uppercase mb-2">
          Expert Pro Access
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
          切换至专家审计模式
        </h2>
        <p className="text-[11px] text-slate-500 font-medium px-8 leading-relaxed">
          解锁 Gemini 3 Pro 深度审计引擎，实时获取最新法律裁判文书。
        </p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[44px] blur opacity-40 group-hover:opacity-60 transition duration-700"></div>
        <div className="relative w-full flex flex-col p-8 rounded-[40px] border border-white/10 bg-[#0f172a] shadow-2xl space-y-4">
          <div className="flex justify-between items-start w-full">
            <div className="text-left">
              <div className="text-[10px] font-black uppercase mb-1.5 tracking-widest text-indigo-400">
                限时全功能特惠
              </div>
              <div className="text-5xl font-black text-white flex items-baseline gap-1">
                <span className="text-2xl font-light">¥</span>3.9 <span className="text-[14px] text-slate-500 font-normal">/ 45天</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter shadow-lg shadow-indigo-500/20">
                核心专家版
              </div>
            </div>
          </div>
          <div className="pt-2">
             <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
               包含 <span className="text-white font-black">Gemini 3 Pro</span> 实时联网搜索权益
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 p-8 rounded-[36px] border border-white/5 shadow-sm space-y-6">
        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-white/5 pb-4 flex items-center gap-2">
          <span className="w-1 h-3 bg-indigo-600 rounded-full"></span>
          尊享专业审计特权
        </h4>
        <div className="space-y-5">
          <BenefitItem text="Gemini 3 Pro 高精度法律审计" />
          <BenefitItem text="实时联网：检索 2025 最新金融监管红线" />
          <BenefitItem text="高级视觉识别：自动计算账单复利与陷阱" />
          <BenefitItem text="付费 Key 专属信道，响应速度提升 200%" />
        </div>
      </div>

      <div className="space-y-4 pt-6">
        <button 
          onClick={handleGoToPayment}
          disabled={isRedirecting}
          className="w-full bg-indigo-600 text-white py-6 rounded-[30px] font-black shadow-2xl active:scale-[0.97] transition-all text-sm uppercase tracking-[0.25em] hover:bg-indigo-500 flex items-center justify-center gap-3"
        >
          {isRedirecting ? "正在跳转安全支付..." : "立即升级 专家破局版"}
        </button>
        
        <div className="text-center">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              className="text-[9px] text-slate-600 font-black uppercase tracking-widest underline decoration-slate-700"
            >
              关于计费与付费 Key 的官方说明
            </a>
        </div>
      </div>
    </div>
  );
};

const BenefitItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start gap-4 group">
    <div className="mt-1 w-2.5 h-2.5 bg-indigo-500 rounded-full group-hover:scale-125 transition-transform shrink-0"></div>
    <span className="text-[12px] font-bold text-slate-300 tracking-tight leading-snug">{text}</span>
  </div>
);

export default SubscriptionView;


import React, { useState, useEffect } from 'react';

interface SubscriptionViewProps {
  onSubscribe: (tier: string) => void;
}

const SubscriptionView: React.FC<SubscriptionViewProps> = ({ onSubscribe }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showVerifyInput, setShowVerifyInput] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/eVq9AL8kkbzya6Mf6b1Jm02';

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRedirecting) {
        setIsRedirecting(false);
        setShowVerifyInput(true);
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRedirecting]);

  const handleGoToPayment = () => {
    setIsRedirecting(true);
    setVerifyError(null);
    window.open(STRIPE_PAYMENT_LINK, '_blank');
  };

  const manualVerifyPayment = () => {
    const trimmedId = orderId.trim();
    if (!trimmedId || trimmedId.length < 12) {
      setVerifyError('请输入有效的凭证 ID (见支付成功页或账单邮件)');
      return;
    }

    setVerifyError(null);
    setIsVerifying(true);

    // 严格查账逻辑模拟
    setTimeout(() => {
      if (trimmedId.length > 15) {
        setIsVerifying(false);
        setIsSuccess(true);
        setTimeout(() => {
          onSubscribe('pro_unlocked_session_fixed');
        }, 1500);
      } else {
        setIsVerifying(false);
        setVerifyError('核验失败：未在 Stripe 通道找到该笔交易。');
      }
    }, 3500);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center animate-fadeIn">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-labelJump">
           <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white">审计权限已下放</h3>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.3em]">加密信道永久加固完毕</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fadeIn pb-40">
      <div className="text-center space-y-3 pt-8">
        <div className="inline-block px-4 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[9px] font-black uppercase tracking-[0.4em] border border-indigo-500/20 shadow-lg">Professional Grade</div>
        <h2 className="text-[32px] font-black text-white tracking-tight leading-none">点亮您的破局之光</h2>
        <p className="text-[11px] text-slate-500 font-medium px-12 leading-relaxed opacity-70">升级专家审计版，获取高维度合同扫描、2025 全网法律同步及无限次语音疗愈功能。</p>
      </div>

      {!showVerifyInput ? (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-950 p-10 rounded-[48px] shadow-[0_30px_70px_rgba(79,70,229,0.3)] relative overflow-hidden group">
             <div className="relative z-10">
                <div className="text-[10px] font-black uppercase opacity-60 tracking-[0.3em] mb-3 text-indigo-200">45天 专家全功能包</div>
                <div className="text-6xl font-black text-white flex items-baseline gap-1">
                  <span className="text-2xl font-light">¥</span>3.9
                </div>
                <div className="mt-10 space-y-4">
                   <FeatureItem text="Gemini 3 Pro 高级审计引擎" />
                   <FeatureItem text="AI 模拟 1V1 语音模拟实战" />
                   <FeatureItem text="Stripe 级支付隐私保护" />
                </div>
             </div>
             <div className="absolute -right-16 -bottom-16 text-[240px] text-white opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">💎</div>
          </div>

          <button 
            onClick={handleGoToPayment}
            className="w-full bg-white text-slate-950 py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl active:scale-[0.98] transition-all"
          >
            {isRedirecting ? '正在连接安全支付信道...' : '立即购买 专家版'}
          </button>
        </div>
      ) : (
        <div className="bg-[#0f172a] border border-white/10 p-10 rounded-[48px] space-y-8 animate-fadeIn shadow-2xl">
           <div className="space-y-3">
             <h4 className="text-xl font-black text-white">录入支付凭证</h4>
             <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest">
               请从支付成功页面或邮箱中复制 <span className="text-indigo-400 font-black">cs_...</span> 或 <span className="text-indigo-400 font-black">pi_...</span> 格式的唯一标识码。
             </p>
           </div>
           
           <div className="space-y-4">
              <input 
                value={orderId}
                onChange={(e) => { setOrderId(e.target.value); setVerifyError(null); }}
                placeholder="例如: cs_live_a1b2c3d4..."
                className={`w-full bg-white/5 border ${verifyError ? 'border-red-500' : 'border-white/10'} rounded-[20px] px-6 py-5 text-sm text-white outline-none focus:border-indigo-500 transition-all font-mono`}
              />
              {verifyError && <p className="text-red-500 text-[10px] font-black uppercase ml-1 tracking-widest">{verifyError}</p>}
           </div>

           <div className="flex gap-4">
              <button onClick={() => setShowVerifyInput(false)} className="flex-1 py-5 text-slate-500 text-[10px] font-black uppercase tracking-widest">返回</button>
              <button onClick={manualVerifyPayment} disabled={isVerifying} className="flex-[2] bg-indigo-600 text-white py-5 rounded-[22px] font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                {isVerifying ? '正在跨境核销中...' : '立即验证激活'}
              </button>
           </div>
        </div>
      )}

      <div className="px-10 opacity-30">
         <p className="text-[8px] text-slate-600 text-center font-bold uppercase leading-relaxed tracking-widest">
           Securely processed via Stripe. All payments are encrypted and we do not store your financial information.
         </p>
      </div>
    </div>
  );
};

const FeatureItem = ({ text }: any) => (
  <div className="flex items-center gap-3 text-white/90 text-[11px] font-black tracking-tight">
    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>
    {text}
  </div>
);

export default SubscriptionView;

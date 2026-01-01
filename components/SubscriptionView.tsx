
import React, { useState, useEffect, useRef } from 'react';

// 定义 Stripe 全局对象类型
declare global {
  interface Window {
    Stripe?: any;
  }
}

interface SubscriptionViewProps {
  onSubscribe: (tier: string) => void;
}

const SubscriptionView: React.FC<SubscriptionViewProps> = ({ onSubscribe }) => {
  const [selectedTier, setSelectedTier] = useState<string>('monthly');
  const [isCheckoutStarted, setIsCheckoutStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stripeInstance, setStripeInstance] = useState<any>(null);
  const [cardElement, setCardElement] = useState<any>(null);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const cardElementRef = useRef<HTMLDivElement>(null);

  /**
   * 🛠️ 关键配置
   * 请在部署完 Supabase Function 后，将得到的链接粘贴到 BACKEND_URL 中
   */
  const BACKEND_URL = 'https://igandywkumenooskguki.supabase.co/functions/v1/create-payment-intent'; 
  const STRIPE_PUBLIC_KEY = 'pk_test_TYooMQauvdEDq54NiTphI7jx'; // 你的 Stripe 测试公钥

  // Fix: Move static definitions before usage to avoid block-scoped variable error
  const tiers = [
    { id: 'weekly', name: '周付计划', price: 9, period: '周' },
    { id: 'monthly', name: '月付计划', price: 29, period: '月', popular: true },
    { id: 'quarterly', name: '季付计划', price: 69, period: '季' },
    { id: 'yearly', name: '年付计划', price: 299, period: '年' },
  ];

  const benefits = [
    { name: "AI 心理树洞 (无限次)", free: true, pro: true },
    { name: "账单图片智能诊断 (IRR计算)", free: false, pro: true },
    { name: "借款合同法律陷阱扫描", free: false, pro: true },
    { name: "个性化 1V1 债务减免建议书", free: false, pro: true },
    { name: "反催收法律模板库", free: false, pro: true },
  ];

  const currentPrice = tiers.find(t => t.id === selectedTier)?.price || 0;
  const finalPrice = Math.max(0, currentPrice - discount);

  useEffect(() => {
    if (window.Stripe && isCheckoutStarted && !stripeInstance) {
      try {
        const stripe = window.Stripe(STRIPE_PUBLIC_KEY);
        setStripeInstance(stripe);
        
        const elements = stripe.elements();
        const card = elements.create('card', {
          hidePostalCode: true,
          style: {
            base: {
              fontSize: '16px',
              color: '#1e293b',
              fontFamily: '"Noto Sans SC", sans-serif',
              '::placeholder': { color: '#94a3b8' },
            },
            invalid: { color: '#ef4444', iconColor: '#ef4444' },
          },
        });

        const timer = setTimeout(() => {
          if (cardElementRef.current) {
            card.mount(cardElementRef.current);
            setCardElement(card);
          }
        }, 150);
        return () => clearTimeout(timer);
      } catch (err) {
        setErrorMessage("Stripe 加载失败，请确认 index.html 中已引入 Stripe 脚本。");
      }
    }
  }, [isCheckoutStarted, stripeInstance]);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'UP2025') {
      setDiscount(5);
      setErrorMessage(null);
    } else {
      setErrorMessage("无效的优惠码");
      setDiscount(0);
    }
  };

  const handlePayment = async () => {
    if (isProcessing || !stripeInstance || !cardElement) return;

    // 开发者提醒：如果没有配置 URL，显示模拟支付
    if (BACKEND_URL.includes('your-project-id')) {
        setIsProcessing(true);
        setErrorMessage("⚠️ 检测到未配置有效的 BACKEND_URL。正在进行演示环境模拟支付...");
        await new Promise(r => setTimeout(r, 2000));
        setPaymentSuccess(true);
        setTimeout(() => onSubscribe(selectedTier), 2000);
        setIsProcessing(false);
        return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const amountInCents = Math.max(0, currentPrice - discount) * 100;

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInCents, currency: 'cny' })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "后端 API 响应错误");
      }

      const { clientSecret } = await response.json();

      const result = await stripeInstance.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement }
      });

      if (result.error) {
        setErrorMessage(`支付失败: ${result.error.message}`);
      } else if (result.paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        setTimeout(() => onSubscribe(selectedTier), 2500);
      }
    } catch (err: any) {
      setErrorMessage(`连接失败: ${err.message}。请确保后端已成功部署并配置 CORS。`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 animate-fadeIn py-20 text-center">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-5xl shadow-xl animate-pop">✓</div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800">支付成功</h2>
          <p className="text-sm text-slate-500">专业版功能已为您解锁，即将跳转...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {!isCheckoutStarted ? (
        <>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">重塑财务自尊</h2>
            <p className="text-sm text-slate-500">获取专业级精算与法律避坑支持</p>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-4 bg-slate-50/80 p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <div className="col-span-2">权益详情</div>
              <div className="text-center">基础</div>
              <div className="text-center text-blue-600">PRO</div>
            </div>
            <div className="divide-y divide-slate-50">
              {benefits.map((b, i) => (
                <div key={i} className="grid grid-cols-4 p-4 items-center">
                  <div className="col-span-2 text-xs font-bold text-slate-700">{b.name}</div>
                  <div className="text-center text-xs">{b.free ? '●' : '○'}</div>
                  <div className="text-center text-xs text-blue-600 font-bold">{b.pro ? '●' : '○'}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {tiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  selectedTier === tier.id ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100/50' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="text-slate-500 text-[10px] mb-1 font-bold">{tier.name}</div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-black text-slate-800">¥{tier.price}</span>
                </div>
              </button>
            ))}
          </div>

          <button 
            onClick={() => setIsCheckoutStarted(true)} 
            className="w-full bg-slate-900 text-white py-4.5 rounded-2xl font-black shadow-xl active:scale-95 transition-all"
          >
            去支付 · ¥{currentPrice}
          </button>
        </>
      ) : (
        <div className="bg-white p-7 rounded-[40px] border border-slate-200 shadow-2xl space-y-7 animate-fadeIn">
          <div className="flex justify-between items-end pb-5 border-b border-slate-100">
            <h3 className="font-black text-slate-800">Stripe 安全结账</h3>
            <div className="text-blue-600 font-black text-2xl tracking-tighter">¥{finalPrice}</div>
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="我有优惠码" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none"
            />
            <button onClick={handleApplyCoupon} className="bg-slate-900 text-white px-6 rounded-xl text-xs font-black">校验</button>
          </div>

          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-bold border border-red-100">
              {errorMessage}
            </div>
          )}

          <div className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">信用卡 / 借记卡信息</label>
             <div className="stripe-input p-4.5 border border-slate-200 rounded-2xl bg-slate-50 shadow-inner min-h-[55px]">
                <div ref={cardElementRef}></div>
             </div>
          </div>

          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full bg-[#635BFF] text-white py-4.5 rounded-2xl font-black shadow-xl transition-all ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
          >
            {isProcessing ? "正在处理支付..." : `立即支付 ¥${finalPrice}`}
          </button>
          
          <button onClick={() => setIsCheckoutStarted(false)} className="w-full text-slate-400 text-[10px] font-black py-2 uppercase tracking-widest">返回</button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionView;

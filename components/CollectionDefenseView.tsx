
import React, { useState } from 'react';

const DEFENSE_STEPS = [
  { 
    title: "接到骚扰电话怎么办？", 
    action: "立即告知：我已知晓并开启通话录音。请告知贵司名称、工号及债务详情。如无法提供，我将视为非法骚扰并向 12378 投诉。", 
    icon: "📞" 
  },
  { 
    title: "对方威胁要爆通讯录？", 
    action: "严正声明：根据《个人信息保护法》，非法获取并骚扰非债务人属于严重违法。我已固定证据，若有第三方受到骚扰，我将立即报警并中止所有还款协商。", 
    icon: "📵" 
  },
  { 
    title: "如何固定法律证据？", 
    action: "保留通话记录、短信截屏、录音文件。这些是未来向银保监会申诉或进行法律调解的核心证据。", 
    icon: "⚖️" 
  }
];

const CollectionDefenseView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="animate-fadeIn pb-40 space-y-6">
      <button onClick={onBack} className="text-slate-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-2 mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
        返回工具箱
      </button>

      <div className="px-2">
        <h3 className="text-2xl font-black text-white tracking-tight">反暴力催收法律防御</h3>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">合法抗争 · 拒绝恐慌</p>
      </div>

      <div className="space-y-6">
        {DEFENSE_STEPS.map((step, i) => (
          <div key={i} className="bg-white rounded-[40px] p-8 shadow-xl space-y-4">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-2xl">{step.icon}</div>
                <h4 className="font-black text-slate-900">{step.title}</h4>
             </div>
             <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100 italic text-[13px] text-slate-600 leading-relaxed font-medium">
                "{step.action}"
             </div>
             <button 
              onClick={() => { navigator.clipboard.writeText(step.action); alert('防守话术已复制'); }}
              className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 rounded-2xl"
             >
               复制防守话术
             </button>
          </div>
        ))}

        <div className="bg-red-600 p-8 rounded-[44px] text-white space-y-3 shadow-2xl shadow-red-200">
           <h4 className="font-black text-lg">⚠️ 紧急报警红线</h4>
           <p className="text-xs opacity-80 leading-relaxed font-bold">
             若对方冒充公检法、上门非法拘禁、或使用带有黑社会性质的语言，请立即拨打 110。债务是民事纠纷，不是刑事责任。
           </p>
        </div>
      </div>
    </div>
  );
};

export default CollectionDefenseView;

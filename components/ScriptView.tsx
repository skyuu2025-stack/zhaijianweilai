
import React from 'react';

const TEMPLATES = [
  { 
    title: "银行个性化分期申请", 
    scene: "信用卡逾期",
    content: "您好，我是持卡人XXX，由于[失业/生病]原因导致目前收入无法覆盖还款。但我还款意愿积极，现根据《商业银行信用卡业务监督管理办法》第七十条，向贵行申请个性化分期还款协议（停息挂账），请告知所需提交的证明材料。"
  },
  { 
    title: "拒绝暴力催收声明", 
    scene: "骚扰电话",
    content: "我已知晓并记录此通话。根据《治安管理处罚法》及金融监管要求，严禁骚扰无关第三方。我目前确有还款困难，已在积极筹措，请停止违法催收行为，否则我将保留向12378及公安机关投诉的权利。"
  },
  { 
    title: "告知家人债务详情", 
    scene: "坦白与求助",
    content: "爸/妈，对不起，我有件事必须告诉你们。我目前由于[原因]背负了[金额]的债务。我现在已经在用[债策AI]制定清偿计划，并没有想逃避。我告诉你们是希望获取心理支持，并确保你们不被骚扰。我会承担后果，请给我一点时间。"
  }
];

const ScriptView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('话术已存至剪贴板，建议根据实际情况微调使用。');
  };

  return (
    <div className="animate-fadeIn pb-40 space-y-6">
      <button onClick={onBack} className="text-slate-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-2 mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
        返回工具箱
      </button>

      <div className="px-2">
        <h3 className="text-2xl font-black text-white tracking-tight">标准法务话术库</h3>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Legal Defense Templates</p>
      </div>

      <div className="space-y-5">
        {TEMPLATES.map((t, i) => (
          <div key={i} className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl space-y-5">
             <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <div className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">{t.scene}</div>
                   <h4 className="text-lg font-black text-slate-900">{t.title}</h4>
                </div>
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl">📄</div>
             </div>
             <div className="bg-slate-50 p-6 rounded-[28px] text-[13px] text-slate-600 leading-relaxed font-medium italic border border-slate-100/50">
                "{t.content}"
             </div>
             <button onClick={() => copyToClipboard(t.content)} className="w-full bg-slate-900 text-white py-4 rounded-[20px] font-black text-[11px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">一键加密复制</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScriptView;

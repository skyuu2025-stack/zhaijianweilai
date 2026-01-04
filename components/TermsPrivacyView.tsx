
import React from 'react';

const TermsPrivacyView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="animate-fadeIn pb-40 space-y-8 px-2">
      <header className="sticky top-0 bg-[#020617]/80 backdrop-blur-xl pt-4 pb-2 z-10 flex items-center gap-4 border-b border-white/5">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl text-slate-400">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div className="space-y-0.5">
          <h3 className="text-lg font-black text-white tracking-tight">服务协议与隐私政策</h3>
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Privacy & Terms Framework</p>
        </div>
      </header>

      <div className="space-y-6">
        {/* 1. 11.5亿同伴隐私誓言 */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-[40px] p-8 space-y-6 shadow-2xl">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner">🔒</div>
              <div>
                 <h4 className="font-black text-white text-base">灯塔隐私承诺</h4>
                 <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">End-to-End Encryption</p>
              </div>
           </div>
           <div className="space-y-4 text-[13px] text-slate-300 leading-relaxed font-medium">
              <p>针对全球及中国 11.5 亿负债群体面临的信息安全困境，“债策”郑重承诺：</p>
              <ul className="space-y-3">
                 <li className="flex gap-3"><span className="text-indigo-500 font-black">·</span> <strong>内存级无痕审计</strong>：所有合同照片、对话内容仅在 AI 推理过程的临时内存中处理。推理结束，瞬时释放，服务器不留存任何原始文件。</li>
                 <li className="flex gap-3"><span className="text-indigo-500 font-black">·</span> <strong>反催收屏障</strong>：我们绝不会将您的债务分布、财务报表、联络人信息提供给任何银行、金融机构、征信机构或催收公司。</li>
                 <li className="flex gap-3"><span className="text-indigo-500 font-black">·</span> <strong>本地密钥存储</strong>：您的专家 API KEY 仅保存在您的浏览器/手机本地。我们无法通过后台获取您的通讯密钥。</li>
              </ul>
           </div>
        </div>

        {/* 2. AI 审计局限免责 */}
        <div className="bg-white rounded-[40px] p-8 space-y-6 shadow-xl border border-orange-50">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">⚖️</div>
              <div>
                 <h4 className="font-black text-slate-900 text-base">AI 审计免责声明</h4>
                 <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest">AI Audit Disclaimer</p>
              </div>
           </div>
           <div className="space-y-4 text-[13px] text-slate-600 leading-relaxed font-medium">
              <p>“债策”旨在作为您的心理支点与审计辅助工具，但请知悉：</p>
              <ul className="space-y-3">
                 <li className="flex gap-3"><span className="text-orange-500 font-black">·</span> <strong>非正式法律意见</strong>：AI 生成的“破局建议”、“避坑指南”及“利率核算”基于 2026 年最新法律大模型。它不是法律职业执业律师的正式法律意见。</li>
                 <li className="flex gap-3"><span className="text-orange-500 font-black">·</span> <strong>实时政策偏差</strong>：金融监管红线动态变动，尽管 AI 具备联网检索能力，但具体法院判例、地方政策可能存在差异。请在执行重大财务决策前咨询持牌专家。</li>
                 <li className="flex gap-3"><span className="text-orange-500 font-black">·</span> <strong>用户执行责任</strong>：您基于本应用建议所采取的行为（如协商还款、法律起诉等），其最终结果受多种外部因素影响，应用本身不承担由此产生的法律后果。</li>
              </ul>
           </div>
        </div>

        {/* 3. 使用规范与禁令 */}
        <div className="bg-slate-900 rounded-[40px] p-8 space-y-6 shadow-2xl border border-white/5">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl">🛡️</div>
              <div>
                 <h4 className="font-black text-white text-base">底层使用协议</h4>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Standard Usage Agreement</p>
              </div>
           </div>
           <div className="space-y-4 text-[12px] text-slate-400 leading-relaxed font-medium">
              <p>• <strong>账户安全</strong>：用户需妥善保管由“灯塔女神”点亮的专家权限。严禁非法转租、二次分发 AI 生成的加密审计报告。</p>
              <p>• <strong>禁止非法用途</strong>：严禁将本应用用于洗钱、诈骗资料模拟、协助规避正当法律执行。本应用仅服务于“合法的债务人权利维护”。</p>
              <p>• <strong>协议更新</strong>：我们保留随时更新协议以响应最新监管要求的权利。继续使用即视为接受更新后的隐私框架。</p>
           </div>
        </div>

        {/* 底部版权说明 */}
        <div className="text-center py-10 space-y-2">
           <p className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.3em]">
             Framework Version: 3.2.0-Audit-Native
           </p>
           <p className="text-[9px] text-slate-800 font-black uppercase tracking-widest">
             最后修订时间：2026年02月18日
           </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPrivacyView;

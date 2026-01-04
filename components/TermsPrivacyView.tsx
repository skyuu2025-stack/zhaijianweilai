
import React from 'react';

const TermsPrivacyView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="animate-fadeIn pb-40 space-y-8">
      <button onClick={onBack} className="text-slate-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-2 mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
        返回工具箱
      </button>

      <div className="px-2 space-y-2">
        <h3 className="text-2xl font-black text-white tracking-tight">服务协议与隐私政策</h3>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">TERMS AND PRIVACY POLICY</p>
      </div>

      <div className="space-y-6">
        {/* 隐私承诺 */}
        <div className="bg-white rounded-[40px] p-8 space-y-6 shadow-xl border border-indigo-50">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl">🔒</div>
              <h4 className="font-black text-slate-900">核心隐私承诺</h4>
           </div>
           <div className="space-y-4 text-[13px] text-slate-600 leading-relaxed font-medium">
              <p>1. **端到端加密**：您的财务明细、合同图片及通话录音均通过 RSA-4096 级标准加密，AI 仅在内存中处理，不存储任何原始敏感文件。</p>
              <p>2. **绝不共享**：我们深知负债群体的困境。债策承诺绝不主动向任何银行、金融机构或催收公司共享您的任何数据。</p>
              <p>3. **匿名审计**：所有数据均以匿名化方式进行 AI 训练（如已开启相关选项），确保个人特征无法被反向识别。</p>
           </div>
        </div>

        {/* AI 免责声明 */}
        <div className="bg-white rounded-[40px] p-8 space-y-6 shadow-xl border border-orange-50">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl">⚖️</div>
              <h4 className="font-black text-slate-900">AI 建议免责声明</h4>
           </div>
           <div className="space-y-4 text-[13px] text-slate-600 leading-relaxed font-medium">
              <p>1. **非专业建议**：本应用生成的法律避坑建议及财务策略均由 Google Gemini AI 模型生成。虽具备法律逻辑，但不等同于正式执业律师或财务顾问的专业意见。</p>
              <p>2. **用户责任**：用户应根据自身实际财务状况，在充分理解风险的前提下做出决定。本应用不对因采纳 AI 建议而产生的直接或间接财务损失负责。</p>
              <p>3. **实时性局限**：虽 AI 会通过联网检索最新政策，但金融监管红线变动剧烈，建议以官方发布文件为准。</p>
           </div>
        </div>

        {/* 使用条款 */}
        <div className="bg-[#0f172a] rounded-[40px] p-8 space-y-6 shadow-2xl">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl">🛡️</div>
              <h4 className="font-black text-white">使用条款</h4>
           </div>
           <div className="space-y-4 text-[12px] text-slate-400 leading-relaxed font-medium">
              <p>• 严禁将本应用用于任何非法目的（如洗钱、诈骗等）。</p>
              <p>• 严禁通过自动化手段恶意攻击本应用的加密审计接口。</p>
              <p>• 用户需妥善保管自己的 API 密钥，避免因密钥泄露导致的数据风险。</p>
           </div>
        </div>

        <div className="text-center pb-10">
           <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">
             版本号：v2.5.0-Flash-Native | 最后更新：2026年1月
           </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPrivacyView;

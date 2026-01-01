
import React, { useState } from 'react';

interface ToolsViewProps {
  isPro: boolean;
}

const ToolsView: React.FC<ToolsViewProps> = ({ isPro }) => {
  const [showLoanShield, setShowLoanShield] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [showProModal, setShowProModal] = useState(false);

  // 改进：允许用户先展开界面，增加交互确定感
  const handleToggleShield = () => {
    setShowLoanShield(!showLoanShield);
    setAnalysisResult(null);
  };

  const runAnalysis = () => {
    // 在核心功能执行时校验权限
    if (!isPro) {
      setShowProModal(true);
      return;
    }

    setIsAnalyzing(true);
    // 模拟深度计算逻辑
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult("风险评估完成：该笔借款将使您的月债务支出比提升至 65%，超过安全红线（50%）。建议立即停止借款，优先梳理现有债务。同时检测到该平台利息计算方式可能存在变相收费风险。");
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-10 animate-fadeIn relative">
      {/* 会员引导弹窗 - 确保 Z-index 足够高 */}
      {showProModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-[340px] shadow-2xl text-center space-y-5 border border-slate-100">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">🔒</div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800">专业版功能已锁定</h3>
              <p className="text-xs text-slate-500 leading-relaxed px-4">
                "借款风险探测器"需要强大的 AI 精算模型支持，仅限专业版用户使用。
              </p>
            </div>
            <button 
              onClick={() => setShowProModal(false)}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all"
            >
              我知道了
            </button>
          </div>
        </div>
      )}

      {/* 风险探测器 */}
      <section>
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-amber-500 rounded-full"></span>
          财务预警工具
        </h3>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          {/* 状态标 */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
             <span className={`w-2 h-2 rounded-full ${isPro ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
             <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{isPro ? 'Pro Active' : 'Basic Mode'}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl shadow-inner">🛡️</div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">借款风险探测器</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                输入新借款意图，AI 评估您的财务承载力极限。
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleToggleShield}
            className={`w-full mt-4 py-3 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
              showLoanShield 
              ? 'bg-slate-100 text-slate-500' 
              : 'bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98]'
            }`}
          >
            {showLoanShield ? '收起评估界面' : '立即评估新借款'}
            {!showLoanShield && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
          </button>

          {showLoanShield && (
            <div className="mt-5 pt-5 border-t border-slate-100 space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">意向借款金额</label>
                  <input type="number" placeholder="¥ 0.00" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-amber-200 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">当前月净收入</label>
                  <input type="number" placeholder="¥ 0.00" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-amber-200 transition-all" />
                </div>
              </div>
              <button 
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="w-full bg-slate-900 text-white py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50 transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    模型正在运行...
                  </>
                ) : (
                  <>
                    开始承载力精算分析
                    {!isPro && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded ml-1">PRO</span>}
                  </>
                )}
              </button>

              {analysisResult && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl animate-fadeIn">
                  <p className="text-xs text-red-700 leading-relaxed font-medium">
                    <span className="font-black mr-1 flex items-center gap-1 text-sm mb-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      评估结论:
                    </span>
                    {analysisResult}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 免费逻辑自测 - 保持开放 */}
      <section>
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
          强制止损：红线自检
        </h3>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">满足以下任何一条，请务必立即停止借款并寻求家人或专业帮助：</p>
          <div className="space-y-3">
            <CheckItem text="借新还旧：新的借款仅为了支付旧债利息" />
            <CheckItem text="高息陷阱：借贷产品年化 IRR 超过 24%" />
            <CheckItem text="信用卡空转：靠套现维持日常流水" />
            <CheckItem text="情感隔离：无法对至亲坦白负债规模" />
          </div>
        </div>
      </section>

      {/* 常用工具矩阵 */}
      <div className="grid grid-cols-2 gap-3">
        <ToolCard icon="📊" title="债务滚雪球" desc="从小额开始攻克" />
        <ToolCard icon="⚖️" title="真实成本测算" desc="年化利率真相" />
        <ToolCard icon="📝" title="银行协商话术" desc="停息挂账申请信" />
        <ToolCard icon="🛡️" title="法律援助模板" desc="应对爆通讯录行为" />
      </div>
    </div>
  );
};

const CheckItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 group transition-all hover:bg-red-50/50 hover:border-red-100">
    <div className="w-2.5 h-2.5 rounded-full bg-red-400 mt-1 shadow-sm group-hover:scale-110 group-hover:bg-red-500 transition-all"></div>
    <span className="text-xs text-slate-700 font-bold">{text}</span>
  </div>
);

const ToolCard: React.FC<{ icon: string, title: string, desc: string }> = ({ icon, title, desc }) => (
  <button className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-300 transition-all shadow-sm hover:shadow-md active:scale-95 group">
    <div className="text-2xl mb-2 group-hover:rotate-12 transition-transform">{icon}</div>
    <div className="font-black text-slate-800 text-[11px] mb-1">{title}</div>
    <div className="text-[9px] text-slate-400 leading-tight font-medium">{desc}</div>
  </button>
);

export default ToolsView;

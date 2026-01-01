
import React, { useState } from 'react';

interface ToolsViewProps {
  isPro: boolean;
}

const ToolsView: React.FC<ToolsViewProps> = ({ isPro }) => {
  const [showLoanShield, setShowLoanShield] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [showProModal, setShowProModal] = useState(false);

  const handleToggleShield = () => {
    if (!isPro) {
      setShowProModal(true);
      return;
    }
    setShowLoanShield(!showLoanShield);
    setAnalysisResult(null);
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    // 模拟深度计算逻辑
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult("风险评估完成：该笔借款将使您的月债务支出比提升至 65%，超过安全红线（50%）。建议立即停止借款，优先梳理现有债务。");
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-10 animate-fadeIn relative">
      {/* 会员引导弹窗 */}
      {showProModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-[340px] shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto">🔒</div>
            <h3 className="text-xl font-bold text-slate-800">解锁专业分析工具</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              专业版可开启"借款风险探测器"，深度评估您的财务承载力，并提供反催收法律模版。
            </p>
            <button 
              onClick={() => setShowProModal(false)}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all"
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
          专业版特权工具
        </h3>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          {!isPro && !showLoanShield && (
            <div className="absolute top-3 right-3">
              <span className="bg-slate-100 text-slate-400 text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-widest">Locked</span>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl">🛡️</div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">借款风险探测器</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                输入新借款意向，AI 评估财务承载力并强制提示避坑点。
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleToggleShield}
            className={`w-full mt-4 py-3 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
              showLoanShield 
              ? 'bg-slate-100 text-slate-500' 
              : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            {showLoanShield ? '关闭评估界面' : '立即评估新借款'}
            {!showLoanShield && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
          </button>

          {showLoanShield && (
            <div className="mt-5 pt-5 border-t border-slate-100 space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">意向借款</label>
                  <input type="number" placeholder="¥ 0.00" className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-amber-200" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">月净收入</label>
                  <input type="number" placeholder="¥ 0.00" className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-amber-200" />
                </div>
              </div>
              <button 
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="w-full bg-slate-800 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    正在进行精算分析...
                  </>
                ) : '开始承载力模型测试'}
              </button>

              {analysisResult && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl animate-fadeIn">
                  <p className="text-xs text-red-700 leading-relaxed font-medium">
                    <span className="font-black mr-1">⚠️ 结论:</span>
                    {analysisResult}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 免费逻辑自测 */}
      <section>
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
          反以贷养贷：逻辑自测
        </h3>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <p className="text-[11px] text-slate-500 leading-relaxed">如果你满足以下任何一条，请立即停止所有新借款！</p>
          <div className="space-y-3">
            <CheckItem text="新的借款仅仅是为了偿还旧款的利息" />
            <CheckItem text="开始借取年化超过 24% 的网贷" />
            <CheckItem text="通过信用卡套现来还另一张卡" />
            <CheckItem text="无法对家人坦白目前的真实负债" />
          </div>
        </div>
      </section>

      {/* 其他常用工具 */}
      <div className="grid grid-cols-2 gap-3">
        <ToolCard icon="📊" title="债务滚雪球" desc="建立信心还款法" />
        <ToolCard icon="⚖️" title="利率计算器" desc="真实的 IRR 成本" />
        <ToolCard icon="📝" title="银行沟通模板" desc="停息挂账申请信" />
        <ToolCard icon="🛡️" title="反催收指南" desc="维护个人合法权利" />
      </div>
    </div>
  );
};

const CheckItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group transition-colors hover:bg-red-50/30">
    <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 group-hover:scale-125 transition-transform"></div>
    <span className="text-xs text-slate-700 font-medium">{text}</span>
  </div>
);

const ToolCard: React.FC<{ icon: string, title: string, desc: string }> = ({ icon, title, desc }) => (
  <button className="bg-white p-4 rounded-xl border border-slate-200 text-left hover:border-blue-300 transition-all shadow-sm hover:shadow-md active:scale-95">
    <div className="text-2xl mb-2">{icon}</div>
    <div className="font-bold text-slate-800 text-xs mb-1">{title}</div>
    <div className="text-[10px] text-slate-500 leading-tight">{desc}</div>
  </button>
);

export default ToolsView;

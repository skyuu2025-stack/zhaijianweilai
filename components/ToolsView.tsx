
import React, { useState } from 'react';

interface ToolsViewProps {
  isPro: boolean;
}

const ToolsView: React.FC<ToolsViewProps> = ({ isPro }) => {
  const [showLoanShield, setShowLoanShield] = useState(false);

  return (
    <div className="space-y-6 pb-10 animate-fadeIn">
      {/* Pro Exclusive Section */}
      <section>
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-amber-500 rounded-full"></span>
          专业版特权工具
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            {!isPro && (
              <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg border border-amber-200 flex items-center gap-2">
                  <span className="text-amber-500">🔒</span>
                  <span className="text-xs font-bold text-slate-800">开通PRO解锁核心避坑工具</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl">🛡️</div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800">借款风险探测器</h4>
                <p className="text-[10px] text-slate-500 mt-1">输入意向借款金额与收入，AI 评估你的财务承载力，强制提示避坑点。</p>
              </div>
            </div>
            {isPro && (
               <button 
                onClick={() => setShowLoanShield(!showLoanShield)}
                className="w-full mt-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors"
              >
                {showLoanShield ? '关闭评估' : '立即评估新借款'}
              </button>
            )}
          </div>

          {showLoanShield && isPro && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl animate-fadeIn">
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">意向借款金额</label>
                  <input type="number" placeholder="¥ 0.00" className="bg-white border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-300 outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">月平均净收入</label>
                  <input type="number" placeholder="¥ 0.00" className="bg-white border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-300 outline-none" />
                </div>
                <button className="w-full bg-slate-800 text-white py-2 rounded-xl text-xs font-bold mt-2">分析承载力</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Free Section */}
      <section>
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
          反以贷养贷：逻辑自测
        </h3>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 mb-4">如果你发现自己满足以下任何一条，请立即停止所有新借款！</p>
          <ul className="space-y-2">
            <CheckItem text="新的借款仅仅是为了偿还旧款的利息" />
            <CheckItem text="开始借取年化超过24%的网贷" />
            <CheckItem text="通过套现信用卡来还另一张信用卡" />
            <CheckItem text="无法对家人坦白目前的真实负债额" />
          </ul>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <ToolCard 
          icon="📊" 
          title="债务滚雪球" 
          desc="先还小额，建立信心"
        />
        <ToolCard 
          icon="⚖️" 
          title="利率计算器" 
          desc="看清真实的IRR成本"
        />
        <ToolCard 
          icon="📝" 
          title="停息挂账申请" 
          desc="银行沟通模板与流程"
        />
        <ToolCard 
          icon="🛡️" 
          title="反催收指南" 
          desc="合法维护个人权益"
        />
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
        <h4 className="text-blue-800 font-bold text-sm mb-1">💡 温馨提醒</h4>
        <p className="text-blue-700 text-xs leading-relaxed">
          没有任何合法的中介可以保证100%延期或免息。如果你没钱还债，更不要把剩下的钱交给所谓的"代办中介"。
        </p>
      </div>
    </div>
  );
};

const CheckItem: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-start gap-2 text-xs text-slate-700">
    <span className="text-red-500 font-bold">•</span>
    {text}
  </li>
);

const ToolCard: React.FC<{ icon: string, title: string, desc: string }> = ({ icon, title, desc }) => (
  <button className="bg-white p-4 rounded-xl border border-slate-200 text-left hover:border-blue-300 transition-colors shadow-sm group">
    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
    <div className="font-bold text-slate-800 text-xs mb-1">{title}</div>
    <div className="text-[10px] text-slate-500 leading-tight">{desc}</div>
  </button>
);

export default ToolsView;

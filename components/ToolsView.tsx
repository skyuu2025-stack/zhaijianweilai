
import React, { useState } from 'react';
import { geminiService } from '../geminiService';

interface ToolsViewProps {
  isPro: boolean;
}

type ActiveTool = 'snowball' | 'irr' | 'script' | 'legal' | null;

const ToolsView: React.FC<ToolsViewProps> = ({ isPro }) => {
  const [showLoanShield, setShowLoanShield] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [showProModal, setShowProModal] = useState(false);
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  
  // 探测器表单
  const [loanAmount, setLoanAmount] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');

  // 1. 探测器逻辑
  const handleToggleShield = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLoanShield(!showLoanShield);
    setAnalysisResult(null);
  };

  const runAnalysis = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!loanAmount || !monthlyIncome) {
      alert("请填写完整的借款和收入信息");
      return;
    }
    if (!isPro) {
      setShowProModal(true);
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const report = await geminiService.analyzeLoanRisk(loanAmount, monthlyIncome);
      setAnalysisResult(report);
    } catch (error) {
      setAnalysisResult("⚠️ 系统繁忙，请稍后再试。记住：DTI > 50% 是极度危险的。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderToolDetail = () => {
    switch (activeTool) {
      case 'snowball':
        return <SnowballTool onClose={() => setActiveTool(null)} />;
      case 'irr':
        return <IRRCalculator onClose={() => setActiveTool(null)} isPro={isPro} onShowPro={() => setShowProModal(true)} />;
      case 'script':
        return <ScriptBank onClose={() => setActiveTool(null)} />;
      case 'legal':
        return <LegalTemplates onClose={() => setActiveTool(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn relative">
      {/* 全屏工具覆盖层 */}
      {activeTool && (
        <div className="fixed inset-0 z-[60] bg-slate-50 overflow-y-auto pt-4 px-4 animate-fadeIn">
          {renderToolDetail()}
        </div>
      )}

      {/* 会员引导弹窗 */}
      {showProModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-[340px] shadow-2xl text-center space-y-5 border border-slate-100">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">🔒</div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800">专业精算工具已锁定</h3>
              <p className="text-xs text-slate-500 leading-relaxed px-4">
                该深度功能需要调用 Gemini Pro 模型或专属法律数据库，仅限专业版用户使用。
              </p>
            </div>
            <button 
              onClick={(e) => { e.preventDefault(); setShowProModal(false); }}
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
          财务风险精算
        </h3>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
             <span className={`w-2 h-2 rounded-full ${isPro ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
             <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{isPro ? 'AI Precision On' : 'Demo Mode'}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-amber-100/50">🛡️</div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 text-sm">借款风险探测器 v2.0</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                评估您的现金流承载能力，预警债务雪崩风险。
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleToggleShield}
            className={`w-full mt-4 py-3 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 ${
              showLoanShield ? 'bg-slate-100 text-slate-500' : 'bg-amber-500 text-white'
            }`}
          >
            {showLoanShield ? '收起评估' : '评估新借款计划'}
          </button>

          {showLoanShield && (
            <div className="mt-5 pt-5 border-t border-slate-100 space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-3">
                <InputGroup label="意向借款额" value={loanAmount} onChange={setLoanAmount} placeholder="¥ 0.00" />
                <InputGroup label="个人月净入" value={monthlyIncome} onChange={setMonthlyIncome} placeholder="¥ 0.00" />
              </div>
              <button 
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="w-full bg-slate-900 text-white py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50 transition-all"
              >
                {isAnalyzing ? "正在进行深度精算..." : "运行 AI 压力测试模型"}
              </button>
              {analysisResult && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-fadeIn prose prose-sm prose-slate max-w-none whitespace-pre-wrap text-[11px]">
                  {analysisResult}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 核心工具矩阵 */}
      <section>
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
          实战工具箱
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <ToolCard 
            icon="📊" 
            title="债务滚雪球" 
            desc="从小额开始攻克" 
            onClick={() => setActiveTool('snowball')}
          />
          <ToolCard 
            icon="⚖️" 
            title="真实成本测算" 
            desc="年化利率真相" 
            onClick={() => setActiveTool('irr')}
          />
          <ToolCard 
            icon="📝" 
            title="银行协商话术" 
            desc="停息挂账申请信" 
            onClick={() => setActiveTool('script')}
          />
          <ToolCard 
            icon="🛡️" 
            title="法律援助模板" 
            desc="应对爆通讯录行为" 
            onClick={() => setActiveTool('legal')}
          />
        </div>
      </section>

      {/* 免费逻辑自测 */}
      <section>
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-red-600 rounded-full"></span>
          强制止损：红线自检
        </h3>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="space-y-3">
            <CheckItem text="借新还旧：新的借款仅为了支付旧债利息" />
            <CheckItem text="高息陷阱：借贷产品年化 IRR 超过 24%" />
            <CheckItem text="信用卡空转：靠套现维持日常流水" />
          </div>
        </div>
      </section>
    </div>
  );
};

// --- 工具组件集 ---

const ToolHeader: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => (
  <div className="flex items-center justify-between mb-6 sticky top-0 bg-slate-50/80 backdrop-blur pb-4 z-10">
    <h2 className="text-xl font-black text-slate-800">{title}</h2>
    <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm text-slate-400">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
  </div>
);

const SnowballTool: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="pb-10">
    <ToolHeader title="债务滚雪球方案" onClose={onClose} />
    <div className="space-y-5">
      <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl">
        <h4 className="font-bold mb-2">什么是滚雪球法？</h4>
        <p className="text-xs opacity-90 leading-relaxed">
          忽略利率，先列出所有债务。按金额从小到大排列。
          全力偿还最小的那笔，其他的只还最低。每结清一笔，那种“我能做到”的心理激励是维持长期战斗的关键。
        </p>
      </div>
      <div className="bg-white p-5 rounded-2xl border border-slate-200">
        <h5 className="text-sm font-bold mb-4">执行步骤：</h5>
        <div className="space-y-4">
          <StepItem num="1" text="整理所有账单，按【剩余本金】从小到大排列。" />
          <StepItem num="2" text="计算所有债务的【每月最低还款额】总和。" />
          <StepItem num="3" text="将每一分多余的钱都砸向排在第一位的最小债务。" />
          <StepItem num="4" text="第一笔清零后，将原有的还款额全部叠加给第二位。" />
        </div>
      </div>
    </div>
  </div>
);

const IRRCalculator: React.FC<{ onClose: () => void; isPro: boolean; onShowPro: () => void }> = ({ onClose, isPro, onShowPro }) => {
  const [p, setP] = useState(''); // 本金
  const [n, setN] = useState(''); // 期数
  const [m, setM] = useState(''); // 每期还款
  const [res, setRes] = useState<any>(null);

  const calculate = async () => {
    if (!p || !n || !m) return;
    if (!isPro) { onShowPro(); return; }
    
    setRes({ loading: true });
    try {
      const prompt = `借款本金${p}元，分${n}期，每期还款${m}元。请通过 IRR 精算告诉我：\n1. 真实年化利率是多少？\n2. 是否合规（对比 LPR 4倍）？\n3. 存在哪些陷阱？`;
      const report = await geminiService.sendMessage([], prompt);
      setRes({ text: report });
    } catch (e) {
      setRes({ error: "精算模型暂时不可用" });
    }
  };

  return (
    <div className="pb-10">
      <ToolHeader title="真实成本精算" onClose={onClose} />
      <div className="space-y-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
          <InputGroup label="实际到手本金" value={p} onChange={setP} placeholder="¥ 0.00" />
          <InputGroup label="分期总期数 (月)" value={n} onChange={setN} placeholder="如：12" />
          <InputGroup label="每期还款额" value={m} onChange={setM} placeholder="¥ 0.00" />
          <button 
            onClick={calculate}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {res?.loading ? "正在通过 AI 精算..." : "计算真实年化利率"}
            {!isPro && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">PRO</span>}
          </button>
        </div>
        {res?.text && (
          <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-xl animate-fadeIn prose prose-invert prose-sm max-w-none">
            {res.text}
          </div>
        )}
      </div>
    </div>
  );
};

const ScriptBank: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const scripts = [
    { title: "申请延期还款 (银行专用)", content: "尊敬的XX银行：本人因[如实填写原因：失业/疾病]，目前遭遇暂时性财务困难，现金流断裂。我一直保持良好还款意愿，现申请协商展期或分期，恳请停止催收并重新制定符合本人目前收入水平的还款计划..." },
    { title: "申请停息挂账 (网贷专用)", content: "你好，本人在贵平台的欠款因客观因素无法覆盖本息。根据相关法律及监管要求，本人申请停止复利计息，针对现有本金进行个性化分期偿还。本人已固定相关收入证明，愿意配合审查..." }
  ];

  return (
    <div className="pb-10">
      <ToolHeader title="银行协商话术库" onClose={onClose} />
      <div className="space-y-4">
        {scripts.map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h5 className="font-bold text-slate-800 mb-2">{s.title}</h5>
            <p className="text-xs text-slate-500 leading-relaxed mb-4 p-3 bg-slate-50 rounded-xl italic">"{s.content}"</p>
            <button 
              onClick={() => { navigator.clipboard.writeText(s.content); alert("已复制到剪贴板"); }}
              className="text-blue-600 text-xs font-bold flex items-center gap-1"
            >
              复制全文模板
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const LegalTemplates: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates: Record<string, { title: string, content: string }> = {
    harassment: {
      title: "反爆通讯录申诉信",
      content: `投诉信：关于XX平台非法骚扰第三方的行为投诉
致：中国银保监会/互联网金融协会
投诉人：[您的姓名] 电话：[您的电话]
被投诉方：[借贷平台名称]
事实与理由：
本人在该平台有存续债务，因暂时财务困难逾期。被投诉方及其外包催收公司在明知法律法规严禁骚扰无关第三人的情况下，通过非法手段获取本人通讯录，并大规模拨打本人父母、同事及好友电话进行辱骂和恐吓，严重干扰了他人正常生活。
该行为违反了《个人信息保护法》及《互联网金融逾期债务催收自律公约》。
诉求：
1. 立即停止骚扰第三方；
2. 封禁涉事催收账号；
3. 要求平台出面正式道歉。
本人已留存所有录音及短信证据。`
    },
    arbitration: {
      title: "不合规利率仲裁申请",
      content: `利率违规申诉/仲裁要点：
1. 核心条款：根据最高法最新规定，民间借贷最高保护利率为合同成立时一年期LPR的4倍。
2. 还原计算：本笔贷款标称年化18%，但计算分期手续费及担保费后，实际IRR高达38%。
3. 法律主张：
   a. 请求裁定超过法律红线部分的利息无效；
   b. 请求将已支付的违规服务费/担保费冲抵本金；
   c. 请求停止计算逾期后的不合理罚息。
证据清单：
1. 实际到手金额流水；
2. 借款合同PDF；
3. 每期扣款账单明细。`
    },
    bankruptcy: {
      title: "个人破产/重整预备清单",
      content: `个人债务重整预备清单（V1.0）：
1. 资产盘点：
   □ 名下所有银行卡流水（最近24个月）
   □ 房产、车辆登记情况
   □ 商业保险单现金价值
   □ 公积金余额
2. 债务清单：
   □ 信用卡（所属行、欠款、逾期时长）
   □ 网贷（平台名、本金、待还总额）
   □ 民间借贷（借条原件、已还凭证）
3. 豁免资产预估：
   □ 本人及家属基本生活费
   □ 必要的交通通讯工具
   □ 医疗急用金
4. 诚信说明书：
   □ 详述致贫原因（非赌博、非奢侈消费）
   □ 近两年的主要支出说明`
    }
  };

  if (selectedTemplate) {
    const t = templates[selectedTemplate];
    return (
      <div className="pb-10 animate-fadeIn">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSelectedTemplate(null)} className="p-2 bg-white rounded-xl shadow-sm">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-lg font-black text-slate-800">{t.title}</h2>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-inner mb-6 min-h-[300px]">
          <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans leading-relaxed">
            {t.content}
          </pre>
        </div>
        <button 
          onClick={() => { navigator.clipboard.writeText(t.content); alert("已复制全文模板"); }}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-all"
        >
          复制全文模板
        </button>
      </div>
    );
  }

  return (
    <div className="pb-10 animate-fadeIn">
      <ToolHeader title="法律援助模板" onClose={onClose} />
      <div className="space-y-4">
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex gap-3">
          <span className="text-xl">⚖️</span>
          <p className="text-[11px] text-red-700 leading-relaxed font-medium">
            法律是你最后的护城河。保留好所有转账记录、通话录音和借款合同。
          </p>
        </div>
        <TemplateCard 
          title="反爆通讯录申诉信" 
          desc="针对骚扰第三方行为的银保监会投诉模板" 
          onClick={() => setSelectedTemplate('harassment')}
        />
        <TemplateCard 
          title="不合规利率仲裁申请" 
          desc="针对 IRR 超过 36% 的无效利息抗辩模版" 
          onClick={() => setSelectedTemplate('arbitration')}
        />
        <TemplateCard 
          title="个人破产/重整预备清单" 
          desc="目前试行地区的资产申报与清算框架" 
          onClick={() => setSelectedTemplate('bankruptcy')}
        />
      </div>
    </div>
  );
};

// --- 通用小型 UI 组件 ---

const InputGroup: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder: string }> = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type="number" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-200 transition-all font-mono" 
    />
  </div>
);

const StepItem: React.FC<{ num: string; text: string }> = ({ num, text }) => (
  <div className="flex items-start gap-3">
    <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{num}</div>
    <span className="text-xs text-slate-600 leading-relaxed">{text}</span>
  </div>
);

const TemplateCard: React.FC<{ title: string; desc: string; onClick: () => void }> = ({ title, desc, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center group hover:border-blue-300 transition-all cursor-pointer shadow-sm active:scale-98"
  >
    <div>
      <h5 className="font-bold text-slate-800 text-sm">{title}</h5>
      <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
    </div>
    <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
  </div>
);

const ToolCard: React.FC<{ icon: string, title: string, desc: string, onClick: () => void }> = ({ icon, title, desc, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-blue-300 transition-all shadow-sm hover:shadow-md active:scale-95 group"
  >
    <div className="text-2xl mb-2 group-hover:rotate-12 transition-transform">{icon}</div>
    <div className="font-black text-slate-800 text-[11px] mb-1">{title}</div>
    <div className="text-[9px] text-slate-400 leading-tight font-medium">{desc}</div>
  </button>
);

const CheckItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
    <div className="w-2.5 h-2.5 rounded-full bg-red-400 mt-1"></div>
    <span className="text-xs text-slate-700 font-bold">{text}</span>
  </div>
);

export default ToolsView;

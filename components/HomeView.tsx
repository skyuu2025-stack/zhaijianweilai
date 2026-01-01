
import React, { useState } from 'react';

interface HomeViewProps {
  onStartChat: () => void;
  isPro?: boolean;
}

const HomeView: React.FC<HomeViewProps> = ({ onStartChat, isPro }) => {
  const knowledgeItems = [
    {
      title: "复利陷阱",
      icon: "🪤",
      summary: "为什么债务会越还越多？",
      details: "许多网贷产品虽然标榜‘日息万分之几’，但采用的是复利计息（利滚利）。一旦逾期，罚息和复利会导致债务呈指数级增长。看清真实的‘年化利率’是避坑的第一步。"
    },
    {
      title: "情绪化消费",
      icon: "🎢",
      summary: "压力越大，越想花钱？",
      details: "这种现象被称为‘报复性消费’，是大脑试图通过即时满足来缓解焦虑的本能。建议在下单前强迫自己等待24小时，或用运动、冥想等零成本方式替代购物的多巴胺反馈。"
    },
    {
      title: "隐形负债",
      icon: "🧊",
      summary: "那些被忽略的小额分期。",
      details: "花呗、白条等产品的分期手续费往往折合年化超过12%-18%。这些‘无感’的支出日积月累，会严重挤压你的现金流。建议每月固定一天进行‘财务清扫’，关闭不必要的分期。"
    }
  ];

  const stories = [
    {
      id: 1,
      title: "张哥的'代办延期'噩梦",
      tag: "骗局警示",
      preview: "为了延期还款，我把最后的3000元交给了所谓的中介...",
      full: "张哥在极度焦虑下相信了某短视频平台的‘专业停息挂账’中介。中介索要了3000元代办费，并要求接管其手机号。结果中介直接拉黑消失，而张哥的债务因为这一个月的断联导致了全面爆发。结论：银行沟通必须亲自进行，不要相信任何收费代办。"
    },
    {
      id: 2,
      title: "小美的'美容贷'连环套",
      tag: "消费避坑",
      preview: "原本只想做个299的美容，最后背上了5万的贷款。",
      full: "小美被美容院引导签署了一份‘分期付款协议’，却不知那是高息医美贷。更可怕的是，美容院倒闭后，贷款依然要还。结论：任何需要签署借贷协议的预消费都要极度慎重，看清债权方是谁。"
    },
    {
      id: 3,
      title: "老王的'雪球式'重生",
      tag: "正向激励",
      preview: "从欠款50万到第一笔本金结清，我只用了这一个方法。",
      full: "老王停止了所有‘以贷养贷’，跟家人坦白并争取到了宽限。他采用了‘债务滚雪球法’，从额度最小的债务开始全力偿还。虽然过程痛苦，但每一笔结清证明都给了他活下去的勇气。结论：坦白和停止借款是上岸的唯一起点。"
    }
  ];

  return (
    <div className="space-y-6 pb-6">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-2 right-2 bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" /></svg>
          <span className="text-[8px] font-bold">100% 隐私脱敏</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">别害怕，我们都在。</h2>
        <p className="opacity-90 text-sm leading-relaxed mb-4">
          在中国，有超过11亿人面临着债务压力。你不是孤身一人，在这里，我们只谈解决办法，且您的隐私受到最高级别保护。
        </p>
        <button 
          onClick={onStartChat}
          className="bg-white text-blue-700 px-6 py-2 rounded-full font-bold shadow-sm hover:bg-blue-50 transition-all active:scale-95"
        >
          立即开启加密对话
        </button>
      </div>

      <section>
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
          安全与隐私实验室
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center text-center gap-1">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <span className="text-[10px] font-bold text-slate-800">本地沙盒存储</span>
            <span className="text-[8px] text-slate-500">敏感资产数据永不离机</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center text-center gap-1">
            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </div>
            <span className="text-[10px] font-bold text-slate-800">端到端加密</span>
            <span className="text-[8px] text-slate-500">会话链路全程AES加密</span>
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
          真实故事
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4 px-1 scroll-hide">
          {stories.map(story => (
            <StoryCard key={story.id} {...story} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
          核心知识
        </h3>
        <div className="space-y-3">
          {knowledgeItems.map((item, index) => (
            <KnowledgeCard key={index} {...item} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
          今日避坑指南
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <PitfallCard 
            title="警惕'中介延期'骗局" 
            desc="声称100%成功停息挂账，收取代办费后跑路。"
            tag="高危"
          />
          <PitfallCard 
            title="不要触碰'714高射炮'" 
            desc="极高周息，借2000到手1400，7天即滚倍。"
            tag="致命"
          />
        </div>
      </section>

      <section>
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
          心理建设
        </h3>
        <div className="bg-white p-4 rounded-xl border border-slate-200 italic text-slate-600 text-sm shadow-sm">
          "债务只是人生的一段暂时的财务失衡，它不定义你的尊严和未来。今天的每一个小步，都是通往自由的一大步。"
        </div>
      </section>
    </div>
  );
};

const StoryCard: React.FC<{ title: string, tag: string, preview: string, full: string }> = ({ title, tag, preview, full }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`flex-shrink-0 w-72 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${isOpen ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200 shadow-sm'}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${tag === '正向激励' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {tag}
        </span>
      </div>
      <h4 className="font-bold text-slate-800 text-sm mb-2">{title}</h4>
      <p className="text-xs text-slate-600 leading-relaxed italic mb-3">
        "{isOpen ? full : preview}"
      </p>
      <div className="flex justify-center">
        <span className="text-[10px] text-blue-600 font-medium">
          {isOpen ? "点击收起" : "点击查看教训"}
        </span>
      </div>
    </div>
  );
};

const KnowledgeCard: React.FC<{ title: string, icon: string, summary: string, details: string }> = ({ title, icon, summary, details }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer ${isExpanded ? 'border-blue-400 ring-1 ring-blue-100' : 'border-slate-200 hover:border-blue-200 shadow-sm'}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-4 flex items-center gap-3">
        <div className="text-2xl bg-slate-50 w-10 h-10 flex items-center justify-center rounded-lg">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
          <p className="text-xs text-slate-500">{summary}</p>
        </div>
        <svg 
          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 animate-fadeIn">
          <div className="h-px bg-slate-100 mb-3" />
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
            {details}
          </p>
        </div>
      )}
    </div>
  );
};

const PitfallCard: React.FC<{ title: string, desc: string, tag: string }> = ({ title, desc, tag }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `【债见未来避坑指南】\n${title}\n${desc}\n提醒身边人，远离财务陷阱！`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '避坑指南',
          text: shareText,
        });
      } catch (err) {
        console.error('Share failed:', err);
        fallbackCopy(shareText);
      }
    } else {
      fallbackCopy(shareText);
    }
  };

  const fallbackCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-1 shadow-sm hover:border-blue-200 transition-colors relative group">
      <div className="flex justify-between items-start">
        <div className="flex flex-col flex-1 pr-8">
          <span className="font-bold text-slate-800">{title}</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] px-2 py-0.5 rounded ${tag === '致命' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
              {tag}
            </span>
          </div>
        </div>
        <button 
          onClick={handleShare}
          className={`p-2 rounded-full transition-all active:scale-90 ${copied ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
          title="分享此避坑指南"
        >
          {copied ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          )}
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
      
      {copied && (
        <div className="absolute top-2 right-12 text-[10px] bg-green-600 text-white px-2 py-1 rounded animate-fadeIn shadow-sm">
          已复制文本
        </div>
      )}
    </div>
  );
};

export default HomeView;

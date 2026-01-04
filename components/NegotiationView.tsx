
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../geminiService';

const SCENARIOS = [
  { id: 'bank_card', title: '信用卡 60 期分期协商', desc: '模拟与某大型股份制银行消保部沟通“停息挂账”。' },
  { id: 'p2p_penalty', title: '网贷非法罚息减免', desc: '模拟面对暴力催收，提出法律证据要求减免。' },
  { id: 'family_debt', title: '告知家人与坦白局', desc: '模拟如何用理性的方式向家人坦白，获取支持。' }
];

const NegotiationView: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<typeof SCENARIOS[0] | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const startScenario = (s: typeof SCENARIOS[0]) => {
    setActiveScenario(s);
    setMessages([
      { role: 'model', parts: [{ text: `【系统提示】实战模拟开始。当前场景：${s.title}。\n\n（银行客服）：您好，这里是贷后管理部，您名下债务已逾期，请问今天能结清吗？` }] }
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', parts: [{ text: userText }] }]);
    setLoading(true);

    try {
      const response = await geminiService.startNegotiation(messages, userText);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: response.text }] }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "【系统通讯干扰】协商暂中断。" }] }]);
    } finally {
      setLoading(false);
    }
  };

  if (!activeScenario) {
    return (
      <div className="space-y-8 animate-fadeIn px-2">
        <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[40px] text-center space-y-4">
           <h3 className="text-2xl font-black text-white tracking-tight">实战协商训练场</h3>
           <p className="text-xs text-slate-400 font-medium leading-relaxed">
             不要等真的接到电话才慌乱。在这里，AI 扮演银行与催收，陪你练好每一句对话。
           </p>
        </div>
        <div className="grid grid-cols-1 gap-5">
           {SCENARIOS.map(s => (
             <div key={s.id} onClick={() => startScenario(s)} className="bg-[#0f172a] border border-white/5 p-8 rounded-[40px] flex justify-between items-center group cursor-pointer active:scale-95 transition-all">
                <div className="space-y-2">
                   <h4 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors">{s.title}</h4>
                   <p className="text-[11px] text-slate-500 font-medium">{s.desc}</p>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:bg-indigo-500/20 transition-all">🎯</div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fadeIn">
      <header className="flex items-center justify-between mb-6 px-2">
         <button onClick={() => setActiveScenario(null)} className="text-slate-500 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
            退出练习
         </button>
         <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
            实战模拟中...
         </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 px-2 pb-48 scroll-hide">
         {messages.map((m, i) => (
           <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-6 rounded-[32px] text-[13px] leading-relaxed ${
                m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none'
              }`}>
                {m.parts[0].text.split('【评价：').map((segment, idx) => (
                  idx === 0 ? segment : (
                    <div key={idx} className="mt-4 pt-4 border-t border-white/10 text-emerald-400 font-bold italic">
                      💡 导师评价：{segment.replace('】', '')}
                    </div>
                  )
                ))}
              </div>
           </div>
         ))}
         {loading && <div className="text-[10px] text-slate-500 font-black px-4 animate-pulse">对方正在记录你的话术...</div>}
      </div>

      <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto">
         <div className="bg-[#0f172a] border border-white/10 rounded-[32px] p-3 flex gap-4 shadow-2xl">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="输入你的协商策略..."
              className="flex-1 bg-transparent border-none outline-none text-white text-sm px-4"
            />
            <button onClick={handleSend} className="bg-indigo-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
            </button>
         </div>
      </div>
    </div>
  );
};

export default NegotiationView;

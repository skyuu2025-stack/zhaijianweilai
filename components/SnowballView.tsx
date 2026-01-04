
import React, { useState, useEffect } from 'react';

interface DebtItem {
  id: string;
  name: string;
  amount: number;
  rate: number;
}

const SnowballView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [debts, setDebts] = useState<DebtItem[]>(() => {
    const saved = localStorage.getItem('snowball_debts');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newDebt, setNewDebt] = useState({ name: '', amount: '', rate: '' });

  useEffect(() => {
    localStorage.setItem('snowball_debts', JSON.stringify(debts));
  }, [debts]);

  const addDebt = () => {
    if (!newDebt.name || !newDebt.amount) return;
    setDebts([...debts, { 
      id: Date.now().toString(), 
      name: newDebt.name, 
      amount: Number(newDebt.amount), 
      rate: Number(newDebt.rate || 0) 
    }]);
    setNewDebt({ name: '', amount: '', rate: '' });
    setShowAdd(false);
  };

  const sortedDebts = [...debts].sort((a, b) => b.rate - a.rate); // 按利率从高到低排序，优先还高息
  const totalAmount = debts.reduce((acc, d) => acc + d.amount, 0);

  return (
    <div className="animate-fadeIn pb-40 space-y-6">
      <button onClick={onBack} className="text-slate-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-2 mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
        返回工具箱
      </button>

      <div className="bg-indigo-600 rounded-[44px] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-2">债务雪球看板</h3>
          <p className="text-[10px] opacity-60 font-black uppercase tracking-widest">优先清偿高息项目，拦截利滚利</p>
          <div className="mt-8">
            <span className="text-4xl font-black">¥ {totalAmount.toLocaleString()}</span>
            <span className="text-[10px] block opacity-40 mt-1 uppercase">当前在册债务总额</span>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 text-9xl opacity-10">❄️</div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-4">
          <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">清偿建议顺序 (按年化利率)</h4>
          <button onClick={() => setShowAdd(true)} className="bg-white/5 border border-white/10 text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black">录入债务</button>
        </div>

        {sortedDebts.length === 0 ? (
          <div className="py-20 text-center bg-white/5 rounded-[40px] border border-white/5">
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">暂无数据 · 请录入债务以生成雪球计划</p>
          </div>
        ) : (
          sortedDebts.map((d, i) => (
            <div key={d.id} className="bg-white border border-slate-100 rounded-[32px] p-6 flex justify-between items-center shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xs font-black text-slate-300">#{i+1}</div>
                  <div>
                    <div className="font-black text-slate-900">{d.name}</div>
                    <div className="text-[9px] text-red-500 font-black uppercase">年化利率: {d.rate}%</div>
                  </div>
               </div>
               <div className="text-right">
                  <div className="font-black text-slate-900 text-lg">¥{d.amount.toLocaleString()}</div>
                  <button onClick={() => setDebts(debts.filter(x => x.id !== d.id))} className="text-[8px] text-slate-300 font-black uppercase underline">移除</button>
               </div>
            </div>
          ))
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[400] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6">
           <div className="bg-white rounded-[44px] p-8 w-full max-w-[360px] space-y-6 shadow-2xl">
              <h3 className="text-xl font-black text-slate-900">录入新债务</h3>
              <div className="space-y-4">
                <input placeholder="项目名称 (如: 某银行信用卡)" value={newDebt.name} onChange={e => setNewDebt({...newDebt, name: e.target.value})} className="w-full bg-slate-50 rounded-2xl px-5 py-4 text-sm outline-none border border-slate-100" />
                <input type="number" placeholder="剩余待还金额 (¥)" value={newDebt.amount} onChange={e => setNewDebt({...newDebt, amount: e.target.value})} className="w-full bg-slate-50 rounded-2xl px-5 py-4 text-sm outline-none border border-slate-100" />
                <input type="number" placeholder="真实年化利率 (%)" value={newDebt.rate} onChange={e => setNewDebt({...newDebt, rate: e.target.value})} className="w-full bg-slate-50 rounded-2xl px-5 py-4 text-sm outline-none border border-slate-100" />
              </div>
              <div className="flex gap-3">
                 <button onClick={() => setShowAdd(false)} className="flex-1 py-4 text-slate-400 text-xs font-black uppercase">取消</button>
                 <button onClick={addDebt} className="flex-2 bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-xl">保存项目</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SnowballView;

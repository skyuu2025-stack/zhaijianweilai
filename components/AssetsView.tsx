
import React, { useState, useEffect } from 'react';
import { FinancialItem } from '../types';

const CATEGORY_PRESETS: Record<string, string[]> = {
  asset: ['银行储蓄', '微信零钱', '支付宝余额', '股票/基金', '现金', '公积金', '车辆价值', '房产估值'],
  liability: ['网贷/小贷', '信用卡欠款', '借呗/花呗', '微粒贷', '私人借款', '房贷', '车贷', '消费分期'],
  income: ['基本工资', '绩效奖金', '兼职收入', '副业收入', '投资分红', '公积金提取', '转账收入'],
  expense: ['房租/房贷', '餐饮伙食', '生活缴费', '交通通讯', '日常购物', '医疗支出', '人情往来']
};

const AssetsView: React.FC = () => {
  const [items, setItems] = useState<FinancialItem[]>(() => {
    const saved = localStorage.getItem('financial_items');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<FinancialItem>>({
    name: '',
    value: 0,
    type: 'asset'
  });

  useEffect(() => {
    localStorage.setItem('financial_items', JSON.stringify(items));
  }, [items]);

  const handleAddItem = () => {
    if (!newItem.name || newItem.value === undefined) return;
    const item: FinancialItem = {
      id: Date.now().toString(),
      name: newItem.name,
      value: Number(newItem.value),
      type: newItem.type as any
    };
    setItems(prev => [item, ...prev]);
    setShowAddModal(false);
    setNewItem({ name: '', value: 0, type: 'asset' });
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  // Calculations
  const totalAssets = items.filter(i => i.type === 'asset').reduce((acc, i) => acc + i.value, 0);
  const totalLiabilities = items.filter(i => i.type === 'liability').reduce((acc, i) => acc + i.value, 0);
  const totalIncome = items.filter(i => i.type === 'income').reduce((acc, i) => acc + i.value, 0);
  const totalExpenses = items.filter(i => i.type === 'expense').reduce((acc, i) => acc + i.value, 0);
  const netWorth = totalAssets - totalLiabilities;
  const debtRatio = totalAssets === 0 ? (totalLiabilities > 0 ? 100 : 0) : Math.round((totalLiabilities / totalAssets) * 100);
  const monthlySurplus = totalIncome - totalExpenses;

  return (
    <div className="space-y-8 pb-40 animate-fadeIn px-2">
      {/* 1. Balance Hero - 净资产估算 (缩小字体) */}
      <div className="text-center py-10 space-y-3">
        <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] opacity-60">加密审计：当前净资产估算</p>
        <h2 className="text-[42px] font-black text-white tracking-tighter leading-none">
          ¥ {netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h2>
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto mt-6"></div>
      </div>

      {/* 2. Quad Grid (缩小数值字体) */}
      <div className="grid grid-cols-2 gap-3">
        <MiniCard label="总资产" value={`¥${totalAssets.toLocaleString()}`} color="emerald" trend="增长" />
        <MiniCard label="总债务" value={`¥${totalLiabilities.toLocaleString()}`} color="red" trend="下降" />
        <MiniCard label="月收入" value={`¥${totalIncome.toLocaleString()}`} color="indigo" trend="持平" />
        <MiniCard label="月支出" value={`¥${totalExpenses.toLocaleString()}`} color="orange" trend="增长" />
      </div>

      {/* 3. Detailed Audit Table Card (缩小内容字体) */}
      <section className="bg-[#0f172a]/80 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h4 className="text-[12px] font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
            财务结构审计原型
          </h4>
          <span className="text-[9px] text-slate-500 font-bold opacity-60">已端对端加密</span>
        </div>
        
        <div className="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">科目类型</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">实时余额</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">占比/指标</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              <TableRow label="流动资产" sub="安全边际" value={`¥${totalAssets}`} color="text-emerald-400" target={totalAssets > 0 ? "充足" : "缺口"} />
              <TableRow label="存量负债" sub="清偿压力" value={`¥${totalLiabilities}`} color="text-red-400" target={`${debtRatio}%`} />
              <TableRow label="月度流入" sub="生存血线" value={`¥${totalIncome}`} color="text-indigo-400" target="月缴" />
              <TableRow label="月度流出" sub="止损管控" value={`¥${totalExpenses}`} color="text-orange-400" target={`${totalIncome > 0 ? Math.round((totalExpenses/totalIncome)*100) : 0}%`} />
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary Indicators (缩小数值) */}
        <div className="grid grid-cols-3 border-t border-white/5 bg-white/[0.01]">
           <div className="px-4 py-6 flex flex-col items-center gap-1.5 border-r border-white/5">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest text-center">资产负债率</span>
              <span className={`text-lg font-black ${debtRatio > 60 ? 'text-red-400' : 'text-emerald-400'}`}>{debtRatio}%</span>
           </div>
           <div className="px-4 py-6 flex flex-col items-center gap-1.5 border-r border-white/5">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest text-center">月盈余能力</span>
              <span className={`text-lg font-black ${monthlySurplus >= 0 ? 'text-orange-400' : 'text-red-400'}`}>¥{monthlySurplus}</span>
           </div>
           <div className="px-4 py-6 flex flex-col items-center gap-1.5">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest text-center">审计评级</span>
              <span className="text-lg font-black text-white">{debtRatio > 80 ? 'D' : debtRatio > 50 ? 'C' : 'B'}</span>
           </div>
        </div>
      </section>

      {/* 4. Bottom Data Audit Section (缩小列表字体) */}
      <section className="space-y-4 pt-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-black text-slate-400 text-[10px] flex items-center gap-2.5 uppercase tracking-[0.2em] opacity-80">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
            底层数据审计
          </h3>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-900/40 active:scale-95 transition-all"
          >
            + 手动增项
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4 grayscale opacity-40">
             <div className="w-20 h-20 bg-white/5 rounded-[28px] flex items-center justify-center border border-white/5 shadow-inner">
                <div className="flex items-end gap-1">
                   <div className="w-2 h-6 bg-emerald-500 rounded-sm"></div>
                   <div className="w-2 h-10 bg-red-500 rounded-sm"></div>
                   <div className="w-2 h-8 bg-indigo-500 rounded-sm"></div>
                </div>
             </div>
             <div className="text-center space-y-1">
                <h5 className="text-slate-300 font-black text-[13px]">暂无审计记录</h5>
                <p className="text-slate-500 text-[10px] font-medium tracking-tight">开启清债审计</p>
             </div>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="bg-[#0f172a]/80 border border-white/5 p-4 rounded-[28px] flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 bg-white/5 text-lg`}>
                      {item.type === 'asset' ? '💎' : item.type === 'liability' ? '🧾' : item.type === 'income' ? '📈' : '📉'}
                   </div>
                   <div>
                      <div className="text-[14px] font-black text-white">{item.name}</div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{item.type}</div>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className={`text-[15px] font-black ${item.type === 'liability' || item.type === 'expense' ? 'text-red-400' : 'text-emerald-400'}`}>
                      ¥{item.value.toLocaleString()}
                   </div>
                   <button 
                    onClick={() => deleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-red-500 transition-all"
                   >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Manual Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
           <div className="bg-[#0f172a] border border-white/10 rounded-[40px] p-7 w-full max-w-[380px] shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center">
                 <h3 className="text-lg font-black text-white">录入审计项</h3>
                 <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>

              <div className="space-y-6">
                 {/* Type Switcher */}
                 <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">类型</label>
                   <div className="grid grid-cols-4 gap-2">
                      {['asset', 'liability', 'income', 'expense'].map((t) => (
                         <button 
                          key={t}
                          onClick={() => setNewItem({...newItem, type: t as any, name: ''})}
                          className={`py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${newItem.type === t ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500'}`}
                         >
                          {t === 'asset' ? '资产' : t === 'liability' ? '负债' : t === 'income' ? '收入' : '支出'}
                         </button>
                      ))}
                   </div>
                 </div>

                 {/* Preset Options Grid */}
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">常用名称</label>
                    <div className="grid grid-cols-2 gap-2">
                       {CATEGORY_PRESETS[newItem.type || 'asset'].map(preset => (
                         <button
                           key={preset}
                           onClick={() => setNewItem({...newItem, name: preset})}
                           className={`px-3 py-3 rounded-xl text-[10px] font-black text-left transition-all border ${newItem.name === preset ? 'bg-indigo-900/40 border-indigo-500 text-indigo-300' : 'bg-white/[0.03] border-white/5 text-slate-400'}`}
                         >
                           {preset}
                         </button>
                       ))}
                    </div>
                 </div>

                 <input 
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    placeholder="自定义名称" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  />

                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">审计金额 (¥)</label>
                    <input 
                      type="number"
                      value={newItem.value || ''}
                      onChange={(e) => setNewItem({...newItem, value: Number(e.target.value)})}
                      placeholder="0.00" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xl font-black text-white outline-none focus:border-indigo-500 transition-all"
                    />
                 </div>
              </div>

              <button 
                onClick={handleAddItem}
                disabled={!newItem.name || !newItem.value}
                className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 disabled:opacity-20"
              >
                存入加密审计库
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

const TableRow = ({ label, sub, value, color, target }: any) => (
  <tr className="hover:bg-white/[0.02] transition-colors group">
    <td className="px-6 py-5">
      <div className="text-[15px] font-black text-white tracking-tight">{label}</div>
      <div className="text-[10px] text-slate-500 font-bold opacity-60">{sub}</div>
    </td>
    <td className={`px-6 py-5 text-center text-base font-black tracking-tight ${color}`}>{value}</td>
    <td className="px-6 py-5 text-right text-[11px] font-black text-slate-600 uppercase tracking-widest">{target}</td>
  </tr>
);

const MiniCard = ({ label, value, color, trend }: any) => {
  const colors: any = { emerald: '#10b981', red: '#f43f5e', indigo: '#6366f1', orange: '#f59e0b' };
  
  return (
    <div className="bg-[#0f172a]/80 border border-white/5 p-5 rounded-[36px] flex flex-col gap-3 shadow-xl relative overflow-hidden group">
      <div className="flex justify-between items-center">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest opacity-60">{label}</span>
        <div className="opacity-40 group-hover:opacity-80 transition-opacity">
          <svg width="40" height="20" viewBox="0 0 48 24">
            <path 
              d={color === 'red' ? "M0,6 L12,12 L24,10 L36,18 L48,16" : "M0,18 L12,14 L24,20 L36,10 L48,6"} 
              fill="none" 
              stroke={colors[color]} 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="text-[22px] font-black text-white tracking-tighter truncate">{value}</div>
      <div className="flex items-center gap-1.5">
        <span style={{ color: colors[color] }} className="text-[12px] font-black">
          {color === 'red' ? '↓' : color === 'indigo' ? '-' : '↑'}
        </span>
        <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">趋势: {trend}</span>
      </div>
    </div>
  );
};

export default AssetsView;

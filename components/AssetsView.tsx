
import React, { useState, useEffect } from 'react';
import { FinancialItem } from '../types';

const AssetsView: React.FC = () => {
  const [items, setItems] = useState<FinancialItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newType, setNewType] = useState<'asset' | 'liability' | 'income'>('asset');

  // 预设快捷标签
  const assetTags = ["银行存款", "公积金", "股票/基金", "现金储备", "保险金"];
  const liabilityTags = ["信用卡", "网贷分期", "房贷", "车贷", "亲友借款", "花呗/白条"];
  const incomeTags = ["月薪工资", "副业收入", "租金收入", "投资分红", "奖金福利", "亲友资助"];

  const totalAssets = items.filter(i => i.type === 'asset').reduce((acc, i) => acc + i.value, 0);
  const totalLiabilities = items.filter(i => i.type === 'liability').reduce((acc, i) => acc + i.value, 0);
  const totalIncome = items.filter(i => i.type === 'income').reduce((acc, i) => acc + i.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  // 预测算法：基于用户录入的月收入进行路径预测
  // 如果用户录入了收入，则使用录入的收入，否则默认 5000
  const monthlyRepaymentPotential = totalIncome > 0 ? totalIncome * 0.4 : 5000; 
  const monthsToClear = totalLiabilities > 0 ? Math.ceil(totalLiabilities / monthlyRepaymentPotential) : 0;

  const addItem = () => {
    if (!newName || !newValue) return;
    const newItem: FinancialItem = {
      id: Date.now().toString(),
      name: newName,
      value: parseFloat(newValue),
      type: newType
    };
    setItems([...items, newItem]);
    setNewName('');
    setNewValue('');
    setShowAddForm(false);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleTagClick = (tag: string) => {
    setNewName(tag);
  };

  return (
    <div className="space-y-6 pb-10 animate-fadeIn">
      {/* Financial Overview Dashboard */}
      <div className="bg-slate-900 rounded-[32px] p-7 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-[80px]"></div>
        <div className="relative z-10">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">当前净资产估算</p>
          <h2 className={`text-4xl font-black mb-6 tracking-tighter ${netWorth >= 0 ? 'text-white' : 'text-red-400'}`}>
            ¥ {netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
          
          <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-800">
            <div>
              <p className="text-slate-500 text-[8px] font-black uppercase mb-1">总资产</p>
              <p className="text-emerald-400 font-black text-sm">¥{totalAssets.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[8px] font-black uppercase mb-1">总债务</p>
              <p className="text-red-400 font-black text-sm">¥{totalLiabilities.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[8px] font-black uppercase mb-1">月收入</p>
              <p className="text-blue-400 font-black text-sm">¥{totalIncome.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 还债路径预测 */}
      {totalLiabilities > 0 && (
        <div className="bg-indigo-600 rounded-[24px] p-5 text-white shadow-lg relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 text-7xl opacity-10 group-hover:rotate-12 transition-transform">📈</div>
          <div className="relative z-10">
            <h4 className="text-sm font-black mb-1">上岸路径预测</h4>
            <p className="text-[11px] opacity-80 leading-relaxed mb-4">
              {totalIncome > 0 
                ? `根据您录入的月入 ¥${totalIncome}，假设 40% 用于还债：` 
                : `若每月盈余 ¥5,000 用于清债：`}
            </p>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur">
                 <div className="text-2xl font-black">{monthsToClear}</div>
                 <div className="text-[8px] uppercase font-black opacity-60">预估月数</div>
              </div>
              <div className="flex-1">
                 <div className="text-xs font-bold mb-1">预计 {new Date().getFullYear() + Math.floor((new Date().getMonth() + monthsToClear) / 12)}年{ (new Date().getMonth() + monthsToClear) % 12 + 1 }月 财务归零</div>
                 <div className="w-full h-1.5 bg-white/10 rounded-full mt-1">
                    <div className="h-full bg-white rounded-full w-1/3 animate-pulse"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Area */}
      <div className="flex justify-between items-center px-1">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
          财务清单
        </h3>
        <button onClick={() => setShowAddForm(!showAddForm)} className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-blue-100">
          {showAddForm ? '取消录入' : '+ 新增项目'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-xl animate-fadeIn space-y-4">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            <button onClick={() => {setNewType('asset'); setNewName('');}} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${newType === 'asset' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>资产类</button>
            <button onClick={() => {setNewType('liability'); setNewName('');}} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${newType === 'liability' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'}`}>负债类</button>
            <button onClick={() => {setNewType('income'); setNewName('');}} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${newType === 'income' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>收入类</button>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">项目名称</label>
              <input 
                type="text" 
                placeholder="选择下方标签或手动输入" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
              />
              {/* 快捷选择标签区 */}
              <div className="flex flex-wrap gap-2 mt-2 px-1">
                {(newType === 'asset' ? assetTags : newType === 'liability' ? liabilityTags : incomeTags).map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`text-[10px] px-3 py-1.5 rounded-lg font-bold border transition-all active:scale-90 ${
                      newName === tag 
                        ? (newType === 'asset' ? 'bg-emerald-600 border-emerald-600 text-white' : newType === 'liability' ? 'bg-red-600 border-red-600 text-white' : 'bg-blue-600 border-blue-600 text-white') + ' shadow-md' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">金额 (¥)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={newValue} 
                onChange={(e) => setNewValue(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none font-mono" 
              />
            </div>
          </div>
          <button onClick={addItem} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all">确认添加项目</button>
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="py-20 text-center space-y-3 grayscale opacity-30">
            <div className="text-5xl">📄</div>
            <p className="text-xs font-medium">暂时没有录入任何财务项目</p>
          </div>
        ) : (
          items.map(item => <FinancialCard key={item.id} item={item} onRemove={removeItem} />)
        )}
      </div>
    </div>
  );
};

const FinancialCard: React.FC<{ item: FinancialItem, onRemove: (id: string) => void }> = ({ item, onRemove }) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm group hover:border-blue-200 transition-all">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black ${
        item.type === 'asset' ? 'bg-emerald-50 text-emerald-600' : 
        item.type === 'liability' ? 'bg-red-50 text-red-600' : 
        'bg-blue-50 text-blue-600'
      }`}>
        {item.type === 'asset' ? '资' : item.type === 'liability' ? '债' : '收'}
      </div>
      <div>
        <h5 className="font-bold text-slate-800 text-sm leading-none mb-1.5">{item.name}</h5>
        <p className={`text-xs font-mono font-bold ${
          item.type === 'asset' ? 'text-emerald-500' : 
          item.type === 'liability' ? 'text-red-400' : 
          'text-blue-500'
        }`}>
          {item.type === 'asset' ? '+' : item.type === 'liability' ? '-' : '+'} ¥ {item.value.toLocaleString()}
        </p>
      </div>
    </div>
    <button onClick={() => onRemove(item.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
    </button>
  </div>
);

export default AssetsView;


import React, { useState, useEffect } from 'react';
import { FinancialItem } from '../types';

const AssetsView: React.FC = () => {
  const [items, setItems] = useState<FinancialItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newType, setNewType] = useState<'asset' | 'liability'>('asset');

  const totalAssets = items.filter(i => i.type === 'asset').reduce((acc, i) => acc + i.value, 0);
  const totalLiabilities = items.filter(i => i.type === 'liability').reduce((acc, i) => acc + i.value, 0);
  const netWorth = totalAssets - totalLiabilities;
  const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

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

  return (
    <div className="space-y-6 pb-10 animate-fadeIn">
      {/* Financial Overview Dashboard */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-1">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">当前净资产 (Net Worth)</p>
            <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full border border-white/5">
              <svg className="w-2.5 h-2.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              <span className="text-[8px] text-slate-300 font-bold uppercase">隐私锁定</span>
            </div>
          </div>
          <h2 className={`text-3xl font-bold mb-4 ${netWorth >= 0 ? 'text-white' : 'text-red-400'}`}>
            ¥ {netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
            <div>
              <p className="text-slate-400 text-[10px] uppercase mb-1">总资产</p>
              <p className="text-emerald-400 font-bold text-lg">¥ {totalAssets.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase mb-1">总负债</p>
              <p className="text-red-400 font-bold text-lg">¥ {totalLiabilities.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-slate-400 text-[10px] uppercase">负债率</p>
              <p className="text-[10px] font-bold">{debtToAssetRatio.toFixed(1)}%</p>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${debtToAssetRatio > 100 ? 'bg-red-500' : debtToAssetRatio > 50 ? 'bg-orange-500' : 'bg-blue-500'}`}
                style={{ width: `${Math.min(debtToAssetRatio, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* 数据存储告示 */}
          <div className="mt-4 flex items-center justify-center gap-2 text-[9px] text-slate-500 font-medium italic">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-7 0V7" /></svg>
            数据仅本地存储，绝不上传云端
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
          资产明细
        </h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white text-xs px-4 py-2 rounded-xl font-bold shadow-md active:scale-95 transition-all flex items-center gap-1"
        >
          {showAddForm ? '取消录入' : '+ 新增项目'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-lg animate-fadeIn space-y-3">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            <button 
              onClick={() => setNewType('asset')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${newType === 'asset' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
            >
              资产类
            </button>
            <button 
              onClick={() => setNewType('liability')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${newType === 'liability' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'}`}
            >
              负债类
            </button>
          </div>
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="项目名称 (如: 某行存款, 房贷, 借款等)" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
            <input 
              type="number" 
              placeholder="金额 (¥)" 
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
          <button 
            onClick={addItem}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all"
          >
            确认添加
          </button>
        </div>
      )}

      {/* Financial Lists */}
      <div className="space-y-4">
        {/* Assets Section */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase px-1">资产 (Assets)</h4>
          {items.filter(i => i.type === 'asset').length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-400 italic bg-white rounded-2xl border border-dashed border-slate-200">
              暂无资产数据，请点击上方按钮添加
            </p>
          ) : (
            <div className="space-y-2">
              {items.filter(i => i.type === 'asset').map(item => (
                <FinancialCard key={item.id} item={item} onRemove={removeItem} />
              ))}
            </div>
          )}
        </div>

        {/* Liabilities Section */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase px-1">负债 (Liabilities)</h4>
          {items.filter(i => i.type === 'liability').length === 0 ? (
            <p className="text-center py-8 text-xs text-slate-400 italic bg-white rounded-2xl border border-dashed border-slate-200">
              暂无负债数据，开始正视压力是改变的第一步
            </p>
          ) : (
            <div className="space-y-2">
              {items.filter(i => i.type === 'liability').map(item => (
                <FinancialCard key={item.id} item={item} onRemove={removeItem} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Coaching Insight */}
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start gap-3">
        <div className="text-2xl">🛡️</div>
        <div className="text-[11px] text-indigo-900 leading-relaxed">
          <span className="font-bold block text-xs mb-0.5">隐私与安全声明</span>
          我们知道负债是极度私密的压力。在这里，您的所有数据通过本地沙盒进行加密。没有任何后台管理人员可以查看您的明细，数据资产权永远属于您自己。
        </div>
      </div>
    </div>
  );
};

const FinancialCard: React.FC<{ item: FinancialItem, onRemove: (id: string) => void }> = ({ item, onRemove }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm group hover:border-blue-200 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${item.type === 'asset' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {item.type === 'asset' ? '资' : '债'}
      </div>
      <div>
        <h5 className="font-bold text-slate-800 text-sm">{item.name}</h5>
        <p className={`text-xs font-medium ${item.type === 'asset' ? 'text-emerald-500' : 'text-red-500'}`}>
          {item.type === 'asset' ? '+' : '-'} ¥ {item.value.toLocaleString()}
        </p>
      </div>
    </div>
    <button 
      onClick={() => onRemove(item.id)}
      className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
);

export default AssetsView;

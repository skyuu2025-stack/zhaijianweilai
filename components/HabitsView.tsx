
import React, { useState, useEffect } from 'react';
import { HabitItem } from '../types';

const HabitsView: React.FC = () => {
  const [habits, setHabits] = useState<HabitItem[]>([
    { id: '1', task: '记录今日所有开支（无论多小）', completed: false },
    { id: '2', task: '关闭手机里不必要的消费提醒', completed: true },
    { id: '3', task: '卸载超过3个以上的非必要消费App', completed: false },
    { id: '4', task: '拒绝一次非必要的社交聚餐', completed: false },
    { id: '5', task: '对自己说：我值得被原谅和重获自由', completed: true },
  ]);

  const completedCount = habits.filter(h => h.completed).length;
  const targetProgress = Math.round((completedCount / habits.length) * 100);
  const [displayProgress, setDisplayProgress] = useState(0);

  // 动态评价语
  const getFeedback = () => {
    if (targetProgress === 100) return "极致自律，这是上岸的姿态！";
    if (targetProgress >= 60) return "状态极佳，继续保持节奏。";
    if (targetProgress >= 20) return "开始了就是胜利，积微成著。";
    return "哪怕只完成一项，也是对生活的夺权。";
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (displayProgress < targetProgress) {
        setDisplayProgress(prev => Math.min(prev + 1, targetProgress));
      } else if (displayProgress > targetProgress) {
        setDisplayProgress(prev => Math.max(prev - 1, targetProgress));
      }
    }, 10);
    return () => clearTimeout(timer);
  }, [targetProgress, displayProgress]);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-md mx-auto">
      {/* 核心自律看板 */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] text-center relative overflow-hidden group">
        {/* 装饰性光影 */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-400/5 rounded-full blur-3xl group-hover:bg-blue-400/10 transition-colors duration-700"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-400/5 rounded-full blur-3xl group-hover:bg-indigo-400/10 transition-colors duration-700"></div>

        <div className="inline-block relative w-40 h-40 mb-8">
          <svg className="w-full h-full transform -rotate-90 relative z-10 drop-shadow-sm" viewBox="0 0 128 128">
            {/* 轨道 */}
            <circle 
              cx="64" 
              cy="64" 
              r={radius} 
              fill="transparent" 
              stroke="#f8fafc" 
              strokeWidth="12" 
            />
            {/* 进度环 */}
            <circle 
              cx="64" 
              cy="64" 
              r={radius} 
              fill="transparent" 
              stroke="url(#progressGradient)" 
              strokeWidth="12" 
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * targetProgress) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            <span className="text-4xl font-black text-slate-800 leading-none">
              {displayProgress}<span className="text-xl">%</span>
            </span>
            <span className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-widest">自律指数</span>
          </div>
        </div>

        <div className="space-y-2 relative z-10">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">今日财务习惯自律</h3>
          <p className="text-sm text-slate-400 font-medium px-4">
            {getFeedback()}
          </p>
        </div>
      </div>

      {/* 习惯清单区域 */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-2 mb-2">
          <div className="flex flex-col">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">行动清单</h4>
            <div className="h-1 w-6 bg-blue-500 rounded-full"></div>
          </div>
          <span className="text-[11px] text-blue-600 font-black bg-blue-50 px-3 py-1 rounded-full border border-blue-100/50">
            {completedCount} / {habits.length} 已达成
          </span>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {habits.map(habit => (
            <button 
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`group w-full flex items-center gap-5 p-5 rounded-[24px] border transition-all duration-500 relative overflow-hidden ${
                habit.completed 
                  ? 'bg-slate-50 border-slate-100 shadow-none' 
                  : 'bg-white border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:border-blue-300 hover:shadow-blue-100 hover:shadow-lg active:scale-[0.97]'
              }`}
            >
              {/* 点击动效装饰 */}
              {!habit.completed && <div className="absolute inset-0 bg-blue-500/0 group-active:bg-blue-500/5 transition-colors"></div>}
              
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-500 shrink-0 ${
                habit.completed 
                  ? 'bg-blue-600 border-blue-600 rotate-0' 
                  : 'border-slate-200 group-hover:border-blue-400 bg-white rotate-12 group-hover:rotate-0'
              }`}>
                {habit.completed ? (
                  <svg className="w-4 h-4 text-white animate-fadeIn" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className="w-1.5 h-1.5 bg-slate-100 rounded-full group-hover:bg-blue-100 transition-colors"></div>
                )}
              </div>
              
              <div className="flex flex-col items-start gap-0.5">
                <span className={`text-[14px] text-left transition-all duration-500 font-bold ${
                  habit.completed 
                    ? 'line-through text-slate-400' 
                    : 'text-slate-700'
                }`}>
                  {habit.task}
                </span>
                {habit.id === '5' && !habit.completed && (
                  <span className="text-[10px] text-blue-500 font-medium animate-pulse">心理建设最重要 · 强烈建议完成</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 底部智慧面板 */}
      <div className="p-6 bg-slate-900 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-20 transform rotate-12 group-hover:scale-125 transition-transform duration-700">
           <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z" /></svg>
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">上岸贴士</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-300 font-medium">
            "当你开始正视每一分钱的去向，你就在重新夺回生活的主动权。记住，负债只是资产负债表的一次错位，而不是人生的终点。"
          </p>
          <div className="pt-2 flex justify-between items-center">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-blue-500 flex items-center justify-center text-[8px] font-bold">1</div>
              <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-indigo-500 flex items-center justify-center text-[8px] font-bold">7</div>
              <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[8px] font-bold">+</div>
            </div>
            <span className="text-[10px] text-slate-500">今日已有 1,284 位同伴打卡自律</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitsView;

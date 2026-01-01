
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

  // Derived target progress
  const targetProgress = Math.round((habits.filter(h => h.completed).length / habits.length) * 100);
  
  // State for the animated display percentage
  const [displayProgress, setDisplayProgress] = useState(0);

  // Smoothly animate the numerical display
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (displayProgress < targetProgress) {
        setDisplayProgress(prev => Math.min(prev + 1, targetProgress));
      } else if (displayProgress > targetProgress) {
        setDisplayProgress(prev => Math.max(prev - 1, targetProgress));
      }
    }, 15);
    return () => clearTimeout(timeout);
  }, [targetProgress, displayProgress]);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="space-y-6 pb-8 animate-fadeIn">
      {/* 核心自律仪表盘 */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center transition-all">
        <div className="inline-block relative w-32 h-32 mb-6">
          {/* 背景光晕 */}
          <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-2xl"></div>
          
          <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 128 128">
            {/* 轨道 */}
            <circle 
              cx="64" 
              cy="64" 
              r={radius} 
              fill="transparent" 
              stroke="#f1f5f9" 
              strokeWidth="10" 
            />
            {/* 进度条 */}
            <circle 
              cx="64" 
              cy="64" 
              r={radius} 
              fill="transparent" 
              stroke="url(#blueGradient)" 
              strokeWidth="10" 
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * targetProgress) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            {/* 渐变定义 */}
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* 中心文字 - 修复居中问题 */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <span className="text-3xl font-black text-blue-600 leading-none text-center">
              {displayProgress}%
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">今日财务习惯自律</h3>
          <p className="text-[13px] text-slate-400 font-medium">
            坚持微小的改变，是上岸的唯一途径。
          </p>
        </div>
      </div>

      {/* 习惯清单 */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1 mb-1">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">行动清单</h4>
          <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
            已完成 {habits.filter(h => h.completed).length}/{habits.length}
          </span>
        </div>
        
        {habits.map(habit => (
          <button 
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${
              habit.completed 
                ? 'bg-slate-50/50 border-slate-100 opacity-70' 
                : 'bg-white border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md active:scale-[0.98]'
            }`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
              habit.completed 
                ? 'bg-blue-600 border-blue-600 scale-110 shadow-lg shadow-blue-100' 
                : 'border-slate-200'
            }`}>
              {habit.completed && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`text-sm text-left transition-all duration-500 ${
              habit.completed 
                ? 'line-through text-slate-400' 
                : 'text-slate-700 font-bold'
            }`}>
              {habit.task}
            </span>
          </button>
        ))}
      </div>

      {/* 激励金句 */}
      <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-center gap-4 shadow-sm group">
        <div className="text-3xl transition-transform group-hover:scale-110 duration-500">🐢</div>
        <div className="flex-1">
          <span className="font-bold block text-sm text-blue-900 mb-0.5">理财就是理生活</span>
          <p className="text-[11px] text-blue-700/80 leading-relaxed font-medium">
            当你开始正视每一分钱的去向，你就在重新夺回生活的主动权。慢慢来，比较快。
          </p>
        </div>
      </div>
    </div>
  );
};

export default HabitsView;

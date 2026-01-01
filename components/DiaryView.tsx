
import React, { useState, useEffect } from 'react';
import { DiaryEntry, HabitItem } from '../types';
import { geminiService } from '../geminiService';

const DiaryView: React.FC = () => {
  // --- 心情相关状态 ---
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [currentMood, setCurrentMood] = useState('😌');
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- 自律相关状态 ---
  const [habits, setHabits] = useState<HabitItem[]>([
    { id: '1', task: '记录今日所有开支', completed: false },
    { id: '2', task: '拒接一通无效社交', completed: false },
    { id: '3', task: '对自己说：我值得重获自由', completed: true },
    { id: '4', task: '关闭非必要消费提醒', completed: false },
  ]);

  const moods = [
    { icon: '😩', label: '焦虑' },
    { icon: '😔', label: '低落' },
    { icon: '😌', label: '平静' },
    { icon: '🙂', label: '还行' },
    { icon: '🔥', label: '干劲' },
  ];

  // 模拟打卡人数
  const [checkInCount, setCheckInCount] = useState(856);

  // 计算自律指数
  const completedCount = habits.filter(h => h.completed).length;
  const targetProgress = Math.round((completedCount / habits.length) * 100);
  const [displayProgress, setDisplayProgress] = useState(0);

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
    const habit = habits.find(h => h.id === id);
    if (habit && !habit.completed) {
      // 如果是完成动作，模拟在线人数增加
      setCheckInCount(prev => prev + 1);
    }
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      mood: currentMood,
      content: content,
      timestamp: Date.now()
    };

    setIsAnalyzing(true);
    setEntries([newEntry, ...entries]);
    setContent('');

    try {
      // AI 分析时，带上自律完成情况作为背景
      const habitContext = `(今日完成了 ${completedCount}/${habits.length} 项自律任务)`;
      const response = await geminiService.analyzeMood(`${content} ${habitContext}`, newEntry.mood);
      setEntries(prev => prev.map(e => e.id === newEntry.id ? { ...e, aiResponse: response } : e));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const radius = 32;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      {/* 顶部身心看板 */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6">
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
            <circle 
              cx="40" cy="40" r={radius} 
              fill="transparent" 
              stroke="url(#diaryGradient)" 
              strokeWidth="8" 
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * displayProgress) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="diaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-slate-800">{displayProgress}%</span>
            <span className="text-[7px] font-bold text-slate-400 uppercase">自律指数</span>
          </div>
        </div>
        
        <div className="flex-1 space-y-2">
          <h3 className="font-black text-slate-800 text-sm">今日状态</h3>
          <p className="text-[10px] text-slate-500 leading-relaxed italic">
            "自律是重塑自尊的基石。每勾选一项，你就在从财务泥潭中拔出一只脚。"
          </p>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
               {habits.map(h => (
                 <div key={h.id} className={`w-3.5 h-3.5 rounded-full border border-white ${h.completed ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
               ))}
            </div>
            <span className="text-[9px] font-bold text-indigo-600">{completedCount}项已达成</span>
          </div>
        </div>
      </div>

      {/* 整合的行动与日记区 */}
      <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-6 rounded-[32px] border border-white shadow-xl">
        <div className="space-y-4 mb-6">
          <div className="flex flex-col gap-2 mb-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-indigo-900 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                  自愈行动清单
                </h4>
             </div>
             {/* 新增打卡激励提示 */}
             <div className="bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 flex items-center gap-2 animate-fadeIn shadow-sm">
                <span className="text-sm">🔥</span>
                <p className="text-[10px] text-orange-700 font-bold leading-tight">
                  今日已有 <span className="text-orange-600 text-xs font-black">{checkInCount}</span> 位战友完成自律打卡。别掉队，立即开启你的重塑之路！
                </p>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {habits.map(habit => (
              <button 
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all border ${
                  habit.completed ? 'bg-white/40 border-indigo-100 opacity-60' : 'bg-white border-white shadow-sm hover:scale-[1.01]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${habit.completed ? 'bg-indigo-500 border-indigo-500' : 'border-slate-200'}`}>
                  {habit.completed && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className={`text-[11px] font-bold ${habit.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{habit.task}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-indigo-100/50 mb-6"></div>

        <div className="space-y-4">
          <h4 className="text-xs font-black text-indigo-900">此刻心情</h4>
          <div className="flex justify-between bg-white/40 p-1.5 rounded-2xl">
            {moods.map(m => (
              <button 
                key={m.icon}
                onClick={() => setCurrentMood(m.icon)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${currentMood === m.icon ? 'bg-white shadow-md scale-110' : 'opacity-40 grayscale hover:opacity-100'}`}
              >
                <span className="text-xl">{m.icon}</span>
                <span className="text-[8px] font-bold text-slate-500">{m.label}</span>
              </button>
            ))}
          </div>

          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="压力像潮水一样涌来？写在这里，让 AI 陪你分析出路..."
            className="w-full h-28 bg-white/80 backdrop-blur border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-200 shadow-inner"
          />

          <button 
            onClick={handleSave}
            disabled={!content.trim() || isAnalyzing}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50 transition-all"
          >
            {isAnalyzing ? "AI 深度倾听中..." : "保存今日心迹"}
          </button>
        </div>
      </div>

      {/* 历史记录 */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">自愈时光轴</h4>
        {entries.length === 0 ? (
          <div className="text-center py-12 opacity-20 grayscale">
            <span className="text-5xl">🌙</span>
            <p className="text-xs mt-2 font-bold">还没有记录，今晚写第一篇吧</p>
          </div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-indigo-50 w-12 h-12 flex items-center justify-center rounded-2xl">{entry.mood}</span>
                  <div>
                    <div className="text-xs font-black text-slate-800">{new Date(entry.timestamp).toLocaleDateString()}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">{new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium italic">"{entry.content}"</p>
              
              {entry.aiResponse && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative pt-6">
                  <div className="absolute top-0 left-4 -translate-y-1/2 bg-indigo-600 text-white text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">AI Counselor</div>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                    {entry.aiResponse}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiaryView;

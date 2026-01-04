
import React, { useState, useEffect } from 'react';
import { DiaryEntry } from '../types';
import { geminiService } from '../geminiService';

const DiaryView: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem('diary_entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentMood, setCurrentMood] = useState('😌');
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // 愿望系统
  const [wish, setWish] = useState(() => localStorage.getItem('user_wish') || '');
  const [isEditingWish, setIsEditingWish] = useState(!wish);

  // 连签与积分
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('user_streak') || '0'));
  const [hopePoints, setHopePoints] = useState(() => parseInt(localStorage.getItem('hope_points') || '0'));
  const [showRewardToast, setShowRewardToast] = useState(false);

  useEffect(() => {
    localStorage.setItem('diary_entries', JSON.stringify(entries));
    localStorage.setItem('hope_points', hopePoints.toString());
    localStorage.setItem('user_streak', streak.toString());
    localStorage.setItem('user_wish', wish);
  }, [entries, hopePoints, streak, wish]);

  const moods = [
    { icon: '😩', label: '焦虑' },
    { icon: '😔', label: '低落' },
    { icon: '😌', label: '平静' },
    { icon: '🙂', label: '还行' },
    { icon: '🔥', label: '干劲' },
  ];

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
    
    // 增加积分与连签（简单逻辑：每次写+10分）
    setHopePoints(prev => prev + 10);
    setStreak(prev => prev + 1);
    setShowRewardToast(true);
    setTimeout(() => setShowRewardToast(false), 3000);

    try {
      const response = await geminiService.analyzeMood(content, newEntry.mood);
      setEntries(prev => prev.map(e => e.id === newEntry.id ? { ...e, aiResponse: response } : e));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24 relative">
      {/* 积分奖励弹窗 */}
      {showRewardToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-blue-600 text-white px-6 py-3 rounded-full font-black shadow-2xl flex items-center gap-2 animate-bounce">
          <span>✨ 希望值 +10</span>
          <span className="text-[10px] opacity-70">离解锁深度审计报告更近了</span>
        </div>
      )}

      {/* 头部：连签看板 */}
      <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 rounded-full blur-[80px]"></div>
        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">加密信道已就绪</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight">债见日记。</h2>
            <div className="flex items-center gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-black text-blue-400">{streak}</div>
                <div className="text-[8px] opacity-50 font-black uppercase tracking-tighter">连签天数</div>
              </div>
              <div className="w-[1px] h-8 bg-white/10"></div>
              <div className="text-center">
                <div className="text-2xl font-black text-amber-400">{hopePoints}</div>
                <div className="text-[8px] opacity-50 font-black uppercase tracking-tighter">希望总值</div>
              </div>
            </div>
          </div>
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-sm">
             <span className="text-3xl animate-pulse">🕯️</span>
          </div>
        </div>
      </div>

      {/* 希望许愿池 (Wishing Fountain) */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-[32px] text-white shadow-lg relative overflow-hidden group">
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-70">上岸后的第一件事 (My Recovery Wish)</h4>
            <button onClick={() => setIsEditingWish(!isEditingWish)} className="text-[10px] bg-white/10 px-2 py-1 rounded-lg">
              {isEditingWish ? '完成' : '修改'}
            </button>
          </div>
          {isEditingWish ? (
            <input 
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="例如：带家人去一次旅行、吃一顿不看价格的大餐..."
              className="w-full bg-white/10 border-none rounded-xl px-4 py-3 text-sm placeholder:text-white/30 focus:ring-0 outline-none"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌟</span>
              <p className="text-sm font-bold tracking-tight italic">
                {wish || "点击修改，立下您的上岸宏愿..."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 记录区 */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">此时心情</h4>
          <div className="flex justify-between bg-slate-50 p-1.5 rounded-2xl">
            {moods.map(m => (
              <button 
                key={m.icon}
                onClick={() => setCurrentMood(m.icon)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${currentMood === m.icon ? 'bg-white shadow-md scale-110' : 'opacity-30 grayscale hover:opacity-100'}`}
              >
                <span className="text-xl">{m.icon}</span>
                <span className="text-[8px] font-black text-slate-500 uppercase">{m.label}</span>
              </button>
            ))}
          </div>

          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你今天的压力、委屈或希望..."
            className="w-full h-32 bg-slate-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 shadow-inner font-medium"
          />

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleSave}
              disabled={!content.trim() || isAnalyzing}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl active:scale-95 disabled:opacity-50 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  正在加固加密通道...
                </>
              ) : "加密保存并获取 10 点希望值"}
            </button>
            
            {/* 进度提示 */}
            <div className="px-4 space-y-2">
              <div className="flex justify-between items-center text-[8px] font-black text-slate-400 uppercase tracking-widest">
                <span>距离解锁深度审计报告</span>
                <span>{hopePoints % 70} / 70 XP</span>
              </div>
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(hopePoints % 70) / 70 * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 记录轴 */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">债见 · 记录轴</h4>
        {entries.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-[32px]">
            <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">开始您的第一次心迹加密记录</p>
          </div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-4 group hover:border-blue-100 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-2xl bg-slate-50 w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-100 group-hover:scale-110 transition-transform">{entry.mood}</span>
                  <div>
                    <div className="text-xs font-black text-slate-800">{new Date(entry.timestamp).toLocaleDateString()}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">{new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                </div>
                <div className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black rounded-lg uppercase tracking-widest">已存证</div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">"{entry.content}"</p>
              {entry.aiResponse && (
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100/50 relative pt-7">
                  <div className="absolute top-0 left-5 -translate-y-1/2 bg-blue-600 text-white text-[8px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM5.884 6.607a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zm9.9 0a1 1 0 00-1.414 0l-.707.707a1 1 0 001.414 1.414l.707-.707a1 1 0 000-1.414zm-9.9 9.9a1 1 0 001.414 0l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 000 1.414zm9.9 0a1 1 0 01-1.414 0l-.707-.707a1 1 0 111.414-1.414l.707.707a1 1 0 010 1.414zM10 7a3 3 0 100 6 3 3 0 000-6z" /></svg>
                    加密疗愈建议
                  </div>
                  <p className="text-[11px] text-blue-900 leading-relaxed font-bold">
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


import React from 'react';

const InstallGuideView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="animate-fadeIn pb-40 space-y-6">
      <button onClick={onBack} className="text-slate-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-2 mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
        返回工具箱
      </button>

      <div className="px-2">
        <h3 className="text-2xl font-black text-white tracking-tight">将“债策”安装到桌面</h3>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">沉浸、无痕、全屏体验</p>
      </div>

      <div className="space-y-6">
        {/* iOS Guide */}
        <div className="bg-white rounded-[40px] p-8 space-y-6 shadow-xl">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl">🍎</div>
              <h4 className="font-black text-slate-900">iOS (Safari 浏览器)</h4>
           </div>
           <div className="space-y-4">
              <Step number="1" text="点击浏览器底部的【分享】图标" />
              <Step number="2" text="在菜单中向上滑动，找到【添加到主屏幕】" />
              <Step number="3" text="点击右上角【添加】，即刻开启全屏模式" />
           </div>
        </div>

        {/* Android Guide */}
        <div className="bg-white rounded-[40px] p-8 space-y-6 shadow-xl">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl">🤖</div>
              <h4 className="font-black text-slate-900">Android (Chrome/华为/小米)</h4>
           </div>
           <div className="space-y-4">
              <Step number="1" text="点击浏览器右上角【三个点】菜单" />
              <Step number="2" text="选择【安装应用】或【添加到主屏幕】" />
              <Step number="3" text="在弹窗中确认安装，桌面上会出现债策图标" />
           </div>
        </div>

        <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-[32px] text-indigo-400">
           <p className="text-[11px] font-bold leading-relaxed">
             💡 提示：安装后您可以像原生 App 一样启动，且不会在浏览器留下历史记录，更好地保护您的财务隐私。
           </p>
        </div>
      </div>
    </div>
  );
};

const Step = ({ number, text }: { number: string, text: string }) => (
  <div className="flex gap-4 items-center">
    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0">{number}</div>
    <p className="text-[13px] text-slate-600 font-bold">{text}</p>
  </div>
);

export default InstallGuideView;

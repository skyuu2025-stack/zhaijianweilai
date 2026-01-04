
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../geminiService';
import NegotiationView from './NegotiationView.tsx';
import DiaryView from './DiaryView.tsx';
import HabitsView from './HabitsView.tsx';
import SnowballView from './SnowballView.tsx';
import ScriptView from './ScriptView.tsx';
import InstallGuideView from './InstallGuideView.tsx';
import CollectionDefenseView from './CollectionDefenseView.tsx';
import TermsPrivacyView from './TermsPrivacyView.tsx';

const ToolsView: React.FC<{ isPro: boolean }> = ({ isPro }) => {
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<string>('');
  const [pendingImages, setPendingImages] = useState<{ data: string, mimeType: string }[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (showCameraModal && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => {
        console.error("Camera play failed:", err);
      });
    }
  }, [showCameraModal, stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }, 
        audio: false 
      });
      setStream(mediaStream);
      setShowCameraModal(true);
    } catch (err) {
      console.error("Camera error:", err);
      fileInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCameraModal(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPendingImages(prev => [...prev, { data: dataUrl.split(',')[1], mimeType: 'image/jpeg' }]);
      }
    }
  };

  const runMultiAudit = async () => {
    if (pendingImages.length === 0) return;
    setIsAnalyzing(true);
    setShowAnalysisModal(true);
    try {
      const response = await geminiService.sendMessage([], 
        "请深度审计这些图片中的法律风险。重点分析：综合年化利率是否超标、是否存在暴力催收条款、是否有隐藏服务费。", 
        { images: pendingImages, isDeepMode: true }
      );
      setAuditResult(response.text);
    } catch (err: any) {
      if (err.message && err.message.includes("AUTH_KEY_ERROR")) {
        setAuditResult(err.message.split(": ")[1]);
      } else {
        setAuditResult("系统连接中断。可能由于网络加速环境不稳定，请切换节点重试。");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (activeTool === 'negotiation') return <NegotiationView onBack={() => setActiveTool(null)} />;
  if (activeTool === 'diary') return <DiaryView onBack={() => setActiveTool(null)} />;
  if (activeTool === 'habits') return <HabitsView onBack={() => setActiveTool(null)} />;
  if (activeTool === 'snowball') return <SnowballView onBack={() => setActiveTool(null)} />;
  if (activeTool === 'script') return <ScriptView onBack={() => setActiveTool(null)} />;
  if (activeTool === 'install') return <InstallGuideView onBack={() => setActiveTool(null)} />;
  if (activeTool === 'defense') return <CollectionDefenseView onBack={() => setActiveTool(null)} />;
  if (activeTool === 'privacy') return <TermsPrivacyView onBack={() => setActiveTool(null)} />;

  return (
    <div className="space-y-10 pb-40 animate-fadeIn px-2">
      {/* Fix: Explicitly cast files to File[] to ensure 'f' is correctly typed as File, resolving property 'type' and Blob parameter errors */}
      <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => {
        const files = Array.from(e.target.files || []) as File[];
        files.forEach(f => {
          const r = new FileReader();
          r.onload = (ev) => setPendingImages(prev => [...prev, { data: (ev.target?.result as string).split(',')[1], mimeType: f.type }]);
          r.readAsDataURL(f);
        });
      }} />
      <canvas ref={canvasRef} className="hidden" />

      {/* 风险探测模块 */}
      <section className="space-y-5">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[19px] font-black text-white flex items-center gap-3 tracking-tight">
            <div className="w-1.5 h-7 bg-orange-500 rounded-full"></div>
            风险探测
          </h3>
          <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black rounded-full tracking-widest uppercase">
            视觉审计已开启
          </div>
        </div>
        
        <div className="bg-white rounded-[48px] p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {pendingImages.length > 0 && (
             <div className="flex gap-2 overflow-x-auto pb-2">
               {pendingImages.map((img, i) => (
                 <div key={i} className="relative shrink-0">
                    <img src={`data:${img.mimeType};base64,${img.data}`} className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                    <button onClick={() => setPendingImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[8px]">✕</button>
                 </div>
               ))}
             </div>
          )}
          <div className="flex items-center gap-7">
            <div className="w-20 h-20 bg-blue-50 rounded-[28px] flex items-center justify-center shadow-inner shrink-0 text-3xl">👁️</div>
            <div className="space-y-1">
              <h4 className="font-black text-slate-900 text-[18px]">合同多图审计</h4>
              <p className="text-[12px] text-slate-400 font-bold opacity-80">支持拍摄多张合同或催收短信进行联查。</p>
            </div>
          </div>

          <div className="flex gap-3">
             <button onClick={startCamera} className="flex-1 bg-slate-900 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
               拍摄资料
             </button>
             {pendingImages.length > 0 && (
               <button onClick={runMultiAudit} className="flex-1 bg-orange-500 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg">开始审计</button>
             )}
          </div>
        </div>
      </section>

      {/* 破局工具箱模块 */}
      <section className="space-y-5">
        <h3 className="text-[19px] font-black text-white flex items-center gap-3 tracking-tight px-2">
          <div className="w-1.5 h-7 bg-blue-600 rounded-full"></div>
          破局工具箱
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <ToolCard icon="🛡️" title="法御催收" desc="反暴力催收流程" onClick={() => setActiveTool('defense')} />
          <ToolCard icon="📲" title="安装教程" desc="添加桌面 PWA" onClick={() => setActiveTool('install')} />
          <ToolCard icon="🎯" title="协商演练" desc="AI 模拟谈判" onClick={() => setActiveTool('negotiation')} />
          <ToolCard icon="📊" title="债务雪球" desc="清偿优先级" onClick={() => setActiveTool('snowball')} />
          <ToolCard icon="⚖️" title="法务模板" desc="标准话术库" onClick={() => setActiveTool('script')} />
          <ToolCard icon="🏔️" title="上岸习惯" desc="每日自律打卡" onClick={() => setActiveTool('habits')} />
        </div>
      </section>

      {/* 相机 Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-[600] bg-black flex flex-col items-center">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <div className="absolute bottom-16 w-full px-10 flex items-center justify-between">
            <button onClick={stopCamera} className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-black">完成</button>
            <button onClick={capturePhoto} className="w-24 h-24 bg-white rounded-full border-[6px] border-orange-500/50 flex items-center justify-center active:scale-90 shadow-2xl">
              <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-full"></div>
            </button>
            <div className="w-16 h-16"></div>
          </div>
        </div>
      )}

      {/* 分析结果 Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-3xl">
           <div className="bg-white rounded-[44px] p-8 w-full max-w-[420px] shadow-2xl space-y-6 overflow-y-auto max-h-[80vh]">
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                 <h3 className="text-xl font-black text-slate-900">审计报告</h3>
                 <button onClick={() => setShowAnalysisModal(false)} className="text-slate-300">✕</button>
              </div>
              <div className="text-[13px] text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                 {isAnalyzing ? "AI 正在逐行扫描法务风险..." : auditResult}
              </div>
              
              <button onClick={() => setShowAnalysisModal(false)} className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest">关闭报告</button>
           </div>
        </div>
      )}
    </div>
  );
};

const ToolCard = ({ icon, title, desc, onClick }: any) => (
  <div onClick={onClick} className="bg-white p-6 rounded-[32px] flex flex-col gap-4 shadow-xl active:scale-[0.97] transition-all cursor-pointer border border-transparent hover:border-indigo-100">
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl">{icon}</div>
    <div className="space-y-1">
      <h4 className="font-black text-slate-900 text-[14px]">{title}</h4>
      <p className="text-[10px] text-slate-400 font-bold leading-tight">{desc}</p>
    </div>
  </div>
);

export default ToolsView;

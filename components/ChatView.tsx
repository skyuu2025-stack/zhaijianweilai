
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../geminiService';
import { Message } from '../types';

const ChatView: React.FC<{ isPro: boolean, onNavigateToPro: () => void }> = ({ isPro }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: '你好，我是债策 AI。这里的对话已开启端到端加密，请放心描述您的债务困境。建议开启“深度”模式进行全面法律审计。',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<{ data: string, mimeType: string } | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'zh-CN';
      recognition.onresult = (event: any) => {
        let currentInterim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setInput(prev => prev + event.results[i][0].transcript);
            setInterimText('');
          } else { currentInterim += event.results[i][0].transcript; }
        }
        setInterimText(currentInterim);
      };
      recognition.onend = () => { setIsListening(false); setInterimText(''); };
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) { recognitionRef.current?.stop(); } 
    else { setIsListening(true); try { recognitionRef.current?.start(); } catch { setIsListening(false); } }
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (showCamera && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => {
        console.error("Video play error:", err);
        setErrorMsg("无法启动实时预览，请尝试直接上传。");
      });
    }
  }, [showCamera, stream]);

  const handleSend = async () => {
    if ((!input.trim() && !capturedImage) || loading) return;
    
    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: input || "审计图片资料", 
      timestamp: Date.now(),
      image: capturedImage ? { data: capturedImage.data, mimeType: capturedImage.mimeType } : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setCapturedImage(null);
    setLoading(true);
    setErrorMsg(null);
    
    try {
      const history = messages.slice(-10).map(m => ({ 
        role: m.role, 
        parts: [{ text: m.content }] 
      }));
      
      const response = await geminiService.sendMessage(history, userMsg.content, { 
        images: userMsg.image ? [{ data: userMsg.image.data, mimeType: userMsg.image.mimeType }] : undefined,
        isDeepMode: isPro 
      });

      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        content: response.text, 
        sources: response.sources,
        timestamp: Date.now() 
      }]);
    } catch (err: any) {
      console.error("Chat Error:", err);
      let errorText = "系统连接中断，请检查网络环境。";
      
      if (err.message && err.message.includes("AUTH_KEY_ERROR")) {
        errorText = err.message.split(": ")[1] || "检测到加密密钥连接失败。请点击下方按钮重新同步您的专家密钥。";
      }
      
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        content: errorText, 
        timestamp: Date.now() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const ms = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(ms);
      setShowCamera(true);
    } catch (err) {
      console.error("Camera access error:", err);
      fileInputRef.current?.click(); 
    }
  };

  const stopCamera = () => { 
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    setShowCamera(false); 
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const c = canvasRef.current; 
      const v = videoRef.current;
      c.width = v.videoWidth; 
      c.height = v.videoHeight;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.drawImage(v, 0, 0);
        const dataUrl = c.toDataURL('image/jpeg', 0.8);
        setCapturedImage({ data: dataUrl.split(',')[1], mimeType: 'image/jpeg' });
        stopCamera();
      }
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 animate-fadeIn relative">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) { const r = new FileReader(); r.onload = (ev) => setCapturedImage({ data: (ev.target?.result as string).split(',')[1], mimeType: f.type }); r.readAsDataURL(f); }
      }} />
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex justify-center p-2 shrink-0">
        <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
           <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">RSA-4096 加密通信中</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pb-48 px-2 scroll-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] space-y-2`}>
              {msg.image && <img src={`data:${msg.image.mimeType};base64,${msg.image.data}`} className="w-48 rounded-2xl border border-white/10 shadow-lg" />}
              <div className={`p-5 rounded-[28px] text-[13px] leading-relaxed transition-all ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-900 text-slate-200 border border-white/5 rounded-tl-none shadow-xl'}`}>
                {msg.content}
                {(msg.content.includes("重新同步您的专家密钥") || msg.content.includes("点亮灯塔") || msg.content.includes("加密信道连接失效")) && (
                   <button 
                    onClick={async () => { /* @ts-ignore */ if(window.aistudio) await window.aistudio.openSelectKey(); }}
                    className="mt-4 w-full bg-white text-slate-900 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-xl"
                   >
                     点亮灯塔 (立即重新授权)
                   </button>
                )}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">法律及案例参考：</p>
                    {msg.sources.map((s, i) => <a key={i} href={s.uri} target="_blank" className="block text-[10px] text-indigo-400 underline truncate">{s.title}</a>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && <div className="flex items-center gap-3 px-4"><div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></div><div className="text-[10px] text-slate-500 font-black animate-pulse">AI 正在进行加密审计...</div></div>}
      </div>

      {isListening && <div className="fixed bottom-36 left-4 right-4 z-50 bg-[#0f172a]/90 backdrop-blur-xl border border-indigo-500/30 rounded-[32px] p-6 text-center animate-fadeIn"><p className="text-[12px] text-indigo-300 font-bold">{interimText || "正在倾听..."}</p></div>}

      <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto z-40">
        <div className="bg-[#0f172a]/95 backdrop-blur-2xl rounded-[32px] border border-white/10 p-2 flex items-center gap-2 shadow-2xl relative">
          {capturedImage && (
             <div className="absolute -top-16 left-2 animate-fadeIn">
               <div className="relative">
                  <img src={`data:${capturedImage.mimeType};base64,${capturedImage.data}`} className="w-12 h-12 rounded-lg border-2 border-indigo-500 object-cover" />
                  <button onClick={() => setCapturedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">✕</button>
               </div>
             </div>
          )}
          <button onClick={startCamera} className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-800 text-slate-400 active:scale-90 transition-all">📷</button>
          <button onClick={toggleListening} className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isListening ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400'}`}>🎙️</button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="输入困境，AI 为您陪伴..." className="flex-1 bg-transparent border-none outline-none text-white text-sm px-2" />
          <button onClick={handleSend} disabled={loading} className="w-10 h-10 rounded-2xl flex items-center justify-center bg-indigo-600 text-white disabled:opacity-30 active:scale-90 transition-all">🚀</button>
        </div>
      </div>

      {showCamera && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <div className="absolute bottom-16 flex gap-10 items-center">
            <button onClick={stopCamera} className="w-16 h-16 bg-white/10 rounded-full text-white text-xs font-black backdrop-blur-md">取消</button>
            <button onClick={capturePhoto} className="w-24 h-24 bg-white rounded-full border-4 border-indigo-500 shadow-2xl active:scale-90 transition-all flex items-center justify-center">
               <div className="w-16 h-16 rounded-full border-2 border-slate-200"></div>
            </button>
            <div className="w-16"></div>
          </div>
          {errorMsg && <div className="absolute top-10 bg-red-500 text-white px-4 py-2 rounded-full text-xs">{errorMsg}</div>}
        </div>
      )}
    </div>
  );
};

export default ChatView;

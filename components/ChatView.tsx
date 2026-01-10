
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../geminiService';
import { Message } from '../types';

const ChatView: React.FC<{ isPro: boolean, onNavigateToPro: () => void }> = ({ isPro, onNavigateToPro }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: '你好，我是债策。这里的对话已开启 RSA-4096 加密。请放心描述您的处境，我会为你寻找法律红线与心理支点。',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<{ data: string, mimeType: string } | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [tempImage, setTempImage] = useState<{ data: string, mimeType: string } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [useDeepMode, setUseDeepMode] = useState(isPro);
  
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

  const handleSend = async () => {
    if ((!input.trim() && !capturedImage) || loading) return;
    
    const effectiveDeepMode = useDeepMode && isPro;

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
    
    try {
      const history = messages.slice(-10).map(m => ({ 
        role: m.role, 
        parts: [{ text: m.content }] 
      }));
      
      const response = await geminiService.sendMessage(history, userMsg.content, { 
        images: userMsg.image ? [{ data: userMsg.image.data, mimeType: userMsg.image.mimeType }] : undefined,
        isDeepMode: effectiveDeepMode 
      });

      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        content: response.text, 
        sources: response.sources,
        timestamp: Date.now() 
      }]);
    } catch (err: any) {
      let errorText = "加密通道受干扰，请重新连接。";
      if (err.message?.includes("AUTH_KEY_ERROR")) {
        errorText = err.message.split(": ")[1];
      }
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: errorText, timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const ms = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 } } 
      });
      setStream(ms);
      setShowCamera(true);
    } catch (err) { fileInputRef.current?.click(); }
  };

  const stopCamera = () => { 
    if (stream) stream.getTracks().forEach(t => t.stop());
    setStream(null);
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
        setTempImage({ data: c.toDataURL('image/jpeg', 0.8).split(',')[1], mimeType: 'image/jpeg' });
        setIsPreviewing(true);
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

      {/* 审计免责浮窗 - Apple 审核加分项 */}
      <div className="mx-4 mt-2 px-4 py-2 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between opacity-50">
         <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">
            AI 审计仅供参考 · 请以最终法律文书为准
         </span>
         <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pb-48 px-2 scroll-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] space-y-2`}>
              {msg.image && <img src={`data:${msg.image.mimeType};base64,${msg.image.data}`} className="w-48 rounded-2xl border border-white/10 shadow-lg" />}
              <div className={`p-5 rounded-[28px] text-[13px] leading-relaxed transition-all ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-900 text-slate-200 border border-white/5 rounded-tl-none shadow-xl'}`}>
                {msg.content}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                    {msg.sources.map((s, i) => <a key={i} href={s.uri} target="_blank" className="block text-[10px] text-indigo-400 underline truncate">{s.title}</a>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && <div className="flex items-center gap-3 px-4"><div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></div><div className="text-[10px] text-slate-500 font-black">AI 正在推演最优路径...</div></div>}
      </div>

      <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto z-40">
        <div className="bg-[#0f172a]/95 backdrop-blur-2xl rounded-[32px] border border-white/10 p-2 flex items-center gap-2 shadow-2xl">
          <button onClick={startCamera} className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-800 text-slate-400">📷</button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="在此加密输入..." className="flex-1 bg-transparent border-none outline-none text-white text-sm px-2" />
          <button onClick={handleSend} disabled={loading} className="w-10 h-10 rounded-2xl flex items-center justify-center bg-indigo-600 text-white active:scale-90 transition-all">🚀</button>
        </div>
      </div>

      {showCamera && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
          {!isPreviewing ? (
            <>
              <video ref={(el) => { if (el && stream) el.srcObject = stream; (videoRef as any).current = el; }} autoPlay playsInline muted className="w-full h-full object-cover" />
              <button onClick={capturePhoto} className="absolute bottom-16 w-20 h-20 bg-white rounded-full border-4 border-indigo-500 shadow-2xl"></button>
              <button onClick={stopCamera} className="absolute top-10 right-10 text-white font-black">✕</button>
            </>
          ) : (
            <>
              <img src={`data:${tempImage?.mimeType};base64,${tempImage?.data}`} className="w-full h-full object-cover" />
              <div className="absolute bottom-16 flex gap-6 px-8 w-full">
                <button onClick={() => setIsPreviewing(false)} className="flex-1 bg-white/10 text-white py-5 rounded-3xl font-black">重拍</button>
                <button onClick={() => { setCapturedImage(tempImage); stopCamera(); }} className="flex-1 bg-indigo-600 text-white py-5 rounded-3xl font-black">确认</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatView;

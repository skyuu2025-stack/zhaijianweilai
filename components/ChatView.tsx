
import React, { useState, useRef, useEffect } from 'react';
import { geminiService, ImagePart } from '../geminiService';
import { Message } from '../types';

interface ChatViewProps {
  isPro: boolean;
  onNavigateToPro?: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ isPro, onNavigateToPro }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: '你好，我是你的AI财务精算伴侣。您可以直接拍下：\n1. 网贷分期详情图\n2. 借款合同/PDF截图\n3. 银行逾期通知书或催收短信\n\n我会为您还原真实年化利率，并从法律角度分析其中的利息风险，陪您科学上岸。',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ data: string, mimeType: string, preview: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showProNudge, setShowProNudge] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleImageUploadClick = () => {
    if (!isPro) {
      setShowProNudge(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setSelectedImage({
          data: base64Data,
          mimeType: file.type,
          preview: base64String
        });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || loading) return;

    const currentInput = input;
    const currentImage = selectedImage;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentInput || (currentImage ? '[上传文档待分析]' : ''),
      image: currentImage ? { data: currentImage.data, mimeType: currentImage.mimeType } : undefined,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setLoading(true);

    try {
      const history = messages.map(m => {
        const parts: any[] = [];
        if (m.content && m.content.trim()) {
          parts.push({ text: m.content });
        }
        if (m.image) {
          parts.push({
            inlineData: {
              data: m.image.data,
              mimeType: m.image.mimeType
            }
          });
        }
        return { role: m.role, parts: parts };
      });
      
      let imagePart: ImagePart | undefined;
      if (currentImage) {
        imagePart = {
          inlineData: {
            data: currentImage.data,
            mimeType: currentImage.mimeType
          }
        };
      }

      const response = await geminiService.sendMessage(history, currentInput || "请帮我深度审计这张财务相关的图片，计算其年化真实利率并分析法律风险。", imagePart);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response || '精算引擎分析完成，但未返回具体结论。',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: '抱歉，深度审计引擎遇到了一点波动。请检查网络后重试。',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 pb-24 relative">
      {showProNudge && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-[320px] shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mb-4 text-blue-600">⚖️</div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">深度审计已就绪</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              升级专业版，开启 AI 视觉精算功能，自动识别高息陷阱与合同违约风险。
            </p>
            <div className="flex flex-col w-full gap-2">
              <button 
                onClick={() => {
                  setShowProNudge(false);
                  onNavigateToPro?.();
                }}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm shadow-lg active:scale-95"
              >
                解锁 Pro 审计功能
              </button>
              <button onClick={() => setShowProNudge(false)} className="text-slate-400 text-xs py-2">稍后再说</button>
            </div>
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-hide pt-2">
        {messages.map(msg => (
          <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-4 text-sm leading-relaxed rounded-2xl shadow-sm ${
              msg.role === 'user' 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none prose prose-slate prose-sm max-w-none'
            }`}>
              {msg.image && (
                <div className="mb-2 overflow-hidden rounded-lg">
                  <img src={`data:${msg.image.mimeType};base64,${msg.image.data}`} alt="User Upload" className="w-full h-auto max-h-80 object-cover" />
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl shadow-sm flex flex-col gap-2 min-w-[200px]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">AI 正在深度审计...</span>
              </div>
              <p className="text-[10px] text-slate-400 italic">正在还原 IRR 真实利率并核查法律风险点</p>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-30">
        {selectedImage && (
          <div className="mb-3 animate-fadeIn">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-xl ring-2 ring-blue-100">
                <img src={selectedImage.preview} alt="Selected Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[1px] flex items-center justify-center">
                   <svg className="w-8 h-8 text-white/50" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                </div>
              </div>
              <button 
                onClick={removeSelectedImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        )}

        <div className="glass-morphism rounded-2xl border border-slate-200 shadow-2xl p-2 flex items-center gap-2">
          <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />
          <button 
            onClick={handleImageUploadClick}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative ${
              selectedImage 
              ? 'bg-blue-600 text-white shadow-blue-200 shadow-lg scale-105' 
              : 'bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-500 active:scale-90'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {!selectedImage && isPro && (
               <span className="absolute -top-1 -right-1 flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
               </span>
            )}
          </button>

          <div className="flex-1">
            <textarea 
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={selectedImage ? "上传完毕，点击右侧分析..." : "输入账单详情或拍个照..."}
              className="w-full bg-slate-50 border-none outline-none text-sm p-2.5 rounded-xl resize-none max-h-32 scroll-hide"
            />
          </div>

          <button 
            onClick={handleSend}
            disabled={loading || (!input.trim() && !selectedImage)}
            className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 disabled:bg-slate-300 disabled:shadow-none transition-all"
          >
            <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;

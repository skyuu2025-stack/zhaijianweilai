
import React, { useState, useRef, useEffect } from 'react';
import { geminiService, ImagePart } from '../geminiService';
import { Message } from '../types';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ChatViewProps {
  isPro: boolean;
  onNavigateToPro?: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ isPro, onNavigateToPro }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: '你好，我是你的AI财务心理伴侣。你可以发文字，也可以直接拍下让你困惑的账单、催收函或借款协议。我会为你分析其中的利息风险，并陪你度过这段艰难时光。',
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
      content: currentInput || (currentImage ? '[分析账单图片]' : ''),
      image: currentImage ? { data: currentImage.data, mimeType: currentImage.mimeType } : undefined,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setLoading(true);

    try {
      const history = messages.map(m => {
        const parts: any[] = [{ text: m.content }];
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

      const response = await geminiService.sendMessage(history, currentInput || "请帮我深度分析这张财务相关的图片。", imagePart);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response || '我正在梳理信息，请稍等。',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: '抱歉，目前的网络连接有些波动。请稍后再次发送。',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 pb-24 relative">
      {/* 会员引导 */}
      {showProNudge && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 w-full max-w-[320px] shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-3xl mb-4">📸</div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">专业账单诊断</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              上传账单截图，AI将为您自动计算IRR年化利率并识别违法陷阱。此功能仅限专业版用户。
            </p>
            <div className="flex flex-col w-full gap-2">
              <button 
                onClick={() => {
                  setShowProNudge(false);
                  onNavigateToPro?.();
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm"
              >
                立即升级解锁
              </button>
              <button onClick={() => setShowProNudge(false)} className="text-slate-400 text-xs py-2">稍后再说</button>
            </div>
          </div>
        </div>
      )}

      {/* 消息流 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-hide pt-2">
        {messages.map(msg => (
          <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3.5 text-sm leading-relaxed rounded-2xl shadow-sm ${
              msg.role === 'user' 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
            }`}>
              {msg.image && (
                <div className="mb-2 overflow-hidden rounded-lg">
                  <img src={`data:${msg.image.mimeType};base64,${msg.image.data}`} alt="User Upload" className="w-full h-auto max-h-60 object-cover" />
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm flex gap-2 items-center">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-[10px] text-slate-400">分析中...</span>
            </div>
          </div>
        )}
      </div>

      {/* 输入与预览区 */}
      <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-30">
        
        {/* 图片预览浮层 */}
        {selectedImage && (
          <div className="mb-3 animate-fadeIn">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-xl ring-2 ring-blue-100">
                <img src={selectedImage.preview} alt="Selected Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[1px]"></div>
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
          {/* 醒目的上传按钮 */}
          <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />
          <button 
            onClick={handleImageUploadClick}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative ${
              selectedImage 
              ? 'bg-blue-600 text-white shadow-blue-200 shadow-lg scale-105' 
              : 'bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-500'
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
              placeholder={selectedImage ? "为这张图片写点描述..." : "聊聊心事或拍个账单..."}
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

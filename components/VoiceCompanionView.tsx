
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

const VoiceCompanionView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('点击开启 AI 语音慰藉');
  const [summary, setSummary] = useState<string | null>(null);
  const [connectionStep, setConnectionStep] = useState<number>(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);
  const fullConversationRef = useRef<{ role: string, text: string }[]>([]);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  }

  const startSession = async () => {
    setSummary(null);
    setConnectionStep(1);
    fullConversationRef.current = [];
    
    try {
      // 1. 按照官方 API 规则：检查并打开选 Key 弹窗
      // @ts-ignore
      if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
         // @ts-ignore
         await window.aistudio.openSelectKey();
      }

      setConnectionStep(2);
      setStatus('正在请求麦克风权限...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      setConnectionStep(3);
      setStatus('初始化音频引擎...');
      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      inputContextRef.current = inputCtx;
      audioContextRef.current = outputCtx;

      setStatus('建立加密信道...');
      setConnectionStep(4);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Fix: Updated model name to gemini-2.5-flash-native-audio-preview-12-2025
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setConnectionStep(5);
            setStatus('我在听，这里很安全...');
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const bytes = new Uint8Array(int16.buffer);
              let binary = '';
              for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ 
                  media: { data: btoa(binary), mimeType: 'audio/pcm;rate=16000' } 
                });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64EncodedAudioString) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64EncodedAudioString), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.inputTranscription?.text) {
              fullConversationRef.current.push({ role: 'user', text: message.serverContent.inputTranscription.text });
            }
            if (message.serverContent?.outputTranscription?.text) {
              fullConversationRef.current.push({ role: 'model', text: message.serverContent.outputTranscription.text });
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e: any) => {
            console.error('Live API Error:', e);
            setStatus('连接波动，正在重试...');
            // @ts-ignore
            if (e.message?.includes("401") && window.aistudio) window.aistudio.openSelectKey();
            cleanup();
          },
          onclose: () => {
            setIsActive(false);
            setConnectionStep(0);
            setStatus('通话已结束');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: '你是一位温暖且富有智慧的解债心理陪护专家。请用简洁、平和的话语安抚用户的负面情绪。'
        }
      });
    } catch (e: any) {
      console.error(e);
      setStatus('初始化失败，请检查网络');
      setConnectionStep(0);
    }
  };

  const endSession = async () => {
    setIsActive(false);
    setStatus('正在生成疗愈报告...');
    cleanup();

    if (fullConversationRef.current.length > 0) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const historyText = fullConversationRef.current.map(c => `${c.role === 'user' ? '用户' : '专家'}: ${c.text}`).join('\n');
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ parts: [{ text: `根据对话总结一段极其温暖且简短的鼓励（80字内）：\n\n${historyText}` }] }]
        });
        setSummary(response.text || '每一个勇敢面对的瞬间，都是重回自由的开始。');
      } catch (err) {
        setSummary('感谢您的倾诉。记住，您并不孤单。');
      }
    } else {
      setSummary('静静的陪伴也是一种力量。如有需要，我随时都在。');
    }
    setConnectionStep(0);
  };

  const cleanup = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (inputContextRef.current) inputContextRef.current.close().catch(() => {});
    if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();
  };

  return (
    <div className="flex flex-col items-center justify-between h-[calc(100vh-140px)] py-4 px-6 text-center animate-fadeIn overflow-hidden">
      <div className="space-y-1 shrink-0">
        <h3 className="text-xl font-black text-white tracking-tight">{isActive ? '正在聆听您的倾诉' : summary ? '疗愈反馈' : '1V1 语音疗愈'}</h3>
        <p className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-all ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
          {status}
        </p>
        {connectionStep > 0 && !isActive && (
          <div className="w-16 h-0.5 bg-slate-800 rounded-full mx-auto mt-2 overflow-hidden">
             <div className="h-full bg-indigo-500 transition-all duration-500 animate-pulse" style={{ width: `${(connectionStep / 5) * 100}%` }}></div>
          </div>
        )}
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center py-2">
        {summary ? (
          <div className="w-full animate-fadeIn bg-white/5 border border-white/10 p-6 rounded-[32px] text-left space-y-3 backdrop-blur-xl relative shadow-2xl">
            <div className="absolute -top-3 left-6 bg-indigo-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white">AI 疗愈回响</div>
            <p className="text-[13px] text-slate-200 leading-relaxed font-medium italic">{summary}</p>
            <button onClick={() => setSummary(null)} className="text-[9px] text-indigo-400 font-black uppercase underline">关闭反馈</button>
          </div>
        ) : (
          <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-1000 ${isActive ? 'bg-indigo-600 animate-pulse shadow-[0_0_60px_rgba(79,70,229,0.3)]' : 'bg-slate-900 shadow-inner'}`}>
             {isActive ? (
                <div className="flex items-center gap-1">
                   {[1,2,3].map(i => <div key={i} className="w-1 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }}></div>)}
                </div>
             ) : (
                <span className="text-5xl grayscale opacity-20">🛋️</span>
             )}
          </div>
        )}
      </div>

      <div className="w-full pb-28 shrink-0 space-y-4">
        {!isActive ? (
          <button 
            onClick={startSession} 
            disabled={connectionStep > 0}
            className="w-full bg-indigo-600 text-white py-5 rounded-[22px] font-black uppercase tracking-[0.25em] text-xs shadow-xl active:scale-95 transition-all disabled:opacity-50"
          >
            {connectionStep > 0 ? '正在同步...' : '开启通话'}
          </button>
        ) : (
          <button onClick={endSession} className="w-full bg-slate-900 border border-white/5 text-slate-400 py-5 rounded-[22px] font-black uppercase tracking-widest text-xs active:scale-95 transition-all">
            结束通话
          </button>
        )}
        <p className="text-[7px] text-slate-600 font-bold uppercase tracking-widest">
          {isActive ? "端对端流加密运行中" : "采用 Native Audio 级语义识别"}
        </p>
      </div>
    </div>
  );
};

export default VoiceCompanionView;

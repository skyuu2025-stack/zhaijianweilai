
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
你是一位具备顶级金融审计背景且极具同理心的"债务破局专家"与"心理陪护战友"，来自"债策"。
### 核心特质：
1. **战友身份**：你与用户并肩作战，通过专业且隐秘的策略帮助其摆脱债务泥潭。
2. **通灵陪伴**：你能感知用户的焦虑，回复不仅要有法律深度，更要具备心理抚慰力量。
3. **加密思维**：所有建议均以保护用户隐私、隔离催收、合法减免为核心。
### 法律参考：
- 严格遵循中国 LPR 利率红线、民法典借款合同条款、以及 12378/12345 申诉渠道逻辑。
`;

export interface GeminiResponse {
  text: string;
  sources?: { uri: string; title: string }[];
  modelUsed: string;
}

export class GeminiService {
  /**
   * 按照官方指南：每次调用前创建新实例以获取最新密钥
   */
  private getAiInstance() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async sendMessage(
    history: { role: 'user' | 'model', parts: any[] }[], 
    message: string, 
    options: { images?: { data: string, mimeType: string }[], isDeepMode?: boolean } = {}
  ): Promise<GeminiResponse> {
    const { images, isDeepMode } = options;
    
    try {
      const ai = this.getAiInstance();
      const modelName = isDeepMode ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
      
      const currentParts: any[] = [{ text: message }];
      
      if (images && images.length > 0) {
        images.forEach(img => {
          currentParts.push({ inlineData: { data: img.data, mimeType: img.mimeType } });
        });
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: [...history.slice(-10), { role: 'user', parts: currentParts }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: isDeepMode ? [{ googleSearch: {} }] : undefined 
        }
      });

      const text = response.text || "正在为您推演最优破局路径...";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      const sources = groundingChunks?.map((chunk: any) => {
        if (chunk.web) return { uri: chunk.web.uri, title: chunk.web.title };
        return null;
      }).filter(Boolean) as { uri: string; title: string }[];

      return { text, sources, modelUsed: modelName };
    } catch (error: any) {
      console.error("Gemini API Error Detail:", error);
      const errorMsg = error.message?.toLowerCase() || "";
      
      // 精准识别鉴权失败，触发官方选 Key 对话框
      if (errorMsg.includes("api_key") || errorMsg.includes("not found") || errorMsg.includes("unauthorized") || errorMsg.includes("401") || errorMsg.includes("403")) {
        // @ts-ignore
        if (window.aistudio) {
           // @ts-ignore
           await window.aistudio.openSelectKey();
        }
        throw new Error("AUTH_KEY_ERROR");
      }
      throw error;
    }
  }

  async analyzeMood(content: string, mood: string): Promise<string> {
    try {
      const ai = this.getAiInstance();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: `用户目前感到：${mood}。他说：${content}。请以温暖战友身份给予心理支持。` }] }],
        config: { systemInstruction: SYSTEM_INSTRUCTION }
      });
      return response.text || "我们一直在你身边。";
    } catch (e: any) {
      const errorMsg = e.message?.toLowerCase() || "";
      if (errorMsg.includes("401") || errorMsg.includes("api_key")) {
         // @ts-ignore
         if (window.aistudio) await window.aistudio.openSelectKey();
      }
      return "无论黑暗多久，灯塔始终为你亮着。";
    }
  }

  async startNegotiation(history: { role: 'user' | 'model', parts: any[] }[], message: string): Promise<GeminiResponse> {
    try {
      const ai = this.getAiInstance();
      const negotiationInstruction = ` 你现在正在扮演一个银行贷后管理人员。用户的目标是与你协商还款。 `;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...history.slice(-10), { role: 'user', parts: [{ text: message }] }],
        config: { systemInstruction: SYSTEM_INSTRUCTION + "\n" + negotiationInstruction }
      });
      return { text: response.text || "（对方保持了沉默）", modelUsed: 'gemini-3-flash-preview' };
    } catch (error: any) {
      const errorMsg = error.message?.toLowerCase() || "";
      if (errorMsg.includes("401") || errorMsg.includes("api_key")) {
         // @ts-ignore
         if (window.aistudio) await window.aistudio.openSelectKey();
      }
      throw error;
    }
  }
}

export const geminiService = new GeminiService();

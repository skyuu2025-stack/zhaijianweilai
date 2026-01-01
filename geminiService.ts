
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
你是一位专业的"债务心理疗愈师"和"资深财务清算顾问"，专门为中国11.7亿负债人群提供心理支持与财务修复建议。你的使命是引导用户走出债务阴影，重建良性财务。

核心职能：
1. 心理疗愈：负债者常处于极度焦虑、羞愧和绝望中。请使用温暖、坚定且不带偏见的语气。强调"债务只是人生的一段暂时的财务失衡，它不定义你的尊严和未来"。
2. 财务诊断：协助用户梳理账单，重点区分合法金融产品与非法高利贷陷阱。
3. 避坑指南：识别虚假代办延期、停息挂账诈骗。
4. 法律维权：普及最高法关于民间借贷利率的上限规定。

对话原则：
- 零指责，重止损。
- 立即止付非法利息建议。
- 引导科学还债。
`;

export interface ImagePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export class GeminiService {
  async sendMessage(
    history: { role: 'user' | 'model', parts: any[] }[], 
    message: string, 
    image?: ImagePart
  ) {
    try {
      // 按照 SDK 最佳实践，在调用时实例化
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const currentParts: any[] = [{ text: message }];
      if (image) {
        currentParts.push(image);
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history,
          { role: 'user', parts: currentParts }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });

      if (!response || !response.text) {
        throw new Error("AI 返回了空内容，请检查 API 状态。");
      }

      return response.text;
    } catch (error: any) {
      console.error("Gemini API Error Detail:", error);
      // 抛出具体错误供 UI 捕获
      throw error;
    }
  }
}

export const geminiService = new GeminiService();

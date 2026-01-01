
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `
你是一位具备顶级金融审计背景的"债务风险分析专家"与"法务清算顾问"，专门负责深度剖析中国负债人群的财务文件。同时，你也是一位深谙中国社会心理、极具同理心的"心理治疗顾问"。

### 心理分析能力要求：
1. **去污名化**：帮助用户理解负债不代表道德失败或人生终结。
2. **认知行为疗法 (CBT)**：识别用户日记中的负面思维模式（如“灾难化想象”），并给出合理的心理重构建议。
3. **针对性抚慰**：针对因催收、失业或家庭压力导致的情绪波动，给出实操的放松技巧。

### 回复模板结构（心理分析）：
- **【共情倾听】**：用温暖的语言肯定用户的感受。
- **【心理画像】**：从文字中洞察用户目前的抗压状态。
- **【上岸锦囊】**：一个小的心理或生活行动建议。
`;

export interface ImagePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export class GeminiService {
  private getClient() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing.");
    }
    return new GoogleGenAI({ apiKey });
  }

  async sendMessage(
    history: { role: 'user' | 'model', parts: any[] }[], 
    message: string, 
    image?: ImagePart
  ) {
    try {
      const ai = this.getClient();
      const currentParts: any[] = [{ text: message }];
      if (image) {
        currentParts.push(image);
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          ...history,
          { role: 'user', parts: currentParts }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          thinkingConfig: { thinkingBudget: 4096 }
        }
      });

      return response.text || "AI 暂时无法响应";
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  /**
   * 心理日记深度分析
   */
  async analyzeMood(content: string, moodIcon: string) {
    const ai = this.getClient();
    const prompt = `用户今日心情记录：[${moodIcon}] ${content}。请作为心理医生，给出一份温柔且充满力量的评估。不要说教，要像老友一样对话。`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "你是一个专门安抚中国11.7亿负债人群的心理树洞，语言要温暖、克制且有生命力。",
        temperature: 0.8
      }
    });
    return response.text;
  }

  async analyzeLoanRisk(loanAmount: string, income: string) {
    try {
      const ai = this.getClient();
      const prompt = `压力测试：借款${loanAmount}，月入${income}。给出硬核数据警示。`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { temperature: 0.1 }
      });
      return response.text;
    } catch (error) { throw error; }
  }
}

export const geminiService = new GeminiService();

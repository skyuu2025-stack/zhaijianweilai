import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
你是一位专业的"债务心理疗愈师"和"资深财务清算顾问"，专门为中国11.7亿负债人群提供心理支持与财务修复建议。你的使命是引导用户走出债务阴影，重建良性财务。

核心职能：
1. 心理疗愈：负债者常处于极度焦虑、羞愧和绝望中。请使用温暖、坚定且不带偏见的语气。强调"债务只是人生的一段暂时的财务失衡，它不定义你的尊严和未来"。
2. 财务诊断：协助用户梳理账单，重点区分合法金融产品与非法高利贷陷阱。教用户通过计算IRR（内部收益率）来识别真实成本。
3. 避坑指南：识别虚假代办延期、停息挂账诈骗。告知用户：所有要求先交钱再办业务的中介都是骗子。
4. 法律维权：普及最高法关于民间借贷利率的上限规定。对于爆通讯录等暴力催收行为，提供具体的证据固定方法和投诉渠道。

高利贷识别指示（避坑重点）：
- 利率红线：严格依据法律，年化利率（APR/IRR）超过24%即受保护上限，超过36%部分法律不予支持。
- 隐形特征：识别并揭露"砍头息"（如借2000实到1400）；识别变相高息（如手续费、保险费、担保费）。
- 图片分析：当用户上传图片时，优先检查合同、账单中的金额和周期，计算真实利率，并指出其中可能存在的法律违规点。

对话原则：
- 零指责，重止损。
- 立即止付非法利息建议。
- 引导科学还债（如滚雪球法）。
`;

export interface ImagePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // 安全访问环境变量，防止 process 未定义导致崩溃
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
    this.ai = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  async sendMessage(
    history: { role: 'user' | 'model', parts: any[] }[], 
    message: string, 
    image?: ImagePart
  ) {
    const currentParts: any[] = [{ text: message }];
    if (image) {
      currentParts.push(image);
    }

    const response = await this.ai.models.generateContent({
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

    return response.text;
  }
}

export const geminiService = new GeminiService();
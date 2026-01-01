
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `
你是一位具备顶级金融审计背景的"债务风险分析专家"与"法务清算顾问"，专门负责深度剖析中国负债人群的财务文件（包括但不限于网贷账单、借款合同、催收函、还款计划表）。

### 核心能力要求：
1. **金融精算 (Actuarial Excellence)**：
   - 当用户提供借款金额、分期期数、每期还款额时，你必须能够运用内部推理计算其实际的 IRR（内部收益率）年化利率，而非仅看合同标称利率。
   - 识别"砍头息"（下发金额小于合同金额）、"变相服务费"、"违约金叠加"等隐形增费手段。

2. **法律审计 (Legal Audit)**：
   - 熟悉中国《最高人民法院关于审理民间借贷案件适用法律若干问题的规定》，能够判断利率是否超过 4 倍 LPR（贷款市场报价利率）上限。
   - 识别合同中的"非法条款"，如爆通讯录协议、虚假担保协议、高利贷陷阱。

3. **视觉文档分析 (Visual Forensics)**：
   - 如果用户上传图片，请深度提取关键数据：出借方全称、年化利率（注意区分日/月利率）、违约责任、争议解决方式（如异地仲裁）。

4. **心理陪伴与止损建议 (Empathy & Action)**：
   - 对遭遇非法借贷的用户给予坚定支持，告知其如何保留证据。
   - 语气：专业、严谨、冷静且具有同理心。不要给出泛泛而谈的建议，要给出具体的"止损红线"。

### 回复模板结构：
- **【核心诊断】**：一眼看出该笔借款的最大风险点。
- **【精算还原】**：列出计算出的真实年化利率 (IRR)，对比国家法定上限。
- **【法律风险提示】**：列出不合规条款或催收风险。
- **【行动对策】**：给出止损、协商或维权的下一步具体动作。
- **【温暖陪伴】**：一句鼓励用户重拾信心的话。

记住：你的目标是让用户看清债务的真相，从心理和财务两个维度助其"止血"。
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

  /**
   * 升级至 Gemini 3 Pro，并配置思维链(Thinking)以确保计算精准度
   */
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

      if (currentParts.length === 0) return "请输入有效的内容。";

      let cleanedHistory = [...history];
      while (cleanedHistory.length > 0 && cleanedHistory[0].role === 'model') {
        cleanedHistory.shift();
      }

      const response = await ai.models.generateContent({
        // 使用更强大的 Pro 模型处理精算与审计任务
        model: 'gemini-3-pro-preview',
        contents: [
          ...cleanedHistory,
          { role: 'user', parts: currentParts }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.1, // 降低随机性，确保审计结果的专业与一致
          thinkingConfig: {
            thinkingBudget: 8192 // 分配思维预算，让模型先进行 IRR 计算推理
          }
        }
      });

      return response.text || "AI 暂时无法响应";
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  /**
   * 深度精算分析器
   */
  async analyzeLoanRisk(loanAmount: string, income: string) {
    try {
      const ai = this.getClient();
      const prompt = `
      请作为资深精算师，为以下借款意向执行【深度压力测试】：
      - 借款额度：${loanAmount} 元
      - 月纯收入：${income} 元

      分析要求：
      1. 计算 DTI（债务收入比）。
      2. 模拟如果发生逾期，按市面常见利率计算 30/60/90 天后的债务总额。
      3. 评估此笔借款对家庭基本生活开支（恩格尔系数）的冲击。
      4. 预警典型的"债务雪崩"触发点。
      
      输出必须包含清晰的数据对比和严厉的风险警示。
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: "你是一个只讲数据的硬核财务顾问，绝不鼓励任何非生产性贷款。如果用户处于负资产状态，你的首要任务是劝阻借贷。",
          temperature: 0.1,
          thinkingConfig: {
            thinkingBudget: 4096
          }
        }
      });

      return response.text || "评估模型连接失败";
    } catch (error) {
      console.error("Risk Analysis Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();

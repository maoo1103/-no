import { GoogleGenAI, Type } from "@google/genai";
import { MealAnalysis, JournalEntry, StomachFeeling } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeFoodInput = async (input: string): Promise<MealAnalysis> => {
  if (!apiKey) {
    console.warn("No API Key found. Returning mock data.");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      items: [
        { name: "番茄炒蛋", weight_grams: 250, ingredients_breakdown: "番茄 150g, 鸡蛋 100g (约2个)" },
        { name: "米饭", weight_grams: 150, ingredients_breakdown: "熟米饭 150g" },
        { name: "清炒时蔬", weight_grams: 100, ingredients_breakdown: "青菜 100g, 蒜末 5g" }
      ],
      stomachLoadPercentage: 75,
      advice: "API Mock: 只吃番茄炒蛋有点单调哦，我帮你加了一份清炒时蔬，这样膳食纤维更充足！",
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `请分析用户输入的食物："${input}"。
      
      请完成以下任务：
      1. **识别与拆分**：如果用户输入了一个菜名（如“西红柿炒蛋”），请将其视为一道菜。如果用户输入了多个菜（如“西红柿炒蛋和牛肉粉”），请将它们分开列出。
      2. **详细拆解**：对于每一道菜，**必须**拆解出主要食材的推荐克重。例如“西红柿炒蛋”不要只给总重量，要给出“西红柿100g，鸡蛋50g”这样的细节。
      3. **营养补全**：如果用户输入的食物营养不均衡（例如只输入了“米饭”或只输入了“肉”），请**自动添加**互补的食材（如蔬菜、优质蛋白）以构成一顿健康的简餐。
      4. **饮食建议**：生成一句话的建议（advice）。
         - 如果你添加了额外的食物，必须在建议中解释原因。例如：“光吃米饭不够健康哦，增加西兰花牛肉可以更加均衡营养哦”。
         - 建议的语气要温暖、童趣、像朋友一样。
      5. **充盈度**：估算吃完这些推荐份量后，胃部的舒适充盈度（0-100%）。

      注意：不要提及具体的卡路里数字。重点是“种类均衡”和“食材细节”。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "菜品名称，如'番茄炒蛋'" },
                  ingredients_breakdown: { type: Type.STRING, description: "详细食材与克重，如'番茄 150g, 鸡蛋 100g'" },
                  weight_grams: { type: Type.NUMBER, description: "该菜品的总推荐克重" }
                }
              }
            },
            stomachLoadPercentage: { type: Type.NUMBER, description: "0-100 scale" },
            advice: { type: Type.STRING, description: "解释为什么要这样搭配，特别是如果有额外添加食物的时候" },
          },
          required: ["items", "stomachLoadPercentage", "advice"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as MealAnalysis;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw new Error("分析失败，请稍后再试");
  }
};

export const generateWeeklyReport = async (logs: JournalEntry[]): Promise<string> => {
  if (!apiKey) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `本周胃感简报\n\n本周共记录了 ${logs.length} 次用餐感受。\n\n分析发现：当你晚餐摄入大量淀粉类食物（如米饭）时，容易感到“撑到了”。而吃蔬菜和白肉时，身体反馈多为“刚好”。\n\n建议：晚餐尝试减少一口主食，增加蔬菜比例。✨`;
  }

  try {
    // Convert logs to a readable string for the prompt
    const logsText = logs.map(l => 
      `日期: ${l.date}, 食物: ${l.foodNote || '未记录'}, 感受: ${l.feeling}`
    ).join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `基于以下用户的饮食日记，生成一份周报总结。
      
      日记数据：
      ${logsText}
      
      要求：
      1. 角色设定：你是一位温柔、专业的心理咨询师。
      2. 核心原则：**极度精简**。不要废话。
      3. **核心洞察**：分析“食物”与“身体感受”的因果关系。必须引用具体食物。
      4. **建议**：只给一条建议，**不超过30个字**。
      5. 格式禁忌：
         - **严禁**使用英文翻译（例如：绝对不要写 "撑到了(Stuffed)"，只写“撑到了”）。
         - **严禁**罗嗦的铺垫。直接说重点。
         - 全文只能在结尾有一个Emoji。
      
      输出结构参考：
      本周回顾：[简短概括]
      我的发现：[食物与感受的规律]
      小建议：[30字以内的建议]`,
    });

    return response.text || "生成报告失败";
  } catch (error) {
    console.error("Report generation failed", error);
    return "抱歉，生成报告时出了点小差错，请稍后再试。";
  }
};

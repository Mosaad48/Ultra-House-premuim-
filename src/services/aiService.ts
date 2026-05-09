import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const generateStoreInsight = async (stats: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract a professional Shopify-like business summary from these stats: 
      Total Revenue: ${stats.totalRevenue}, 
      Active Orders: ${stats.activeOrders}, 
      Visits: ${stats.visits}. 
      Provide a short, punchy insight about performance and one actionable recommendation.`,
      config: {
        systemInstruction: "You are a professional ecommerce analyst sidekick for a store owner. Your tone is supportive, data-driven, and concise."
      }
    });

    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Unable to generate insights at this moment.";
  }
};

export const chatWithSidekick = async (message: string, history: any[]) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are Sidekick, an AI assistant for a store owner. You help with product descriptions, analytics summaries, and customer support strategies within the admin dashboard."
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.content }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Sidekick Chat Error:", error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
};

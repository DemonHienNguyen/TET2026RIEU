
import { GoogleGenAI, Type } from "@google/genai";
import { FortuneResult } from "../types";

// Hàm helper để tạo instance AI mới, đảm bảo luôn lấy API_KEY mới nhất từ define của Vite
const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === '' || apiKey === 'undefined') {
    throw new Error("API Key chưa được cấu hình. Vui lòng thêm biến môi trường API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

export const getFortune = async (userBirthYear: string, userQuestion: string): Promise<FortuneResult> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Tôi sinh năm ${userBirthYear}. Hãy gieo cho tôi một quẻ đầu năm Bính Ngọ 2026 về: ${userQuestion}. Hãy trả lời bằng tiếng Việt một cách trang trọng, đậm chất văn hóa Việt Nam.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Tiêu đề của quẻ xăm" },
          content: { type: Type.STRING, description: "Nội dung chi tiết của quẻ xăm" },
          luckLevel: { 
            type: Type.STRING,
            enum: ['Đại Cát', 'Trung Cát', 'Tiểu Cát', 'Bình An']
          }
        },
        required: ["title", "content", "luckLevel"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("AI không trả về nội dung.");
  return JSON.parse(text);
};

export const generateTetGreetingCard = async (description: string): Promise<string | null> => {
  const ai = getAIInstance();
  const prompt = `A beautiful high-quality digital illustration for Vietnamese Lunar New Year 2026 (Year of the Horse). Artistic, festive style with red and gold colors. Scene: ${description}. Include blossoming Peach/Apricot flowers and Tet decorations.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  const part = response.candidates?.[0]?.content.parts.find(p => p.inlineData);
  if (part?.inlineData) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  return null;
};

export const generateTetWish = async (recipient: string, style: string): Promise<string> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Viết một lời chúc Tết 2026 ngắn gọn cho ${recipient} phong cách ${style}.`
  });
  return response.text || "Chúc mừng năm mới!";
};

export const generateTetPoetry = async (theme: string, type: 'couplet' | 'poem'): Promise<string> => {
  const ai = getAIInstance();
  const prompt = type === 'couplet' 
    ? `Sáng tác cặp câu đối Tết 2026 về: ${theme}.`
    : `Viết bài thơ lục bát ngắn mừng Xuân 2026 về: ${theme}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });
  return response.text || "Vạn sự như ý";
};

export const analyzeTetFood = async (base64Image: string): Promise<string> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: "Món ăn Tết này là gì? Giải thích ý nghĩa và văn hóa bằng tiếng Việt." }
      ]
    }
  });
  return response.text || "Không thể nhận diện món ăn.";
};

export const findFlowerMarkets = async (lat: number, lng: number) => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Tìm các chợ hoa Tết hoặc địa điểm tham quan Tết gần đây.",
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: { latitude: lat, longitude: lng }
        }
      }
    },
  });
  
  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const getZodiacCompatibility = async (birthYear: string): Promise<string> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Chủ nhà sinh năm ${birthYear}, năm nay là 2026 (Bính Ngọ). Tư vấn tuổi xông đất tốt nhất (Dần, Tuất, Ngọ) ngắn gọn.`
  });
  return response.text || "Đang phân tích...";
};

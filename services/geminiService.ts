
import { GoogleGenAI, Type } from "@google/genai";
import { FortuneResult } from "../types";

// Hàm khởi tạo AI - Ưu tiên key từ hệ thống, nếu không có sẽ ném lỗi rõ ràng
const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === '' || apiKey === 'undefined') {
    throw new Error("Thiếu API_KEY. Hãy kiểm tra Environment Variables trên Vercel.");
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
  // Đối với model pro image, ta khởi tạo instance mới ngay lúc gọi để đảm bảo lấy key mới nhất
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `A breathtaking, high-quality cinematic digital art for 2026 Vietnamese Lunar New Year (Year of the Horse). Artistic style: modern mixed with traditional lacquer painting. Scene: ${description}. Vibrant red and gold theme, blooming apricot blossoms, festive atmosphere, ultra-detailed.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      }
    });

    // Lặp qua các part để tìm dữ liệu ảnh (inlineData)
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error: any) {
    console.error("Image Gen Error:", error);
    if (error.message?.includes("entity was not found")) {
      throw new Error("KEY_NOT_FOUND");
    }
    throw error;
  }
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

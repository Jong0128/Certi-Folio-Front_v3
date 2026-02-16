import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const suggestSkillsForRole = async (role: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `2025년 기준 '${role}' 역할에 필요한 상위 5가지 트렌딩 기술 스택을 한국어 또는 통용되는 영문 명칭으로 나열해주세요. 결과는 오직 스킬 이름 배열로만 반환하세요.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText) as string[];
  } catch (error) {
    console.error("Gemini API 오류:", error);
    return [];
  }
};

export const enhanceBio = async (currentBio: string, role: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `다음 자기소개를 '${role}' 포지션에 맞게 더 전문적이고 임팩트 있게 한국어로 수정해주세요. 150자 이내로 작성하세요. 원본: "${currentBio}"`,
    });
    return response.text || currentBio;
  } catch (error) {
    console.error("Bio 개선 오류:", error);
    return currentBio;
  }
};
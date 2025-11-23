import { GoogleGenAI } from "@google/genai";

// NOTE: This assumes process.env.API_KEY is available. 
// In a real frontend deployment, this should ideally be proxied through a backend to protect the key,
// or the user should enter their key (as per the "API Key Selection" guidance for Veo, but applicable here for general use).

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
};

export const analyzeSalesData = async (contextData: string, prompt: string) => {
  const client = getClient();
  if (!client) {
    return "API Key not configured. Please check environment variables.";
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an AI Sales Analyst for a Castrol Distributor. 
      Analyze the following data context and answer the user's question briefly and professionally.
      
      DATA CONTEXT:
      ${contextData}

      USER QUESTION:
      ${prompt}`,
      config: {
          systemInstruction: "Keep answers concise (under 100 words) and data-driven. Use bullet points for metrics."
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't process that request right now.";
  }
};

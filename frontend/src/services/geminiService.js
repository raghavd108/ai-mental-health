// services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

export async function fetchChatResponse(promptText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(promptText);
    const response = result.response;
    const text = await response.text();

    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

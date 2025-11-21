import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, Role } from '../types';

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Sends a message to Gemini, optionally with an image.
 * This function constructs a prompt based on the message history context,
 * though for simplicity in this "simple website", we are primarily sending the current prompt
 * with an optional image.
 */
export const sendMessageToGemini = async (
  currentText: string,
  imageBase64?: string,
  imageMimeType?: string
): Promise<string> => {
  try {
    const parts: any[] = [];

    // Add image if present
    if (imageBase64 && imageMimeType) {
      parts.push({
        inlineData: {
          mimeType: imageMimeType,
          data: imageBase64,
        },
      });
    }

    // Add text prompt
    if (currentText) {
      parts.push({
        text: currentText,
      });
    }

    // Call the model
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts
      },
      config: {
        // Optional: Set a system instruction if you want a specific persona
        systemInstruction: "You are Gemini Spark, a helpful, concise, and intelligent AI assistant.",
      }
    });

    // Extract text
    const text = response.text;
    if (!text) {
      throw new Error("No text returned from Gemini.");
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Helper to convert a File object to a Base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data-URI prefix (e.g. "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};
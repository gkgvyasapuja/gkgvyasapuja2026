"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function fixGrammar(htmlContent: string) {
  try {
    const adminPrompt = 'Correct the word, "Maharaja" or similar to "Maharaj"';

    const prompt = `
You are an expert editor. The user has provided an HTML document.
Your task is to fix spelling and grammar mistakes in the visible text while STRICTLY preserving the EXACT HTML structure, tags, classes, and newlines. 
Do not change stylistic or aesthetic tags.

CRITICAL INSTRUCTION:
When you make ANY correction, change, or modification to the text, you MUST wrap your corrected text in a span tag with the class "ai-correction" and provide specific data attributes.
Format: <span class="ai-correction" data-id="UNIQUE_ID" data-original="ORIGINAL_TEXT" data-reason="SHORT_EXPLANATION">CORRECTED_TEXT</span>
Example: If you change "Teh" to "The", output: <span class="ai-correction" data-id="change-1" data-original="Teh" data-reason="Spelling correction">The</span>

Ensure every change has a unique data-id.

Additionally, identify the primary language of the text. It should be either "Hindi" or "English".
Your response MUST be a valid JSON object with the following structure:
{
  "language": "Hindi" | "English",
  "correctedHtml": "<the complete and corrected HTML string with the span tags>"
}

Additional Custom Rules:
${adminPrompt}

Here is the HTML content to fix:
${htmlContent}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    const resultObj = JSON.parse(responseText);

    return {
      success: true,
      text: resultObj.correctedHtml,
      language: resultObj.language,
    };
  } catch (error) {
    console.error("Failed to fix grammar:", error);
    return { success: false, error: "Failed to process text with AI." };
  }
}

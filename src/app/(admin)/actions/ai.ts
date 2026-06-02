"use server";

import { GoogleGenAI } from "@google/genai";
import { formatOfferingSpellingRulesForPrompt } from "@/lib/offering-spelling-rules";
import { recordAppLog } from "@/app/(admin)/actions/logs";
import type { AppLogMetadata } from "@/lib/app-log-context";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function fixGrammar(
  htmlContent: string,
  logContext?: AppLogMetadata,
) {
  const startedAt = Date.now();
  try {
    const spellingRules = formatOfferingSpellingRulesForPrompt();

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
${spellingRules}

Here is the HTML content to fix:
${htmlContent}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    const resultObj = JSON.parse(responseText) as {
      language?: "Hindi" | "English";
      correctedHtml?: string;
    };

    const durationMs = Date.now() - startedAt;
    const correctedHtml = resultObj.correctedHtml ?? "";
    await recordAppLog({
      logType: "doc_ai_analysis",
      durationMs,
      success: true,
      metadata: {
        ...logContext,
        htmlLength: htmlContent.length,
        hasCorrections: correctedHtml.includes("ai-correction"),
        language: resultObj.language,
      },
    });

    return {
      success: true,
      text: correctedHtml,
      language: resultObj.language,
    };
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    await recordAppLog({
      logType: "doc_ai_analysis",
      durationMs,
      success: false,
      errorMessage:
        error instanceof Error ? error.message : "Failed to process text with AI.",
      metadata: {
        ...logContext,
        htmlLength: htmlContent.length,
      },
    });
    console.error("Failed to fix grammar:", error);
    return { success: false, error: "Failed to process text with AI." };
  }
}

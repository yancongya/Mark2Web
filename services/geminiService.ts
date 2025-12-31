
import { GoogleGenAI } from "@google/genai";
import { OutputFormat, GlobalSettings, GenerationConfig } from "../types";

export const constructPrompts = (
  content: string,
  config: GenerationConfig,
  settings: GlobalSettings
) => {
  // 1. Get Style Instruction from Dynamic Settings
  const selectedStyle = settings.styles.find(s => s.id === config.style);
  const styleInstruction = selectedStyle ? selectedStyle.prompt : "Clean and modern design.";

  // 2. Get Level Instruction from Dynamic Settings
  const selectedLevel = settings.levels.find(l => l.id === config.level);
  const levelInstruction = selectedLevel ? selectedLevel.prompt : "Standard layout structure.";

  // 3. Tech Stack Specifics (Hardcoded logic based on Format, but could be moved to settings too if needed)
  let techInstruction = "";
  if (config.format === OutputFormat.HTML) {
      techInstruction = "Output Format: HTML5 Single File. Styling: Tailwind CSS (CDN).";
  } else if (config.format === OutputFormat.PLAIN_HTML) {
      techInstruction = "Output Format: HTML5 Semantic Only. Styling: None (No CSS).";
  } else if (config.format === OutputFormat.TSX) {
      techInstruction = "Output Format: React (TSX) Functional Component. Styling: Tailwind CSS classes.";
  } else if (config.format === OutputFormat.VUE) {
      techInstruction = "Output Format: Vue 3 Single File Component (SFC). Styling: Tailwind CSS classes.";
  }

  // 4. Convert Temperature Number to Instruction
  const temp = config.temperature;
  let tempInstruction = "";
  if (temp <= 0.3) {
      tempInstruction = "Strict Compliance. Do not add any extra content or creative flair. Follow the structure exactly.";
  } else if (temp <= 0.7) {
      tempInstruction = "Balanced Creativity. Follow the structure but enhance visual presentation reasonably.";
  } else {
      tempInstruction = "High Creativity. You may use imagination to enhance the visual layout significantly, but keeps content accurate.";
  }

  const userPrompt = `
    Input Content:
    ---
    ${content || "[Content will be inserted here]"}
    ---

    Configuration Requirements:
    - ${techInstruction}
    - Visual Style: ${selectedStyle ? selectedStyle.label : 'Custom'} -> ${styleInstruction}
    - Refinement Level: ${selectedLevel ? selectedLevel.label : 'Custom'} -> ${levelInstruction}
    - Creativity Level (Temperature ${temp}): ${tempInstruction}
    - Custom User Instructions: ${config.customPrompt || "None"}

    Generate the complete, runnable code now according to the System Instructions.
  `;

  return {
    systemInstruction: settings.systemInstruction.trim(),
    userPrompt: userPrompt.trim()
  };
};

export const generateWebPage = async (
  content: string,
  config: GenerationConfig,
  settings: GlobalSettings,
  onStream: (chunk: string) => void
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const { systemInstruction, userPrompt } = constructPrompts(content, config, settings);

  try {
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        // Temperature is now controlled via prompt instructions for better portability
      }
    });

    let fullText = "";
    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onStream(fullText); // Notify UI of update
      }
    }
    
    // Cleanup formatting if the model accidentally added markdown blocks despite instructions
    let cleanText = fullText.trim();
    if (cleanText.startsWith("```")) {
      const lines = cleanText.split('\n');
      if (lines[0].startsWith("```")) lines.shift();
      if (lines[lines.length - 1].startsWith("```")) lines.pop();
      cleanText = lines.join('\n');
    }

    return cleanText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate web page. Please check your input and try again.");
  }
};

export const modifyElementCode = async (
  elementHtml: string,
  instruction: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    I have a specific HTML element from a webpage. I need you to modify it based on the user's instruction.
    
    Current Element HTML:
    ${elementHtml}

    Instruction:
    ${instruction}

    Requirements:
    1. Return ONLY the new HTML for this element.
    2. Do not wrap in markdown blocks.
    3. Maintain Tailwind classes unless asked to change.
    4. Ensure valid HTML.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    let result = response.text || elementHtml;
    // Cleanup markdown if present
    if (result.startsWith("```")) {
       const lines = result.split('\n');
       if (lines[0].startsWith("```")) lines.shift();
       if (lines[lines.length - 1].startsWith("```")) lines.pop();
       result = lines.join('\n');
    }
    return result.trim();
  } catch (error) {
    console.error("Gemini Element Modification Error:", error);
    throw error;
  }
}

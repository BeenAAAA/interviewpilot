import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface InterviewContext {
  resumeText: string;
  jobTitle: string;
  companyName: string;
  jobRequirements: string;
  systemPrompt: string;
}

export interface AnalysisResult {
  feedbackType?: "strength" | "mistake" | "observation";
  feedbackText?: string;
  scoreAdjustment: number;
}

export async function generateInterviewerResponse(
  context: InterviewContext,
  conversationHistory: Array<{ role: string; content: string }>,
): Promise<string> {
  const systemInstruction = `${context.systemPrompt}

INTERVIEW CONTEXT:
- Position: ${context.jobTitle} at ${context.companyName}
- Key Requirements: ${context.jobRequirements}

CANDIDATE'S RESUME:
${context.resumeText}

Your task is to conduct a professional interview. Ask relevant questions, listen to responses, and provide follow-up questions. Keep your responses concise and professional.`;

  const messages = conversationHistory.map((msg) => ({
    role: msg.role === "interviewer" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction,
      },
      contents: messages,
    });

    return response.text || "I understand. Please continue.";
  } catch (error) {
    console.error("Failed to generate response:", error);
    return "I apologize, I'm having trouble processing that. Could you please rephrase?";
  }
}

export async function analyzeResponse(
  candidateResponse: string,
  interviewContext: InterviewContext,
  conversationHistory: Array<{ role: string; content: string }>,
): Promise<AnalysisResult> {
  const systemInstruction = `You are an expert interview assessor. Analyze the response and provide feedback.

INTERVIEW CONTEXT:
- Position: ${interviewContext.jobTitle} at ${interviewContext.companyName}
- Requirements: ${interviewContext.jobRequirements}

CANDIDATE'S RESUME:
${interviewContext.resumeText}

Analyze their latest response for:
1. Technical accuracy and depth
2. Communication clarity
3. Relevant experience demonstration
4. Problem-solving approach
5. Cultural fit indicators
6. Encouragement

Provide a JSON response with:
- feedbackType: "strength", "mistake", or "observation" (or null if no specific feedback)
- feedbackText: Brief description using pronouns like "You" (or null)
- scoreAdjustment: Number between -3 and +3 to adjust overall score (start conservative, most responses should be 0 to +2)

Example feedback: (For strength) "Great! You demonstrated strong problem-solving skills in this response." or (for mistake) "Your explanation lacked technical depth in some areas. (for observation) Improve it by using [short suggestion]", or "Your writing was a little unclear, but still understandable."`;

  const conversationContext = conversationHistory
    .slice(-5)
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            feedbackType: {
              type: "string",
              enum: ["strength", "mistake", "observation"],
              nullable: true,
            },
            feedbackText: { type: "string", nullable: true },
            scoreAdjustment: { type: "number" },
          },
          required: ["scoreAdjustment"],
        },
      },
      contents: `Recent conversation:\n${conversationContext}\n\nLatest response to analyze: ${candidateResponse}`,
    });

    const rawJson = response.text;
    if (rawJson) {
      const analysis: AnalysisResult = JSON.parse(rawJson);
      return analysis;
    }
  } catch (error) {
    console.error("Failed to analyze response:", error);
  }

  return { scoreAdjustment: 0 };
}

export async function generateOpeningQuestion(context: InterviewContext): Promise<string> {
  const systemInstruction = `${context.systemPrompt}

You are starting an interview for ${context.jobTitle} at ${context.companyName}.

Generate a friendly, professional opening statement and first question. Review the candidate's resume and ask an engaging opening question that sets a positive tone.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction,
      },
      contents: `Candidate Resume:\n${context.resumeText}\n\nJob Requirements:\n${context.jobRequirements}`,
    });

    return response.text || "Hello! Thank you for joining this interview. Let's begin by discussing your background.";
  } catch (error) {
    console.error("Failed to generate opening:", error);
    return "Hello! Thank you for joining this interview. Let's begin by discussing your background.";
  }
}
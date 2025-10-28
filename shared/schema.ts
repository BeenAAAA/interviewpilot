import { z } from "zod";

// Interview Session Schema
export const interviewSessionSchema = z.object({
  id: z.string(),
  resumeText: z.string(),
  jobTitle: z.string(),
  companyName: z.string(),
  jobRequirements: z.string(),
  systemPrompt: z.string(),
  status: z.enum(["idle", "active", "paused", "completed"]),
  score: z.number().min(0).max(100),
  startedAt: z.string().optional(),
  endedAt: z.string().optional(),
});

export type InterviewSession = z.infer<typeof interviewSessionSchema>;

// Transcript Message Schema
export const transcriptMessageSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  speaker: z.enum(["interviewer", "candidate"]),
  text: z.string(),
  timestamp: z.string(),
});

export type TranscriptMessage = z.infer<typeof transcriptMessageSchema>;

// Feedback Item Schema
export const feedbackItemSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  type: z.enum(["strength", "mistake", "observation"]),
  text: z.string(),
  timestamp: z.string(),
});

export type FeedbackItem = z.infer<typeof feedbackItemSchema>;

// Insert Schemas
export const insertInterviewSessionSchema = interviewSessionSchema.omit({
  id: true,
  status: true,
  score: true,
  startedAt: true,
  endedAt: true,
});

export type InsertInterviewSession = z.infer<typeof insertInterviewSessionSchema>;

export const insertTranscriptMessageSchema = transcriptMessageSchema.omit({
  id: true,
  timestamp: true,
});

export type InsertTranscriptMessage = z.infer<typeof insertTranscriptMessageSchema>;

export const insertFeedbackItemSchema = feedbackItemSchema.omit({
  id: true,
  timestamp: true,
});

export type InsertFeedbackItem = z.infer<typeof insertFeedbackItemSchema>;

// AI Prompt Template Schema
export const promptTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  template: z.string(),
});

export type PromptTemplate = z.infer<typeof promptTemplateSchema>;

// Default system prompt for the interviewer
export const DEFAULT_SYSTEM_PROMPT = `You are an experienced technical interviewer conducting a professional job interview. Your role is to:

1. Ask relevant questions based on the candidate's resume and the job requirements
2. Listen carefully to the candidate's responses
3. Provide follow-up questions to assess depth of knowledge
4. Evaluate communication skills, technical competency, and cultural fit
5. Be professional, encouraging, and constructive

Throughout the interview, assess the candidate on:
- Technical knowledge and skills
- Communication clarity and confidence
- Problem-solving approach
- Relevant experience
- Cultural fit and enthusiasm

Provide real-time feedback on strengths, areas for improvement, and notable observations.`;

// Preset prompt templates
export const PRESET_PROMPTS: PromptTemplate[] = [
  {
    id: "technical",
    name: "Technical Interview",
    description: "Focus on technical skills and problem-solving",
    template: `You are a senior technical interviewer. Focus heavily on technical competency, problem-solving skills, and coding best practices. Ask detailed technical questions and probe deeply into the candidate's understanding of core concepts.`,
  },
  {
    id: "behavioral",
    name: "Behavioral Interview",
    description: "Focus on soft skills and past experiences",
    template: `You are an HR professional conducting a behavioral interview. Focus on the candidate's past experiences, teamwork, leadership, conflict resolution, and cultural fit. Use STAR method questions (Situation, Task, Action, Result).`,
  },
  {
    id: "friendly",
    name: "Friendly Interview",
    description: "Supportive and encouraging approach",
    template: `You are a friendly, supportive interviewer. Create a comfortable atmosphere, be encouraging, and help the candidate showcase their best qualities. Focus on building rapport while still assessing skills professionally.`,
  },
  {
    id: "challenging",
    name: "Challenging Interview",
    description: "Rigorous and demanding assessment",
    template: `You are a demanding interviewer known for thorough assessments. Ask challenging questions, probe for specifics, and don't accept vague answers. Push the candidate to demonstrate deep expertise and critical thinking.`,
  },
];

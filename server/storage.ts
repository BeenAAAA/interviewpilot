import {
  InterviewSession,
  InsertInterviewSession,
  TranscriptMessage,
  InsertTranscriptMessage,
  FeedbackItem,
  InsertFeedbackItem,
} from "@shared/schema";

export interface IStorage {
  // Interview Sessions
  createSession(data: InsertInterviewSession): Promise<InterviewSession>;
  getSession(id: string): Promise<InterviewSession | null>;
  updateSession(id: string, data: Partial<InterviewSession>): Promise<InterviewSession | null>;
  
  // Transcript Messages
  createMessage(data: InsertTranscriptMessage): Promise<TranscriptMessage>;
  getMessagesBySession(sessionId: string): Promise<TranscriptMessage[]>;
  
  // Feedback Items
  createFeedback(data: InsertFeedbackItem): Promise<FeedbackItem>;
  getFeedbackBySession(sessionId: string): Promise<FeedbackItem[]>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, InterviewSession> = new Map();
  private messages: Map<string, TranscriptMessage> = new Map();
  private feedback: Map<string, FeedbackItem> = new Map();
  private idCounter = 1;

  async createSession(data: InsertInterviewSession): Promise<InterviewSession> {
    const id = `session-${this.idCounter++}`;
    const session: InterviewSession = {
      id,
      ...data,
      status: "idle",
      score: 50, // Start at 50 (baseline)
    };
    this.sessions.set(id, session);
    return session;
  }

  async getSession(id: string): Promise<InterviewSession | null> {
    return this.sessions.get(id) || null;
  }

  async updateSession(id: string, data: Partial<InterviewSession>): Promise<InterviewSession | null> {
    const session = this.sessions.get(id);
    if (!session) return null;
    
    const updated = { ...session, ...data };
    this.sessions.set(id, updated);
    return updated;
  }

  async createMessage(data: InsertTranscriptMessage): Promise<TranscriptMessage> {
    const id = `message-${this.idCounter++}`;
    const message: TranscriptMessage = {
      id,
      ...data,
      timestamp: new Date().toISOString(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesBySession(sessionId: string): Promise<TranscriptMessage[]> {
    return Array.from(this.messages.values()).filter((msg) => msg.sessionId === sessionId);
  }

  async createFeedback(data: InsertFeedbackItem): Promise<FeedbackItem> {
    const id = `feedback-${this.idCounter++}`;
    const item: FeedbackItem = {
      id,
      ...data,
      timestamp: new Date().toISOString(),
    };
    this.feedback.set(id, item);
    return item;
  }

  async getFeedbackBySession(sessionId: string): Promise<FeedbackItem[]> {
    return Array.from(this.feedback.values()).filter((item) => item.sessionId === sessionId);
  }
}

export const storage = new MemStorage();

import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import multer from "multer";
import { storage } from "./storage";
import {
  generateOpeningQuestion,
  generateInterviewerResponse,
  analyzeResponse,
  type InterviewContext,
} from "./gemini-service";

const upload = multer({ storage: multer.memoryStorage() });

// Session management
const activeSessions = new Map<
  string,
  {
    context: InterviewContext;
    conversationHistory: Array<{ role: string; content: string }>;
    ws: WebSocket | null;
  }
>();

export async function registerRoutes(app: Express): Promise<Server> {
  // Start interview session
  app.post("/api/interview/start", async (req, res) => {
    try {
      const { resumeText, jobTitle, companyName, jobRequirements, systemPrompt } = req.body;

      if (!resumeText || !jobTitle || !companyName) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const session = await storage.createSession({
        resumeText,
        jobTitle,
        companyName,
        jobRequirements: jobRequirements || "",
        systemPrompt,
      });

      await storage.updateSession(session.id, {
        status: "active",
        startedAt: new Date().toISOString(),
      });

      const context: InterviewContext = {
        resumeText,
        jobTitle,
        companyName,
        jobRequirements,
        systemPrompt,
      };

      activeSessions.set(session.id, {
        context,
        conversationHistory: [],
        ws: null,
      });

      res.json({ sessionId: session.id });
    } catch (error) {
      console.error("Failed to start interview:", error);
      res.status(500).json({ error: "Failed to start interview" });
    }
  });

  // Stop interview
  app.post("/api/interview/:id/stop", async (req, res) => {
    try {
      const { id } = req.params;

      await storage.updateSession(id, {
        status: "completed",
        endedAt: new Date().toISOString(),
      });

      activeSessions.delete(id);

      res.json({ success: true });
    } catch (error) {
      console.error("Failed to stop interview:", error);
      res.status(500).json({ error: "Failed to stop interview" });
    }
  });

  // Pause interview
  app.post("/api/interview/:id/pause", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.updateSession(id, { status: "paused" });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to pause interview" });
    }
  });

  // Resume interview
  app.post("/api/interview/:id/resume", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.updateSession(id, { status: "active" });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to resume interview" });
    }
  });

  // Parse PDF resume
  app.post("/api/parse-resume", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      let text = "";

      if (req.file.mimetype === "application/pdf") {
        try {
          const pdfParse = (await import("pdf-parse")).default;
          const data = await pdfParse(req.file.buffer);
          text = data.text;
        } catch (pdfError) {
          console.error("PDF parsing error:", pdfError);
          return res.status(400).json({
            error: "Failed to parse PDF. Please use a .txt file instead.",
          });
        }
      } else if (req.file.mimetype === "text/plain") {
        text = req.file.buffer.toString("utf-8");
      } else {
        return res.status(400).json({
          error: "Unsupported file type. Please upload PDF or TXT.",
        });
      }

      if (!text.trim()) {
        return res.status(400).json({
          error: "No text could be extracted from the file.",
        });
      }

      res.json({ text });
    } catch (error) {
      console.error("Failed to parse resume:", error);
      res.status(500).json({ error: "Failed to parse resume" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time interview
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", async (ws: WebSocket) => {
    console.log("WebSocket client connected");

    ws.on("message", async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === "start" && message.sessionId) {
          const sessionData = activeSessions.get(message.sessionId);
          if (!sessionData) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Session not found",
              })
            );
            return;
          }

          sessionData.ws = ws;

          // Generate opening question
          const opening = await generateOpeningQuestion(sessionData.context);

          const openingMessage = await storage.createMessage({
            sessionId: message.sessionId,
            speaker: "interviewer",
            text: opening,
          });

          sessionData.conversationHistory.push({
            role: "interviewer",
            content: opening,
          });

          ws.send(
            JSON.stringify({
              type: "transcript",
              id: openingMessage.id,
              speaker: "interviewer",
              text: opening,
              timestamp: openingMessage.timestamp,
            })
          );
        }

        if (message.type === "candidate_response" && message.sessionId && message.text) {
          const sessionData = activeSessions.get(message.sessionId);
          if (!sessionData) return;

          const session = await storage.getSession(message.sessionId);
          if (!session || session.status !== "active") return;

          // Save candidate message
          const candidateMessage = await storage.createMessage({
            sessionId: message.sessionId,
            speaker: "candidate",
            text: message.text,
          });

          sessionData.conversationHistory.push({
            role: "candidate",
            content: message.text,
          });

          ws.send(
            JSON.stringify({
              type: "transcript",
              id: candidateMessage.id,
              speaker: "candidate",
              text: message.text,
              timestamp: candidateMessage.timestamp,
            })
          );

          // Analyze response
          const analysis = await analyzeResponse(
            message.text,
            sessionData.context,
            sessionData.conversationHistory
          );

          // Update score
          const newScore = Math.max(
            0,
            Math.min(100, session.score + analysis.scoreAdjustment)
          );
          await storage.updateSession(message.sessionId, { score: newScore });

          ws.send(
            JSON.stringify({
              type: "score",
              score: newScore,
            })
          );

          // Send feedback if any
          if (analysis.feedbackType && analysis.feedbackText) {
            const feedbackItem = await storage.createFeedback({
              sessionId: message.sessionId,
              type: analysis.feedbackType,
              text: analysis.feedbackText,
            });

            ws.send(
              JSON.stringify({
                type: "feedback",
                id: feedbackItem.id,
                feedbackType: analysis.feedbackType,
                text: analysis.feedbackText,
                timestamp: feedbackItem.timestamp,
              })
            );
          }

          // Generate interviewer response
          const response = await generateInterviewerResponse(
            sessionData.context,
            sessionData.conversationHistory
          );

          const interviewerMessage = await storage.createMessage({
            sessionId: message.sessionId,
            speaker: "interviewer",
            text: response,
          });

          sessionData.conversationHistory.push({
            role: "interviewer",
            content: response,
          });

          ws.send(
            JSON.stringify({
              type: "transcript",
              id: interviewerMessage.id,
              speaker: "interviewer",
              text: response,
              timestamp: interviewerMessage.timestamp,
            })
          );
        }
      } catch (error) {
        console.error("WebSocket error:", error);
        ws.send(
          JSON.stringify({
            type: "error",
            message: "An error occurred processing your message",
          })
        );
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });

  return httpServer;
}

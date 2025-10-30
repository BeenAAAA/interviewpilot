# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

InterviewPilot is an AI-powered mock interview application that provides real-time feedback and scoring. It uses Google's Gemini AI to conduct technical interviews based on uploaded resumes and job descriptions, with live transcript tracking and performance scoring.

## Development Commands

### Running the Application
- `npm run dev` - Start development server (runs both frontend and backend)
- `npm run build` - Build for production (builds both Vite frontend and esbuild backend)
- `npm start` - Start production server

### Type Checking and Database
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes (Drizzle ORM)

## Architecture

### Project Structure

```
server/
  ├── index.ts           # Express server setup, middleware, and initialization
  ├── routes.ts          # API routes and WebSocket server configuration
  ├── gemini-service.ts  # Gemini AI integration for interview logic
  ├── storage.ts         # In-memory storage implementation (IStorage interface)
  └── vite.ts           # Vite development server integration

client/src/
  ├── pages/
  │   └── interview.tsx  # Main interview page (primary UI component)
  ├── components/        # React UI components
  ├── hooks/            # Custom React hooks
  └── lib/              # Utilities and query client

shared/
  └── schema.ts         # Zod schemas and TypeScript types shared between client/server
```

### Key Architectural Patterns

**Full-Stack TypeScript**: The project uses TypeScript throughout with a monorepo structure. Types are shared via the `shared/` directory and imported using `@shared/*` path alias.

**Real-Time Communication**: WebSocket connection (`/ws` endpoint) handles bidirectional communication for the interview session. The server maintains active sessions in memory (`activeSessions` Map in routes.ts:15-23).

**AI Service Layer**: `gemini-service.ts` provides three core AI functions:
- `generateOpeningQuestion()` - Creates interview opener
- `generateInterviewerResponse()` - Generates follow-up questions
- `analyzeResponse()` - Provides feedback and score adjustments

**Session Management**: Interview sessions flow through states: `idle` → `active` → `paused` → `completed`. Each session stores context (resume, job info, prompts) and maintains conversation history for AI context.

**Storage Abstraction**: `IStorage` interface (storage.ts:10-23) enables swapping storage implementations. Currently uses in-memory `MemStorage`, but is designed to support database persistence.

### Import Paths

The project uses path aliases configured in both `tsconfig.json` and `vite.config.ts`:
- `@/*` - Client source files (`client/src/*`)
- `@shared/*` - Shared types and schemas
- `@assets/*` - Static assets in `attached_assets/`

### WebSocket Message Protocol

Client sends:
- `{ type: "start", sessionId: string }` - Initialize interview
- `{ type: "candidate_response", sessionId: string, text: string }` - Candidate answers

Server sends:
- `{ type: "transcript", id, speaker, text, timestamp }` - Conversation message
- `{ type: "feedback", id, feedbackType, text, timestamp }` - Real-time feedback
- `{ type: "score", score: number }` - Updated interview score
- `{ type: "error", message: string }` - Error notifications

### Gemini AI Integration

The application uses Google Gemini API (`@google/genai`) with two model tiers:
- `gemini-2.5-flash` - Main interviewer responses and opening questions
- `gemini-flash-lite-latest` - Response analysis and scoring (uses structured JSON output)

API key is configured via `GEMINI_API_KEY` environment variable.

### Scoring System

Interviews start at a baseline score of 50/100. The AI analyzer (`analyzeResponse()`) adjusts scores by -3 to +3 points per response based on:
- Technical accuracy and depth
- Communication clarity
- Relevant experience demonstration
- Problem-solving approach
- Cultural fit indicators

## Important Notes

- The server runs on port specified by `PORT` environment variable (default 5000)
- Development mode uses Vite dev server; production serves static files from `dist/public`
- All interview data is currently stored in-memory and will be lost on server restart
- The application expects `GEMINI_API_KEY` environment variable to be set
- PDF resume parsing uses `pdf-parse` library; TXT files are also supported
- TypeScript strict mode is enabled - ensure all types are properly defined

## UI Framework

The frontend uses:
- React 18 with TypeScript
- Tailwind CSS for styling
- Radix UI components (shadcn/ui)
- TanStack Query for data fetching
- Wouter for routing
- Framer Motion for animations

## Testing in Development

When testing the interview flow:
1. Upload a resume (PDF or TXT)
2. Fill in job title, company name, and optional job requirements
3. Optionally customize the system prompt or select a preset
4. Click "Start Interview" to begin
5. Respond to questions via text input
6. Monitor real-time score and feedback in the right panel
7. Stop interview to see final results and download transcript

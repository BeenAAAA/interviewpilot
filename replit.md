# Interview Coach - AI-Powered Mock Interview Platform

## Overview
An AI-powered mock interview application that helps users practice job interviews with real-time feedback, scoring, and performance analytics. Built with React, Express, WebSockets, and Google's Gemini AI.

## Features Implemented

### ✅ Core Functionality
- **Three-Column Dark Theme Layout**: Professional dark theme with left panel (inputs), center panel (transcript), right panel (score & feedback)
- **Resume Upload**: Support for PDF and TXT files with automatic text extraction using pdf-parse
- **Job Information Form**: Customizable job title, company name, and requirements
- **AI Prompt Customization**: Multiple preset interviewer styles (Technical, Behavioral, Friendly, Challenging) with custom prompt editing
- **Real-Time Interview**: WebSocket-based chat conversation with Gemini AI acting as interviewer
- **Live Scoring System**: Circular progress indicator (0-100 score) that updates based on response quality
- **Color-Coded Feedback**: 
  - Green checkmarks for strengths
  - Red X's for mistakes/areas to improve
  - Yellow highlights for general observations
- **Session Management**: Start, pause, resume, and end interviews
- **Transcript Download**: Export conversation history to text file

### 🎯 Technical Stack
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js, Express, WebSocket (ws library)
- **AI**: Google Gemini 2.5 Flash/Pro for interview generation and feedback analysis
- **Storage**: In-memory storage (MemStorage) for sessions, messages, and feedback

## Architecture

### Data Flow
1. User uploads resume and provides job details
2. Click "Start Interview" → Creates session, connects WebSocket
3. Gemini AI generates opening question
4. User types responses in chat input
5. Each response is analyzed by Gemini for:
   - Technical accuracy
   - Communication clarity
   - Relevant experience
   - Problem-solving approach
   - Cultural fit
6. Score adjusts (-3 to +3 per response, starting from 50 baseline)
7. Feedback items are generated and categorized
8. Conversation continues until user ends interview
9. Transcript can be downloaded for review

### WebSocket Protocol
**Client → Server:**
- `{ type: "start", sessionId: string }` - Initialize interview
- `{ type: "candidate_response", sessionId: string, text: string }` - Send response

**Server → Client:**
- `{ type: "transcript", id, speaker, text, timestamp }` - New message
- `{ type: "score", score: number }` - Updated score
- `{ type: "feedback", id, feedbackType, text, timestamp }` - New feedback item
- `{ type: "error", message: string }` - Error notification

## Key Files
- `shared/schema.ts` - Data models and types
- `client/src/pages/interview.tsx` - Main interview page with three-column layout
- `client/src/components/` - All UI components (resume-upload, job-info-form, prompt-editor, transcript-panel, feedback-panel, score-dashboard, chat-input)
- `server/routes.ts` - API endpoints and WebSocket server
- `server/gemini-service.ts` - Gemini AI integration
- `server/storage.ts` - In-memory storage interface
- `design_guidelines.md` - Dark theme specifications and UI guidelines

## Environment Variables
- `GEMINI_API_KEY` - Google Gemini API key (required)
- `SESSION_SECRET` - Session encryption secret (auto-generated)

## Testing
The application has been tested end-to-end with successful results:
- Resume upload and parsing (PDF/TXT)
- Form validation
- WebSocket connection and real-time updates
- AI question generation
- Response analysis and scoring
- Feedback categorization
- Session lifecycle (start/end/reset)
- Transcript download

## Future Enhancements
1. **Voice Conversation**: Implement real-time voice streaming with Gemini's multimodal API
2. **Persistent Storage**: Replace in-memory storage with PostgreSQL database
3. **User Accounts**: Add authentication to save interview history
4. **Analytics Dashboard**: Detailed performance metrics and progress tracking
5. **Mobile Responsive**: Optimize layout for mobile devices
6. **Interview Templates**: Pre-configured interview scenarios for different roles
7. **Video Recording**: Optional video capture for self-review

## Current Implementation Note
The application currently uses **text-based chat** for the interview conversation. While the UI includes microphone controls (as a placeholder for future voice features), the actual interview is conducted through a text input interface. This provides:
- Immediate functionality without complex audio streaming
- Better testing and debugging experience
- Foundation for future voice integration
- Full feature parity for scoring and feedback

Voice functionality can be added in a future iteration using Gemini's realtime API with audio streaming over WebSockets.

## Usage
1. Upload your resume (PDF or TXT)
2. Enter job title and company name
3. (Optional) Customize the AI interviewer's behavior
4. Click "Start Interview"
5. Respond to questions in the chat input
6. Observe real-time score and feedback
7. Click "End Interview" when done
8. Download transcript for review
9. Click "New Interview" to start fresh

## Design Philosophy
The application follows a professional, data-dense design optimized for dark mode with:
- High contrast text for readability
- Subtle animations for score updates
- Color-coded feedback for quick scanning
- Three-panel layout for comprehensive context
- Clean, minimalist interface focused on the conversation

## Credits
Built with Replit Agent using modern web technologies and AI-powered development assistance.

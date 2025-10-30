# Running InterviewPilot on Replit

This guide explains how to set up and run InterviewPilot on Replit.

## Prerequisites

You need a **Google Gemini API key** to run this application. Get one for free at:
https://aistudio.google.com/app/apikey

## Setup Instructions

### 1. Install Dependencies

The first time you run the project, you need to install npm packages:

```bash
npm install
```

### 2. Set Environment Variables

**Option A: Using Replit Secrets (Recommended)**

1. Click on the "Tools" button (wrench icon) in the left sidebar
2. Click on "Secrets"
3. Add a new secret:
   - Key: `GEMINI_API_KEY`
   - Value: Your actual Gemini API key

**Option B: Using .env file (For local development)**

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your actual API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Run the Application

Click the **Run** button at the top of Replit, or run manually:

```bash
npm run dev
```

The application will start on port 5000. Replit will automatically expose it via the web view.

## What Was Wrong?

The main issues preventing the app from running in Replit were:

1. **Missing dependencies** - `node_modules` was not installed
   - **Fixed by**: Running `npm install`

2. **No environment configuration** - Missing API key setup instructions
   - **Fixed by**: Creating `.env.example` and this setup guide

## Development Commands

- `npm run dev` - Start development server (hot reload enabled)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Run TypeScript type checking

## Troubleshooting

### "tsx: not found" error
- **Cause**: Dependencies not installed
- **Fix**: Run `npm install`

### "Failed to generate response" errors in console
- **Cause**: Invalid or missing GEMINI_API_KEY
- **Fix**: Check that your API key is correctly set in Replit Secrets or .env

### Port already in use
- **Cause**: Another instance is running
- **Fix**: Stop all running processes and restart

### WebSocket connection issues
- **Cause**: Usually related to Replit's proxy configuration
- **Fix**: This should work automatically in Replit - the server is configured to bind to 0.0.0.0:5000

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend + WebSocket server
├── shared/          # Shared types and schemas
├── .replit          # Replit configuration
├── package.json     # Dependencies and scripts
└── vite.config.ts   # Vite bundler configuration
```

## Features

- AI-powered mock interviews using Google Gemini
- Real-time feedback and scoring
- Resume upload (PDF/TXT)
- WebSocket-based live conversation
- Transcript download

For more details, see `replit.md` and `CLAUDE.md`.

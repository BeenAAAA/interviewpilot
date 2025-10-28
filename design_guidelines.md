# Design Guidelines: Live Mock Job Interview Platform

## Design Approach
**System-Based with Dark Theme Customization**
This application requires a functional, data-dense interface with real-time updates and multi-panel layouts. Drawing from productivity tools like Linear and Notion's dark modes, combined with dashboard patterns from analytics platforms, emphasizing clarity and readability in a professional interview context.

## Layout Architecture

### Three-Column Grid System (Desktop)
- **Left Panel (25%)**: Resume upload + job info inputs - fixed width, scrollable
- **Center Panel (45%)**: Live conversation transcript - primary focus area
- **Right Panel (30%)**: Score dashboard + feedback analytics - fixed width, scrollable

**Mobile**: Stack vertically - Job Info → Transcript → Feedback, with sticky score badge

### Spacing System
Use Tailwind units: **4, 6, 8, 12** for consistent rhythm
- Component padding: `p-6` to `p-8`
- Section gaps: `gap-6` or `gap-8`
- Panel margins: `space-y-6`
- Tight groupings: `gap-4`

## Typography Hierarchy

**Primary Font**: Inter (Google Fonts) - clarity at all sizes
**Monospace**: JetBrains Mono - for timestamps and technical details

**Scale**:
- Page Title: `text-2xl font-bold` (Interview Coach)
- Section Headers: `text-lg font-semibold` (Resume, Transcript, Score)
- Body Text: `text-base` (form labels, conversation text)
- Metadata: `text-sm` (timestamps, file names)
- Micro Text: `text-xs` (hints, character counts)

## Component Library

### Input Components
**File Upload Zone**
- Dashed border area with upload icon
- Drag-and-drop support with hover state indication
- File preview with name and remove button
- Accepted formats badge (PDF, TXT)

**Text Input Fields**
- Job title, company name, requirements textarea
- Label above, subtle bottom border
- Focus state with accent glow
- Character count for longer fields

**Prompt Editor**
- Expandable textarea with preset dropdown
- Save/reset controls inline
- Syntax highlighting consideration for advanced users

### Conversation Display
**Transcript Panel**
- Auto-scrolling message list
- Speaker identification (Interviewer vs. Candidate)
- Timestamp per message cluster
- Message bubbles with subtle differentiation
- Loading indicator for AI response

**Message Styling**:
- Interviewer: Align left with subtle background
- Candidate: Align right with different background shade
- Spacing: `space-y-4` between message groups

### Scoring Dashboard
**Circular Score Display**
- Large percentage (0-100) in center
- Ring progress indicator around score
- Size: 120px-160px diameter
- Animated score updates

**Feedback Lists**
Three separate sections with icons:
- ✓ **Strengths** (green accent)
- ✗ **Mistakes** (red accent)  
- ⚠ **Observations** (yellow/amber accent)

Each feedback item:
- Icon + text description
- Timestamp if applicable
- Compact card with subtle background

### Controls
**Microphone Button**
- Large circular primary action button (56px+)
- Pulsing animation when active
- Clear visual states: idle, recording, processing
- Positioned prominently below transcript or in header

**Session Controls**
- Start/Pause/End interview actions
- Clear status indicator (idle, active, paused)
- Confirmation for destructive actions

## Visual Specifications

### Dark Theme Palette
- **Background**: Deep charcoal (#0f0f0f to #1a1a1a)
- **Surface**: Elevated panels (#242424 to #2a2a2a)
- **Borders**: Subtle separation (#333333)
- **Text Primary**: High contrast white (#f5f5f5)
- **Text Secondary**: Muted gray (#a3a3a3)
- **Accent Success**: Emerald green for strengths
- **Accent Error**: Coral red for mistakes
- **Accent Warning**: Amber yellow for observations
- **Accent Primary**: Cool blue for interactive elements

### Borders & Elevation
- Panel separation: `border border-gray-800`
- Cards: `border border-gray-700 rounded-lg`
- Elevated surfaces: Subtle shadow for depth
- Input focus: Accent color border glow

## Interaction Patterns

**Real-time Updates**
- Smooth transitions for new messages
- Score increments with brief animation
- Feedback items fade in as added
- No page refresh needed

**File Handling**
- Instant preview on upload
- Progress indicator for large files
- Clear error messaging

**State Management**
- Disabled states when interview not started
- Loading states during AI processing
- Empty states with helpful guidance

## Accessibility
- High contrast text ratios (WCAG AAA where possible)
- Focus indicators on all interactive elements
- Keyboard navigation support
- Screen reader labels for icons
- Clear visual hierarchy

## Images
**No hero images** - This is a functional application, not marketing.
**Icons**: Use Heroicons (CDN) for UI elements, feedback indicators, and file type badges
**Avatars**: Optional small user avatar in transcript for visual personality

## Animation Guidelines
Use sparingly and purposefully:
- Microphone pulse during recording
- Score counter increment
- Smooth scroll for new messages
- Fade-in for new feedback items
**Avoid**: Excessive transitions, distracting movements

---

**Key Principle**: Professional interview simulation demands clarity, focus, and real-time responsiveness. The dark theme reduces eye strain during extended sessions, while the three-panel layout provides comprehensive context without overwhelming the user. Every element serves the goal of productive interview practice.
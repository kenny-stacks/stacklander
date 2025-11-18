# Stacklander - Development Guide

## Commands

- **Development**: `npm run dev` - Runs custom server.js with Socket.IO + Next.js
- **Build**: `npm run build` - Type checks and builds Next.js app
- **Production**: `npm start` - Runs production server with Socket.IO
- **Lint**: `npm run lint` - ESLint check

## Architecture

### Custom Server
- `server.js` - Custom Node.js HTTP server that integrates Socket.IO with Next.js
- Handles WebSocket connections for real-time gameplay
- Supports multiple concurrent game sessions

### Game Logic
- `lib/game-manager.ts` - In-memory game session management (Map-based)
- `lib/types.ts` - TypeScript type definitions
- `lib/questions.ts` - 20 Stacks-themed trivia questions
- `lib/socket-client.ts` - Socket.IO client singleton

### Routes
- `/` - Landing page (app/page.tsx)
- `/host` - Host interface (app/host/page.tsx)
- `/game/[sessionId]` - Participant interface (app/game/[sessionId]/page.tsx)

## WebSocket Events

### Host Events
- `create-game` - Create new session (requires password)
- `start-game` - Begin game
- `show-results` - Display results after question
- `next-question` - Advance to next question

### Player Events
- `join-game` - Join session with Stacks address
- `submit-answer` - Submit answer (only once per question)

### Broadcast Events
- `player-joined` - New player joined lobby
- `game-started` - Game beginning countdown
- `question-started` - New question available
- `results-ready` - Results + leaderboard
- `game-over` - Final leaderboard

## Scoring Algorithm
```
basePoints = 100
timeSeconds = floor(timeMs / 1000)
timeBonus = max(100 - (timeSeconds * 10), 0)
points = correct ? basePoints + timeBonus : 0
```
- Questions auto-advance after 10 seconds
- Time bonus decreases by 10 points per second
- Maximum score per question: 200 points (100 base + 100 bonus for instant answer)

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- Socket.IO 4.8 (WebSocket)
- TypeScript 5.x
- Tailwind CSS 4
- Framer Motion 12 (animations)
- canvas-confetti (celebrations)
- qrcode (session sharing)
- nanoid (session ID generation)

## State Management
- Game sessions: In-memory Map (server-side)
- Client state: React hooks (no external state library)
- Real-time sync: Socket.IO events

## Code Conventions
- Client components marked with 'use client'
- Async Socket.IO callbacks for error handling
- TypeScript strict mode enabled
- Tailwind utility classes for styling
- Framer Motion for all animations

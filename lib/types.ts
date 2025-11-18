export type GameState = 'LOBBY' | 'QUESTION' | 'RESULTS' | 'FINISHED';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

export interface Player {
  id: string;
  stacksAddress: string;
  score: number;
  answers: PlayerAnswer[];
  joinedAt: number;
}

export interface PlayerAnswer {
  questionId: string;
  answerIndex: number;
  timeMs: number;
  correct: boolean;
  pointsEarned: number;
}

export interface GameSession {
  id: string;
  hostId: string;
  players: Map<string, Player>;
  currentQuestionIndex: number;
  state: GameState;
  questions: Question[];
  questionStartTime?: number;
  createdAt: number;
}

export interface LeaderboardEntry {
  stacksAddress: string;
  score: number;
  rank: number;
}

import { GameSession, Player, Question } from './types';
import { questions } from './questions';
import { nanoid } from 'nanoid';

class GameManager {
  private sessions: Map<string, GameSession> = new Map();

  createSession(hostId: string): GameSession {
    const sessionId = nanoid(8);
    const shuffledQuestions = this.shuffleArray([...questions]);
    
    const session: GameSession = {
      id: sessionId,
      hostId,
      players: new Map(),
      currentQuestionIndex: -1,
      state: 'LOBBY',
      questions: shuffledQuestions,
      createdAt: Date.now(),
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId: string): GameSession | undefined {
    return this.sessions.get(sessionId);
  }

  addPlayer(sessionId: string, playerId: string, name: string, stacksAddress: string): Player | null {
    const session = this.sessions.get(sessionId);
    if (!session || session.state !== 'LOBBY') return null;

    const player: Player = {
      id: playerId,
      name,
      stacksAddress,
      score: 0,
      answers: [],
      joinedAt: Date.now(),
    };

    session.players.set(playerId, player);
    return player;
  }

  startGame(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || session.state !== 'LOBBY') return false;

    session.state = 'QUESTION';
    session.currentQuestionIndex = 0;
    session.questionStartTime = Date.now();
    return true;
  }

  submitAnswer(sessionId: string, playerId: string, answerIndex: number): { correct: boolean; points: number } | null {
    const session = this.sessions.get(sessionId);
    if (!session || session.state !== 'QUESTION') return null;

    const player = session.players.get(playerId);
    if (!player) return null;

    const currentQuestion = session.questions[session.currentQuestionIndex];
    const timeMs = Date.now() - (session.questionStartTime || Date.now());
    const correct = answerIndex === currentQuestion.correctAnswer;
    
    const basePoints = 100;
    const timeBonus = Math.max(100 - Math.floor(timeMs / 100), 0);
    const points = correct ? basePoints + timeBonus : 0;

    console.log(`Answer submitted: timeMs=${timeMs}, timeBonus=${timeBonus}, total points=${points}`);

    player.answers.push({
      questionId: currentQuestion.id,
      answerIndex,
      timeMs,
      correct,
      pointsEarned: points,
    });

    if (correct) {
      player.score += points;
    }

    return { correct, points };
  }

  nextQuestion(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.currentQuestionIndex++;
    
    if (session.currentQuestionIndex >= session.questions.length) {
      session.state = 'FINISHED';
      return false;
    }

    session.state = 'QUESTION';
    session.questionStartTime = Date.now();
    return true;
  }

  getLeaderboard(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return [];

    const leaderboard = Array.from(session.players.values())
      .map(player => ({
        name: player.name,
        stacksAddress: player.stacksAddress,
        score: player.score,
      }))
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    return leaderboard;
  }

  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export const gameManager = new GameManager();

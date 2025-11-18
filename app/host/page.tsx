'use client';

import { useState, useEffect } from 'react';
import { getSocket } from '@/lib/socket-client';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

type GameState = 'AUTH' | 'LOBBY' | 'COUNTDOWN' | 'QUESTION' | 'RESULTS' | 'FINISHED';

interface PlayerInfo {
  id: string;
  stacksAddress: string;
}

interface LeaderboardEntry {
  stacksAddress: string;
  score: number;
  rank: number;
}

export default function HostPage() {
  const [gameState, setGameState] = useState<GameState>('AUTH');
  const [password, setPassword] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<{ text: string; options: string[] } | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    const socket = getSocket();

    socket.on('player-joined', (data: { players: PlayerInfo[] }) => {
      setPlayers(data.players);
    });

    socket.on('question-started', (data: { questionNumber: number; question: { text: string; options: string[] } }) => {
      setQuestionNumber(data.questionNumber);
      setCurrentQuestion(data.question);
      setTimeLeft(10);
      setGameState('QUESTION');
    });

    socket.on('game-over', (data: { leaderboard: LeaderboardEntry[] }) => {
      setLeaderboard(data.leaderboard);
      setGameState('FINISHED');
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
    });

    return () => {
      socket.off('player-joined');
      socket.off('question-started');
      socket.off('game-over');
    };
  }, []);

  useEffect(() => {
    if (gameState === 'QUESTION' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft]);

  const handleCreateGame = () => {
    const socket = getSocket();
    socket.emit('create-game', { password }, (response: any) => {
      if (response.error) {
        setError(response.error);
        return;
      }
      
      setSessionId(response.sessionId);
      setGameState('LOBBY');
      
      const gameUrl = `${window.location.origin}/game/${response.sessionId}`;
      QRCode.toDataURL(gameUrl, { width: 300 }).then(setQrCodeUrl);
    });
  };

  const handleStartGame = () => {
    const socket = getSocket();
    socket.emit('start-game', { sessionId }, (response: any) => {
      if (response.error) {
        setError(response.error);
        return;
      }
    });

    socket.once('game-started', (data: { questionNumber: number; totalQuestions: number }) => {
      setTotalQuestions(data.totalQuestions);
      setGameState('COUNTDOWN');
      
      setTimeout(() => {
        setGameState('QUESTION');
      }, 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {gameState === 'AUTH' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl p-12 shadow-2xl"
            >
              <h1 className="text-5xl font-bold text-gray-800 mb-8 text-center">🎮 Stacklander Host</h1>
              <div className="space-y-6">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter host password"
                  className="w-full px-6 py-4 text-xl text-gray-900 placeholder:text-gray-500 border-4 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateGame()}
                />
                {error && <p className="text-red-500 text-center">{error}</p>}
                <button
                  onClick={handleCreateGame}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-2xl font-bold hover:scale-105 transition-transform shadow-lg"
                >
                  Create Game Session
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'LOBBY' && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-12 shadow-2xl"
            >
              <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Waiting for Players</h1>
              
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-8">
                <p className="text-center text-2xl font-mono font-bold text-purple-800 mb-4">
                  Session ID: {sessionId}
                </p>
                {qrCodeUrl && (
                  <div className="flex justify-center mb-4">
                    <img src={qrCodeUrl} alt="QR Code" className="rounded-xl shadow-lg" />
                  </div>
                )}
                <p className="text-center text-lg text-gray-600">
                  {window.location.origin}/game/{sessionId}
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Connected Players ({players.length})</h2>
                <div className="space-y-3">
                  {players.map((player, idx) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-xl font-mono text-lg text-gray-900"
                    >
                      {player.stacksAddress}
                    </motion.div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStartGame}
                disabled={players.length === 0}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-5 rounded-2xl text-2xl font-bold hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Game! 🚀
              </button>
            </motion.div>
          )}

          {gameState === 'COUNTDOWN' && (
            <motion.div
              key="countdown"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-white rounded-3xl p-20 shadow-2xl text-center"
            >
              <motion.h1
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Get Ready!
              </motion.h1>
            </motion.div>
          )}

          {gameState === 'QUESTION' && currentQuestion && (
            <motion.div
              key="question"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              className="bg-white rounded-3xl p-12 shadow-2xl"
            >
              <div className="text-center mb-8">
                <p className="text-xl text-gray-600 mb-2">Question {questionNumber} of {totalQuestions}</p>
                <h2 className="text-4xl font-bold text-gray-800 leading-tight mb-8">{currentQuestion.text}</h2>
                
                <motion.div 
                  className="text-8xl font-bold mb-4"
                  animate={{ scale: timeLeft <= 3 ? [1, 1.1, 1] : 1 }}
                  transition={{ repeat: timeLeft <= 3 ? Infinity : 0, duration: 0.5 }}
                >
                  <span className={timeLeft <= 3 ? 'text-red-500' : 'text-purple-600'}>{timeLeft}</span>
                </motion.div>
                <p className="text-xl text-gray-500">seconds remaining</p>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
                <p className="text-center text-gray-700 text-lg">Players are answering...</p>
              </div>
            </motion.div>
          )}

          {gameState === 'FINISHED' && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-3xl p-12 shadow-2xl"
            >
              <h1 className="text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-8">
                🏆 Game Over! 🏆
              </h1>

              <div className="space-y-4 mb-8">
                {leaderboard.slice(0, 3).map((entry, idx) => (
                  <motion.div
                    key={entry.stacksAddress}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.2 }}
                    className={`p-8 rounded-2xl font-bold text-2xl flex justify-between items-center ${
                      idx === 0 ? 'bg-gradient-to-r from-yellow-300 to-yellow-400 text-yellow-900 text-3xl' :
                      idx === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900' :
                      'bg-gradient-to-r from-orange-300 to-orange-400 text-orange-900'
                    }`}
                  >
                    <span>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'} {entry.stacksAddress}</span>
                    <span>{entry.score.toFixed(0)} pts</span>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-5 rounded-2xl text-2xl font-bold hover:scale-105 transition-transform shadow-lg"
              >
                Start New Game
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

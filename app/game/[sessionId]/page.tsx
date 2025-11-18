'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getSocket } from '@/lib/socket-client';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

type GameState = 'JOIN' | 'LOBBY' | 'COUNTDOWN' | 'QUESTION' | 'WAITING' | 'RESULTS' | 'FINISHED';

interface PlayerInfo {
  id: string;
  stacksAddress: string;
}

interface LeaderboardEntry {
  stacksAddress: string;
  score: number;
  rank: number;
}

export default function GamePage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [gameState, setGameState] = useState<GameState>('JOIN');
  const [stacksAddress, setStacksAddress] = useState('');
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<{ text: string; options: string[] } | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<{ correct: boolean; points: number } | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [myScore, setMyScore] = useState(0);
  const [myRank, setMyRank] = useState(0);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [potentialBonus, setPotentialBonus] = useState(100);

  useEffect(() => {
    const socket = getSocket();

    socket.on('player-joined', (data: { players: PlayerInfo[] }) => {
      setPlayers(data.players);
    });

    socket.on('game-started', () => {
      setGameState('COUNTDOWN');
      setTimeout(() => {
        setGameState('QUESTION');
      }, 2000);
    });

    socket.on('question-started', (data: { questionNumber: number; question: { text: string; options: string[] } }) => {
      setQuestionNumber(data.questionNumber);
      setCurrentQuestion(data.question);
      setSelectedAnswer(null);
      setAnswerResult(null);
      setTimeLeft(10);
      setPotentialBonus(100);
      setGameState('QUESTION');
    });

    socket.on('game-over', (data: { leaderboard: LeaderboardEntry[] }) => {
      setLeaderboard(data.leaderboard);
      const myEntry = data.leaderboard.find(entry => entry.stacksAddress === stacksAddress);
      if (myEntry) {
        setMyScore(myEntry.score);
        setMyRank(myEntry.rank);
        
        if (myEntry.rank === 1) {
          confetti({
            particleCount: 300,
            spread: 150,
            origin: { y: 0.6 }
          });
        }
      }
      setGameState('FINISHED');
    });

    return () => {
      socket.off('player-joined');
      socket.off('game-started');
      socket.off('question-started');
      socket.off('game-over');
    };
  }, [stacksAddress]);

  useEffect(() => {
    if (gameState === 'QUESTION' && timeLeft > 0 && selectedAnswer === null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setPotentialBonus(Math.max(100 - ((10 - newTime) * 10), 0));
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft, selectedAnswer]);

  const handleJoinGame = () => {
    if (!stacksAddress.trim()) {
      setError('Please enter your Stacks address');
      return;
    }

    const socket = getSocket();
    socket.emit('join-game', { sessionId, stacksAddress }, (response: any) => {
      if (response.error) {
        setError(response.error);
        return;
      }
      
      setGameState('LOBBY');
    });
  };

  const handleAnswerClick = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    
    const socket = getSocket();
    socket.emit('submit-answer', { sessionId, answerIndex }, (response: any) => {
      if (response.error) {
        setError(response.error);
        return;
      }
      
      setAnswerResult({
        correct: response.correct,
        points: response.points,
      });
      
      if (response.correct) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
      
      setGameState('WAITING');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 p-4">
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {gameState === 'JOIN' && (
            <motion.div
              key="join"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 shadow-2xl mt-8"
            >
              <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Join Stacklander! 🎮</h1>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={stacksAddress}
                  onChange={(e) => setStacksAddress(e.target.value)}
                  placeholder="Enter your Stacks address"
                  className="w-full px-4 py-3 text-lg text-gray-900 placeholder:text-gray-500 border-4 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleJoinGame()}
                />
                {error && <p className="text-red-500 text-center">{error}</p>}
                <button
                  onClick={handleJoinGame}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl text-xl font-bold hover:scale-105 transition-transform shadow-lg"
                >
                  Join Game
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'LOBBY' && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl p-8 shadow-2xl mt-8"
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Waiting for Game to Start...</h1>
              
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-700 mb-3">Players in Lobby ({players.length})</h2>
                <div className="space-y-2">
                  {players.map((player, idx) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-3 rounded-xl font-mono text-gray-900 ${
                        player.stacksAddress === stacksAddress
                          ? 'bg-gradient-to-r from-purple-200 to-pink-200 font-bold'
                          : 'bg-gray-100'
                      }`}
                    >
                      {player.stacksAddress}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'COUNTDOWN' && (
            <motion.div
              key="countdown"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-white rounded-3xl p-20 shadow-2xl mt-8 text-center"
            >
              <motion.h1
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
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
              className="bg-white rounded-3xl p-8 shadow-2xl mt-8"
            >
              <div className="text-center mb-6">
                <p className="text-lg text-gray-600 mb-2">Question {questionNumber}</p>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentQuestion.text}</h2>
                
                {selectedAnswer === null && (
                  <motion.div 
                    className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 mb-4"
                    animate={{ scale: timeLeft <= 3 ? [1, 1.05, 1] : 1 }}
                    transition={{ repeat: timeLeft <= 3 ? Infinity : 0, duration: 0.5 }}
                  >
                    <p className="text-sm text-gray-600 mb-1">Time Bonus</p>
                    <p className={`text-5xl font-bold ${timeLeft <= 3 ? 'text-red-500' : 'text-purple-600'}`}>
                      +{potentialBonus}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{timeLeft}s remaining</p>
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerClick(idx)}
                    disabled={selectedAnswer !== null}
                    className={`p-6 rounded-2xl text-left font-bold text-lg transition-all ${
                      selectedAnswer === idx
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 text-gray-900'
                    } disabled:cursor-not-allowed`}
                  >
                    <span className="text-2xl mr-3">{String.fromCharCode(65 + idx)}</span>
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === 'WAITING' && answerResult && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 shadow-2xl mt-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`text-6xl mb-4`}
              >
                {answerResult.correct ? '✅' : '❌'}
              </motion.div>
              <h2 className={`text-3xl font-bold mb-4 ${answerResult.correct ? 'text-green-600' : 'text-red-600'}`}>
                {answerResult.correct ? 'Correct!' : 'Incorrect'}
              </h2>
              {answerResult.correct && (
                <p className="text-2xl text-gray-700">+{answerResult.points.toFixed(0)} points</p>
              )}
              <p className="text-gray-500 mt-6">Next question coming up...</p>
            </motion.div>
          )}

          {gameState === 'FINISHED' && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-3xl p-8 shadow-2xl mt-8"
            >
              <h1 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
                {myRank === 1 ? '🏆 You Won! 🏆' : 'Game Over!'}
              </h1>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6">
                <p className="text-xl text-gray-700">Final Score: <span className="font-bold text-3xl">{myScore.toFixed(0)}</span></p>
                <p className="text-xl text-gray-700">Final Rank: <span className="font-bold text-3xl">#{myRank}</span></p>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-700 mb-3">Final Leaderboard</h2>
                {leaderboard.slice(0, 5).map((entry, idx) => (
                  <motion.div
                    key={entry.stacksAddress}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-4 rounded-xl flex justify-between items-center text-gray-900 ${
                      entry.stacksAddress === stacksAddress
                        ? 'bg-gradient-to-r from-purple-200 to-pink-200 font-bold'
                        : idx === 0 ? 'bg-gradient-to-r from-yellow-200 to-yellow-300' :
                        idx === 1 ? 'bg-gradient-to-r from-gray-200 to-gray-300' :
                        idx === 2 ? 'bg-gradient-to-r from-orange-200 to-orange-300' :
                        'bg-gray-100'
                    }`}
                  >
                    <span className="font-mono">#{entry.rank} {entry.stacksAddress}</span>
                    <span className="font-bold">{entry.score.toFixed(0)}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

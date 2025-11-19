'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full"
      >
        <div className="bg-white rounded-3xl p-12 shadow-2xl text-center">
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6"
          >
            ⚔️ Stacklander
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 mb-2"
          >
            There Can Be Only One!
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <Link href="/host">
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-5 rounded-2xl text-2xl font-bold hover:scale-105 transition-transform shadow-lg">
                🎤 Host a Game
              </button>
            </Link>

            <div className="text-gray-500">
              <p>or join a game using a session link</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 pt-8 border-t-2 border-gray-200"
          >
            <h3 className="text-lg font-bold text-gray-700 mb-3">How to Play:</h3>
            <div className="text-left space-y-2 text-gray-600">
              <p>1. Host creates a game session and shares the QR code</p>
              <p>2. Players scan QR code and enter their Stacks address</p>
              <p>3. Host starts the game when everyone is ready</p>
              <p>4. Answer 10 questions as fast as you can!</p>
              <p>5. Faster correct answers = more points</p>
              <p>6. See who wins on the final leaderboard 🏆</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

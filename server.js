const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { gameManager } = require('./lib/game-manager.ts');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  const advanceToNextQuestion = (sessionId) => {
    const session = gameManager.getSession(sessionId);
    if (!session) {
      console.log('Session not found:', sessionId);
      return;
    }

    console.log(`Advancing from question ${session.currentQuestionIndex + 1}`);
    const hasNext = gameManager.nextQuestion(sessionId);
    
    if (!hasNext) {
      console.log('Game finished, showing leaderboard');
      const leaderboard = gameManager.getLeaderboard(sessionId);
      io.to(`game-${sessionId}`).emit('game-over', { leaderboard });
      return;
    }

    const currentQuestion = session.questions[session.currentQuestionIndex];
    const questionNumber = session.currentQuestionIndex + 1;

    console.log(`Starting question ${questionNumber}`);
    io.to(`game-${sessionId}`).emit('question-started', {
      questionNumber,
      question: {
        text: currentQuestion.text,
        options: currentQuestion.options,
      },
    });

    // Auto-advance after 10 seconds
    setTimeout(() => {
      advanceToNextQuestion(sessionId);
    }, 10000);
  };

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('create-game', (data, callback) => {
      const { password } = data;
      const adminPassword = process.env.ADMIN_PASSWORD || 'stacks123';
      
      if (password !== adminPassword) {
        callback({ error: 'Invalid password' });
        return;
      }

      const session = gameManager.createSession(socket.id);
      socket.join(`game-${session.id}`);
      
      callback({ sessionId: session.id });
    });

    socket.on('join-game', (data, callback) => {
      const { sessionId, name, stacksAddress } = data;
      
      const session = gameManager.getSession(sessionId);
      if (!session) {
        callback({ error: 'Game not found' });
        return;
      }

      if (session.state !== 'LOBBY') {
        callback({ error: 'Game already started' });
        return;
      }

      const player = gameManager.addPlayer(sessionId, socket.id, name, stacksAddress);
      if (!player) {
        callback({ error: 'Could not join game' });
        return;
      }

      socket.join(`game-${sessionId}`);
      
      const players = Array.from(session.players.values()).map(p => ({
        id: p.id,
        name: p.name,
        stacksAddress: p.stacksAddress,
      }));

      io.to(`game-${sessionId}`).emit('player-joined', { 
        players,
        newPlayer: {
          id: player.id,
          name: player.name,
          stacksAddress: player.stacksAddress,
        }
      });

      callback({ success: true, playerId: socket.id });
    });

    socket.on('start-game', (data, callback) => {
      const { sessionId } = data;
      const session = gameManager.getSession(sessionId);
      
      if (!session || session.hostId !== socket.id) {
        callback({ error: 'Unauthorized' });
        return;
      }

      const success = gameManager.startGame(sessionId);
      if (!success) {
        callback({ error: 'Could not start game' });
        return;
      }

      const currentQuestion = session.questions[0];
      
      io.to(`game-${sessionId}`).emit('game-started', {
        questionNumber: 1,
        totalQuestions: session.questions.length,
      });

      setTimeout(() => {
        io.to(`game-${sessionId}`).emit('question-started', {
          questionNumber: 1,
          question: {
            text: currentQuestion.text,
            options: currentQuestion.options,
          },
        });

        // Auto-advance after 10 seconds
        setTimeout(() => {
          advanceToNextQuestion(sessionId);
        }, 10000);
      }, 2000);

      callback({ success: true });
    });

    socket.on('submit-answer', (data, callback) => {
      const { sessionId, answerIndex } = data;
      
      const result = gameManager.submitAnswer(sessionId, socket.id, answerIndex);
      if (!result) {
        callback({ error: 'Could not submit answer' });
        return;
      }

      callback({ 
        correct: result.correct, 
        points: result.points 
      });
    });



    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.IO server running`);
    });
});

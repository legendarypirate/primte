const { Server } = require('socket.io');
const { Match } = require('./models');
const { getLeaderboardForMatch, getLeaderboardForCompetition } = require('./services/liveLeaderboard');

let io = null;

function attachRealtime(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: true, credentials: true },
    path: '/socket.io',
  });

  io.on('connection', (socket) => {
    socket.on('join_competition', async (competitionId) => {
      if (!competitionId) return;
      const room = `comp:${competitionId}`;
      socket.join(room);
      try {
        socket.emit('leaderboard', await getLeaderboardForCompetition(competitionId));
      } catch (err) {
        console.error('leaderboard join failed', err);
      }
    });

    socket.on('leave_competition', (competitionId) => {
      if (competitionId) socket.leave(`comp:${competitionId}`);
    });
  });

  return io;
}

async function broadcastLeaderboard(matchId) {
  if (!io || !matchId) return;
  try {
    const match = await Match.findByPk(matchId);
    if (!match) return;
    const payload = await getLeaderboardForMatch(matchId, match.competitionId);
    io.to(`comp:${match.competitionId}`).emit('leaderboard', payload);
    io.to(`match:${matchId}`).emit('leaderboard', payload);
  } catch (err) {
    console.error('leaderboard broadcast failed', err);
  }
}

module.exports = { attachRealtime, broadcastLeaderboard };

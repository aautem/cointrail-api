function configure(http) {
  const io = require('socket.io')(http, { pingInterval: 10000, pingTimeout: 15000 });
  const Series = require('./series');
  const Game = require('./game');
  const online = {};
  const waitingRoom = [];

  // WHERE ARE INDIVIDUAL GAME STATS BEING ADDED TO THE SERIES STATS???
  // SHOULD BE SERVER SIDE WHEN GAME IS SET TO GAMEOVER

  // SERVER SHOULD SEND BACK FINISHED GAMES WITH NEXT GAME INITIALIZED

  io.on('connection', (socket) => {
    console.log('\x1b[32m', 'New player connected:', user.username);

    // Request user info and add to online list
    socket.emit('user-request', socket.id, (user) => {
      socket.username = user.username;
      online[user.username] = user;
    });

    // Update series object
    socket.on('start-next-game', (series, respond) => {
      const updatedSeries = new Series(series);
      respond(updatedSeries);
    });

    // Join game or add to waiting room
    socket.on('join-game', (userData, respond) => {
      // check waiting room for other player
      console.log('\x1b[35m', 'Request to join game:', userData.username);

      // userData EXAMPLE:
      // {id: 'LxKOP7TqMVBDUzimAAAA',
      // username: 'aautem',
      // avatarUrl: 'https://s.gravatar.com,
      // inGame: false,
      // settings: {
      //   boardSize: 4,
      //   seriesLength: 7,
      //   timeLimit: false,
      //   color: '#71CFEE',
      //   altColor: '#71CFEE'}}

      if (!waitingRoom.length) {
        waitingRoom.push(userData);
        respond('waiting');
      } else {
        const player1 = waitingRoom.pop();
        const player2 = userData;
        player1.inGame = true;
        player2.inGame = true;

        // user player1 game settings
        const series = new Series({
          seriesLength: player1.settings.seriesLength,
          boardSize: player1.settings.boardSize,
          timeLimit: player1.settings.timeLimit,
        });
        series.initializeSeries(player1, player2);

        // emit to players
        io.to(player1.id).to(player2.id).emit('series-created', series);
        respond('series created');
      }
    });

    socket.on('join-room', (roomName) => {
      console.log('\x1b[34m', 'Joining room:', socket.username, '>>>', roomName);
      socket.join(roomName);
    });

    socket.on('game-request-timeout', (id) => {
      console.log('\x1b[31m', 'Game request timeout:', id);
      if (waitingRoom.length === 1 && waitingRoom[0].id === id) {
        waitingRoom.pop();
      }
    });

    socket.on('cancel-game', (username) => {
      console.log('\x1b[31m', 'Game request cancelled:', username);
      if (waitingRoom.length === 1 && waitingRoom[0].username === username) {
        waitingRoom.pop();
      }
    });

    socket.on('drop-coin', (data) => {
      console.log('\x1b[34m', 'Coin dropped by', data.game.turn);
      const game = new Game(data.game);
      game.dropCoin(game.turn, data.colId);
      // emit updated game to room
      io.to(game.roomName).emit('game-update', game);
    });

    socket.on('disconnecting', (reason) => {
      console.log('\x1b[31m', 'Player disconnected:', socket.username, reason);
      delete online[socket.username];
    });
  });
};

// FgBlack = '\x1b[30m'
// FgRed = '\x1b[31m'
// FgGreen = '\x1b[32m'
// FgYellow = '\x1b[33m'
// FgBlue = '\x1b[34m'
// FgMagenta = '\x1b[35m'
// FgCyan = '\x1b[36m'
// FgWhite = '\x1b[37m'

module.exports = { configure: configure };
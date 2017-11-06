function configure(http) {
  const io = require('socket.io')(http, { pingInterval: 10000, pingTimeout: 15000 });
  const Series = require('./series');
  const online = {};
  const waitingRoom = [];

  io.on('connection', (socket) => {
    console.log('*** WAITING ROOM ***', waitingRoom);

    // Request user info and add to online list
    socket.emit('user-request', socket.id, (user) => {
      socket.username = user.username;
      online[user.username] = user;
      console.log('*** USER CONNECTED ***', online);
    });

    // Join game or add to waiting room
    socket.on('join-game', (userData, respond) => {
      // check waiting room for other player
      console.log('*** JOIN GAME REQUEST ***', userData);
      console.log('*** WAITING ROOM ***', waitingRoom);

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
        console.log('*** WAITING ROOM ***', waitingRoom);
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
        io.to(player2.id).emit('series-created', series, (ack) => {
          console.log('*** SERIES CREATED ACK ***', ack);
        });
        io.to(player1.id).emit('series-created', series, (ack) => {
          console.log('*** SERIES CREATED ACK ***', ack);
        });
      }
    });

    socket.on('game-request-timeout', (id) => {
      if (waitingRoom.length === 1 && waitingRoom[0].id === id) {
        const player = waitingRoom.pop();
      }
    });

    socket.on('drop-coin', (data) => {
      console.log('*** DROP COIN ***', data.game, data.colId);

      const game = Object.assign({}, data.game);
      game.dropCoin(game.turn, data.colId);

      // emit updated game to room
      io.to(game.roomName).emit('game-update', game, (ack) => {
        console.log('*** GAME UPDATE ACK ***', ack);
      });
    });

    // Inconsistent event firing on quick app restarts
    // Possibly set up polling if this causes problems
    socket.on('disconnecting', (reason) => {
      // delete online[socket.username];
      console.log(`*** ${socket.username} DISCONNECTED ***`, reason);
    });
  });
};

module.exports = { configure: configure };
function configure(http) {
  const io = require('socket.io')(http);
  const Series = require('./utilities/series');
  const online = {};
  const waitingRoom = [];

  io.on('connection', (socket) => {

    // Request user info and add to online list
    socket.emit('user-request', socket.id, (user) => {
      socket.username = user.username;
      online[user.username] = user;
      console.log('*** USER CONNECTED ***', online);
    });

    socket.on('game-request-timeout', (id, ack) => {
      if (waitingRoom.length === 1 && waitingRoom[0].id === id) {
        const player = waitingRoom.pop();
        ack(`${player.username}: game request timeout.`);
      }
    });

    socet.on('drop-coin', (data, ack) => {
      console.log('*** DROP COIN ***', data.game, data.colId);

      const game = Object.assign({}, data.game);
      game.dropCoin(game.turn, data.colId);

      // emit updated game to room
      io.to(game.roomName).emit('game-update', game, (ack) => {
        console.log('*** GAME UPDATE ACK ***', ack);
      });

      ack(200);
    });

    // Handle game request from client
    socket.on('join-game', (userData, respond) => {
      // check waiting room for other player
      console.log('*** JOIN GAME REQ ***', userData);

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
        socket.join(series.roomName);
        // LEAVE ROOM WHEN GAME OVER

        // emit to player waiting
        io.to(player2.id).emit('series-created', series, (ack) => {
          console.log('*** SERIES CREATED ACK ***', ack);
        });
        respond(series);
      }

      console.log('*** WAITING ROOM ***', waitingRoom);
      console.log(`*** ${socket.username} ROOMS ***`, socket.rooms);
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
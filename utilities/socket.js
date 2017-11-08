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

    // Request user info and add to online list
    socket.emit('user-request', socket.id, (user) => {
      socket.username = user.username;
      online[user.username] = user;
      console.log('New player connected:'.green, user.username);
    });

    // Join game or add to waiting room
    socket.on('join-game', (userData, respond) => {
      // check waiting room for other player
      console.log('*** JOIN GAME REQUEST ***', userData.username);
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
        io.to(player1.id).to(player2.id).emit('series-created', series);
        respond('series created');
      }
    });

    socket.on('join-room', (roomName) => {
      console.log('*** JOINING ROOM ***', roomName);
      socket.join(roomName);
    });

    socket.on('game-request-timeout', (id) => {
      console.log('*** GAME REQUEST TIMEOUT ***', id);
      if (waitingRoom.length === 1 && waitingRoom[0].id === id) {
        waitingRoom.pop();
      }
    });

    socket.on('cancel-game', (username) => {
      console.log('*** GAME REQUEST CANCELLATION ***', username);
      if (waitingRoom.length === 1 && waitingRoom[0].username === username) {
        waitingRoom.pop();
      }
    });

    socket.on('drop-coin', (data) => {
      console.log('*** DROP COIN ***', data.game, data.colId);
      const game = new Game(data.game);
      game.dropCoin(game.turn, data.colId);

      // emit updated game to room
      io.to(game.roomName).emit('game-update', game);
    });

    socket.on('disconnecting', (reason) => {
      console.log('Player disconnected:'.red, socket.username, reason);
      delete online[socket.username];
    });
  });
};

module.exports = { configure: configure };
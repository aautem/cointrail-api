function configure(http) {
  const io = require('socket.io')(http, { pingInterval: 10000, pingTimeout: 20000 });
  const Series = require('./series');
  const Game = require('./game');
  const online = {};
  let playerWaiting = null;

  // WHERE ARE INDIVIDUAL GAME STATS BEING ADDED TO THE SERIES STATS???
  // SHOULD BE SERVER SIDE WHEN GAME IS SET TO GAMEOVER

  // SERVER SHOULD SEND BACK FINISHED GAMES WITH NEXT GAME INITIALIZED

  // add sockets back into rooms if they got disconnected and are reconnecting

  io.on('connection', (socket) => {
    console.log('\x1b[32m', 'New player connected:', socket.id);

    // Request user info and add to online list
    socket.emit('user-request', socket.id, (user) => {
      socket.username = user.username;
      online[user.username] = user;
    });

    // Join game or add to waiting room
    socket.on('join-game', (player) => {
      // check waiting room for other player
      console.log('\x1b[34m', 'Request to join game:', player.username);

      // id: 'LxKOP7TqMVBDUzimAAAA',
      // username: 'aautem',
      // avatarUrl: 'https://s.gravatar.com,
      // inGame: false,
      // settings:
      //   boardSize: 4,
      //   seriesLength: 7,
      //   timeLimit: false,
      //   color: '#71CFEE',
      //   altColor: '#71CFEE'

      if (!playerWaiting) {
        playerWaiting = player;
      } else {
        const player1 = playerWaiting;
        const player2 = player;
        playerWaiting = null;

        player1.inGame = true;
        player2.inGame = true;

        const players = {
          p1: player1,
          p2: player2,
        };

        // emit to players
        io.to(player1.id).to(player2.id).emit('game-joined', players);
      }
    });

    // Update series object
    // socket.on('start-next-game', (series, respond) => {
    //   const updatedSeries = new Series(series);
    //   respond(updatedSeries);
    // });

    socket.on('join-room', (roomname) => {
      console.log('\x1b[34m', 'Joining room:', socket.username, '>>>', roomname);
      socket.join(roomname);
    });

    socket.on('cancel-game-request', (username) => {
      console.log('\x1b[31m', 'Game request cancelled:', username);
      if (playerWaiting.username === username) {
        playerWaiting = null;
      }
    });

    socket.on('drop-coin', (game) => {
      console.log('\x1b[34m', 'Coin dropped in', game.roomName);

      // emit updated game to room
      io.to(game.roomName).emit('game-update', game);
    });

    socket.on('disconnecting', (reason) => {
      console.log('\x1b[31m', 'Player disconnected:', socket.username, reason);
      delete online[socket.username];
    });
  });
};

module.exports = { configure: configure };
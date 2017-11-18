function configure(http) {
  const io = require('socket.io')(http, { pingInterval: 10000, pingTimeout: 20000 });
  let playersOnline = [];
  let playerWaiting = null;

  // Add sockets back into rooms if they get disconnected while playing and reconnect

  io.on('connection', (socket) => {
    console.log('\x1b[32m', 'New player connected:', socket.id);

    // Request user info and add to socket
    socket.emit('user-request', socket.id, (user) => {

      // username
      // auth0Id
      // socketId
      // avatarUrl
      // online

      socket.username = user.username;
      socket.auth0Id = user.auth0Id;
      socket.avatarUrl = user.avatarUrl;

      playersOnline.push(user.username);

      // TODO: Broadcast object with online array + connected: <username> OR disconnected: <username>

      socket.broadcast.emit('online-players-update', playersOnline);
      // Emit event to self
      socket.emit('online-players-update', playersOnline);

      console.log('\x1b[32m', 'Online Players:', playersOnline);
    });

    // Join game or add to waiting room
    socket.on('join-game', (player) => {

      console.log('\x1b[34m', 'Request to join game:', player.username);

      // socketId
      // username
      // avatarUrl
      // settings
      //   boardSize
      //   timeLimit
      //   color
      //   altColor

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
        io.to(player1.socketId).to(player2.socketId).emit('game-joined', players);
      }
    });

    // Request to start game with friend
    socket.on('setup-game', (players) => {

      console.log('\x1b[34m', 'Request to create game:', players.p1.username, 'vs.', players.p2.username);

      // p1: player requesting game
      // p2: player being requested

      io.to(players.p2.socketId).emit('friend-game-request', players.p1.username, (response) => {
        if (response === 'N') {
          // request declined
        } else if (response === 'Y') {
          // request accepted, start game
          players.p1.inGame = true;
          players.p2.inGame = true;

          // emit to players
          io.to(players.p1.socketId).to(players.p2.socketId).emit('game-joined', players);
        }
      });
    });

    socket.on('join-room', (roomname) => {
      console.log('\x1b[34m', 'Joining room:', socket.username, '>>>', roomname);

      socket.join(roomname);
    });

    socket.on('cancel-game-request', (username) => {
      console.log('\x1b[31m', 'Game request cancelled:', username);

      if (playerWaiting && playerWaiting.username === username) {
        playerWaiting = null;
      }
    });

    socket.on('drop-coin', (game) => {
      console.log('\x1b[34m', 'Coin dropped in', game.roomName);

      // emit updated game to room
      io.to(game.roomName).emit('game-update', game);
    });

    socket.on('end-game', (roomName) => {
      console.log('\x1b[34m', 'Game ended: ', roomName);

      socket.leave(roomName);
      socket.inGame = false;

      // let other player know game is over
      io.to(roomName).emit('game-over', socket.username);
    });

    socket.on('online-request', (username, respond) => {
      console.log('\x1b[34m', username, 'requesting online players');
      respond(playersOnline);
    });

    socket.on('disconnecting', (reason) => {
      console.log('\x1b[31m', socket.username, 'disconnected:', reason);

      playersOnline = playersOnline.filter((username) => {
        return username !== socket.username;
      });

      socket.broadcast.emit('online-players-update', playersOnline);

      console.log('\x1b[32m', 'Online Players:', playersOnline);
    });
  });
};

module.exports = { configure: configure };
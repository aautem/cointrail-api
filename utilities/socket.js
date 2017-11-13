function configure(http) {
  const io = require('socket.io')(http, { pingInterval: 10000, pingTimeout: 20000 });
  let playerWaiting = null;

  // add sockets back into rooms if they get disconnected while playing and reconnect

  io.on('connection', (socket) => {
    console.log('\x1b[32m', 'New player connected:', socket.id);

    // Request user info and add to socket
    socket.emit('user-request', socket.id, (user) => {
      socket.username = user.username;
      socket.inGame = false;

      let playersOnline = [];
      let onlineSockets = io.sockets.sockets;
      for (let id in onlineSockets) {
        playersOnline.push(onlineSockets[id].username);
      }
      socket.broadcast.emit('online-players-update', playersOnline);
      socket.emit('online-players-update', playersOnline);

      console.log('\x1b[32m', 'Online Players:', playersOnline);
    });

    // Join game or add to waiting room
    socket.on('join-game', (player) => {

      console.log('\x1b[34m', 'Request to join game:', player.username);

      // id: 'LxKOP7TqMVBDUzimAAAA',
      // username: 'aautem',
      // avatarUrl: 'https://s.gravatar.com,
      // inGame: false,
      // settings:
      //   boardSize: 4,
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

      // let other play know game is over
      io.to(roomName).emit('game-over', socket.username);
    });

    socket.on('disconnecting', (reason) => {
      console.log('\x1b[31m', 'Player disconnected:', socket.username, reason);

      const playersOnline = [];
      let onlineSockets = io.sockets.sockets;
      for (let id in onlineSockets) {
        if (onlineSockets[id].id !== socket.id) {
          playersOnline.push(onlineSockets[id].username);
        }
      }
      socket.broadcast.emit('online-players-update', playersOnline);

      console.log('\x1b[32m', 'Online Players:', playersOnline);
    });
  });
};

module.exports = { configure: configure };
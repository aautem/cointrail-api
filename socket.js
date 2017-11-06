function configure(http) {
  const io = require('socket.io')(http);
  const online = {};
  const waitingRoom = [];

  io.on('connection', (socket) => {

    // Request user info and add to online list
    socket.emit('user-request', socket.id, (user) => {
      socket.username = user.username;
      online[user.username] = user;
      console.log('*** USER CONNECTED ***', online);
    });

    // Handle game request from client
    socket.on('join-game', (userData, cb) => {
      // check waiting room for other player
      console.log('*** JOIN GAME REQ ***', userData, typeof userData);

      if (!waitingRoom.length) {
        waitingRoom.push(userData);
        cb('waiting');
      } else {
        cb('connected');
      }

      console.log('*** WAITING ROOM ***', waitingRoom);
      console.log('*** OTHER ROOMS ***', socket.rooms);
    });

    // Inconsistent event firing on quick app restarts
    // Possibly set up polling if this causes problems
    socket.on('disconnecting', (reason) => {
      // delete online[socket.username];
      console.log('*** USER DISCONNECTED ***', online);
    });
  });
};

module.exports = { configure: configure };
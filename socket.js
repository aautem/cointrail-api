const io = require('socket.io')(http);
const online = {};

// Socket.IO configuration
io.on('connection', function(socket){
  // Request user info and add to online list
  socket.emit('user-request', socket.id, (user) => {
    socket.username = user.username;
    online[user.username] = user;
    console.log('*** USER CONNECTED ***', online);
  });

  // Inconsistent event firing on quick app restarts
  // Possibly set up polling if this causes problems
  socket.on('disconnecting', (reason) => {
    delete online[socket.username];
    console.log('*** USER DISCONNECTED ***', online);
  });
});
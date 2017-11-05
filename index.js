const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

// App routes
app.get('/', function(req, res) {
  res.send('.~::  C O N T R A I L  ::~.');
});

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

// App ready
http.listen(port, function() {
  console.log(`LISTENING ON PORT ${port}...`);
});

// TODO: Move elsewhere
// Online players
const online = {};
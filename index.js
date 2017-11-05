const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', function(req, res) {
  res.send('.~::  C O N T R A I L  ::~.');
});

io.on('connection', function(socket){

  console.log('*** NEW PLAYER ***', socket.id);

  // request user info and add to online list
  socket.emit('user-request', socket.id, (user) => {
    socket.username = user.username;
    online[user.username] = user;

    console.log('*** ONLINE LIST ***', online);
  });

  socket.on('disconnect', (reason) => {

    console.log('*** DISCONNECTED ***', reason);

    delete online[socket.username];

    console.log('*** ONLINE LIST ***', online);
  });

});

http.listen(port, function() {
  console.log(`LISTENING ON PORT ${port}...`);
});

// MOVE THESE SOMEWHERE ELSE
const online = {};
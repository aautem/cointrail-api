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

    console.log('*** USER PROFILE ***', user);

    online[user.username] = user;
  });

});

http.listen(port, function() {
  console.log(`LISTENING ON PORT ${port}...`);
});

// MOVE THESE SOMEWHERE ELSE
const online = {};
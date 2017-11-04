const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.send('.~::  C O N T R A I L  ::~.');
});

io.on('connection', function(socket) {
  console.log('New Player:', socket);
});

http.listen(3000, function() {
  console.log('Listening on port 3000');
});

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', function(req, res) {
  res.send('.~::  C O N T R A I L  ::~.');
});

io.on('connection', function(socket){
  console.log('*** New Player ***', socket.conn);
});

http.listen(port, function() {
  console.log(`*** Listening on port ${port}... ***`);
});
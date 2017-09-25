const express = require('express');
const app = express();

app.get('/', function(req, res) {
  res.send('.~::  C O N T R A I L  ::~.');
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});

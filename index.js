const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT || 3000;
const config = require('./config');
const constants = require('./const');
require('./db.js');
require('./socket.js');
require('./routes.js')(app, express);
config.loadConfig(app);

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(constants.APP_TITLE);
});

http.listen(port, () => {
  console.log(`LISTENING ON PORT ${port}...`);
});

module.exports = app;
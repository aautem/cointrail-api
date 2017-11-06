require('newrelic');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT || 3000;
const config = require('./config');
const socket = require('./socket');
const constants = require('./const');

// start database
require('./db.js');

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send(constants.APP_TITLE);
});

config.loadConfig(app);
require('./routes.js')(app, express);
socket.configure(http);

http.listen(port, () => {
  console.log(`*** LISTENING ON PORT ${port} ***`);
});

module.exports = http;
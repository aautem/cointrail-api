// require('newrelic');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT || 3000;
const config = require('./config');
const socket = require('./utilities/socket');
const constants = require('./utilities/const');

// start database
require('./database/db.js');

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send(constants.APP_TITLE);
});

config.loadConfig(app);
require('./database/routes.js')(app, express);
socket.configure(http);

http.listen(port, () => {
  console.log('\x1b[32m', 'Listening on port', port);
});

module.exports = http;
const statsCtrl = require('./stats/statsCtrl');
const settingsCtrl = require('./settings/settingsCtrl');
const friendsCtrl = require('./friends/friendsCtrl');
const userCtrl = require('./user/userCtrl');
const messagesCtrl = require('./messages/messagesCtrl');
// const leadersCtrl = require('./leaders/leadersCtrl');

module.exports = (app, express) => {
  app.get('/api/user/:username', userCtrl.findUser);
  app.put('/api/user/:username', userCtrl.updateUser);

  app.post('/api/messages/:username', messagesCtrl.postMessage);

  app.get('/api/stats/:username', statsCtrl.loadStats);
  app.put('/api/stats/:username', statsCtrl.updateStats);

  app.get('/api/settings/:username', settingsCtrl.loadSettings);
  app.put('/api/settings/:username', settingsCtrl.updateSettings);

  app.get('/api/friends/:username', friendsCtrl.loadFriends);
  app.put('/api/friends/:username', friendsCtrl.updateFriends);
};
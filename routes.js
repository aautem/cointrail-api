const statsCtrl = require('./stats/statsCtrl');
const settingsCtrl = require('./settings/settingsCtrl');
const friendsCtrl = require('./friends/friendsCtrl');

// const leadersCtrl = require('./leaders/leadersCtrl');
// const msgCtrl = require('./msg/msgCtrl');
// const historyCtrl = require('./history/historyCtrl');
// const gameCtrl = require('./game/gameCtrl');

module.exports = (app, express) => {
  app.get('/api/stats/:username', statsCtrl.loadStats);
  app.put('/api/stats/:username', statsCtrl.updateStats);

  app.get('/api/settings/:username', settingsCtrl.loadSettings);
  app.put('/api/settings/:username', settingsCtrl.updateSettings);

  app.get('/api/friends/:username', friendsCtrl.loadFriends);
  app.put('/api/friends/:username', friendsCtrl.updateFriends);
};
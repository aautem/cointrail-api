const statsCtrl = require('./stats/statsCtrl');
const settingsCtrl = require('./settings/settingsCtrl');

// const leadersCtrl = require('./leaders/leadersCtrl');
// const msgCtrl = require('./msg/msgCtrl');
// const friendsCtrl = require('./friends/friendsCtrl');
// const historyCtrl = require('./history/historyCtrl');
// const gameCtrl = require('./game/gameCtrl');

module.exports = (app, express) => {
  app.get('/api/stats/:username', statsCtrl.loadStats);
  app.put('/api/stats/:username', statsCtrl.updateStats);

  app.get('/api/settings/:username', settingsCtrl.loadSettings);
  app.put('/api/settings/:username', settingsCtrl.updateSettings);
};
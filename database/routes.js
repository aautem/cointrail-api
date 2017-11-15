const userCtrl = require('./user/userCtrl');
const messageCtrl = require('./message/messageCtrl');

module.exports = (app, express) => {
  // LOAD & SAVE USER (avatar, socketId, inGame, online)
  app.put('/api/users/:auth0Id', userCtrl.saveUser);

  // LOAD/UPDATE/DELETE FRIENDS
  app.get('/api/friends/:id', userCtrl.loadFriends);
  app.put('/api/friends/:id', userCtrl.updateFriends);
  app.delete('/api/friends/:id/:username', userCtrl.deleteFriend);

  // LOAD LEADERBOARD
  app.get('/api/leaderboard', userCtrl.loadLeaderboard);

  // LOAD/SEND/DELETE MESSAGES
  app.get('/api/messages/:id', messageCtrl.loadMessages);
  app.post('/api/messages', messageCtrl.createMessage); // handles friend requests as well
  app.delete('/api/messages/:id', messageCtrl.deleteMessage); // message id
};
const Friends = require('./friendsModel');

module.exports = {
  loadFriends: (req, res) => {
    Friends.findOne({ username: req.params.username }, (err, data) => {
      if (err) {
        console.log('\x1b[34m', 'Error loading friends:', err);
      } else if (!data) {
        const friends = new Friends({
          username: req.params.username,
          friends: [],
        });

        friends.save((err, data) => {
          if (err) {
            console.log('\x1b[34m', 'Error creating friends:', err);
          } else {
            console.log('\x1b[34m', 'Friends initialized for ', data.username);
            res.end(JSON.stringify(data));
          }
        })
      } else {
        console.log('Friends loaded for', data.username);
        res.end(JSON.stringify(data));
      }
    });
  },
  updateFriends: (req, res) => {
    Friends.findOneAndUpdate({ username: req.params.username }, req.body.friends, { new: true }, (err, data) => {
      if (err) {
        console.log('\x1b[34m', 'Error updating friends:', err);
      } else if (!data) {
        console.log('\x1b[34m', 'No user friends found');
      } else {
        console.log('\x1b[34m', 'Friends updated for ', data.username);
        res.end(JSON.stringify(data));
      }
    });
  }
};
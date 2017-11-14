const User = require('./userModel');

module.exports = {
  findUser: (req, res) => {
    User.findOne({ username: req.params.username }, (err, data) => {
      if (err) {
        console.log('\x1b[34m', 'Error finding user:', err);
        res.end(JSON.stringify(404));
      } else if (!data) {
        console.log('\x1b[34m', 'User not found');
        res.end(JSON.stringify(404));
      } else {
        console.log('Found user:', data.username);
        res.end(JSON.stringify(data));
      }
    });
  },
  updateUser: (req, res) => {
    User.findOneAndUpdate({ username: req.params.username }, req.body.user, { new: true }, (err, data) => {
      if (err) {
        console.log('\x1b[34m', 'Error updating user:', err);
      } else if (!data) {
        console.log('\x1b[34m', 'No user found. Creating new user.');

        const user = new User({
          username: req.body.user.username,
          id: req.body.user.id,
          avatarUrl: req.body.user.avatarUrl,
          inGame: req.body.user.inGame,
        });

        user.save((err, data) => {
          if (err) {
            console.log('\x1b[34m', 'Error creating user:', err);
          } else {
            console.log('\x1b[34m', 'User initialized for ', data.username);
            res.end(JSON.stringify(data));
          }
        })
      } else {
        console.log('\x1b[34m', 'User updated:', data.username);
        res.end(JSON.stringify(data));
      }
    });
  }
};
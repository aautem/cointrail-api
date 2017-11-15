const User = require('./userModel');

module.exports = {
  saveUser: (req, res) => {
    const auth0Id = req.params.auth0Id;
    const update = req.body;

    console.log('\x1b[34m', 'Saving user:', req.params);
    console.log('Request body:', req.body);

    User.findOneAndUpdate({ auth0Id: auth0Id }, update, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }, (err, user) => {
      if (err) {
        console.log('\x1b[31m', 'Error saving user:', err);
        res.end(JSON.stringify(err));
      } else {
        console.log('\x1b[34m', 'User saved:', user.username);
        res.end(JSON.stringify(user));
      }
    });
  },
  loadFriends: (req, res) => {
    const id = req.params.id;
    User.findById(id, (err, user) => {
      if (err) {
        console.log('\x1b[31m', 'Error loading user:', err);
        res.end(JSON.stringify(err));
      } else if (!user) {
        console.log('\x1b[31m', 'User does not exist.');
        res.end(new Error('User does not exist.'));
      } else {
        // Find any user in the database with an id in the friends array
        User.find({ '_id': { $in: user.friends }}, (err, friends) => {
          if (err) {
            console.log('\x1b[31m', 'Error loading friends:', err);
            res.end(JSON.stringify(err));
          } else {
            console.log('\x1b[34m', 'Friends loaded:', friends);
            res.end(JSON.stringify(friends));
          }
        });
      }
    });
  },
  updateFriends: (req, res) => {
    const id = req.params.id;
    const username = req.body;
    User.findOne({ username: username }, (err, user1) => {
      if (err) {
        console.log('\x1b[31m', 'Error loading user:', err);
        res.end(JSON.stringify(err));
      } else if (!user1) {
        console.log('\x1b[31m', 'User does not exist.');
        res.end(new Error('User does not exist.'));
      } else {
        // friend 1 found, load friend 2
        User.findById(id, (err, user2) => {
          if (err) {
            console.log('\x1b[31m', 'Error loading user:', err);
            res.end(JSON.stringify(err));
          } else if (!user2) {
            console.log('\x1b[31m', 'User does not exist.');
            res.end(new Error('User does not exist.'));
          } else {
            // push user ids into eachothers friends arrays
            user1.friends.push(user2._id);
            user2.friends.push(user1._id);
            user1.save((err) => {
              if (err) {
                console.log('\x1b[31m', 'Error saving friends:', err);
                res.end(JSON.stringify(err));
              } else {
                user2.save((err) => {
                  if (err) {
                    console.log('\x1b[31m', 'Error saving friends:', err);
                    res.end(JSON.stringify(err));
                  } else {
                    console.log('\x1b[34m', 'Friends saved:', user2.friends);
                    res.end(JSON.stringify(user2.friends));
                  }
                });
              }
            });
          }
        });
      }
    });
  },
  deleteFriend: (req, res) => {
    const id = req.params.id;
    const username = req.params.username;
    User.findById(id, (err, user1) => {
      if (err) {
        console.log('\x1b[31m', 'Error loading user:', err);
        res.end(JSON.stringify(err));
      } else if (!user1) {
        console.log('\x1b[31m', 'User does not exist.');
        res.end(new Error('User does not exist.'));
      } else {
        User.findOne({ username: username }, (err, user2) => {
          if (err) {
            console.log('\x1b[31m', 'Error loading user:', err);
            res.end(JSON.stringify(err));
          } else if (!user2) {
            console.log('\x1b[31m', 'User does not exist.');
            res.end(new Error('User does not exist.'));
          } else {
            // remove friends
            user1.friends = user1.friends.filter((id) => {
              return id !== user2._id;
            });
            user2.friends = user2.friends.filter((id) => {
              return id !== user1._id;
            });

            // save updates
            user1.save((err) => {
              if (err) {
                console.log('\x1b[31m', 'Error updating friends:', err);
                res.end(JSON.stringify(err));
              } else {
                user2.save((err) => {
                  if (err) {
                    console.log('\x1b[31m', 'Error updating friends:', err);
                    res.end(JSON.stringify(err));
                  } else {
                    console.log('\x1b[34m', 'Friends updated:', user1.friends);
                    res.end(JSON.stringify(user1.friends));
                  }
                });
              }
            });
          }
        });
      }
    });
  },
  loadLeaderboard: (req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        console.log('\x1b[31m', 'Error loading users:', err);
        res.end(JSON.stringify(err));
      } else {
        const leaderboard = users.sort((user1, user2) => {
          const user1WinPercent = user1.stats.gamesPlayed ? (user1.stats.wins / user1.stats.gamesPlayed) : 0;
          const user2WinPercent = user2.stats.gamesPlayed ? (user2.stats.wins / user2.stats.gamesPlayed) : 0;
          if (user1WinPercent > user2WinPercent) {
            return -1;
          } else if (user2WinPercent > user1WinPercent) {
            return 1;
          } else {
            return 0;
          }
        });
        console.log('\x1b[34m', 'Leaderboard created.');
        res.end(JSON.stringify(leaderboard));
      }
    });
  }
};
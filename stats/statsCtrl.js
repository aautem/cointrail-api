const Stats = require('./statsModel');

module.exports = {
  loadStats: (req, res) => {
    Stats.findOne({ username: req.params.username }, (err, data) => {
      if (err) {
        console.log('\x1b[34m', 'Error loading stats:', err);
      } else if (!data) {
        const stats = new Stats({
          username: req.params.username,
        });

        stats.save((err, data) => {
          if (err) {
            console.log('\x1b[34m', 'Error creating stats:', err);
          } else {
            console.log('\x1b[34m', 'Stats initialized for ', data.username);
            res.end(JSON.stringify(data));
          }
        })
      } else {
        console.log('Stats loaded for', data.username);
        res.end(JSON.stringify(data));
      }
    });
  },
  updateStats: (req, res) => {
    Stats.findOneAndUpdate({ username: req.params.username }, req.body.stats, { new: true }, (err, data) => {
      if (err) {
        console.log('\x1b[34m', 'Error updating stats:', err);
      } else if (!data) {
        console.log('\x1b[34m', 'No user stats found');
      } else {
        console.log('\x1b[34m', 'Stats updated for ', data.username);
        res.end(JSON.stringify(data));
      }
    });
  }
};
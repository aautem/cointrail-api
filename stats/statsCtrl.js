const Stats = require('./statsModel');

module.exports = {
  loadStats: (req, res) => {
    Stats.findOne({ username: req.params.username }, (err, data) => {
      if (err) {
        console.error('Load stats error:', err);
      } else if (!data) {
        const stats = new Stats({
          username: req.params.username,
        });

        stats.save((err, data) => {
          if (err) {
            console.error('Error creating stats:', err);
          } else {
            console.log('Stats initialized', data);
            res.end(JSON.stringify(data));
          }
        })
      } else {
        console.log('Stats loaded', data);
        res.end(JSON.stringify(data));
      }
    });
  },
  updateStats: (req, res) => {
    Stats.findOneAndUpdate({ username: req.body.username }, req.body.stats, { new: true }, (err, data) => {
      if (err) {
        console.error('Update stats error:', err);
      } else if (!data) {
        console.error('No stats found for user');
      } else {
        console.log('Stats updated', data);
        res.end(JSON.stringify(data));
      }
    });
  }
};
const Stats = require('./statsModel');

module.exports = {
  loadStats: (req, res) => {
    Stats.findOne({ username: req.params.username }, (err, data) => {
      if (err) {
        console.log('*** ERROR LOADING STATS ***', err);
      } else if (!data) {
        const stats = new Stats({
          username: req.params.username,
        });

        stats.save((err, data) => {
          if (err) {
            console.log('*** ERROR CREATING STATS ***', err);
          } else {
            console.log('*** STATS INITIALIZED ***', data);
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
        console.log('*** ERROR UPDATING STATS ***', err);
      } else if (!data) {
        console.log('*** NO USER STATS ***');
      } else {
        console.log('*** STATS UPDATED ***', data);
        res.end(JSON.stringify(data));
      }
    });
  }
};
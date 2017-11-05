const Settings = require('./settingsModel');

module.exports = {
  loadSettings: (req, res) => {
    Settings.findOne({ username: req.params.username }, (err, data) => {
      if (err) {
        console.error('Load settings error:', err);
      } else if (!data) {
        const settings = new Settings({
          username: req.params.username,
        });

        settings.save((err, data) => {
          if (err) {
            console.error('Error creating settings:', err);
          } else {
            console.log('Settings initialized', data);
            res.end(JSON.stringify(data));
          }
        })
      } else {
        console.log('Settings loaded', data);
        res.end(JSON.stringify(data));
      }
    });
  },
  updateSettings: (req, res) => {
    Settings.findOneAndUpdate({ username: req.params.username }, req.body.stats, { new: true }, (err, data) => {
      if (err) {
        console.error('Update settings error:', err);
      } else if (!data) {
        console.error('No settings found for user');
      } else {
        console.log('Settings updated', data);
        res.end(JSON.stringify(data));
      }
    });
  }
};
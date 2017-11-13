const Settings = require('./settingsModel');

module.exports = {
  loadSettings: (req, res) => {
    Settings.findOne({ username: req.params.username }, (err, data) => {
      if (err) {
        console.log('\x1b[34m', 'Error loading settings:', err);
      } else if (!data) {
        const settings = new Settings({
          username: req.params.username,
        });

        settings.save((err, data) => {
          if (err) {
            console.log('\x1b[34m', 'Error creating settings:', err);
          } else {
            console.log('\x1b[34m', 'Settings initialized for ', data.username);
            res.end(JSON.stringify(data));
          }
        })
      } else {
        console.log('Settings loaded for', data.username);
        res.end(JSON.stringify(data));
      }
    });
  },
  updateSettings: (req, res) => {
    Settings.findOneAndUpdate({ username: req.params.username }, req.body.settings, { new: true }, (err, data) => {
      if (err) {
        console.log('\x1b[34m', 'Error updating settings:', err);
      } else if (!data) {
        console.log('\x1b[34m', 'No user settings found', err);
      } else {
        console.log('\x1b[34m', 'Settings updated for ', data.username);
        res.end(JSON.stringify(data));
      }
    });
  }
};
const Settings = require('./settingsModel');

module.exports = {
  loadSettings: (req, res) => {
    Settings.findOne({ username: req.params.username }, (err, data) => {
      if (err) {
        console.log('*** ERROR LOADING SETTINGS ***', err);
      } else if (!data) {
        const settings = new Settings({
          username: req.params.username,
        });

        settings.save((err, data) => {
          if (err) {
            console.log('*** ERROR CREATING SETTINGS ***', err);
          } else {
            console.log('*** SETTINGS INITIALIZED ***', data);
            res.end(JSON.stringify(data));
          }
        })
      } else {
        console.log('*** SETTINGS LOADED ***', data);
        res.end(JSON.stringify(data));
      }
    });
  },
  updateSettings: (req, res) => {
    Settings.findOneAndUpdate({ username: req.params.username }, req.body.settings, { new: true }, (err, data) => {
      if (err) {
        console.log('*** ERROR UPDATING SETTINGS ***', err);
      } else if (!data) {
        console.log('*** NO USER SETTINGS ***');
      } else {
        console.log('*** SETTINGS UPDATED ***', data);
        res.end(JSON.stringify(data));
      }
    });
  }
};
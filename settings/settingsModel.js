const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 4,
    required: true
  },
  length: {
    type: Number,
    default: 7,
    required: true
  },
  timeLimit: {
    type: Boolean,
    default: false,
    required: true
  },
  priColor: {
    type: String,
    default: 'steelblue',
    required: true
  },
  altColor: {
    type: String,
    default: 'powderblue',
    required: true
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);
const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  boardSize: {
    type: Number,
    default: 4,
    required: true
  },
  seriesLength: {
    type: Number,
    default: 7,
    required: true
  },
  timeLimit: {
    type: Boolean,
    default: false,
    required: true
  },
  color: {
    type: String,
    default: '#3780B6',
    required: true
  },
  altColor: {
    type: String,
    default: '#71CFEE',
    required: true
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);
const mongoose = require('mongoose');
const helpers = require('../utilities/helpers');

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
    default: 2,
    required: true
  },
  timeLimit: {
    type: Boolean,
    default: false,
    required: true
  },
  color: {
    type: String,
    default: helpers.getRandomColors()[0],
    required: true
  },
  altColor: {
    type: String,
    default: '#000BFC',
    required: true
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);
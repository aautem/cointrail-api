const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  wins: {
    type: Number,
    default: 0,
    required: true
  },
  losses: {
    type: Number,
    default: 0,
    required: true
  },
  ties: {
    type: Number,
    default: 0,
    required: true
  },
  totalPoints: {
    type: Number,
    default: 0,
    required: true
  },
  gamesPlayed: {
    type: Number,
    default: 0,
    required: true
  },
  winsByDefault: {
    type: Number,
    default: 0,
    required: true
  }
});

module.exports = mongoose.model('Stats', StatsSchema);
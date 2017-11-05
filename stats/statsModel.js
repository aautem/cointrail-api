const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
  username: String,
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  ties: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  winsByDefault: { type: Number, default: 0 },
});

module.exports = mongoose.model('Stats', StatsSchema);
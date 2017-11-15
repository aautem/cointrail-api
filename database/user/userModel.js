const mongoose = require('mongoose');
const helpers = require('../../utilities/helpers');

const SettingsSchema = new mongoose.Schema({
  boardSize: {
    type: Number,
    default: 4,
    required: true
  },
  timeLimit: {
    type: Boolean,
    default: false,
    required: true
  },
  color: {
    type: String,
    default: helpers.getColor(),
    required: true
  },
  altColor: {
    type: String,
    default: helpers.getAltColor(),
    required: true
  }
});

const StatsSchema = new mongoose.Schema({
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
  draws: {
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
  },
  winsByPoints: {
    type: Number,
    default: 0,
    required: true
  },
  winsByConnect: {
    type: Number,
    default: 0,
    required: true
  }
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  auth0Id: {
    type: String,
    required: true
  },
  socketId: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    default: 'https://raw.githubusercontent.com/aautem/contrail-client/master/src/assets/cointrail.png',
    required: true
  },
  inGame: {
    type: Boolean,
    default: false,
    required: true
  },
  online: {
    type: Boolean,
    default: true,
    required: true
  },
  settings: {
    type: SettingsSchema,
    default: SettingsSchema,
    required: true
  },
  stats: {
    type: StatsSchema,
    default: StatsSchema,
    required: true
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', UserSchema);
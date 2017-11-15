const mongoose = require('mongoose');
const helpers = require('../../utilities/helpers');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  socketId: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    default: '',
    required: true
  },
  inGame: {
    type: Boolean,
    default: false,
    require: true
  },
  online: {
    type: Boolean,
    default: true,
    required: true
  },
  settings: {
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
  },
  stats: {
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
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', UserSchema);
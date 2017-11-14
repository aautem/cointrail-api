const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  id: {
    type: String
  },
  avatarUrl: {
    type: String,
    required: true
  },
  inGame: {
    type: Boolean
  }
});

module.exports = mongoose.model('User', UserSchema);
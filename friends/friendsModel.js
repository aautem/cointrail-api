const mongoose = require('mongoose');

const FriendsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  friends: [{ username: String, avatar: String, color: String }]
});

module.exports = mongoose.model('Friends', FriendsSchema);
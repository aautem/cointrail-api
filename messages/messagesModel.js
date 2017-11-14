const mongoose = require('mongoose');

const MessagesSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  messages: []
});

module.exports = mongoose.model('Messages', MessagesSchema);
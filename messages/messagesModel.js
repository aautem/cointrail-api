const mongoose = require('mongoose');

const MessagesSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  messages: [{ type: String, to: String, from: String, msg: String }]
});

module.exports = mongoose.model('Messages', MessagesSchema);
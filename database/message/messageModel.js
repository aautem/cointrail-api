const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: {
    type: String,
    default: 'message',
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Message', MessageSchema);
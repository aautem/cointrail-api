const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'message',
    required: true
  },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  toUsername: {
    type: String,
    required: true
  },
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fromUsername: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamps: { createdAt: 'created_at' }
});

module.exports = mongoose.model('Message', MessageSchema);
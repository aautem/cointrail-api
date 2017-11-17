const Message = require('./messageModel');
const User = require('../user/userModel');
const mongoose = require('mongoose');

module.exports = {
  loadMessages: (req, res) => {
    const id = req.params.id;
    Message.find({ toUserId: mongoose.Types.ObjectId(id) }, (err, messages) => {
      if (err) {
        console.log('\x1b[31m', 'Error loading messages:', err);
        res.end(JSON.stringify(err));
      } else {
        console.log('\x1b[34m', 'Messages loaded:', messages);
        res.end(JSON.stringify(messages));
      }
    });
  },
  createMessage: (req, res) => {

    // toUsername
    // fromUserId
    // fromUsername
    // type
    // message

    if (!req.body.toUsername || !req.body.fromUserId || !req.body.fromUsername || !req.body.message) {
      console.log('\x1b[31m', 'Data missing from message.');
      res.end(new Error('Data missing from message.'));
    } else {
      // make sure the user it's going to actually exists
      User.findOne({ username: req.body.toUsername }, (err, user) => {
        if (err) {
          console.log('\x1b[31m', 'Error loading user:', err);
          res.end(JSON.stringify(err));
        } else if (!user) {
          console.log('\x1b[31m', 'User not found.');
          res.end(new Error('User not found.'));
        } else {
          // create message
          const message = new Message({
            type: req.body.type || 'message',
            toUserId: mongoose.Types.ObjectId(user._id),
            toUsername: user.username,
            fromUserId: mongoose.Types.ObjectId(req.body.fromUserId),
            fromUsername: req.body.fromUsername,
            message: req.body.message,
          });
          message.save((err) => {
            if (err) {
              console.log('\x1b[31m', 'Error saving message:', err);
              res.end(JSON.stringify(err));
            } else {
              console.log('\x1b[34m', 'Message saved:', message);
              res.end(JSON.stringify(message));
            }
          });
        }
      });
    }
  },
  deleteMessage: (req, res) => {
    const id = req.params.id; // message object id
    Message.findByIdAndRemove(id, (err, message) => {
      if (err) {
        console.log('\x1b[31m', 'Error deleting message:', err);
        res.end(JSON.stringify(err));
      } else {
        console.log('\x1b[34m', 'Message deleted:', message);
        res.end(JSON.stringify(message));
      }
    });
  }
};
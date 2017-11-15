const Message = require('./messageModel');
const mongoose = require('mongoose');

module.exports = {
  loadMessages: (req, res) => {
    const id = req.params.id;
    Message.find({ to: mongoose.Types.ObjectId(id) }, (err, messages) => {
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
    if (!req.body.to || !req.body.from || !req.body.message) {
      console.log('\x1b[31m', 'Data missing from message.');
      res.end(new Error('Data missing from message.'));
    } else {
      const message = new Message({
        to: mongoose.Types.ObjectId(req.body.to),
        from: mongoose.Types.ObjectId(req.body.from),
        type: req.body.type,
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
  },
  deleteMessage: (req, res) => {
    const id = req.params.id;
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
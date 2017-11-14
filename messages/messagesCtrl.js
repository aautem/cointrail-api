const Messages = require('./messagesModel');

module.exports = {
  // loadMessages: (req, res) => {
  //   Messages.findOne({ username: req.params.username }, (err, data) => {
  //     if (err) {
  //       console.log('\x1b[34m', 'Error loading friends:', err);
  //     } else if (!data) {
  //       const friends = new Friends({
  //         username: req.params.username,
  //         friends: [],
  //       });

  //       friends.save((err, data) => {
  //         if (err) {
  //           console.log('\x1b[34m', 'Error creating friends:', err);
  //         } else {
  //           console.log('\x1b[34m', 'Friends initialized for ', data.username);
  //           res.end(JSON.stringify(data));
  //         }
  //       })
  //     } else {
  //       console.log('Friends loaded for', data.username);
  //       res.end(JSON.stringify(data));
  //     }
  //   });
  // },
  postMessage: (req, res) => {
    Messages.findOne({ username: req.params.username }, (err, data) => {
      if (err) {
        console.log('\x1b[34m', 'Error posting message:', err);
      } else if (!data) {
        console.log('\x1b[34m', 'No user found.');
      } else {
        console.log('\x1b[34m', 'Sending message to ', data.username);

        const messages = new Messages({
          username: req.params.username,
          messages: data.messages.slice().unshift(req.body.message),
        });

        messages.save((err, data) => {
          if (err) {
            console.log('\x1b[34m', 'Error saving messages:', err);
          } else {
            console.log('\x1b[34m', 'Messages saved:', data.username);
            res.end(JSON.stringify('OK'));
          }
        });
      }
    });
  }
};
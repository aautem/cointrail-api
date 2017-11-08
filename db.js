const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
const db = mongoose.connection;

db.on('error', (error) => {
  console.warn('*** MONGO DB CONNECTION ERROR ***', error);
});

db.once('open', () => {
  console.log('*** MONGODB CONNECTED ***');
});

module.exports = db;
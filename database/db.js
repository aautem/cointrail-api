const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
const db = mongoose.connection;

db.on('error', (error) => {
  console.warn('\x1b[31m', 'MongoDB error:', error);
});

db.once('open', () => {
  console.log('\x1b[32m', 'MongoDB connected.');
});

module.exports = db;
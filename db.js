const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

db.on('error', (error) => {
  console.warn('DB connection error:', error);
});

db.once('open', () => {
  console.log('MongoDB connected');
});

module.exports = db;
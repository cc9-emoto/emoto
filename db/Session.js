const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
  user: String,
  token: String,
  isExpired: Boolean
});

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;
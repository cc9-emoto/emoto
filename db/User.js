const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  spotifyId: String,
  accessToken: String,
  refreshToken: String,
  isTutorialComplete: Boolean
});

const User = mongoose.model('User', userSchema);
module.exports = User;
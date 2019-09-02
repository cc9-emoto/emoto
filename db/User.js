const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  accessToken: String,
  refreshToken: String,
  uid: String,
  password: String,
  password_salt: String
});

const User = mongoose.model('User', userSchema);
module.exports = User;
const mongoose = require('mongoose');
const songSchema = new mongoose.Schema({
  userId: String,
  songId: String,
  emoIndex: Number,
  added: {type: Boolean, default: false} 
});

const Song = mongoose.model('Song', songSchema);
module.exports = Song;
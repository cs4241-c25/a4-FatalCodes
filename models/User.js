const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  githubId: String,
  username: String,
  displayName: String,
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);

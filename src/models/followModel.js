const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  user:  String, 
  follower: { type: String, ref: 'User' }
});

const Follow = mongoose.model('followes', followSchema);

module.exports = Follow;
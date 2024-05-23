const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  user:  { type: String, ref: 'User' },
  follower: { type: String, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'accepted' }

});

const Follow = mongoose.model('followes', followSchema);

module.exports = Follow;
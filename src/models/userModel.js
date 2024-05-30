const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  _id: {
    type: String, default: uuidv4
  },
  name: String,
  email: {
    type: String, unique: true
  },
  bio: { type: String, default: 'Hello, I\'m using this blog.' },
  role: { type: String, default: 'user' },
  password: String,
  privacy: { type: String, default: 'public' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

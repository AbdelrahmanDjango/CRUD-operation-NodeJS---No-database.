const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    userId: {
      type: String,
      ref: 'User',
      required: true
    },
    postId: {
      type: String,
      ref: 'Post',
      required: true
    },
    name: {
      type: String,
      // required: true,
      ref : 'User'
    },
    comment: {
      type: String,
      required: true
    },
  }, { timestamps: true });

const Comment = mongoose.model('comments', commentSchema);

module.exports = Comment;
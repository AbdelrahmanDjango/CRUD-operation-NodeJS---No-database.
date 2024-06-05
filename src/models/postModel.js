const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  body: String,
  privacy: String,
  userId: {
    type: String,
    ref: 'User',
  },
  name: {
    type: String,
    ref: 'User',
  },
  groupId: {
    type: String, 
    ref: 'Group',
  },
  postStatusGroup: {
    type: String,
    enum: ['pending', 'rejected', 'accepted'],
    default: 'accepted',
  },
  // postRole: {
  //   type: String, 
  //   enum: ['admin', 'user'], 
  //   default: 'user',
  //   ref: 'Group', 
  // },
  commentsStatus: { 
    type: String, 
    enum: ['closedForAll', 'openedForAll', 'openedForFollowers'], 
    default: 'openedForAll', 
  }
}, { timestamps: true });

postSchema.virtual('comments', { // comments is a parameter to get related objects.
  ref: 'Comment', // Model should be singular and correct
  localField: '_id', 
  foreignField: 'postId' // This is in comment model. 
});

postSchema.set('toObject', { virtuals: true });
postSchema.set('toJSON', { virtuals: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

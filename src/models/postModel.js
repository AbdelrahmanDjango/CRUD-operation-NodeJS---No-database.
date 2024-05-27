const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  body: String,
  privacy: String,
  userId:{
    type: String,
    ref: 'User',
  },
  name:{
    type: String,
    ref: 'User',
  },
},
{ timestamps : true}
);
postSchema.virtual('comments', { // parameter to get related objects.
  ref : 'comments', // Model.
  localField: '_id', 
  foreignField: 'postId' // This is in post model. 
});

postSchema.set('toObject', {virtuals : true});
postSchema.set('toJSON', {virtuals : true});


const Post = mongoose.model('posts', postSchema);

module.exports = Post;
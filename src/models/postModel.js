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
  }
},
   { timestamps : true} 
);

const Post = mongoose.model('posts', postSchema);

module.exports = Post;
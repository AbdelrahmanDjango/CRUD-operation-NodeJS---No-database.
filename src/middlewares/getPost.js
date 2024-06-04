const Post = require('../models/postModel');

const getPost = async(req, res, next) => {
    try{
        const post = await Post.findById(req.params.postId);
        if(!post) return res.status(404).send('Post not found');
        req.targetPost = post;
        next();
    }catch(err){
        console.log(err);
        return res.send('Server error.');
    };

};

module.exports = getPost;
const express = require("express");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const User = require('../../models/userModel');
const Post = require('../../models/postModel');
const Comment = require('../../models/commentModel');
const Follow = require("../../models/followModel");


router.post('/post/:id/comment/create', ensureAuth(), async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).send('Post not found.');
        };
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(400).send('User not found.');
        };
        if(post.privacy === 'private'){
            const existingFollow = await Follow.findOne({ user: post.userId, follower: req.user.id, status : 'accepted'});
            if(!existingFollow){
                return res.status(400).send('Post is not avaliable for you. Follow user first.')
            } 
        }
        const comment = await validationComment(req.body);
        if(comment){
            const newComment = new Comment({
                postId: req.params.id,
                comment: req.body.comment,
                name: user.name, 
                userId: user._id,
            });
            const saveComment = await newComment.save();
            return res.status(200).send(newComment);
        }
        
    }catch(err){
        console.log(err);
        res.send('Server error.')
    }
})

async function validationComment(comment) {
    const schema = Joi.object({
      comment: Joi.string().required().min(1),
    });
    try {
      return await schema.validateAsync(comment);
    } catch (err) {
      throw err;
    }
}

module.exports = router;
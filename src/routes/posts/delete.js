const express = require('express');
const router = express.Router();
const ensureAuth = require('../../middlewares/auth');
const Post = require('../../models/postModel');
const User = require('../../models/userModel');

router.delete('/delete/:id', ensureAuth(), async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(400).send('Post doesn\'t exists.')
        };
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(403).send("invalid authorization");
        };
        if(user.id === post.userId){
            await Post.findOneAndDelete({userId : user.id});
            return res.status(200).send('Post deleted successfully.');
        }
        else{
            return res.status(400).send('You can\'t delete post don\'t belongs to you')
        }
    }catch(err){
        console.log(err);
        res.send(err);
    }
})



module.exports = router;
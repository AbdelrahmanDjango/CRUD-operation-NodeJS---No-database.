const express = require('express');
const router = express.Router();
const ensureAuth = require('../../middlewares/auth')
const Post = require('../../models/postModel')
const User = require('../../models/userModel')

router.get('/', ensureAuth(), async (req, res) => {
    try{
        const posts = await Post.find({privacy : 'public'})
        if(!posts || posts.length === 0){
            return res.status(400).json({msg : 'Posts not found.'})
        }else{
            return res.status(200).json(posts);
        }
        
    }catch(err) {
        console.log(err);
        res.send('Server error.')
    }
});

module.exports = router;
const express = require('express');
const Joi = require('joi');
const ensureAuth = require('../../middlewares/auth');
const Post = require('../../models/postModel');
const User = require('../../models/userModel');
const router = express.Router();

router.put('/update/:id', ensureAuth(), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).send('Post doesn\'t exist.');
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(403).send('Invalid authorization.');
        }

        if (user.id !== post.userId.toString()) {
            return res.status(400).send('You can\'t update a post that does not belong to you.');
        }

        const validatedPostData = await validationPost(req.body);
        await Post.findByIdAndUpdate(req.params.id, { body: validatedPostData.body });

        return res.status(200).json({ Updated: 'Post updated successfully.', validatedPostData });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error.');
    }
});
async function validationPost(post){
    const schema = Joi.object({
        body : Joi.string().required()
    });
    try{
        return await schema.validateAsync(post);
    }catch(err){
        throw err;
    }
};


module.exports = router;
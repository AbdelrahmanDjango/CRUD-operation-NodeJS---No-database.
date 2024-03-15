const express = require('express');
const Joi = require('joi');
const ensureAuth = require('../../middlewares/auth');
const User = require('../../models/userModel');
const Post = require('../../models/postModel');
const Follow = require('../../models/followModel');
const router = express.Router();


router.get('/:id', ensureAuth(), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found.');
        }

        if (user.privacy === 'public') {
            const posts = await Post.find({ userId: req.params.id });

            if (!posts.length) {
                return res.status(400).json({ msg: `User with ID: ${user.id} has no posts.` });
            }

            return res.status(200).json(posts);
        } else if (user.privacy === 'private') {
            const existingFollow = await Follow.findOne({ user: user.id, follower: req.user.id });
            if (!existingFollow) {
                return res.status(400).send('This account is private, follow the user first.');
            } else {
                const posts = await Post.find({ userId: req.params.id });

                if (!posts.length) {
                    return res.status(400).json({ msg: `User with ID: ${user.id} has no posts.` });
                }

                return res.status(200).json(posts);
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
}); 

module.exports = router;
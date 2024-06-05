/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Retrieve user's posts
 *     description: Retrieve posts of a user by their ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose posts are to be retrieved
 *     responses:
 *       '200':
 *         description: User's posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       '400':
 *         description: User has no posts or account is private
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

const express = require('express');
const Joi = require('joi');
const ensureAuth = require('../../../middlewares/auth');
const User = require('../../../models/userModel');
const Post = require('../../../models/postModel');
const Follow = require('../../../models/followModel');
const router = express.Router();


router.get('/:userId', ensureAuth(), async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (user.privacy === 'public') {
            const posts = await Post.find({ userId: req.params.userId });

            if (posts.length > 0){
                return res.status(400).json({ msg: `User with ID: ${user.id} has no posts.` });
            }

            return res.status(200).json(posts);
        } else if (user.privacy === 'private') {
            const existingFollow = await Follow.findOne({ user: user.id, follower: req.user.id, status : 'accepted'});
            if (!existingFollow) {
                return res.status(400).send('This account is private, follow the user first.');
            } else {
                const posts = await Post.find({ userId: req.params.userId });

                if (posts.length > 0){
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
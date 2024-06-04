/**
 * @swagger
 * /posts/{id}/comments/privacy:
 *   patch:
 *     summary: Update comments privacy status on a post
 *     description: Update the privacy status of comments on a specified post. Only the post owner can update this setting.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to update comments privacy
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentsStatus:
 *                 type: string
 *                 enum: [openedForAll, openedForFollowers, closedForAll]
 *                 example: openedForFollowers
 *     responses:
 *       '200':
 *         description: Comments privacy status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Comments {commentsStatus}."
 *       '400':
 *         description: Invalid authorization or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid authorization."
 *       '404':
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Post not found."
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Server error."
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
const express = require("express");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const getPost = require("../../middlewares/getPost");
const User = require('../../models/userModel');
const Post = require('../../models/postModel');

router.patch('/:postId/comments/privacy/', ensureAuth, getPost, async(req, res) => {
    try {
        const post = await req.targetPost;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).send('User not found.');
        }

        if(user.id === post.userId.toString()) {
            const { commentsStatus } = await validationCommentPrivacy(req.body);
            if (commentsStatus === post.commentsStatus) {
                return res.status(200).send('Nothing has changed.');
            }
            post.commentsStatus = commentsStatus;
            await post.save();
            return res.status(200).send(`Comments ${commentsStatus}.`);
        }else {
            return res.status(400).send('Invalid authorization.');
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error.');
    }
});

async function validationCommentPrivacy(comment) {
    const schema = Joi.object({
        commentsStatus: Joi.string().valid('openedForAll', 'openedForFollowers', 'closedForAll').required(),
    });
    try {
        const value = await schema.validateAsync(comment);
        return value;
    } catch (err) {
        throw err;
    }
}

module.exports = router;

/**
 * @swagger
 * /posts/{id}/comment/create:
 *   post:
 *     summary: Create a comment on a post
 *     description: Allows a user to create a comment on a specified post.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "This is a comment."
 *     responses:
 *       '200':
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '400':
 *         description: User not found or unable to comment
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: Internal server error
 *
 * /posts/{id}/comments:
 *   get:
 *     summary: Get comments on a post
 *     description: Retrieve the list of comments on the specified post.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to retrieve comments from
 *     responses:
 *       '200':
 *         description: List of comments on the specified post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       '400':
 *         description: No comments found or unable to retrieve comments
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         postId:
 *           type: string
 *         comment:
 *           type: string
 *         name:
 *           type: string
 *         userId:
 *           type: string
 *       required:
 *         - postId
 *         - comment
 *         - name
 *         - userId
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
const User = require('../../models/userModel');
const Post = require('../../models/postModel');
const Comment = require('../../models/commentModel');
const Follow = require("../../models/followModel");


router.post('/posts/:id/comment/create', ensureAuth(), async(req, res) => {
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
        const newComment = new Comment({
            postId: req.params.id,
            comment: req.body.comment,
            name: user.name, 
            userId: user._id,
        });
        const existingFollow = await Follow.findOne({ user: post.userId, follower: req.user.id, status : 'accepted'});
        if(post.commentsStatus === 'closedForAll'){
            return res.status(200).send('Comments have been closed by the post owner')
        }
        if(post.commentsStatus === 'openedForFollowers' && existingFollow){
            const saveComment = await newComment.save();
            return res.status(200).send(newComment);
        }else if(post.commentsStatus === 'openedForFollowers' && !existingFollow){
            return res.status(200).send('Commenting is available to followers only')
        }
        const saveComment = await newComment.save();
        return res.status(200).send(newComment)

    }catch(err){
        console.log(err);
        res.send('Server error.')
    }
})
router.get('/posts/:id/comments/',ensureAuth(), async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).send('Post not found.');
        };
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(400).send('User not found.');
        };
        const comments = await Comment.find({postId : post.id})
        if(comments.length > 0){
            if(post.privacy === 'private'){
                const existingFollow = await Follow.findOne({ user: post.userId, follower: req.user.id, status : 'accepted'});
                if(!existingFollow){
                    if(post.userId === user.id){
                        return res.status(200).json({comments : comments});
                    }else{
                        return res.status(400).send('Post is not avaliable for you. Follow user first.')
                    } 
                }
            }
            return res.status(200).json({comments : comments});
        }else{
            return res.status(400).send('No comments in this post.')
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
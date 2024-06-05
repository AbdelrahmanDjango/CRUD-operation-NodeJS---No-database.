/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieve public posts
 *     description: Retrieve a list of public posts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of public posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       '400':
 *         description: No public posts found
 *       '401':
 *         description: Unauthorized - Missing or invalid authentication token
 *       '500':
 *         description: Internal server error
 *
 * /posts/{id}:
 *   get:
 *     summary: Retrieve a specific post
 *     description: Retrieve a specific post by its ID if it is public
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to retrieve
 *     responses:
 *       '200':
 *         description: Post found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '400':
 *         description: Post not found
 *       '401':
 *         description: Unauthorized - Missing or invalid authentication token
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         privacy:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *       required:
 *         - title
 *         - content
 *         - privacy
 *         - createdAt
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


const express = require('express');
const router = express.Router();
const ensureAuth = require('../../middlewares/auth')
const getPost = require('../../middlewares/getPost')
const Post = require('../../models/postModel')
const User = require('../../models/userModel')
const Follow = require('../../models/followModel')

router.get('/', async (req, res) => {
    try{
        const posts = await Post.find({privacy : 'public'})
        .sort({createdAt : -1})
        .populate('comments')
        // To get specify fields by populate, put fields name in Array
        // .populate('comments', ['name', 'comment', 'createdAt'])
        if (posts.length > 0){
            return res.status(400).json({msg : 'Posts not found.'})
        }else{
            return res.status(200).json(posts);
        }
        
    }catch(err) {
        console.log(err);
        res.send('Server error.')
    }
});


router.get('/:postId', ensureAuth(), getPost, async (req, res) => {
    try {
        // Posts are opened for all users, geust or authenticated. But if posts are private; user must be an authenticated.
        const post = await req.targetPost;
        if (post.privacy === 'public') {
            return res.status(200).json(post);
        } else {
            // Check authorization if post are private. 
            const user = await User.findById(req.user.id);
            if(!user) {
                return res.status(403).send('This account is private. Sign up and follow the user.');
            };

            const existingFollow = await Follow.findOne({ user: post.userId, follower: req.user.id, status: 'accepted' });
            if(existingFollow) {
                return res.status(200).json(post);
            }else {
                return res.status(403).send('Post is not available for you. Follow the user first.');
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});


module.exports = router;
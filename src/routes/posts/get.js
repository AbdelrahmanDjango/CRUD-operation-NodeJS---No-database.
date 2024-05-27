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
 */

const express = require('express');
const router = express.Router();
const ensureAuth = require('../../middlewares/auth')
const Post = require('../../models/postModel')
const User = require('../../models/userModel')
const Comment = require('../../models/commentModel')

router.get('/', async (req, res) => {
    try{
        const posts = await Post.find({privacy : 'public'})
        .sort({createdAt : -1})
        .populate('comments')
        // To get specify fields by populate, put fields name in Array
        // .populate('comments', ['name', 'comment', 'createdAt'])
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

router.get('/comments', async (req, res) => {
    const comments = await Comment.find()
    // .populate('userId', 'name');
    return res.status(200).json({comments : comments})
})

// router.get('/:_id', ensureAuth(), async(req, res) => {
//     try{
//         const post = await Post.findById(req.params._id)
//         return res.status(200).json(post)
//     }catch(err){
//         console.log(err);
//         res.send('post not found')
//     }
// })

module.exports = router;
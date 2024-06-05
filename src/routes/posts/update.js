/**
 * @swagger
 * /posts/update/{id}:
 *   put:
 *     summary: Update a post
 *     description: Update a post by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *             required:
 *               - body
 *     responses:
 *       '200':
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Updated:
 *                   type: string
 *                   description: Confirmation message
 *                 validatedPostData:
 *                   type: object
 *                   description: Updated post data
 *       '400':
 *         description: Invalid request or post does not exist
 *       '403':
 *         description: Unauthorized - Invalid authorization
 *       '500':
 *         description: Internal server error
 */

const express = require('express');
const Joi = require('joi');
const ensureAuth = require('../../middlewares/auth');
const getPost = require('../../middlewares/getPost');
const Post = require('../../models/postModel');
const User = require('../../models/userModel');
const router = express.Router();

router.put('/update/:postId', ensureAuth(), getPost, async (req, res) => {
    try {
        const post = await req.targetPost;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(403).send('Invalid authorization.');
        }

        if (user.id !== post.userId.toString()) {
            return res.status(400).send('You can\'t update a post that does not belong to you.');
        }

        const validatedPostData = await validationPost(req.body);
        await Post.findByIdAndUpdate(req.params.postId, { body: validatedPostData.body });

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
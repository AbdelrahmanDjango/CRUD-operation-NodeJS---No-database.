/**
 * @swagger
 * /posts/delete/{id}:
 *   delete:
 *     summary: Delete a post
 *     description: Delete a post by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to delete
 *     responses:
 *       '200':
 *         description: Post deleted successfully
 *       '400':
 *         description: Invalid request or post does not exist
 *       '403':
 *         description: Unauthorized - Missing or invalid authentication token
 *       '500':
 *         description: Internal server error
 */

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
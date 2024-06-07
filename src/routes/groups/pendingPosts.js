/**
 * @swagger
 * /groups/{groupId}/pending_posts:
 *   get:
 *     summary: Retrieve pending posts for a group
 *     description: Retrieves all posts in a specified group that are pending approval.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group to retrieve pending posts from
 *     responses:
 *       '200':
 *         description: List of pending posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pendingPosts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       '404':
 *         description: No pending posts found
 *       '403':
 *         description: Access denied - only group owner or admin can access this endpoint
 *       '500':
 *         description: Internal server error
 *
 * /groups/{groupId}/pending_posts/{postId}/response:
 *   patch:
 *     summary: Respond to a pending post request
 *     description: Responds to a pending post request by either accepting or rejecting it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to respond to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostResponse'
 *     responses:
 *       '200':
 *         description: Successfully responded to the post request
 *       '400':
 *         description: No pending post found with this ID
 *       '403':
 *         description: Access denied - only group owner or admin can perform this action
 *       '500':
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         content:
 *           type: string
 *         postStatusGroup:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *     PostResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [accepted, rejected]
 *       required:
 *         - status
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
const getUserOrMembershipOrGroup = require("../../middlewares/userAndGroup");
const Group = require('../../models/groupModel');
const Membership = require('../../models/membershipModel');
const User = require('../../models/userModel');
const Post = require("../../models/postModel");

router.get('/:groupId/pending_posts', ensureAuth(), async(req, res) => {
    try{
        const groupOwner = await User.findById(req.user.id);
        const isAdmin = await Membership.findOne({userId : req.user.id, groupId: req.params.groupId, role : 'admin'})
        if(!groupOwner || (!groupOwner && !isAdmin)){
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
        };
        const group = await Group.findById(req.params.groupId);
        if((groupOwner.id !== group.userId && !isAdmin) || (groupOwner.id !== group.userId && !isAdmin)){
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
        };
        const pendingPosts = await Post.find({ groupId: req.params.groupId, postStatusGroup: 'pending' });
        if(pendingPosts.length > 0) { 
            return res.status(200).json({ pendingPosts : pendingPosts });
        }
        return res.status(404).send('No pending posts requests.');
    }catch(err){
        console.log(err);
        return res.send('Server error.')
    }
});


router.patch('/:groupId/pending_posts/:postId/response', ensureAuth(), async(req, res) => {
    try{
        const groupOwner = await User.findById(req.user.id);
        const isAdmin = await Membership.findOne({userId : req.user.id, groupId: req.params.groupId, role : 'admin'})
        if(!groupOwner || (!groupOwner && !isAdmin)){
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
        };
        const group = await Group.findById(req.params.groupId);
        if((groupOwner.id !== group.userId && !isAdmin) || (groupOwner.id !== group.userId && !isAdmin)){
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
        };
        const pendingPost = await Post.findOne({groupId : req.params.groupId, _id : req.params.postId, postStatusGroup : 'pending'});
        if(!pendingPost){
            return res.status(400).send('No pending post with this ID.');
        }else{
            const response = await validationResponse(req.body);
            if(response.status === 'rejected'){
                await Post.findOneAndDelete({groupId : req.params.groupId, _id: req.params.postId, postStatusGroup : 'pending'});
                return res.status(200).send(`Post ${response.status} successfully.`)
            }else{
                pendingPost.postStatusGroup = response.status
                await pendingPost.save();
                return res.status(200).send(`Post ${response.status}.`);
            }
        }
        
    }catch(err){
        console.log(err);
        return res.send('Server error.')
    }
});


async function validationResponse(pendingPost) {
    const schema = Joi.object({
      status : Joi.string().valid('accepted', 'rejected').required(),
    });
    try {
      return await schema.validateAsync(pendingPost);
    } catch (err) {
      throw err;
    }
}

module.exports = router;
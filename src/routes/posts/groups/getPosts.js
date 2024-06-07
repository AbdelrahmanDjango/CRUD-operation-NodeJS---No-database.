/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Operations related to posts within a group.
 */

/**
 * @swagger
 * /groups/{groupId}/posts:
 *   get:
 *     summary: Retrieve all posts in a group
 *     description: Retrieve all posts with 'accepted' status in a specified group. Users must be members of the group to view the posts if the group is private.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group to retrieve posts from
 *     responses:
 *       '200':
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       '400':
 *         description: Access denied or group not joined
 *       '404':
 *         description: No posts found
 *       '500':
 *         description: Server error
 *
 * /groups/{groupId}/posts/{postId}:
 *   get:
 *     summary: Retrieve a specific post from a group
 *     description: Retrieve a specific post by ID from a specified group with 'accepted' status. Users must be members of the group to view the post if the group is private.
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
 *         description: ID of the post to retrieve
 *     responses:
 *       '200':
 *         description: A single post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '400':
 *         description: Access denied or post not found
 *       '404':
 *         description: No post found with the given ID
 *       '500':
 *         description: Server error
 *
 * /groups/{groupId}/{userId}/posts:
 *   get:
 *     summary: Retrieve all posts by a user in a group
 *     description: Retrieve all posts made by a specific user in a specified group. Users must be members of the group to view posts if the group is private.
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
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose posts to retrieve
 *     responses:
 *       '200':
 *         description: A list of posts by the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       '400':
 *         description: Access denied or user not a member of the group
 *       '404':
 *         description: No posts found for the user
 *       '500':
 *         description: Server error
 *
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The post's unique identifier
 *         groupId:
 *           type: string
 *           description: ID of the group the post belongs to
 *         userId:
 *           type: string
 *           description: ID of the user who created the post
 *         content:
 *           type: string
 *           description: Content of the post
 *         postStatusGroup:
 *           type: string
 *           description: Status of the post within the group (e.g., 'accepted')
 *       required:
 *         - _id
 *         - groupId
 *         - userId
 *         - content
 *         - postStatusGroup
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

const express = require('express');
const router = express.Router();
const ensureAuth = require('../../../middlewares/auth')
const getUserOrMembershipOrGroup = require('../../../middlewares/userAndGroup')
const Post = require('../../../models/postModel')
const User = require('../../../models/userModel')
const Membership = require('../../../models/membershipModel')
const Group = require('../../../models/groupModel')

router.get('/:groupId/posts', ensureAuth(), async(req, res) =>{
    try{
        const group = await Group.findById(req.params.groupId);
        const userAuth = await User.findById(req.user.id);
        const groupOwner = await Group.findOne({userId : userAuth.id});
        const isMembership = await Membership.findOne({userId: userAuth.id, groupId: group.id})
        if(group.privacyStatus === 'private'){
            if(groupOwner || isMembership){
                const posts = await Post.find({groupId: group.id, postStatusGroup: 'accepted'});
                if (posts.length > 0){
                    return res.status(200).json({ Posts: posts });
                }else{
                    return res.status(404).send('There are no posts');
                }
            }else{
                return res.status(400).send(`${group.groupName} is private group. Join group first.`)
            }
        }

    }catch(err){
        console.log(err);
        return res.send('Server error.');
    };

});


router.get('/:groupId/posts/:postId', ensureAuth(), async(req, res) =>{
    try{
        const group = await Group.findById(req.params.groupId);
        const userAuth = await User.findById(req.user.id);
        const groupOwner = await Group.findOne({userId : userAuth.id});
        const isMembership = await Membership.findOne({userId: userAuth.id, groupId: group.id})
        if(group.privacyStatus === 'private'){
            if(groupOwner || isMembership){
                const post = await Post.findById({_id: req.params.postId, groupId: group.id, postStatusGroup: 'accepted'});
                if (post){
                    return res.status(200).json({ Posts: post });
                }else{
                    return res.status(404).send('There are no posts');
                }
            }else{
                return res.status(400).send(`${group.groupName} is private group. Join group first.`)
            }
        }

    }catch(err){
        console.log(err);
        return res.send('Server error.');
    };

})


router.get('/:groupId/:userId/posts/', ensureAuth(), async(req, res) =>{
    try{
        const group = await Group.findById(req.params.groupId);
        const userAuth = await User.findById(req.user.id);
        const targetUser = await User.findById(req.params.userId);
        const groupOwner = await Group.findOne({userId : userAuth.id});
        const isMembership = await Membership.findOne({userId: userAuth.id, groupId: group.id})
        if(group.privacyStatus === 'private'){
            if(groupOwner || isMembership){
                const posts = await Post.find({ userId: req.params.userId });
                if(posts.length > 0){
                    return res.status(200).json({ Posts: posts });
                }else{
                    return res.status(404).send('No posts for this user.');
                }
            }else{
                return res.status(400).send(`${group.groupName} is private group. Join group first.`)
            }
        }

    }catch(err){
        console.log(err);
        return res.send('Server error.');
    };

})
    
        

        
        

    


module.exports = router;
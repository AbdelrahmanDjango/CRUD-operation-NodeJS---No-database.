/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Operations related to creating posts within groups.
 */

/**
 * @swagger
 * /groups/{groupId}/post/create:
 *   post:
 *     summary: Create a new post in a group
 *     description: Allows a user who is a member of a group to create a post. The post will be reviewed by admins if the group's post status is 'pending'.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group where the post will be created
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             body:
 *               type: string
 *               description: Content of the post
 *         description: Content of the post to be created
 *     responses:
 *       '200':
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '404':
 *         description: Group not found or user not a member of the group
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
 *           description: Unique identifier for the post
 *         body:
 *           type: string
 *           description: Content of the post
 *         name:
 *           type: string
 *           description: Name of the user who created the post
 *         userId:
 *           type: string
 *           description: ID of the user who created the post
 *         groupId:
 *           type: string
 *           description: ID of the group where the post belongs
 *         postStatusGroup:
 *           type: string
 *           description: Status of the post within the group (e.g., 'pending')
 *       required:
 *         - _id
 *         - body
 *         - name
 *         - userId
 *         - groupId
 *         - postStatusGroup
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

const express = require("express");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../../middlewares/auth");
const getUserOrMembershipOrGroup = require("../../../middlewares/userAndGroup");
const User = require('../../../models/userModel');
const Group = require('../../../models/groupModel');
const Membership = require('../../../models/membershipModel');
const Post = require("../../../models/postModel");

router.post('/:groupId/post/create', ensureAuth(), async(req, res) =>{
    try{
      const group = await Group.findById(req.params.groupId)
      if(!group) return res.status.apply(404).send('Group not found.')
      const user = await User.findById(req.user.id);
      const isMembership = await Membership.findOne({groupId: group.id, userId: user.id, status: 'accepted'});
      if(!isMembership){
        return res.status(404).send(`You don\'t have access to doing posting in ${group.groupName} group, join group first.`)
      }
      const post = await validationPost(req.body);
      if(group.postStatus === 'pending'){
        const newPost = new Post({
          body: req.body.body,
          name: user.name,
          userId: user._id,
          groupId: group.id,
          postStatusGroup : group.postStatus,
        });
        const savePost = await newPost.save();
        user.posts = user.posts || [];
        user.posts.push(savePost);
        await user.save();
        return res.status(200).send('Post sent to the admins. Post pending now.')
      }else{
        const newPost = new Post({
          body: req.body.body,
          name: user.name,
          userId: user._id,
          groupId: group.id,
          postStatusGroup : group.postStatus,
        });
        const savePost = await newPost.save();
        user.posts = user.posts || [];
        user.posts.push(savePost);
        await user.save();
        return res.status(200).send(savePost);
      }
    }catch(err){
        console.log(err);
        return res.send('Server error.');
    };
});


async function validationPost(post) {
    const schema = Joi.object({
      body: Joi.string().required().min(1),
    });
    try {
      return await schema.validateAsync(post);
    } catch (err) {
      throw err;
    }
  }
  
  module.exports = router;
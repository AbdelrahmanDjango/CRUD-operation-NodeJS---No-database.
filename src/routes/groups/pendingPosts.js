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
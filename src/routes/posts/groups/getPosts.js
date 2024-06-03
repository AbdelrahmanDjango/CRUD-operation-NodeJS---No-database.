const express = require('express');
const router = express.Router();
const ensureAuth = require('../../../middlewares/auth')
const Post = require('../../../models/postModel')
const User = require('../../../models/userModel')
const Membership = require('../../../models/membershipModel')
const Group = require('../../../models/groupModel')

router.get('/:groupId/:userId/posts', ensureAuth(), async(req, res) =>{
    try{
        const group = await Group.findById(req.params.groupId);
        if(!group){
            return res.status(404).send('Group not found.');
        };
        const user = await User.findById(req.user.id);
        const isMembership = await Membership.findOne({groupId: group.id, userId: user.id, status: 'accepted'});
        if(!isMembership){
            return res.status(404).send(`You don\'t have access to doing posting in ${group.groupName} group, join group first.`)
        };
        const userPosts = await User.findById(req.params.userId);
        const isUserMembership = await Membership.findOne({groupId: group.id, userId: user.id, status: 'accepted'});
        if(!isUserMembership){
            return res.status(404).send(`You don\'t have access to doing posting in ${group.groupName} group, join group first.`)
        };
        const posts = await Post.find({userId: userPosts.id, groupId: group.id});
        if(!posts){
            return res.status(`This user has no posts in ${group.groupName} group`);
        };
        return res.status(200).json({Posts: posts});
    }catch(err){
        console.log(err);
        return res.send('Server error.');
    };
});

module.exports = router;
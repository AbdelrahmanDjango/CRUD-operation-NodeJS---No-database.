const express = require("express");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const getUserOrMembershipOrGroup = require("../../middlewares/userAndGroup");
const User = require('../../models/userModel');
const Membership = require('../../models/membershipModel');
const Group = require("../../models/groupModel");

// Group owner  and admin.
router.patch('/:groupId/post_status/edit', ensureAuth(), async(req, res) => {
    try{
        const groupOwner = await User.findById(req.user.id);
        const isAdmin = await Membership.findOne({userId : req.user.id, groupId: req.params.groupId, role : 'admin'})
        if(!groupOwner || (!groupOwner && !isAdmin)){
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
        };

        const group = await Group.findById(req.params.groupId);
        if(!group) return res.status(404).send('Group not found.')
        if((groupOwner.id !== group.userId && !isAdmin) || (groupOwner.id !== group.userId && !isAdmin)){
            console.log('hello')
            console.log('group name:', group.groupName)
            console.log('group privacy:', group.privacyStatus)
            console.log('user name:', groupOwner.name)
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
        };
        if((groupOwner.id !== group.userId && !isAdmin) || (groupOwner.id !== group.userId && !isAdmin)){
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
        }
        const editPostStatus = await validationPostStatus(req.body);
        if(editPostStatus.postStatus === group.postStatus){
            return res.status(200).send('Nothing have changed.');
        };
        group.postStatus = editPostStatus.postStatus;
        group.save();
        console.log(group.postStatus)
        return res.status(200).send(`Post status in ${group.groupName} group is ${group.postStatus} now.\nChanged by ${req.user.email}.`)
    }catch(err){
        console.log(err);
        return res.send('Server error.')
    }
});

async function validationPostStatus(postStatus) {
    const schema = Joi.object({
      postStatus : Joi.string().valid('pending', 'accepted').required().min(1),
    });
    try {
      return await schema.validateAsync(postStatus);
    } catch (err) {
      throw err;
    }
};

module.exports = router;

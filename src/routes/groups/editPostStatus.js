const express = require("express");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const getMembershipAndGroup = require("../../middlewares/userAndGroup");
const User = require('../../models/userModel');
const Membership = require('../../models/membershipModel');

// Group owner  and admin.
router.patch('/:groupId/post_status/edit', ensureAuth, getMembershipAndGroup, async(req, res) => {
    try{
        const groupOwner = await User.findById(req.user.id);
        const isAdmin = await Membership.findOne({userId : req.user.id, groupId: req.params.groupId, role : 'admin'})
        if(!groupOwner || (!groupOwner && !isAdmin)){
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
        };

        const group = await req.targetGroup;
        if((groupOwner.name !== group.name && !isAdmin) || (groupOwner.name !== group.name && !isAdmin)){
            console.log('hello')
            console.log('group name:', group.name)
            console.log('group privacy:', group.privacyStatus)
            console.log('user name:', groupOwner.name)
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
        };
        if((groupOwner.id !== group.userId && !isAdmin) || (groupOwner.id !== group.userId && !isAdmin)){
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
        }
        const editPostStatus = await validationPostStatus(req.body);
        if(editPostStatus.post_status === group.postStatus){
            return res.status(200).send('Nothing have changed.');
        };
        group.postStatus = editPostStatus.post_status;
        group.save();
        return res.status(200).send(`Post status in ${group.groupName} group is ${group.postStatus} now.\nChanged by ${req.user.id}.`)
    }catch(err){
        console.log(err);
        return res.send('Server error.')
    }
});

async function validationPostStatus(post_status) {
    const schema = Joi.object({
      post_status : Joi.string().valid('pending', 'accepted').required().min(1),
    });
    try {
      return await schema.validateAsync(post_status);
    } catch (err) {
      throw err;
    }
};

module.exports = router;

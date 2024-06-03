const express = require("express");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const User = require('../../models/userModel');
const Group = require('../../models/groupModel');
const Membership = require('../../models/membershipModel');

// Only owner group.
router.patch('/:groupId/:userId/role/edit', ensureAuth(), async(req, res) => {
    try{
        const groupOwner = await User.findById(req.user.id);
        const group = await Group.findById(req.params.groupId);
        if(!group){
            return res.status(400).send('Group not found.')
        };
        if(groupOwner.name !== group.name || (groupOwner.name !== group.name && group.privacyStatus === 'private')){
            console.log('group name:', group.name)
            console.log('group privacy:', group.privacyStatus)
            console.log('user name:', groupOwner.name)
            return res.status(403).send('Access denied. Only the group owner can perform this action.');
        }
        const isMembership = await Membership.findOne({userId : req.params.userId, groupId : req.params.groupId});
        if(!isMembership){
            return res.status(400).send('User not found.')
        };
        const editRole = await validationUserRole(req.body);
        if(editRole.role === isMembership.role){
            return res.status(200).send('Nothing have changed.')
        };
        isMembership.role = editRole.role;
        isMembership.save();
        return res.status(200).send(`You gave ${isMembership.userId} a new role in ${group.groupName} group: ${isMembership.role}'s role.`)

    }catch(err){
        console.log(err);
        return res.send('Server error');
    }
});


async function validationUserRole(role) {
    const schema = Joi.object({
      role : Joi.string().valid('user', 'admin').required().min(1),
    });
    try {
      return await schema.validateAsync(role);
    } catch (err) {
      throw err;
    }
};

module.exports = router;
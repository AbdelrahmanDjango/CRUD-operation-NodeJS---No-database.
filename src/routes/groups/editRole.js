const express = require("express");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const User = require('../../models/userModel');
const Group = require('../../models/groupModel');
const Membership = require('../../models/membershipModel');

router.patch('/:groupId/:userId/role/edit', ensureAuth(), async(req, res) => {
    try{
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(400).send('User not found');
        };
        const group = await Group.findById(req.params.groupId);
        if(!group){
            return res.status(400).send('Group not found.')
        };
        if(user.name !== group.name || (user.name !== group.name && group.privacyStatus === 'private')){
            console.log('group name:', group.name)
            console.log('group privacy:', group.privacyStatus)
            console.log('user name:', user.name)
            return res.status(400).send('You don\'t have access to doing this.')
        }
        const userIsMember = await Membership.findOne({userId : req.params.userId, groupId : req.params.groupId});
        if(!userIsMember){
            return res.status(400).send('User not found.')
        };
        const editRole = await validationUserRole(req.body);
        if(editRole.role === userIsMember.role){
            return res.status(200).send('Nothing have changed.')
        };
        userIsMember.role = editRole.role;
        userIsMember.save();
        return res.status(200).send(`You gave ${userIsMember.userId} a new role in ${group.groupName} group: ${userIsMember.role}'s role.`)

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
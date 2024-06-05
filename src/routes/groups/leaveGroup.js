const express = require("express");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const getUserOrMembershipOrGroup = require("../../middlewares/userAndGroup");
const User = require('../../models/userModel');


router.delete('/:groupId/:userId/leave', ensureAuth(), getUserOrMembershipOrGroup, async(req, res) => {
    try{
        const user = await User.findById(req.user.id);
        const group = await req.targetGroup;
        const userToLeave = await req.targetUser;
        const isMembership = await req.targetMembership;
        if(user.id !== isMembership.userId){
            return res.status(400).send('Invalid Authorization.')
        }
        // const deleteMember = await req.targetMembership;
        await isMembership.deleteOne();
        return res.status(200).send(`You leaved ${group.groupName} successfully.`);
    }catch(err){
        console.log(err);
        return res.send('Server error.');
    };
});

module.exports = router;
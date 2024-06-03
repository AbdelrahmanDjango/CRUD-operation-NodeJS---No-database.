const express = require("express");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const getMembershipAndGroup = require("../../middlewares/userAndGroup");
const User = require('../../models/userModel');
const Membership = require('../../models/membershipModel');

router.delete('/:groupId/delete', ensureAuth, getMembershipAndGroup, async(req, res) =>{
    try{
        const groupOwner = await User.findById(req.user.id);
        const group = await req.targetGroup;
        if(group.userId !== groupOwner.id){
            return res.status(403).send('Access denied. Only the group owner can perform this action.');
        };
        // Delete memberships in target group.
        await Membership.deleteMany({groupId: group.id});
        await group.deleteOne();
        return res.status(200).send('Group deleted successfully.');
    }catch(err){
        console.log(err);
        return res.send('Server error.')
    }
});

module.exports = router;
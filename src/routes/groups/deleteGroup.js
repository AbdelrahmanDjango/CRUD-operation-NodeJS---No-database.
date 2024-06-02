const express = require("express");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const User = require('../../models/userModel');
const Group = require('../../models/groupModel');
const Membership = require('../../models/membershipModel');

router.delete('/:groupId/delete', ensureAuth(), async(req, res) =>{
    try{
        const groupOwner = await User.findById(req.user.id);
        const group = await Group.findById(req.params.groupId);
        if(!group){
            return res.status(404).send('Group not found.');
        };
        if(group.userId !== groupOwner.id){
            return res.status(403).send('Access denied. Only the group owner can perform this action.');
        };
        await Membership.deleteMany({groupId: group.id});
        await group.deleteOne();
        return res.status(200).send('Group deleted successfully.');
    }catch(err){
        console.log(err);
        return res.send('Server error.')
    }
});

module.exports = router;
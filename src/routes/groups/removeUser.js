const express = require("express");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const getMembershipAndGroup = require("../../middlewares/userAndGroup");
const User = require('../../models/userModel');
const Group = require('../../models/groupModel');
const Membership = require('../../models/membershipModel');

// Group owner  and admin.
router.delete('/:groupId/:userId/delete', ensureAuth, getMembershipAndGroup, async(req, res) => {
    try{
        const groupOwner = await User.findById(req.user.id);
        const isAdmin = await Membership.findOne({userId : req.user.id, groupId: req.params.groupId, role : 'admin'})
        if(!groupOwner || (!groupOwner && !isAdmin)){
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
        };

        const group = await req.targetGroup;

        // Is authenticated user not the group owner or admin?
        if((groupOwner.id !== group.userId && !isAdmin) || (groupOwner.id !== group.userId && !isAdmin)){
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
        };
        // Is user to delete in group?
        const userToDelete = await req.targetUser;
        const isMembership = await req.targetMembership;

        // Is group owner tying to delete him self?
        if(userToDelete.id === groupOwner._id){
            const isMembershipsNotEmpty = await Membership.find();

            if(isMembershipsNotEmpty.length !== 0){
                // When group owner leaving, the first member in group will be the owner.
                const newOwner = await Membership.findOne({groupId: req.params.groupId}).sort({createdAt: 1})
                await Group.findOneAndUpdate({userId: groupOwner._id}, {userId: newOwner.userId});
                await Membership.findOneAndDelete({
                    userId: req.params.userId,
                    groupId: req.params.groupId,
                    status: 'accepted'})
            }else{
                // If there is no members in group, owner will leaving and group will delete.
                await Group.findOneAndDelete({userId: groupOwner.id})
                return res.status(200).send('You leaved the group. Group deleted successfully.')
            }
            return res.status(200).send(`You leaved your group. You are not the owner any more.`)
        };
        if(!userToDelete || !isMembership){
            return res.status(404).send('User not exists.');
        };
        if(isMembership.role === 'admin' && !isMembership.userId === req.params.userId){
            return res.status(400).send('You can\'t remove admins.')
        };
        if(isMembership.userId === req.params.userId){
            await Membership.findOneAndDelete({
                userId: req.params.userId,
                groupId: req.params.groupId,
                status: 'accepted'
        });
            return res.status(200).send(`${userToDelete.id} deleted successfully.`)
        };
        
    }catch(err){
        console.log(err);
        return res.send('Server error.')
    }
});

module.exports = router;
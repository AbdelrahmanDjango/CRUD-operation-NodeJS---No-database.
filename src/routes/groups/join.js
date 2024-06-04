const express = require("express");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const getUserOrMembershipOrGroup = require("../../middlewares/userAndGroup");
const Group = require('../../models/groupModel');
const Membership = require('../../models/membershipModel');

router.post('/:groupId/join', ensureAuth, getUserOrMembershipOrGroup, async(req, res) => {
    try{
        // I check user is member or not twice: if group is public; or private.
        const group = await req.targetGroup;
        if(group.privacyStatus === 'public'){
            const isMembership = await Membership.findOne({ userId: req.user.id, groupId: req.params.groupId, status : 'accepted'});
            if(isMembership){
                return res.status(400).send('You are already in this group');
            };
            const newMembership = new Membership({
                userId: req.user.id,
                groupId: req.params.id
            });
            await newMembership.save();
            return res.status(200).send(`Joined ${group.groupName} successfully.`);
        }else{
            const reqeustJoin = new Membership({
                userId: req.user.id,
                groupId: req.params.id,
                status : 'pending'
            });
            const existingJoinRequest = await Membership.findOne({ userId: req.user.id, groupId: req.params.groupId, status : 'pending'});
            if(existingJoinRequest){
                return res.status(400).send('Request join already sent.');
            }
            const isMembership = await Membership.findOne({ userId: req.user.id, groupId: req.params.groupId, status : 'accepted'});
            if(isMembership){
                return res.status(400).send('You are already in this group.');
            }
            reqeustJoin.save();
            return res.status(400).send(`${group.groupName} is private group. Request join is sent to admin.`);
        }
    } catch(err){
        console.log(err);
        return res.send('Server error.');
    }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const getUserOrMembershipOrGroup = require("../../middlewares/userAndGroup");
const Group = require('../../models/groupModel');
const Membership = require('../../models/membershipModel');

router.post('/:groupId/join', ensureAuth(), async(req, res) => {
    try{
        // I check user is member or not twice: if group is public; or private.
        const group = await Group.findById(req.params.groupId)
        if(!group) return res.status(404).send('Group not found.')
        // Group owner can't join in his group (Membership model).
        if(req.user.id === group.userId){
            return res.status(400).send('Un expected error.')
        };
        if(group.privacyStatus === 'public'){
            const isMembership = await Membership.findOne({ userId: req.user.id, groupId: req.params.groupId, status : 'accepted'});
            if(isMembership){
                return res.status(400).send('You are already in this group');
            };
            const newMembership = new Membership({
                userId: req.user.id,
                groupId: req.params.groupId
            });
            await newMembership.save();
            return res.status(200).send(`Joined ${group.groupName} successfully.`);
        }else{
            const reqeustJoin = new Membership({
                userId: req.user.id,
                groupId: req.params.groupId,
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

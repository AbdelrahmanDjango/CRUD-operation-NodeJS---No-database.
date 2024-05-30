const express = require("express");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const Group = require('../../models/groupModel');
const Membership = require('../../models/membershipModel');

router.post('/:id/join', ensureAuth(), async(req, res) => {
    try{
        const group = await Group.findById(req.params.id);
        if(!group){
            return res.status(400).send('Group not found.');
        };
        if(group.privacyStatus === 'public'){
            const existingMembership = await Membership.findOne({ userId: req.user.id, groupId: req.params.id, status : 'accepted'});
            if(existingMembership){
                return res.status(400).send('You are already in this group');
            }
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
            const existingJoinRequest = await Membership.findOne({ userId: req.user.id, groupId: req.params.id, status : 'pending'});
            if(existingJoinRequest){
                return res.status(400).send('Request join already sent.');
            }
            const existingMembership = await Membership.findOne({ userId: req.user.id, groupId: req.params.id, status : 'accepted'});
            if(existingMembership){
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

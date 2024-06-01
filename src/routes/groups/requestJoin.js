const express = require("express");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const Group = require('../../models/groupModel');
const Membership = require('../../models/membershipModel');
const User = require('../../models/userModel');

router.get('/:groupId/requests', ensureAuth(), async(req, res) => {
    try{
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(400).send('User not found.');
        };
        const group = await Group.findById(req.params.groupId);
        if(!group){
            return res.status(400).send('Group not found.');
        };
        if(user.id !== group.userId){
            return res.status(400).send('You don\'t have access on requests join for this group.')
        };
        const joinRequests = await Membership.find({ groupId: group.id, status: 'pending' });
        if(!joinRequests.length) { 
            return res.status(404).send('No pending join requests.');
        }
        return res.status(200).json({ joinRequests : joinRequests });
    }catch(err){
        console.log(err);
        return res.send('Server error.')
    }
});
router.patch('/:groupId/:userId/response', ensureAuth(), async(req, res) => {
    try{
        const groupOwner = await User.findById(req.user.id);
        const isAdmin = await Membership.findOne({userId : req.user.id, groupId: req.params.groupId, role : 'admin'})
        if(!groupOwner || (!groupOwner && !isAdmin)){
            return res.status(400).send('You are not the group owner or admin.')
        };
        const group = await Group.findById(req.params.groupId);
        if(!group){
            return res.status(400).send('Group not found.');
        };
        console.log(group.userId);
        if((groupOwner.id !== group.userId && !isAdmin) || (groupOwner.id !== group.userId && !isAdmin)){
            return res.status(400).send('You don\'t have access on requests join for this group.')
        };
        const joinRequest = await Membership.findOne({userId : req.params.userId, groupId : group.id, status : 'pending'});
        if(!joinRequest){
            return res.status(400).send('There is no join request.');
        }else{
            const response = await validationResponse(req.body);
            if(response.status === 'rejected'){
                await Membership.findOneAndDelete({userId : req.params.userId, groupId: group.id, status : 'pending'});
                return res.status(200).send(`Join request ${response.status}.`)
            }else{
                joinRequest.status = response.status
                await joinRequest.save();
                return res.status(200).send(`Follow request ${response.status}.`);
            }
        }
        
    }catch(err){
        console.log(err);
        return res.send('Server error.')
    }
});

async function validationResponse(reqeustJoin) {
    const schema = Joi.object({
      status : Joi.string().valid('accepted', 'rejected').required(),
    });
    try {
      return await schema.validateAsync(reqeustJoin);
    } catch (err) {
      throw err;
    }
}

module.exports = router;
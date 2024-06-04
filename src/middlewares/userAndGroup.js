const User = require('../models/userModel');
const Group = require('../models/groupModel');
const Membership = require('../models/membershipModel');

const getUserOrMembershipOrGroup = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            console.log('User not found');
            return res.status(400).send('User not found.');
        }
        const group = await Group.findById(req.params.groupId);
        if (!group) {
            console.log('Group not found');
            return res.status(400).send('Group not found.');
        }
        
        const isMembership = await Membership.findOne({
            userId: req.params.userId,
            groupId: req.params.groupId,
            status: 'accepted',
        });

        req.targetUser = user;
        req.targetGroup = group;
        req.targetMembership = isMembership;
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error.');
    }
};
module.exports = getUserOrMembershipOrGroup;
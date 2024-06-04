const express = require("express");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const getUserOrMembershipOrGroup = require("../../middlewares/userAndGroup");
const User = require('../../models/userModel');
const Group = require('../../models/groupModel');

router.patch('/:id/privacy', ensureAuth, getUserOrMembershipOrGroup, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const group = await req.targetGroup;

        if(user.id !== group.userId) {
            return res.status(403).send('Only admins can change privacy');
        }

        const newPrivacy = await validationPrivacyGroup(req.body);
        if(newPrivacy.privacy === group.privacyStatus) {
            return res.status(400).send(`The ${group.groupName} privacy is already ${newPrivacy.privacy}`);
        }

        const savePrivacy = await Group.findByIdAndUpdate(group.id, { privacyStatus: newPrivacy.privacy });
        return res.status(200).send(`The ${group.groupName} privacy is ${newPrivacy.privacy} now.`);
    }catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
});


async function validationPrivacyGroup(group) {
    const schema = Joi.object({
      privacy : Joi.string().valid('public', 'private').required().min(1),
    });
    try {
      return await schema.validateAsync(group);
    } catch (err) {
      throw err;
    }
};

module.exports = router;
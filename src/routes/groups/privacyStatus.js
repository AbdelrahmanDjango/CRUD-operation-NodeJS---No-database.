/**
 * @swagger
 * /groups/{groupId}/privacy:
 *   patch:
 *     summary: Update the privacy status of a group
 *     description: Allows the group owner to update the privacy status of the group.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group whose privacy status needs to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GroupPrivacy'
 *     responses:
 *       '200':
 *         description: Successfully updated the privacy status of the group
 *       '400':
 *         description: The provided privacy status is the same as the current status
 *       '403':
 *         description: Access denied - only the group owner can update the privacy status
 *       '500':
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     GroupPrivacy:
 *       type: object
 *       properties:
 *         privacy:
 *           type: string
 *           enum: [public, private]
 *           description: The new privacy status for the group
 *       required:
 *         - privacy
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

const express = require("express");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const getUserOrMembershipOrGroup = require("../../middlewares/userAndGroup");
const User = require('../../models/userModel');
const Group = require('../../models/groupModel');
const Membership = require('../../models/membershipModel');

router.patch('/:groupId/privacy', ensureAuth(), async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const group = await Group.findById(req.params.groupId);
      const isMembership = await Membership.findOne({groupId: group.id, userId: user.id, status: 'accepted'});
      if(!isMembership){
        if(user.id !== group.userId) {
             return res.status(403).send('Un expected error.');
        }
        const newPrivacy = await validationPrivacyGroup(req.body);
        if(newPrivacy.privacy === group.privacyStatus) {
            return res.status(400).send(`The ${group.groupName} privacy is already ${newPrivacy.privacy}`);
        }
        const savePrivacy = await Group.findByIdAndUpdate(group.id, { privacyStatus: newPrivacy.privacy });
        return res.status(200).send(`The ${group.groupName} privacy is ${newPrivacy.privacy} now.`);
      }
    
    
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
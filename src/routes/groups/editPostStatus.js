/**
 * @swagger
 * /groups/{groupId}/post_status/edit:
 *   patch:
 *     summary: Edit the post status of a group
 *     description: >
 *       Only the group owner or an admin can edit the post status of the group.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the group whose post status is to be edited
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postStatus:
 *                 type: string
 *                 enum: ['pending', 'accepted']
 *                 example: "pending"
 *             required:
 *               - postStatus
 *     responses:
 *       '200':
 *         description: Post status edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Post status in {groupName} group is {postStatus} now.\nChanged by {userEmail}."
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Access denied. Only the group owner or an admin can perform this action."
 *       '404':
 *         description: Group not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Group not found."
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Server error."
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *     Group:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         groupName:
 *           type: string
 *         name:
 *           type: string
 *         userId:
 *           type: string
 *         postStatus:
 *           type: string
 *         privacyStatus:
 *           type: string
 *     Membership:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         groupId:
 *           type: string
 *         role:
 *           type: string
 *         status:
 *           type: string
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
const Membership = require('../../models/membershipModel');
const Group = require("../../models/groupModel");

// Group owner  and admin.
router.patch('/:groupId/post_status/edit', ensureAuth(), async(req, res) => {
    try{
        const groupOwner = await User.findById(req.user.id);
        const isAdmin = await Membership.findOne({userId : req.user.id, groupId: req.params.groupId, role : 'admin'})
        if(!groupOwner || (!groupOwner && !isAdmin)){
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
        };

        const group = await Group.findById(req.params.groupId);
        if(!group) return res.status(404).send('Group not found.')
        if((groupOwner.id !== group.userId && !isAdmin) || (groupOwner.id !== group.userId && !isAdmin)){
            console.log('hello')
            console.log('group name:', group.groupName)
            console.log('group privacy:', group.privacyStatus)
            console.log('user name:', groupOwner.name)
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
        };
        if((groupOwner.id !== group.userId && !isAdmin) || (groupOwner.id !== group.userId && !isAdmin)){
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
        }
        const editPostStatus = await validationPostStatus(req.body);
        if(editPostStatus.postStatus === group.postStatus){
            return res.status(200).send('Nothing have changed.');
        };
        group.postStatus = editPostStatus.postStatus;
        group.save();
        console.log(group.postStatus)
        return res.status(200).send(`Post status in ${group.groupName} group is ${group.postStatus} now.\nChanged by ${req.user.email}.`)
    }catch(err){
        console.log(err);
        return res.send('Server error.')
    }
});

async function validationPostStatus(postStatus) {
    const schema = Joi.object({
      postStatus : Joi.string().valid('pending', 'accepted').required().min(1),
    });
    try {
      return await schema.validateAsync(postStatus);
    } catch (err) {
      throw err;
    }
};

module.exports = router;

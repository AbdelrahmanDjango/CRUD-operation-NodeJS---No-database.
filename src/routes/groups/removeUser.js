/**
 * @swagger
 * /groups/{groupId}/{userId}/delete:
 *   delete:
 *     summary: Delete a user from a group
 *     description: >
 *       Only the group owner or an admin can delete a user from the group. 
 *       If the group owner deletes themselves and there are other members, the first member becomes the new owner.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the group
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "You leaved the group. Group deleted successfully."
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "You can't remove admins."
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Access denied. Only the group owner or an admin can perform this action."
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "User not exists."
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
 *         name:
 *           type: string
 *         userId:
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
const Group = require('../../models/groupModel');
const Membership = require('../../models/membershipModel');

// Group owner  and admin.
router.delete('/:groupId/:userId/delete', ensureAuth(), getUserOrMembershipOrGroup, async(req, res) => {
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
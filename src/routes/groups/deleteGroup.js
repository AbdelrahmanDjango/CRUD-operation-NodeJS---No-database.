
/**
 * @swagger
 * /groups/{groupId}/delete:
 *   delete:
 *     summary: Delete a group
 *     description: >
 *       Only the group owner can delete the group. This will also delete all memberships associated with the group.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the group to delete
 *     responses:
 *       '200':
 *         description: Group deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Group deleted successfully."
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Access denied. Only the group owner can perform this action."
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

router.delete('/:groupId/delete', ensureAuth(), getUserOrMembershipOrGroup, async(req, res) =>{
    try{
        const groupOwner = await User.findById(req.user.id);
        const group = await req.targetGroup;
        if(group.userId !== groupOwner.id){
            return res.status(403).send('Access denied. Only the group owner can perform this action.');
        };
        // Delete memberships in target group.
        await Membership.deleteMany({groupId: group.id});
        await group.deleteOne();
        return res.status(200).send('Group deleted successfully.');
    }catch(err){
        console.log(err);
        return res.send('Server error.')
    }
});

module.exports = router;
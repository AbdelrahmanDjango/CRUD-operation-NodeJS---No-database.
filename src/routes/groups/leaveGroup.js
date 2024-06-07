/**
 * @swagger
 * /groups/{groupId}/{userId}/leave:
 *   delete:
 *     summary: Leave a group
 *     description: >
 *       Users can leave a group, which involves removing their membership from the group.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the group to leave
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user who wants to leave the group
 *     responses:
 *       '200':
 *         description: Successfully left the group
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "You left {groupName} successfully."
 *       '400':
 *         description: Invalid Authorization
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid Authorization."
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Server error."
 *
 * components:
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


router.delete('/:groupId/:userId/leave', ensureAuth(), getUserOrMembershipOrGroup, async(req, res) => {
    try{
        const user = await User.findById(req.user.id);
        const group = await req.targetGroup;
        const userToLeave = await req.targetUser;
        const isMembership = await req.targetMembership;
        if(user.id !== isMembership.userId){
            return res.status(400).send('Invalid Authorization.')
        }
        // const deleteMember = await req.targetMembership;
        await isMembership.deleteOne();
        return res.status(200).send(`You leaved ${group.groupName} successfully.`);
    }catch(err){
        console.log(err);
        return res.send('Server error.');
    };
});

module.exports = router;
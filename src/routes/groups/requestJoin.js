/**
 * @swagger
 * /groups/{groupId}/requests:
 *   get:
 *     summary: Retrieve join requests for a group
 *     description: Retrieve all pending join requests for a specified group.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group to retrieve join requests for
 *     responses:
 *       '200':
 *         description: A list of pending join requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 joinRequests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Membership'
 *       '403':
 *         description: Access denied - Only the group owner or an admin can perform this action
 *       '404':
 *         description: No pending join requests found
 *       '500':
 *         description: Internal server error
 *
 * /groups/{groupId}/{userId}/response:
 *   patch:
 *     summary: Respond to a join request
 *     description: Accept or reject a join request for a specified group.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose join request is being responded to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JoinRequestResponse'
 *     responses:
 *       '200':
 *         description: Successfully responded to the join request
 *       '400':
 *         description: No join request found or invalid response status
 *       '403':
 *         description: Access denied - Only the group owner or an admin can perform this action
 *       '500':
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     Membership:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         groupId:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *       required:
 *         - userId
 *         - groupId
 *         - status
 *     JoinRequestResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [accepted, rejected]
 *       required:
 *         - status
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
const Group = require('../../models/groupModel');
const Membership = require('../../models/membershipModel');
const User = require('../../models/userModel');

router.get('/:groupId/requests', ensureAuth(), async(req, res) => {
    try{
        const groupOwner = await User.findById(req.user.id);
        const isAdmin = await Membership.findOne({userId : req.user.id, groupId: req.params.groupId, role : 'admin'})
        if(!groupOwner || (!groupOwner && !isAdmin)){
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
        };
        const group = await Group.findById(req.params.groupId);
        if((groupOwner.id !== group.userId && !isAdmin) || (groupOwner.id !== group.userId && !isAdmin)){
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
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

// Group owner  and admin.
router.patch('/:groupId/:userId/response', ensureAuth(), async(req, res) => {
    try{
        const groupOwner = await User.findById(req.user.id);
        const isAdmin = await Membership.findOne({userId : req.user.id, groupId: req.params.groupId, role : 'admin'})
        if(!groupOwner || (!groupOwner && !isAdmin)){
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
        };
        const group = await Group.findById(req.params.groupId);
        if((groupOwner.id !== group.userId && !isAdmin) || (groupOwner.id !== group.userId && !isAdmin)){
            return res.status(403).send('Access denied. Only the group owner or an admin can perform this action.');
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
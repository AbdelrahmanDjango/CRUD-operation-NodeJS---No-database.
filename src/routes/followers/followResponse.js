/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: Endpoints related to follow requests
 */

/**
 * @swagger
 * /follow/response/{id}:
 *   patch:
 *     summary: Respond to a follow request
 *     description: Respond to a follow request sent by another user.
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user who sent the follow request
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: response
 *         description: Follow request response
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [accepted, rejected]
 *     responses:
 *       '200':
 *         description: Follow request response updated successfully
 *       '400':
 *         description: Invalid credentials or there is no follow request for the specified user
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: Endpoints related to follow requests
 */

/**
 * @swagger
 * /follow/response/{id}:
 *   patch:
 *     summary: Respond to a follow request
 *     description: Respond to a follow request sent by another user.
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user who sent the follow request
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: response
 *         description: Follow request response
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [accepted, rejected]
 *     responses:
 *       '200':
 *         description: Follow request response updated successfully
 *       '400':
 *         description: Invalid credentials or there is no follow request for the specified user
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /follow/requests:
 *   get:
 *     summary: Get pending follow requests
 *     description: Retrieve pending follow requests for the authenticated user
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of pending follow requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FollowRequest'
 *       '400':
 *         description: No pending follow requests found
 *       '500':
 *         description: Internal Server Error
 */

const express = require("express");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const User = require('../../models/userModel')
const Follow = require('../../models/followModel')
const Joi = require("joi");

router.patch('/follow/response/:id', ensureAuth(), async (req, res) => {
    try {
        const userId = req.user.id;
        if(!userId) return res.status(400).send('Invalid Credentials');
        const followRequest = await Follow.findOne({user : userId, follower : req.params.id, status: 'pending'});
        if(!followRequest) {
            return res.status(400).send('There is no follow request.')
        }else{
            const response = await validationResponse(req.body)
            if(response.status === 'rejected'){
                await Follow.findOneAndDelete({user : userId, follower: req.params.id});
            }else{
                followRequest.status = response.status
                await followRequest.save();
                return res.status(200).send(`Follow request ${response.status}.`);
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error.');
    }
});


router.get('/follow/requests', ensureAuth(), async (req, res) => {
    try {
        const userId = req.user.id;
        const requests = await Follow.find({ user: userId, status: 'pending' })
        if(requests.length === 0) return res.status(400).send('There is no follow requests.')
            return res.status(200).json(requests);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error.');
    }
});

async function validationResponse(follow) {
    const schema = Joi.object({
      status : Joi.string().valid('accepted', 'rejected').required(),
    });
    try {
      return await schema.validateAsync(follow);
    } catch (err) {
      throw err;
    }
}
module.exports = router

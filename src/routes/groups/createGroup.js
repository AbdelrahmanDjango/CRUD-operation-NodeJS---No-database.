/**
 * @swagger
 * /groups/create:
 *   post:
 *     summary: Create a new group
 *     description: >
 *       Create a new group with the provided group name. The group name must be unique.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupName:
 *                 type: string
 *                 example: "My New Group"
 *             required:
 *               - groupName
 *     responses:
 *       '200':
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "My New Group created successfully."
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Group name taken, write a unique name."
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Server error"
 *
 * /groups:
 *   get:
 *     summary: Retrieve all groups
 *     description: >
 *       Retrieve a list of all groups.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Groups:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Group'
 *       '400':
 *         description: No groups found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "No groups found."
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
 *         users:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
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
const User = require('../../models/userModel');
const Group = require('../../models/groupModel');
const Membership = require('../../models/membershipModel');

router.post('/create', ensureAuth(), async(req, res) => {
    try{
        const user = await User.findById(req.user.id);
        const group = await validationGroup(req.body);
        if(group){
            const newGroup = new Group({
                groupName : req.body.groupName, 
                name : user.name, 
                userId : user._id,
        });
        const groupIsExists = await Group.findOne({groupName: group.groupName});
        if(groupIsExists){
            return res.status(400).send('Group name taken, write a unique name.')
        };
        const saveGroup = await newGroup.save();
        return res.status(200).send(`${newGroup.groupName} created successfully.`)
        };
    }catch(err){
        console.log(err);
        return res.send('Server error');
    }
});
router.get('/', ensureAuth(), async(req, res) => {
    try {
        const groups = await Group.find().populate('users', 'userId')
        if(groups.length === 0) {
            return res.status(400).send('No groups found.');
        }
        return res.status(200).json({ Groups: groups });
    
    }catch(err) {
        console.log(err);
        return res.status(500).send('Server error.');
    }
});


async function validationGroup(group) {
    const schema = Joi.object({
      groupName: Joi.string().required().min(1),
    });
    try {
      return await schema.validateAsync(group);
    } catch (err) {
      throw err;
    }
}
  
  module.exports = router;
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     description: Retrieve a list of all users
 *     responses:
 *       '200':
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       '400':
 *         description: No users found
 *       '500':
 *         description: Internal server error
 *
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     description: Retrieve a user by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve
 *     responses:
 *       '200':
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

const express = require('express');
const router = express.Router();
const User = require('../../models/userModel');


router.get('/', async (req, res) => {
    try{
        const users = await User.find();
        if (users.length > 0){
            res.status(200).json({'users' : users});
        }else{
            res.status(400).json({msg : 'There is no users.'})
        }
    }catch(err){
        console.log(err);
        res.send(err.message);
    }
});


router.get('/:id', async(req, res) => {
    try{
        const userID = await User.findById(req.params.id);
        if (userID){
            res.status(200).json({'user' : userID});
        }else{
            res.status(400).json({msg : `There is no user with this ID: ${req.params.id}.`});
        }
    }catch(err){
        console.log(err);
        res.send(err.message);
    }
});


module.exports = router;
/**
 * @swagger
 * /users/follow/{id}:
 *   post:
 *     summary: Follow a user
 *     description: Follow another user by their ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to follow
 *     responses:
 *       '200':
 *         description: Successfully followed the user
 *       '400':
 *         description: User not found, already following the user, or trying to follow oneself
 *       '500':
 *         description: Internal server error
 */

const express = require("express");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const User = require('../../models/userModel')
const Follow = require('../../models/followModel')
const mongoose = require('mongoose'); // Import mongoose
const { ObjectId } = mongoose.Types; // Import ObjectId

router.post('/follow/:id', ensureAuth(), async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        if (!userToFollow) {
            return res.status(404).send('User not found.');
        }

        const currentUser = await User.findById(req.user.id);
        if (!currentUser) {
            return res.status(404).send('Current user not found.');
        }

        const existingFollow = await Follow.findOne({ user: userToFollow.id, follower: currentUser._id });
        if (existingFollow) {
            return res.status(400).send(`You're already following ${userToFollow.name}.`);
        }

        if (currentUser._id === userToFollow._id) {
            return res.status(400).send("You can't follow yourself.");
        }

        const newFollow = new Follow({ user: userToFollow._id, follower: currentUser._id });
        await newFollow.save();
        
        return res.status(200).send(`You're now following ${userToFollow.name}.`);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error.');
    }
});


module.exports = router;
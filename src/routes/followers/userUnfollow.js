const express = require("express");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const User = require("../../models/userModel");
const Follow = require("../../models/followModel");

router.delete('/unfollow/:id', ensureAuth(), async (req, res) =>{
    try {
        const userToUnFollow = await User.findById(req.params.id);
        if (!userToUnFollow) {
            return res.status(404).send('User not found.');
        }

        const currentUser = await User.findById(req.user.id);
        if (!currentUser) {
            return res.status(404).send('Current user not found.');
        }

        const existingFollow = await Follow.findOneAndDelete({ user: userToUnFollow.id, follower: currentUser._id });

        if (!existingFollow) {
            return res.status(400).send(`You're already not following ${userToUnFollow.name}`);
        }

        if (currentUser._id === (userToUnFollow._id)) {
            return res.status(400).send("You can't unfollow yourself.");
        }

        return res.status(200).send(`Unfollow ${userToUnFollow.name} successfully.`);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error.');
    }
});

module.exports = router;
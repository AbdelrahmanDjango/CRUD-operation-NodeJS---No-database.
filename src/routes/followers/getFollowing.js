/**
 * @swagger
 * /users/{id}/following:
 *   get:
 *     summary: Get users followed by a specific user
 *     description: Retrieve the list of users followed by the specified user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose followed users are to be retrieved
 *     responses:
 *       '200':
 *         description: List of users followed by the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 followings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Follow'
 *       '400':
 *         description: No users found that the specified user follows
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

const express = require('express');
const User = require('../../models/userModel');
const Follow = require('../../models/followModel');
const router = express.Router();



router.get('/:id/following', async(req, res) => {
    try{ 
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).send('User not found.')
    }
    // This return the users that user in req.params.id follow them.
    // For e.x: users/1/following => Ahmed: following{'Abdelrahman', 'Khlaed', ....}.
    const userFollowings = await Follow.find({ follower: req.params.id });
    
    if(!userFollowings.length > 0){
        return res.status(400).send(`This user not following anyone.`)
    };
    // const followingsWithNames = userFollowings.map(following => ({
    //     _id: following._id,
    //     user: following.user.name, // Populate the name of the user
    //     follower: user.name, // Use the name of the user who is following
    //     __v: following.__v
    // }));
    
    return res.status(200).json({ followings: userFollowings });
    
}catch(err){
    console.log(err);
    res.send(err.message);
}

});
module.exports = router;
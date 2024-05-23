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
const ensureAuth = require('../../middlewares/auth');
const router = express.Router();



router.get('/:id/followings', async(req, res) => {
    try{ 
    const user = await User.findById(req.params.id, 'name');
    if(!user){
        return res.status(404).send('User not found.')
    }
    // This return the users that user in req.params.id follow them.
    // For e.x: users/1/following => Ahmed: following{'Abdelrahman', 'Khlaed', ....}.
    const userFollowings = await Follow.find({ follower: req.params.id, status: 'accepted'}).populate('user', 'name')
    
    if(!userFollowings.length > 0){
        return res.status(400).send(`This user not following anyone.`)
    };
    const followings = userFollowings.map(f => f.user);
    return res.status(200).json({user: {_id: user._id, name: user.name}, followings})
    
    // return res.status(200).json({ followings: userFollowings });
    
}catch(err){
    console.log(err);
    res.send(err.message);
}
});

router.get('/:id/followers', async(req, res) => {
    try{
        const user = await User.findById(req.params.id, 'name');
        if(!user) return res.status(404).send('User not found.')
            const userFollowers = await Follow.find({user : user.id, status: 'accepted'}).populate('follower', 'name')
        if(!userFollowers.length > 0) return res.status(400).send('No one follow this user.')
            const followers = userFollowers.map(f => f.follower)
        // User is original object has information like id, name.
        return res.status(200).json({ user: { _id: user._id, name: user.name }, followers });
    }catch(err){
        console.log(err);
        return res.status(400).send('Server error.')
    }
})
module.exports = router;
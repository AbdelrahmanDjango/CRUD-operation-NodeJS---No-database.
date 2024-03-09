const express = require("express");
const db = require("../../config/initDatabase");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");

router.post('/follow/:id', ensureAuth(), async (req, res) => {
    try{
        const userToFollow = await db.user.findByPk(parseInt(req.params.id))
        if(!userToFollow){
            return res.status(404).send('User not found.')
        };
        const user = await db.user.findOne({
            where: {
                id : parseInt(req.user.id)
            },
            include : [{
                model : db.follow
            },
        ]
        });
        console.log('Current User:', userToFollow.toJSON());
        console.log('User to Follow:', user.toJSON());
        // userId => the user that I need to follow him (comes from req.params)
        // followId => the user who doing follow (comes from req.user -Authenticated user- )
        const existingFollow = await db.follow.findOne({
            where: {
                userId: userToFollow.id,
                followerId : user.id,
            },
        });

        if (existingFollow) {
            return res.status(400).send(`You're already following ${userToFollow.name}.`);
        };
        if(user.id === userToFollow.id){
            return res.status(400).send('You can\'t follow your self.')
        };
        const addUserToFollowTable = await db.follow.create({
            userId : userToFollow.id,
            followerId : user.id
        });

        return res.status(200).send(`You're following ${userToFollow.name} now.`)

    }catch(err){
        console.log(err);
        res.send(err);
    }
});

module.exports = router;
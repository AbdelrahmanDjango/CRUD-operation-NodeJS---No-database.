const express = require("express");
const db = require("../../config/initDatabase");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");

router.delete('/unfollow/:id', ensureAuth(), async (req, res) =>{
    try{
        const userToUnFollow = await db.user.findByPk(parseInt(req.params.id));
        if(!userToUnFollow){
            return res.status(404).send('User not found.');
        }
        const user = await db.user.findOne({
            where : {
                id : parseInt(req.user.id),
            },
            include : [{
                model : db.follow
            }]
        });
        const existingFollow = await db.follow.findOne({
            where : {
                userId : userToUnFollow.id,
                followerId : user.id,
            },
        });
        if(user.id !== userToUnFollow.id){
            if(!existingFollow){
                return res.status(400).send(`You're already not following ${userToUnFollow.name}`)
            }
        }else{
            return res.status(400).send('You can\'t unfollow your self.');
        }
            await db.follow.destroy({
            where : {
                userId : userToUnFollow.id, 
                followerId : user.id
            }
        });
        return res.status(200).send(`Unfollow ${userToUnFollow.name} successfully.`)
    }catch(err){
        console.log(err);
        return res.send(err.message);
    }
});

module.exports = router;
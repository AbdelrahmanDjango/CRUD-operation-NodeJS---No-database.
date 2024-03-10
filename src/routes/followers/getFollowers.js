const express = require('express');
const db = require('../../config/initDatabase');
const router = express.Router();

router.get('/:id/followers', async(req, res) => {
    try{
        const user = await db.user.findByPk(parseInt(req.params.id));
        
        if(!user){
            return res.status(404).send('User not found');
        };

        const userFollowers = await db.follow.findAll({
            where : {
                userId : req.params.id,
                followerId :  {
                    [db.Sequelize.Op.ne] : req.params.id}   
            },
            attributes : [
                'followerId',
                'user.name'
            ],
            include : [{
                model : db.user, 
                attributes : []
            }],
            raw : true,
            subQuery : false,
        });
        
        if(!userFollowers.length > 0){
            return res.status(400).send(`No one is following ${user.name}`)
        };
        return res.status(200).json({followers : userFollowers});
    }catch(err){
        console.log(err);
        return  res.send(err.message);
    }
})

module.exports = router;
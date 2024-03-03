const express = require('express');
const db = require('../../config/initDatabase');
const router = express.Router();


router.delete('/delete/:id', async(req, res) => {
    try{
        const userID = await db.user.findByPk(parseInt(req.params.id));
        if(userID){
            const user = await db.auth.findOne({
                where : {email : userID.email, name : userID.name}
            });
            if(user){
                await db.user.destroy({
                    where : {id : parseInt(req.params.id)}
                });
                await db.auth.destroy({
                    where : {email : userID.email, name : userID.name}
                })
                return res.status(200).send('User deleted successfully.')
            }else{
                return res.status(400).send('You\'re not authorization.');
            };
        }else{
            return res.status(400).json({msg : `There is no user with this ID: ${req.params.id}.`})
        }
    }catch(err){
        console.log(err);
        res.send(err.message);
    }
});

module.exports = router;

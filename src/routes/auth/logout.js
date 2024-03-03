const express = require('express');
const db = require('../../config/initDatabase');
const router = express.Router();


router.delete('/logout/:id', async(req, res) => {
    try{
        const userID = await db.user.findByPk(parseInt(req.params.id));
        if (userID){
            const checkUserLogin = await db.auth.findOne({
                where : {name : userID.name, email : userID.email}
            });
            if(checkUserLogin){
                await db.auth.destroy({
                    where : {name : userID.name, email : userID.email}
                })
                return res.status(200).send('Logout successfully.');
            }else{
                return res.status(403).json({
                    error: 'Permissions not available',
                    message: 'You do not have the necessary permissions to perform this action.\
                    Please log in with the valid credential informations.'
                });
            }
        }else{
            return res.status(400).json({msg : `There is no user with this ID: ${req.params.id}`})
        }
    }catch(err){
        res.send(err.message);
        console.log(err);
    }
});

module.exports = router;
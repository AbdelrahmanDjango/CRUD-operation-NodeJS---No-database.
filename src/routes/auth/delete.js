const express = require('express');
const db = require('../../config/initDatabase');
const router = express.Router();
const ensureAuth = require('../../middlewares/auth')


router.delete('/delete', ensureAuth(), async(req, res) => {
    try{
        const findUser = await db.user.findOne({
            where : {
                id : req.user.id
            }
        });
        if(findUser){
            await db.user.destroy({
                where : {
                    id : req.user.id
                }
            });
                return res.status(200).send('User deleted successfully.')
            }else{
                return res.status(400).send('User not found.');
            };
        }catch(err){
        console.log(err);
        res.send(err.message);
    }
});

module.exports = router;

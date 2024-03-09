const express = require('express');
const db = require('../../config/initDatabase');
const Joi = require('joi');
const router = express.Router();
const ensureAuth = require('../../middlewares/auth')

router.put('/update', ensureAuth(), async(req, res) => {
        try{
            const findUser = await db.user.findOne({
                where : {
                    id : req.user.id
                }
            });
            if(!findUser){
                return res.status(400).send('User not found.')
            }
            if(findUser){
                const user = await validationUser(req.body);
                if(user.name !== findUser.name || user.email !== findUser.email){
                    await db.user.update(user, {
                        where : {
                            id : req.user.id
                        }
                    });
                    return res.status(200).send('Updating successfully.')
                }else{
                    return res.status(400).send('Nothing have changed.')
                }
            }
            }catch(err){
                res.send(err.message);
                console.log(err.message);
            }
});



async function validationUser(user) {
    const schema = Joi.object({
        name : Joi.string().min(3).required(),
        email : Joi.string().email().min(3).required()
    });
        try{
            return await schema.validateAsync(user);
        }catch(err){
            throw err;
        }
};

module.exports = router;
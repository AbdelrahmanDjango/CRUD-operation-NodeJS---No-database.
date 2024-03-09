const express = require('express');
const db = require('../../config/initDatabase');
const Joi = require('joi');
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");

router.put('/privacy', ensureAuth(), async(req, res) => {
    try{
        const user = await db.user.findOne({
            where : {
                id : req.user.id
            }
        });
        if(!user){
        return res.status(400).send('Invalid authorization.');
        }
        const newPrivacy = await validatePrivacy(req.body);
        if(user.privacy !== newPrivacy.privacy){

            await db.user.update(newPrivacy, {
                where: {
                    id : req.user.id
                }
            });
            return res.status(200).send(`Your account is ${newPrivacy.privacy} now.`)
        }else{
            return res.status(200).send('Nothing have changed.')
        }
    }catch(err){
        console.log(err);
        return res.send(err.message);
    }
});

async function validatePrivacy(user) {
    const schema = Joi.object({
        privacy : Joi.string().valid('public', 'private').required()
    });
    try{
        return await schema.validateAsync(user);
    }catch(err){
        throw err;
    };
};

module.exports = router;
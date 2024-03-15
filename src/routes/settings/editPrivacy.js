const express = require('express');
const Joi = require('joi');
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const User = require('../../models/userModel');
const Post = require('../../models/postModel');


router.put('/privacy', ensureAuth(), async(req, res) => {
    try{
        const user = await User.findById(req.user.id);
        if(!user){
        return res.status(400).send('Invalid authorization.');
        }
        const newPrivacy = await validatePrivacy(req.body);
        if(user.privacy !== newPrivacy.privacy){

            await User.findByIdAndUpdate( user, {privacy : newPrivacy.privacy});

            const posts = await Post.find({userId : req.user.id})
            if(posts){
                await Post.updateMany({ userId: req.user.id }, { privacy: newPrivacy.privacy });
            }
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
const express = require('express');
const db = require('../../config/initDatabase');
const Joi = require('joi');
const ensureAuth = require('../../middlewares/auth');
const router = express.Router();

router.put('/update/:id', ensureAuth(), async(req, res) => {
    try{
        const post = await db.posts.findByPk(parseInt(req.params.id));
        if(!post){
            return res.status(400).send('Post doen\'t exists.');
        }
        const user = await db.user.findOne({
            where : {
                id : req.user.id
            }
        })
        if(!user){
            return res.status(403).send('invalid authorization.')
        };
        if(user.id === post.userId){
            const validatedPostData = await validationPost(req.body);
            await db.posts.update(validatedPostData, {
                where : {
                    userId : user.id
                }
            });
            return res.status(200).json({Updated : 'Post updated successfully.', validatedPostData})
        }else{
            return res.status(400).send('You can\'t delete post don\'t belongs to you')
        }
    }catch(err){
        console.log(err);
        return res.send(err);
    }
})
async function validationPost(post){
    const schema = Joi.object({
        body : Joi.string().required()
    });
    try{
        return await schema.validateAsync(post);
    }catch(err){
        throw err;
    }
};


module.exports = router;
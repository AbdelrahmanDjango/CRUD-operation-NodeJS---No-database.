const express = require('express');
const db = require('../../config/initDatabase');
const Joi = require('joi');
const router = express.Router();

router.put('/:id', async (req, res) => {
    try {
        const postID = await db.posts.findByPk(parseInt(req.params.id));
        if(postID){
            const user = await db.user.findOne({
                where : {email : req.body.email}
            });
            if(user){
                const post = await validationPost(req.body);
                if (post.name === user.name && post.email === user.email){
                    const updatedPost = await db.posts.update(post, {
                        where: { id: parseInt(req.params.id) }
                    });
                    return res.status(200).send(post); 
                }else{
                    return res.status(400).json({err : post.error.details[0].message})
                }
            }else if(!user || user.email !== req.body.email){
                return res.status(403).json({
                    error: 'Permissions not available',
                    message: 'You do not have the necessary permissions to perform this action.\
                    Please log in with the valid credential informations.'
                });
            }
        }else{
            return res.status(400).json({msg : `There is no post with this ID: ${req.params.id}`});
        }            
    }catch(err){
        console.log(err);
        res.send('Server error.')
    }
});

async function validationPost(post){
    const schema = Joi.object({
        name : Joi.string().min(2),
        email : Joi.string().email().required(),
        body : Joi.string().required()
    });
    try{
        return await schema.validateAsync(post);
    }catch(err){
        throw err;
    }
};


module.exports = router;
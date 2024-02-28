const express = require('express');
const db = require('../../config/initDatabase');
const Joi = require('joi');
const router = express.Router();

// Done!
router.post('/create', async(req, res) => {
    try{
        const users = await db.user.findAll(
            {
                where : {email : req.body.email},
                include : [{model : db.posts}]
            }
        );
        if (users.length > 0){
            const checkPost = await validationPost(req.body);
            if(checkPost.error){
            res.status(400).json({err : checkUser.error.details[0].message});
        }else{
            const post = await users[0].createPost(checkPost);
            res.status(200).send(checkPost);
        }
    }else{
        res.status(400).json({msg : `There is no user with this name: '${req.body.name}'`})
    }
    }catch(err){
        console.log(err);
        res.send('Server error.');
    }
    
});

// Done!
router.get('/', async (req, res) => {
    try{
        const posts = await db.posts.findAll();
        if(posts.length > 0){
            res.json(posts);
        }else{
            res.status(400).json({msg : 'Posts not found.'})
        }
        
    }catch(err) {
        console.log(err);
        res.send('Server error.')
    }
});

// Done!
router.get('/:id', async (req, res) => {
    try {
        const postID = await db.posts.findByPk(parseInt(req.params.id));
        if (postID){
            res.status(200).send(postID);
        }else{
            res.status(400).json({msg : `There is no post with this ID: ${req.params.id}`})
        }
    } catch(err){
        console.log(err);
        res.send('Server error.')
    }
});

// Done!
router.put('/:id', async (req, res) => {
    try {
        const postID = await db.posts.findByPk(parseInt(req.params.id));
        if(postID){
            const checkPost = await validationPost(req.body);
            if (checkPost.error){
                res.status(400).json({err : checkPost.error.details[0].message})
            }else{
                const updatedPost = await db.posts.update(checkPost, {
                    where: { id: parseInt(req.params.id) }
                });
                
                res.status(200).send(checkPost); 
            }
        }else{
            res.status(400).json({msg : `There is no post with this ID: ${req.params.id}`});
        }            
    }catch(err){
        console.log(err);
        res.send('Server error.')
    }
});


// Done!
router.delete('/:id', async (req, res) => {
    try{
        const postID = await db.posts.findByPk(parseInt(req.params.id)); 
        if(postID){
            const deletePost = db.posts.destroy({
                where : {
                    id : parseInt(req.params.id)
                }
            })
            res.status(200).send('Post deleted successfully.')
        }else{
            res.status(400).json({msg : `There is no post with this ID: ${req.params.id}`});
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
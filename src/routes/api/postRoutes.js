const express = require('express');
const db = require('../../config/initDatabase.js');
const Joi = require('joi');


const router = express.Router();

// Done!
router.get('/', async (req, res) => {
    try{
        const posts = await db.posts.findAll();
        if(posts){
            res.json(posts);
        }else{
            res.status(400).json({msg : 'Posts not found.'})
        }
        // Catch is an server err, not like err in (empty data) -for example-.
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
router.post(('/'), async (req, res) => {
    try {
        const checkPost = await validationPost(req.body);
        if (checkPost.error){
            res.status(400).json({err : result.error.details[0].message})
        }else{
            const post = db.posts.create(checkPost)
            res.status(200).send(checkPost);
        }
        
    }
    catch(err) {
        console.log(err);
        res.send('Server error.')
    }
})

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
    })
  
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
})


async function validationPost(post) {
    const schema = Joi.object({
        author  : Joi.string().required().min(3),
        body : Joi.any().required()
    });
    try{
        return await schema.validateAsync(post);
    }catch(err) {
        throw err 
    }
};

module.exports = router;
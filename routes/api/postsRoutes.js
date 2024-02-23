const express = require('express');
const router = express.Router()
const uuid = require('uuid');
const posts = require('../../posts.js');
const Joi = require('joi');
const logger = require('../../middlewares/logger.js');


router.get('/',  logger, (req, res) => {
    res.json(posts);
});

router.get('/:id/', logger, (req, res) => {
    const post = posts.filter(post => post.id === parseInt(req.params.id));
    if (post.length === 0) {
        res.status(404).json({error : 'There is no post ID with this number.'});
    } else{
        res.json(post);
    };
});


router.post('/', logger, (req, res) => {
    const post = {
        id : uuid.v4(),
        Name : req.body.Name,
        body : req.body.body
    };
    const result = validationPost(req.body);
    console.log(result);
    
    if (result.error) {
        res.status(400).json({ error: result.error.details[0].message });
        return;
    }
    posts.push(post);
    res.send(post);
});

router.put('/:id', logger, (req, res) => {
    const post = posts.find(post => post.id === parseInt(req.params.id));
    const result = validationPost(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    };
    
    post.Name = req.body.Name;
    post.body = req.body.body;
    res.send(post);
    posts.push(post);
})



router.delete('/:id', logger, (req, res) => {
    const post = posts.find(post => post.id === parseInt(req.params.id));
    if (post){
        const index = posts.indexOf(post);
        posts.splice(index, 1);
        res.json({msg : 'Post is deleted.', post});
    }else{
        res.status(404).json({error : 'There is no post ID with this number.'});
    }
});

function validationPost (posts)  {
    const schema = Joi.object({
        Name : Joi.string().min(3).required(),
        body : Joi.string().required()
});
    
    return schema.validate(posts);
    
}
module.exports = router;
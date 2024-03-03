const express = require('express');
const db = require('../../config/initDatabase');
const router = express.Router();


router.get('/', async (req, res) => {
    try{
        const posts = await db.posts.findAll({
            attributes: [
                "id",
                "user.name",
                "user.email",
                "body",
             ],
             include: [{
                model: db.user,
                as: 'user',
                attributes: []
             }],
            raw: true,
            subQuery: false
        });
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


router.get('/:id', async (req, res) => {
    try {
        const postID = await db.posts.findByPk(parseInt(req.params.id), {
            attributes: [
                "id",
                "user.name",
                "user.email",
                "body",
             ],
             include: [{
                model: db.user,
                as: 'user',
                attributes: []
             }],
            raw: true,
            subQuery: false

        });
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


module.exports = router;
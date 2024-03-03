const express = require('express');
const db = require('../../config/initDatabase');
const Joi = require('joi');
const router = express.Router();

// Under working...
router.get('/:id/', async(req, res) => {
    try{
        const userID = await db.user.findByPk(parseInt(req.params.id));
        if(userID){
            const checkPosts = await db.posts.findAll(
                {
                    where : {userID : parseInt(req.params.id)},
                    include : {model : db.user},
                    order : [
                        ["id", "ASC"]
                    ]
                }
                );
                if(checkPosts.error){
                    res.status(400).json({msg : `User with ID: ${userID} has no posts.`})
                }else{
                    res.status(200).json(checkPosts);
                };
            }else{
                res.status(400).json({msg : `There is no user with this ID: ${req.params.id}.`});
            }
        }catch(err){
            console.log(err);
            res.send(err);
        }
});
    

module.exports = router;
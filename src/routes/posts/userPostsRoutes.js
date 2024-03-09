const express = require('express');
const db = require('../../config/initDatabase');
const Joi = require('joi');
const ensureAuth = require('../../middlewares/auth');
const router = express.Router();


router.get('/:id/', ensureAuth(), async(req, res) => {
    try{
        const userID = await db.user.findByPk(parseInt(req.params.id));
        if(!userID){
            return res.status(404).send('User not found.');
        }
        if(userID.privacy === 'public'){
            const posts = await db.posts.findAll(
                {
                    where : {
                        userId : parseInt(req.params.id)
                    },
                    attributes : [
                        // 'id',
                        'user.name',
                        'user.email',
                        'body'
                    ],
                    include : [{
                        model : db.user,
                        as : 'user',
                        attributes : []
                    }],
                    raw : true,
                    subQuery : false,
                    order : [
                        ["id", "ASC"]
                    ]
                });
                if(!posts.length > 0){
                    return res.status(400).json({msg : `User with ID: ${userID.id} has no posts.`})
                }
                return res.status(200).json(posts);

            }else if(userID.privacy === 'private'){
                const existingFollow = await db.follow.findOne({
                    where: {
                        userId: userID.id,
                        followerId: req.user.id,
                    },
                });
                if(!existingFollow){
                    return res.status(400).send('This acoount is private, follow user first.')
                }else if(existingFollow){
                    const posts = await db.posts.findAll(
                        {
                            where : {
                                userId : parseInt(req.params.id)
                            },
                            attributes : [
                                // 'id',
                                'user.name',
                                'user.email',
                                'body'
                            ],
                            include : [{
                                model : db.user,
                                as : 'user',
                                attributes : []
                            }],
                            raw : true,
                            subQuery : false,
                            order : [
                                ["id", "ASC"]
                            ]
                        });
                    
                    if(!posts){
                        return res.status(400).json({msg : `User with ID: ${userID} has no posts.`})
                    }
                        return res.status(200).json(posts);
                }
                }

            }catch(err){
            console.log(err);
            res.send(err);
        }
});
    

module.exports = router;
const express = require('express');
const db = require('../../config/initDatabase');
const router = express.Router();



router.get('/:id/following', async(req, res) => {
    try{ 
    const user = await db.user.findByPk(parseInt(req.params.id));
    if(!user){
        return res.status(404).send('User not found.')
    }
    // This return the users that user in req.params.id follow them.
    // For e.x: users/1/following => Ahmed: following{'Abdelrahman', 'Khlaed', ....}.
    const userFollowings = await db.follow.findAll({
        where : {
            followerId : req.params.id
        },
        attributes : [
            'user.name',
        ],
        include : [{
            model : db.user, 
            // as : 'follow',
            attributes : []
        }],
        raw : true,
        subQuery : false
    }
    )
    
    if(!userFollowings.length > 0){
        return res.status(404).send(`This user not following anyone.`)
    };
    
    return res.status(200).json({followings: userFollowings});
    
}catch(err){
    console.log(err);
    res.send(err.message);
}

});


// router.get('/:id/followers/', async (req, res) => {
//     const user = await db.user.findByPk(parseInt(req.params.id));
//     if(!user){
//         return res.status(404).send('User not found');
//     };
//     const userFollowers = await db.follow.findAll({
//         where : {
//             userId : req.params.id
//         },
//         attributes : 
//         [
//             'user.name',
//         ],
//         include : [{
//             model : db.user, 
//             // as : 'follow',
//             attributes : []
//         }],
//         raw : true,
//         subQuery : false
//     });
//     if(!userFollowers){
//         return res.status(400).send('This user don\'t follow anyone.')
//     };
//     return res.status(200).json({
//         followers : userFollowers
//     });
// })
module.exports = router;
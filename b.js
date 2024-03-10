// const express = require('express');
// const db = require('../fb/src/config/initDatabase');
// const router = express.Router();
// router.get('/b/:id', async(req, res) => {
// try{

//     const usersThatFollowUser = await db.user.findAll({
//         where: {
//             id :{
//                 [db.Sequelize.Op.ne] : req.params.id
//             },
//         },
//     });
//     res.send(usersThatFollowUser)
// }catch(e){
//     res.send(e)
// }
// })

// module.exports = router;
const express = require('express');
const db = require('../../config/initDatabase');
const router = express.Router();



router.get('/', async (req, res) => {
    try{
        const users = await db.user.findAll();
        if (users.length > 0){
            res.status(200).json({'users' : users});
        }else{
            res.status(400).json({msg : 'There is no users.'})
        }
    }catch(err){
        console.log(err);
        res.send(err.message);
    }
});


router.get('/:id', async(req, res) => {
    try{
        const userID = await db.user.findByPk(parseInt(req.params.id));
        if (userID){
            res.status(200).json({'user' : userID});
        }else{
            res.status(400).json({msg : `There is no user with this ID: ${req.params.id}.`});
        }
    }catch(err){
        console.log(err);
        res.send(err.message);
    }
});


module.exports = router;
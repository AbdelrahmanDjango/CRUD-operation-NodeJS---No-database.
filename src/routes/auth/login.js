const express = require('express');
const db = require('../../config/initDatabase');
const router = express.Router();

            
router.post('/login', async(req, res) => {
    try{
        const userLogin = req.body;
        const findUser = await db.user.findOne({
            where : { email : req.body.email, name : req.body.name }
        });
        if(findUser){
            await db.auth.create(userLogin);
            res.status(200).send('Login successfully.')
        }else{
            res.status(400).send('User doesn\'t exists.')
        }
    }catch(err){
        console.log(err.message);
        res.send(err.message);
    }
});

router.get('/auth/', async (req, res) => {
    try{
        const users = await db.auth.findAll();
        if (users.length > 0){
            return res.status(200).json({'Authenticated users' : users});
        }else{
            return res.status(400).json({msg : 'There is no users.'})
        }
    }catch(err){
        console.log(err);
        res.send(err.message);
    }
});


router.get('/auth/:id', async(req, res) => {
    try{
        const userID = await db.auth.findByPk(parseInt(req.params.id));
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
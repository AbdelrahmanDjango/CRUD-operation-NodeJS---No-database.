const express = require('express');
const db = require('../../config/initDatabase');
const Joi = require('joi');
const router = express.Router();

// Done!
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
        res.send('Server error.')
    }
});

// Done!
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
        res.send('Server error.');
    }
});


// User login...
router.post('/create/', async (req, res) => {
    try{
        const checkUser = await validationUser(req.body);
        if(checkUser.error){
            res.status(400).json({err : checkUser.error.details[0].message});
        }else{
            const user = await db.user.create(checkUser);
            res.status(200).send(checkUser);
        }
    }catch(err) {
            console.log(err);
            res.send('Server error.');
            }
});

// Done!
router.put('/:id', async (req, res) => {
    try{
        const userID = await db.user.findByPk(parseInt(req.params.id));
        if (userID){
            const checkUser = await validationUser(req.body);
            if(checkUser.error){
                res.status(400).json({err : checkUser.error.details[0].message})
            }else{
                const user = await db.user.update(checkUser, {
                    where : {id : parseInt(req.params.id)}
                })
                res.status(200).send(checkUser);
            }
        }else{
            res.status(400).json({msg : `There is no user with this ID: ${req.params.id}`})
        }
    }catch(err) {
        console.log(err);
        res.send('Server error.')
    }
});

// Done! 
router.delete('/:id', async(req, res) => {
    try{
        const userID = await db.user.findByPk(parseInt(req.params.id));
        if(userID){
            const deleteUser = db.user.destroy({
                where : {id : parseInt(req.params.id)}
            })
            res.status(200).send('User deleted successfully.')
        }else{
            res.status(400).json({msg : `There is no user with this ID: ${req.params.id}.`})
        }
    }catch(err){
        console.log(err);
        res.send('Server error.')
    }
})


async function validationUser(user) {
    const schema = Joi.object({
            name : Joi.string().min(3).required(),
            email : Joi.string().email().min(3).required()
    });
        try{
            return await schema.validateAsync(user);
        }catch(err){
            throw err;
        }
};

module.exports = router;
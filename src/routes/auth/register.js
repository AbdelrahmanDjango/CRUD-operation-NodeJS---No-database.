const express = require('express');
const db = require('../../config/initDatabase');
const Joi = require('joi');
const router = express.Router();

router.post('/register', async(req, res) => {
    try{
        const user = await validationUser(req.body);
        if (user){
            await db.user.create(user);
            return res.status(200).json({Created : 'Registering successfully.', user})
        }
    }catch(err){
        console.log(err);
        res.send(err.message);
    }
});


async function validationUser(user) {
    const schema = Joi.object({
        name : Joi.string().min(3).required(),
        email : Joi.string().email().min(3).required(),
        password : Joi.string().required().min(8),
    });
        try{
            return await schema.validateAsync(user);
        }catch(err){
            throw err;
        }
};

module.exports = router;
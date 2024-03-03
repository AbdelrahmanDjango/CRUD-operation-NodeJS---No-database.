const express = require('express');
const db = require('../../config/initDatabase');
const Joi = require('joi');
const router = express.Router();


router.put('/update/:id', async(req, res) => {
        try{
            const userID = await db.user.findByPk(parseInt(req.params.id));
            if(userID){
                const userLogin = await db.auth.findOne({
                    where : {email : userID.email, name : userID.name}
                });
                if (userLogin){
                    const user = await validationUser(req.body);
                    if(user.name !== userID.name || user.email !== userID.email){
                        await db.user.update(user, {
                            where : {id : parseInt(req.params.id)}
                        });
                        await db.auth.update(user, {
                            where : {email : userLogin.email, name : userLogin.name}
                        });
                        return res.status(200).json({Updating : 'Updating successfully.', checkUser})
                    }else{
                        return res.status(400).json({Updating : 'Nothing have changed.', checkUser})
                    }
                }else{
                    return res.status(403).json({
                        error: 'Permissions not available',
                        message: 'You do not have the necessary permissions to perform this action.\
                        Please log in with the valid credential informations.'
                    });
                }

            }else{
                return res.status(400).json({msg : `There is no user with this ID: ${req.params.id}`})
    }
    }catch(err){
        res.send(err.message);
        console.log(err.message);
    }
});



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
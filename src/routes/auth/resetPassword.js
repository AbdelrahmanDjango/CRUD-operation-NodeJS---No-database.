const express = require('express');
const db = require('../../config/initDatabase');
const Joi = require('joi');
const router = express.Router();

router.put('/resetpassword/:id', async(req, res)=>{
    try{
        const userID = await db.user.findOne({
            where : {
                id : req.params.id
            }
        });
        if(userID){
            const checkLogin = await db.auth.findOne({
                where : {
                    email : userID.email
                }
            });
            if (checkLogin){
                const passwordObject = await validatePassword(req.body)
                if(passwordObject.password === userID.password && passwordObject.newPassword === passwordObject.newPasswordAgain){
                    // First param in update is the new data.
                    // If I need to change specify field; I should to write it in new data.
                    // For example I just need to change only password, so I'll write field name (in object => {pass : ex})
                    await db.user.update({password : passwordObject.newPassword}, {
                    // where is the target data that I'll replace it with new.
                        where : {
                            password : userID.password
                        }
                    })
                    await db.auth.update({password : passwordObject.newPassword}, {
                        where : {
                            password : userID.password
                        }
                    })
                    return res.status(200).send('Reset password successfully.')
                }else{
                    res.status(400).json({err : 'Password is wrong.'})
                }
            }else{
                return res.status(400).send('Failed access.')
            }
        }  
    }catch(err){
        res.send(err.message);
        console.log(err);
    }
})
async function validatePassword(user) {
    const schema = Joi.object({
        password: Joi.string().required().alphanum().min(8).max(30),
        // .regex(/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,30}$/),
        newPassword: Joi.string().required().alphanum().min(8).max(30),
        newPasswordAgain: Joi.string().required().alphanum().min(8).max(30)
    });
    try {
        return await schema.validateAsync(user);
    } catch (err) {
        throw err;
    }
}

module.exports = router;
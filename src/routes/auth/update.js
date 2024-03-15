/**
 * @swagger
 * /users/update:
 *   put:
 *     summary: Update user information
 *     description: Update the authenticated user's information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               bio:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - bio
 *     responses:
 *       '200':
 *         description: User information updated successfully
 *       '400':
 *         description: User not found, failed to update user, or nothing has changed
 *       '500':
 *         description: Internal server error
 */

const express = require('express');
const Joi = require('joi');
const router = express.Router();
const ensureAuth = require('../../middlewares/auth')
const User = require('../../models/userModel')
router.put('/update', ensureAuth(), async(req, res) => {
        try{
            const findUser = await User.findById(req.user.id);
            if(!findUser){
                return res.status(400).send('User not found.')
            }
            const user = await validationUser(req.body);
            if(user.name !== findUser.name || user.email !== findUser.email || user.bio !== findUser.bio){
                const updateUser = await User.findByIdAndUpdate(req.user.id, user, { new: true })
                if(!updateUser){
                    return res.status(400).send('Faild to update user.')
                }    
                return res.status(200).send('Updating successfully.')
                }else{
                    return res.status(400).send('Nothing have changed.')
                }
            }catch(err){
                res.send(err.message);
                console.log(err.message);
            }
});



async function validationUser(user) {
    const schema = Joi.object({
        name : Joi.string().min(1),
        email : Joi.string().email().min(3),
        bio : Joi.string().min(1)
    });
        try{
            return await schema.validateAsync(user);
        }catch(err){
            throw err;
        }
};

module.exports = router;
/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Delete user
 *     description: Delete the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '400':
 *         description: User not found or deletion failed
 *       '500':
 *         description: Internal server error
 */

const express = require('express');
const router = express.Router();
const ensureAuth = require('../../middlewares/auth')
const User = require('../../models/userModel');


router.delete('/delete', ensureAuth(), async(req, res) => {
    try{
        const findUser = await User.findById(req.user.id);
        if(findUser){
            await User.findByIdAndDelete(req.user.id)
                return res.status(200).send('User deleted successfully.')
            }else{
                return res.status(400).send('User not found.');
            };
        }catch(err){
        console.log(err);
        res.send(err.message);
    }
});

module.exports = router;

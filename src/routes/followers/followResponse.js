const express = require("express");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const User = require('../../models/userModel')
const Follow = require('../../models/followModel')
const Joi = require("joi");

router.patch('/follow/response/:id', ensureAuth(), async (req, res) => {
    try {
        const userId = req.user.id;
        if(!userId) return res.status(400).send('Invalid Credentials');
        const followRequest = await Follow.findOne({user : userId, follower : req.params.id, status: 'pending'});
        if(!followRequest) {
            return res.status(400).send('There is no follow request.')
        }else{
            const response = await validationResponse(req.body)
            if(response.status === 'rejected'){
                await Follow.findOneAndDelete({user : userId, follower: req.params.id});
            }else{
                followRequest.status = response.status
                await followRequest.save();
                return res.status(200).send(`Follow request ${response.status}.`);
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error.');
    }
});


router.get('/follow/requests', ensureAuth(), async (req, res) => {
    try {
        const userId = req.user.id;
        const requests = await Follow.find({ user: userId, status: 'pending' })
        if(requests.length === 0) return res.status(400).send('There is no follow requests.')
            return res.status(200).json(requests);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error.');
    }
});

async function validationResponse(follow) {
    const schema = Joi.object({
      status : Joi.string().valid('accepted', 'rejected').required(),
    });
    try {
      return await schema.validateAsync(follow);
    } catch (err) {
      throw err;
    }
}
module.exports = router

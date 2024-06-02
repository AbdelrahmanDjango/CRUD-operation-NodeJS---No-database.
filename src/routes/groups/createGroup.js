const express = require("express");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const User = require('../../models/userModel');
const Group = require('../../models/groupModel');
const Membership = require('../../models/membershipModel');

router.post('/create', ensureAuth(), async(req, res) => {
    try{
        const user = await User.findById(req.user.id);
        const group = await validationGroup(req.body);
        if(group){
            const newGroup = new Group({
                groupName : req.body.groupName, 
                name : user.name, 
                userId : user._id,
            });
        const groupIsExists = await Group.findOne({groupName: group.groupName});
        if(groupIsExists){
            return res.status(400).send('Group name taken, write a unique name.')
        };
        const saveGroup = await newGroup.save();
        return res.status(200).send(`${newGroup.groupName} created successfully.`)
        };
    }catch(err){
        console.log(err);
        return res.send('Server error');
    }
});
router.get('/', ensureAuth(), async(req, res) => {
    try {
        const groups = await Group.find().populate('users', 'userId')
        if(groups.length === 0) {
            return res.status(400).send('No groups found.');
        }
        return res.status(200).json({ Groups: groups });
    
    }catch(err) {
        console.log(err);
        return res.status(500).send('Server error.');
    }
});


async function validationGroup(group) {
    const schema = Joi.object({
      groupName: Joi.string().required().min(1),
    });
    try {
      return await schema.validateAsync(group);
    } catch (err) {
      throw err;
    }
}
  
  module.exports = router;
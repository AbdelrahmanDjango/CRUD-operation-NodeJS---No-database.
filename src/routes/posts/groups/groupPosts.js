const express = require("express");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../../middlewares/auth");
const getUserOrMembershipOrGroup = require("../../../middlewares/userAndGroup");
const User = require('../../../models/userModel');
const Group = require('../../../models/groupModel');
const Membership = require('../../../models/membershipModel');
const Post = require("../../../models/postModel");

router.post('/:groupId/post/create', ensureAuth(), async(req, res) =>{
    try{
      const group = await Group.findById(req.params.groupId)
      if(!group) return res.status.apply(404).send('Group not found.')
      const user = await User.findById(req.user.id);
      const isMembership = await Membership.findOne({groupId: group.id, userId: user.id, status: 'accepted'});
      if(!isMembership){
        return res.status(404).send(`You don\'t have access to doing posting in ${group.groupName} group, join group first.`)
      }
      const post = await validationPost(req.body);
      if(group.postStatus === 'pending'){
        const newPost = new Post({
          body: req.body.body,
          name: user.name,
          userId: user._id,
          groupId: group.id,
          postStatusGroup : group.postStatus,
        });
        const savePost = await newPost.save();
        user.posts = user.posts || [];
        user.posts.push(savePost);
        await user.save();
        return res.status(200).send('Post sent to the admins. Post pending now.')
      }else{
        const newPost = new Post({
          body: req.body.body,
          name: user.name,
          userId: user._id,
          groupId: group.id,
          postStatusGroup : group.postStatus,
        });
        const savePost = await newPost.save();
        user.posts = user.posts || [];
        user.posts.push(savePost);
        await user.save();
        return res.status(200).send(savePost);
      }
    }catch(err){
        console.log(err);
        return res.send('Server error.');
    };
});


async function validationPost(post) {
    const schema = Joi.object({
      body: Joi.string().required().min(1),
    });
    try {
      return await schema.validateAsync(post);
    } catch (err) {
      throw err;
    }
  }
  
  module.exports = router;
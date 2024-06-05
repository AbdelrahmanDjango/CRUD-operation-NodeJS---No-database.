const express = require('express');
const router = express.Router();
const ensureAuth = require('../../../middlewares/auth')
const getUserOrMembershipOrGroup = require('../../../middlewares/userAndGroup')
const Post = require('../../../models/postModel')
const User = require('../../../models/userModel')
const Membership = require('../../../models/membershipModel')
const Group = require('../../../models/groupModel')

router.get('/:groupId/posts', ensureAuth(), async(req, res) =>{
    try{
        const group = await Group.findById(req.params.groupId);
        const userAuth = await User.findById(req.user.id);
        const groupOwner = await Group.findOne({userId : userAuth.id});
        const isMembership = await Membership.findOne({userId: userAuth.id, groupId: group.id})
        if(group.privacyStatus === 'private'){
            if(groupOwner || isMembership){
                const posts = await Post.find({groupId: group.id, postStatusGroup: 'accepted'});
                if (posts.length > 0){
                    return res.status(200).json({ Posts: posts });
                }else{
                    return res.status(404).send('There are no posts');
                }
            }else{
                return res.status(400).send(`${group.groupName} is private group. Join group first.`)
            }
        }

    }catch(err){
        console.log(err);
        return res.send('Server error.');
    };

});


router.get('/:groupId/posts/:postId', ensureAuth(), async(req, res) =>{
    try{
        const group = await Group.findById(req.params.groupId);
        const userAuth = await User.findById(req.user.id);
        const groupOwner = await Group.findOne({userId : userAuth.id});
        const isMembership = await Membership.findOne({userId: userAuth.id, groupId: group.id})
        if(group.privacyStatus === 'private'){
            if(groupOwner || isMembership){
                const post = await Post.findById({_id: req.params.postId, groupId: group.id, postStatusGroup: 'accepted'});
                if (post){
                    return res.status(200).json({ Posts: post });
                }else{
                    return res.status(404).send('There are no posts');
                }
            }else{
                return res.status(400).send(`${group.groupName} is private group. Join group first.`)
            }
        }

    }catch(err){
        console.log(err);
        return res.send('Server error.');
    };

})


router.get('/:groupId/:userId/posts/', ensureAuth(), async(req, res) =>{
    try{
        const group = await Group.findById(req.params.groupId);
        const userAuth = await User.findById(req.user.id);
        const targetUser = await User.findById(req.params.userId);
        const groupOwner = await Group.findOne({userId : userAuth.id});
        const isMembership = await Membership.findOne({userId: userAuth.id, groupId: group.id})
        if(group.privacyStatus === 'private'){
            if(groupOwner || isMembership){
                const posts = await Post.find({ userId: req.params.userId });
                if(posts.length > 0){
                    return res.status(200).json({ Posts: posts });
                }else{
                    return res.status(404).send('No posts for this user.');
                }
            }else{
                return res.status(400).send(`${group.groupName} is private group. Join group first.`)
            }
        }

    }catch(err){
        console.log(err);
        return res.send('Server error.');
    };

})
    
        

        
        

    


module.exports = router;
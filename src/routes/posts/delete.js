const express = require('express');
const db = require('../../config/initDatabase');
const router = express.Router();



// Here I need to make sure the user he try to delete he is the same user he write post
// I think it's about sessions...?
router.delete('/:id', async (req, res) => {
    try{
        const postID = await db.posts.findByPk(parseInt(req.params.id)); 
        if(postID){
            const deletePost = db.posts.destroy({
                where : {
                    id : parseInt(req.params.id)
                }
            })
            res.status(200).send('Post deleted successfully.')
        }else{
            res.status(400).json({msg : `There is no post with this ID: ${req.params.id}`});
        }   
    }catch(err){
        console.log(err);
        res.send('Server error.')
            
    }
});



module.exports = router;
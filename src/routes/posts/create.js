/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *                 minLength: 1
 *             required:
 *               - body
 *     responses:
 *       '200':
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '400':
 *         description: Invalid request or user not found
 *       '401':
 *         description: Unauthorized - Missing or invalid authentication token
 *       '500':
 *         description: Internal server error
 */

const express = require("express");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
const User = require('../../models/userModel');
const Post = require('../../models/postModel');


router.post("/create", ensureAuth(), async (req, res) => {
  try {
    
    const user = await User.findById(req.user.id)
    if(!user){
      return res.status(400).send('User not found');
    }
    const post = await validationPost(req.body);
    if (post){
      const newPost = new Post({
      body: req.body.body,
      privacy: user.privacy,
      name: user.name,
      userId : user._id,
      });
      const savePost = await newPost.save();
      user.posts = user.posts || [];
      user.posts.push(savePost);
      await user.save();
      return res.status(200).send(savePost);
    }  
    
    }catch (err) {
    console.log(err);
    res.send(err.message);
  }
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

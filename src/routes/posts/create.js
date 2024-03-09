const express = require("express");
const db = require("../../config/initDatabase");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");

router.post("/create", ensureAuth(), async (req, res) => {
  try {
    const user = await db.user.findOne({
      where: { id: req.user.id },
      include: [{ model: db.posts }],
    });
    if (user.privacy === 'public'){
      const post = await validationPost(req.body);
      if (post) {
          post.privacy = 'public'
          const savePost = await user.createPost(post);
          return res.status(200).send(post);
        } else {
          return res.status(400).send("Name or email is wrong.");
        }    
      }else if(user.privacy === 'private'){
        const post = await validationPost(req.body);
        post.privacy = 'private'
        if(post) {
            const savePost = await user.createPost(post);
            return res.status(200).send(post);
          }else {
            return res.status(400).send("Name or email is wrong.");
          }
        } else {
          return res.status(400).json({ err: checkUser.error.details[0].message });
        }

      }catch (err) {
    console.log(err);
    res.send(err.message);
  }
});

async function validationPost(post) {
  const schema = Joi.object({
    // name: Joi.string().min(2),
    // email: Joi.string().email().required(),
    body: Joi.string().required(),
  });
  try {
    return await schema.validateAsync(post);
  } catch (err) {
    throw err;
  }
}

module.exports = router;

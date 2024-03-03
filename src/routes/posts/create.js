const express = require("express");
const db = require("../../config/initDatabase");
const Joi = require("joi");
const router = express.Router();
const ensureAuth = require("../../middlewares/auth");
router.post("/create", ensureAuth(["admin"]), async (req, res) => {
  try {
    const user = await db.user.findOne({
      where: { id: req.user.id },
      include: [{ model: db.posts }],
    });
    if (user) {
      const userLogin = await db.auth.findOne({
        where: { email: user.email, name: user.name },
      });
      if (userLogin) {
        const post = await validationPost(req.body);
        if (post) {
          if (post.name === user.name && post.email === user.email) {
            const savePost = await user.createPost(post);
            res.status(200).send(post);
          } else {
            res.status(400).send("Name or email is wrong.");
          }
        } else {
          res.status(400).json({ err: checkUser.error.details[0].message });
        }
      } else {
        return res.status(403).json({
          error: "Permissions not available",
          message:
            "You do not have the necessary permissions to perform this action.\
 Please log in with the valid credential informations.",
        });
      }
    } else {
      res
        .status(400)
        .json({ msg: `There is no user with this name: '${req.body.name}'` });
    }
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});

async function validationPost(post) {
  const schema = Joi.object({
    name: Joi.string().min(2),
    email: Joi.string().email().required(),
    body: Joi.string().required(),
  });
  try {
    return await schema.validateAsync(post);
  } catch (err) {
    throw err;
  }
}

module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require('../../models/userModel');
dotenv.config();

router.post("/login", async (req, res) => {
  try {
    const requestUser = req.body;
    const user = await User.findOne({
      name : requestUser.name,
      email: requestUser.email,
    });

    if (!user) {
      return res.status(400).send("invalid Credentials");
    }
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      return res.status(400).send("invalid Credentials");
    }
    const jwtUser = {
      id: user.id,
      email: user.email,
    };
    const token = jwt.sign(jwtUser, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });



    return res.status(200).json({
      token,
    });
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
});

// router.get("/auth/", async (req, res) => {
//   try {
//     const users = await User.find();
//     if (users.length > 0) {
//       return res.status(200).json({ "Authenticated users": users });
//     } else {
//       return res.status(400).json({ msg: "There is no users." });
//     }
//   } catch (err) {
//     console.log(err);
//     res.send(err.message);
//   }
// });

// router.get("/auth/:id", async (req, res) => {
//   try {
//     const userID = await User.findById(req.params.id);
//     if (userID) {
//       res.status(200).json({ user: userID });
//     } else {
//       res
//         .status(404)
//         .json({ msg: `There is no user with this ID: ${req.params.id}.` });
//     }
//   } catch (err) {
//     console.log(err);
//     res.send(err.message);
//   }
// });

module.exports = router;

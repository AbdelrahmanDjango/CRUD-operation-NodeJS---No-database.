/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with provided credentials and generate JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: JWT token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       '400':
 *         description: Invalid credentials
 *       '500':
 *         description: Internal server error
 */

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


module.exports = router;

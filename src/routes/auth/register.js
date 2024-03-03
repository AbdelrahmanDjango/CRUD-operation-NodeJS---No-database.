const express = require("express");
const db = require("../../config/initDatabase");
const Joi = require("joi");
const router = express.Router();
const bcrypt = require("bcrypt");

// password => "asjdhnaskljdnhlashdnlkasd" encryption
// "asjdhnaskljdnhlashdnlkasd" => "password" decryption
// ("password89");
// hashing:
// password:djklasbhdkjsa => "hashdsaldhkalsdjsakjdalsdlassa;ldksa;ldkasld" but u cant reverse this process ( hashing will always get the same result)
// password:salkdnask => "saldk;asdlls;da;ldksa;ldkasld" but u cant reverse this process ( hashing will always get the same result)
// hashdsaldhkalsdjsakjdalsdlas !=? "password"
router.post("/register", async (req, res) => {
  try {
    const user = await validationUser(req.body);
    if (user) {
      const saltRounds = 10;

      const myPlaintextPassword = req.body.password;
      const hashedPassword = await bcrypt.hash(myPlaintextPassword, saltRounds);
      user.password = hashedPassword;
      user.role = "user";
      await db.user.create(user);
      return res
        .status(200)
        .json({ Created: "Registering successfully.", user });
    }
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      const { errors } = err;
      let errorMessage = "";

      for (const error of errors) {
        errorMessage += error.message + ", ";
      }

      console.log({ message: errorMessage });
      res.json({ error: errorMessage });
    } else {
      // Handle other errors
      console.error(err);
      res.send(err.message);
    }
  }
});

async function validationUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().min(3).required(),
    password: Joi.string().required().min(8),
  });
  try {
    return await schema.validateAsync(user);
  } catch (err) {
    throw err;
  }
}

module.exports = router;

// // password => "asjdhnaskljdnhlashdnlkasd" encryption
// // "asjdhnaskljdnhlashdnlkasd" => "password" decryption
// // ("password89");
// // hashing:
// // password:djklasbhdkjsa => "hashdsaldhkalsdjsakjdalsdlassa;ldksa;ldkasld" but u cant reverse this process ( hashing will always get the same result)
// // password:salkdnask => "saldk;asdlls;da;ldksa;ldkasld" but u cant reverse this process ( hashing will always get the same result)
// // hashdsaldhkalsdjsakjdalsdlas !=? "password"

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Internal Server Error" });
//     // if (err.name === "SequelizeUniqueConstraintError") {
//     //   const { errors } = err;
//     //   let errorMessage = "";

//     //   for (const error of errors) {
//     //     errorMessage += error.message + ", ";
//     //   }

//     //   console.log({ message: errorMessage });
//     //   res.json({ error: errorMessage });
//     // } else {
//     //   // Handle other errors
//     //   console.error(err);
//     //   res.send(err.message);
//     // }
//   }
// });



const express = require("express");
const Joi = require("joi");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../../models/userModel');
const defaultPicture = '/'
router.post("/register", async (req, res) => {
  try {
    const validatedUser = await validationUser(req.body);
    if (validatedUser) {
      const saltRounds = 10;

      const myPlaintextPassword = req.body.password;
      const hashedPassword = await bcrypt.hash(myPlaintextPassword, saltRounds);
      
      const newUser = new User({
        name: validatedUser.name,
        email: validatedUser.email,
        password: hashedPassword,
        role: "user",
        privacy: "public",
        bio : "Hello, I'm using this blog.",
      });

      await newUser.save();

      return res.status(200).json({ Created: "Registering successfully.", user: newUser });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
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

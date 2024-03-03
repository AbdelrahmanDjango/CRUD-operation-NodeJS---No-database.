const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  HOST: process.env.DATABASE_HOST,
  USER: process.env.DB_USERNAME,
  PASSWORD: process.env.DATABASE_PASSWORD,
  DB: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT,
};

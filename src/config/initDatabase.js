// import configuration of db to get user, pass, etc..
const dbConfig = require("./db.config.js");
const Sequelize = require("sequelize");
// create sequelize instance using the information that I import it from dbConfig.
// init ORM and connection with db.
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  // user, db and pass are a original details, another things are additional.
  dialect: dbConfig.dialect,
  host: dbConfig.HOST,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // You may need to adjust this based on your PostgreSQL server configuration
    },
  },
  // No names except the name that I've declare it.
  // operatorsAliases : false
});
// init a clean database.
const db = {};
// adds properties, lib and instance.
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// import and init models.
db.posts = require("../models/postModel.js")(sequelize, Sequelize);
db.user = require("../models/userModel.js")(sequelize, Sequelize);
db.follow = require("../models/followingModel.js")(sequelize, Sequelize);

db.user.hasMany(db.posts);
db.posts.belongsTo(db.user);


db.user.hasMany(db.follow);
db.follow.belongsTo(db.user);

module.exports = db;

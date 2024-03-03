const { DataTypes } = require("sequelize");
const uuid = require("uuid");
module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("post", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    body: {
      type: DataTypes.STRING,
    },
  });

  return Post;
};

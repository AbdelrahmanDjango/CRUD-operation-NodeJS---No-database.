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
    privacy : {
      type : DataTypes.STRING,
    }

  });
  // sequelize.sync({alter : true}).then(() => {
  //   console.log('Post table created successfully.')
  // }).catch((err) => {
  //   console.log('Server error', err.message)
  // });

  return Post;
};

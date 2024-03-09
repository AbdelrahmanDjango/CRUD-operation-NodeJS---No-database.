const { DataTypes } = require("sequelize");
const uuid = require("uuid");
module.exports = (sequelize, Sequelize) => {
  const Follow = sequelize.define("follow", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId : {
      type : DataTypes.INTEGER,
      allowNull : false,
    },
    followerId : {
      type : DataTypes.INTEGER,
      allowNull : false,
    },

  });
  Follow.associate = (models) => {
    Follow.belongsTo(models.User, {foreignKey: 'userId', as: 'user'}),
    Follow.belongsTo(models.User, {foreignKey: 'followerId', as: 'follower'})
  }
  // sequelize.sync({alter : true}).then(() => {
  //   console.log('Follow table created successfully.')
  // }).catch((err) => {
  //   console.log('Server error', err.message)
  // });

  return Follow;
};

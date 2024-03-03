const DataTypes = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const UserAuth = sequelize.define("auth", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return UserAuth;
};

const DataTypes = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
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
    role: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    privacy : {
      type: DataTypes.STRING
    }
    
  });

  // sequelize.sync({alter : true}).then(() => {
  //   console.log('User table created successfully.')
  // }).catch((err) => {
  //   console.log('Server error', err.message)
  // });

  return User;
};

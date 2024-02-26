const { DataTypes } = require('sequelize');
const uuid = require('uuid');
module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define('post', {
        id : {
            // type : DataTypes.UUID,
            // defaultValue: () => uuid.v4(),
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true,
        },
        author : {
           type : DataTypes.STRING
        },
        body : {
            type : DataTypes.STRING
        }
    });
    sequelize.sync().then(() => {
        console.log('Post table created successfully.')
    }).catch((err) => {
        console.error('Error in table creating', err)
    });
    return Post;
};


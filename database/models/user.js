'use strict';
const {
  Model
} = require('sequelize');
const accounts = require('./accounts');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //To create a One-To-Many relationship, the hasMany and belongsTo associations are used together;
      //https://sequelize.org/docs/v6/core-concepts/assocs/
      //Banlist.belongsTo(models.Player);
      User.hasMany(models.Accounts)
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: DataTypes.STRING,
    permissions: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};

// playerModel.init(
// 	{
// 		id: {
// 			type: DataTypes.INTEGER,
// 			autoIncrement: true,
// 			primaryKey: true,
// 			validate: {
// 				isInt: true,
// 			},
// 		},
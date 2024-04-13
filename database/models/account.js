'use strict';
const {
  Model
} = require('sequelize');
const { User } = require("../models")
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    async getAccounts(username){
      //i need to get username id by supplied username
      //i use the findbypk method
      try{
        //const project = await Project.findByPk(123);
        let res = await User.findByPk(username)
        return res

      }
      catch(err){
        console.log(err)
      }


    }
    static associate(models) {
      // define association here
    }
  }
  Account.init({
    balance: DataTypes.INTEGER,
    users_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};
const { Account, User } = require("../database/models");
const user = require("../database/models/user");

class Database {
	constructor() {}
	//used for user model to retrive a user instance
	static async userLookup(username) {
		try {
			//https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
			const UserRes = await User.findOne({
				where: {
					username: username,
				},
			});
			if (!UserRes) return false;
			return UserRes;
		} catch (error) {
			throw new Error(error);
		}
	}

	static async accountLookup(userInstance) {
		const accountRes = await Account.findOne({
			where: {
				user_id: userInstance.id,
			},
			//https://github.com/sequelize/sequelize/issues/4074
			attributes: ["balance"],
		});
		if (!accountRes) return false;
		return accountRes;
	}

	static async balanceUpdate(userInstance , amount){
		const balanceRes = await Account.update(
			{
				balance: amount,
			},
			{
				where: {
					user_id: userInstance.id,
				},
			}
		);
		if (!balanceRes) return false
		return balanceRes
	}
	
}

module.exports = Database;

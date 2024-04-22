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

	static async accountFindall(userInstance){
		const accountRes = await Account.findAll({
			where: {
				user_id: userInstance.id
			},
		});
		if (!accountRes) return false
		return accountRes
	}

	static async accountCreate(userInstance){
		const accountRes = await Account.create({
			user_id: userInstance.id,
			balance: "0",	
			where: {
				user_id: userInstance.id,
			},
		});
		if (!accountRes) return false
		return accountRes

	}
	static async userCreate(username){
		const userRes = await User.create({
			username: username,
			permission: "client"
		})
		if (!userRes) return false 
		return userRes
	}
	
}

module.exports = Database;

// Create a new user
// const jane = await User.create({ firstName: 'Jane', lastName: 'Doe' });
// console.log("Jane's auto-generated ID:", jane.id);

// const [user, created] = await User.findOrCreate({
// 	where: { username: 'sdepold' },
// 	defaults: {
// 	  job: 'Technical Lead JavaScript',
// 	},
//   });
//   console.log(user.username); // 'sdepold'
//   console.log(user.job); // This may or may not be 'Technical Lead JavaScript'
//   console.log(created); // The boolean indicating whether this instance was just created
//   if (created) {
// 	console.log(user.job); // This will certainly be 'Technical Lead JavaScript'
//   }

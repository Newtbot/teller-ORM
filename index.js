const { Account, User } = require("./database/models");
const Database = require("./modules/Database")


//should not see banker privileges blah
class Bank {
	constructor(username, permission) {
		this.username = username;
		this.permission = permission;
	}
	// get all account of the user
	async getUserAccounts(username) {
		try {
			//check permission of user
			const user = await Database.userLookup(username);

			if (user.permission !== "banker") {
				//return username own accounts only
				const accountRes = await Account.findAll({
					where: {
						user_id: user.id,
					},
				});
				return accountRes;
			} else {
				//else return all accounts for banker
				const accountRes = await Account.findAll();
				return accountRes;
			}
		} catch (error) {
			console.log(error);
		}
	}

	//create Account
	async createAccount(username, newAccUsername) {
		try {
			//check permission of user
			const user = await Database.userLookup(username);
			if (user.permission !== "banker") {
				throw new Error(
					"You do not have sufficient permissions for this action"
				);
			} else {
				const accountUser = await Database.userLookup(newAccUsername);
				const accountRes = await Account.create({
					user_id: accountUser.id,
					balance: "0",
					where: {
						user_id: accountUser.id,
					},
				});
				if (!accountRes) return false;
				return `Account successfully created for ${newAccUsername}`;
			}
		} catch (error) {
			console.log(error);
		}
	}

	//deposit
	//deposit and withdraw funds from ANY user account, and transfer money between ANY two user accounts
	async deposit(username, amount , target) {
		try {
			const user = await Database.userLookup(username)
			if (user.permission !== "banker") {
				//deposit for ur own acc
				/*
				This does not account for one to many. 
				if a user has mutliple account it would update both accounts lol
				*/

				//get the old amount first........


				
				// const balRes = await Database.balanceUpdate(user , amount)
				// return balRes
			} else {
				//deposit for any and all accounts
				/*
				This does not account for a proper implemenetation due to nature of the project...
				in a real world scenario proper access control should be implemeneted but this is just a simple
				MVC concept
				*/
				// const targetRes = await Database.userLookup(target)
				// const balRes = await Database.balanceUpdate(targetRes , amount)
				// return `Successful!`

			}
		} catch (error) {
			console.log(error);
		}
	}

	//withdraw
	//deposit and withdraw funds from ANY user account, and transfer money between ANY two user accounts
	/*
	1) get amt to withdraw
	2) do math??
	3) update query
	*/
	async withdraw(username, amount) {
		try {
			const user = await Database.userLookup(username)
			//get bal
			if (user.permission !== "banker") {
				//user withdraw from his own acc and blah

				//acount lookup for the balance
				const accountRes = Database.accountLookup(user)
				const newBal = accountRes.balance - amount 

				const balanceRes = Database.balanceUpdate(user , newBal)
				return `Your new Balance is ${newBal} for ${username}`;

			}else{
				//banker can withdraw from any account and blah
				/*
				This does not account for a proper implemenetation due to nature of the project...
				in a real world scenario proper access control should be implemeneted but this is just a simple
				MVC concept
				*/


			}
		} catch (error) {
			console.log(error);
		}
	}
	//spagati CODE TERRIBLE DO NOT LOOK!!!!!!
	//spagati CODE TERRIBLE DO NOT LOOK!!!!!!
	//spagati CODE TERRIBLE DO NOT LOOK!!!!!!
	//spagati CODE TERRIBLE DO NOT LOOK!!!!!!
	//spagati CODE TERRIBLE DO NOT LOOK!!!!!!

	//Note: in real Banking system. The Tripe A like authentication will obviously be present like usage of pin to authenticate
	//if he is the user
	//Due to the limiation of JS not have inheritence unlike Python. I will not be able to recreate this here.
	//and transfer money from their OWN accounts to another user account
	/*
	Notes:
	user need to have the amt if not it will return a fail 
	if user does not have succifient funds return error.
	*/
	// async transfer(username, amount, receiver) {
	// 	try {
	// 		const userRes = await User.findOne({
	// 			where: {
	// 				username: username,
	// 			},
	// 		});
	// 		if (!userRes) throw new Error("no user found");

	// 		const receiverRes = await User.findOne({
	// 			where: {
	// 				username: receiver,
	// 			},
	// 		});
	// 		if (!receiverRes) throw new Error("no receiver found!");

	// 		//check bal of user trying to transfer
	// 		const userBalRes = await Account.findOne({
	// 			where: {
	// 				user_id: userRes.id,
	// 			},
	// 			//https://github.com/sequelize/sequelize/issues/4074
	// 			attributes: ["balance"],
	// 		});

	// 		//check bal of receiver
	// 		const receiverBalRes = await Account.findOne({
	// 			where: {
	// 				user_id: receiverRes.id,
	// 			},
	// 			//https://github.com/sequelize/sequelize/issues/4074
	// 			attributes: ["balance"],
	// 		});

	// 		//if the bal <= 0 do nothing and throw a error
	// 		// console.log(userBalRes)
	// 		if (userBalRes.balance <= 0) {
	// 			throw new Error(
	// 				`${username} has insufficient Balance to transfer to ${receiver}`
	// 			);
	// 		} else {
	// 			//get amt to transfer
	// 			//minus the amount from the user trying to transfer
	// 			//update the receiver balance
	// 			const remainBal = userBalRes.balance - amount;
	// 			const userBal = await Account.update(
	// 				{
	// 					balance: remainBal,
	// 				},
	// 				{
	// 					where: {
	// 						user_id: userRes.id,
	// 					},
	// 				}
	// 			);
	// 			const receiverNewBal = receiverBalRes.balance + amount;
	// 			const newBal = await await Account.update(
	// 				{
	// 					balance: receiverNewBal,
	// 				},
	// 				{
	// 					where: {
	// 						user_id: receiverRes.id,
	// 					},
	// 				}
	// 			);
	// 			return `${username} has successfully transfer ${amount} to ${receiver}`;
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }
}
const user = new Bank("test");
//get all accounts
// IIFE https://github.com/theta42/proxy/blob/master/nodejs/models/user_redis.js#L111
// (async function(){
// 	try{
// 		let Res = await user.getUserAccounts("noot")
//         console.log(Res)
// 	}catch(error){
//         console.log(error)
// 	}
// })();

//create account
// (async function () {
// 	try {
// 		let res = await user.createAccount("noot", "dave");
// 		console.log(res);
// 	} catch (error) {
// 		console.log(error);
// 	}
// })();

//deposit
(async function(){
	try{
		user.deposit("dave" , "1" , "dave")
	}catch(error){
        console.log(error)
	}
})();

//withdraw
// (async function () {
// 	try {
// 		let Res = await user.withdraw("dave", "5");
// 		console.log(Res);
// 	} catch (error) {
// 		console.log(error);
// 	}
// })();

//transfer
// (async function () {
// 	try {
// 		let Res = await user.transfer("dave", "1", "noot");
// 		// let Res = await user.transfer("noot", "5", "dave");

// 		// console.log(Res);
// 	} catch (error) {
// 		console.log(error);
// 	}
// })();

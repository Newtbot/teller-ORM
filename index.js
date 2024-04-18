// Step 2: Our program models We need two different classes for users - a client, and a banker.
// A client should be able to view all their accounts, deposit and withdraw funds to and from their OWN accounts,
// and transfer money from their OWN accounts to another user account.
// A banker should be able to create accounts, deposit and withdraw funds from ANY user account,
//  and transfer money between ANY two user accounts.
//  A banker should not have any accounts (no co-mingling of funds) and a person should not see the superuser options
//that bankers have.
// How you want to design this is up to you. See inheritance

const { where } = require("sequelize");
const { Account, User } = require("./database/models");
//const { Banlist, Player } = require("../database/models");

class Database {
	constructor() {}
	static async userLookup(username) {
		try {
			//https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
			const UserRes = await User.findOne({
				where: {
					username: username,
				},
			});
			if (!UserRes) return false
			return UserRes;
		} catch (error) {
			throw new Error(error);
		}
	}
	static async accountUpdate() {}
}

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
	async deposit(username, balance) {
		try {
			const user = await Database.userLookup(username)
			if (user.permission !== "banker") {
				//deposit for ur own acc

			} else {
				//deposit for any and all accounts
			
			}
			//fucking update queries would work lol....
			// const balanceRes = await Account.update(
			// 	{
			// 		balance: balance,
			// 	},
			// 	{
			// 		where: {
			// 			user_id: userRes.id,
			// 		},
			// 	}
			// );
			// if (!balanceRes) throw new Error("no balance was added");
			// return balanceRes;
		} catch (error) {
			console.log(error);
		}
	}

	//withdraw
	/*
	1) get amt to withdraw
	2) do math??
	3) update query
	*/
	async withdraw(username, balance) {
		try {
			const userRes = await User.findOne({
				where: {
					username: username,
				},
			});
			if (!userRes) throw new Error("no user found");

			//balance res lookup
			const userBalRes = await Account.findOne({
				where: {
					user_id: userRes.id,
				},
				//https://github.com/sequelize/sequelize/issues/4074
				attributes: ["balance"],
			});
			// console.log(userBalRes.balance)
			const newBal = userBalRes.balance - balance;

			//update the usr account balance now.
			const userBal = await Account.update(
				{
					balance: newBal,
				},
				{
					where: {
						user_id: userRes.id,
					},
				}
			);

			return `Your new Balance is ${newBal} for ${username}`;
		} catch (error) {
			console.log(error);
		}
	}

	//Note: in real Banking system. The Tripe A like authentication will obviously be present like usage of pin to authenticate
	//if he is the user
	//Due to the limiation of JS not have inheritence unlike Python. I will not be able to recreate this here.

	//and transfer money from their OWN accounts to another user account
	/*
	Notes:
	user need to have the amt if not it will return a fail 
	if user does not have succifient funds return error.
	*/
	async transfer(username, amount, receiver) {
		try {
			const userRes = await User.findOne({
				where: {
					username: username,
				},
			});
			if (!userRes) throw new Error("no user found");

			const receiverRes = await User.findOne({
				where: {
					username: receiver,
				},
			});
			if (!receiverRes) throw new Error("no receiver found!");

			//check bal of user trying to transfer
			const userBalRes = await Account.findOne({
				where: {
					user_id: userRes.id,
				},
				//https://github.com/sequelize/sequelize/issues/4074
				attributes: ["balance"],
			});

			//check bal of receiver
			const receiverBalRes = await Account.findOne({
				where: {
					user_id: receiverRes.id,
				},
				//https://github.com/sequelize/sequelize/issues/4074
				attributes: ["balance"],
			});

			//if the bal <= 0 do nothing and throw a error
			// console.log(userBalRes)
			if (userBalRes.balance <= 0) {
				throw new Error(
					`${username} has insufficient Balance to transfer to ${receiver}`
				);
			} else {
				//get amt to transfer
				//minus the amount from the user trying to transfer
				//update the receiver balance
				const remainBal = userBalRes.balance - amount;
				const userBal = await Account.update(
					{
						balance: remainBal,
					},
					{
						where: {
							user_id: userRes.id,
						},
					}
				);
				const receiverNewBal = receiverBalRes.balance + amount;
				const newBal = await await Account.update(
					{
						balance: receiverNewBal,
					},
					{
						where: {
							user_id: receiverRes.id,
						},
					}
				);
				return `${username} has successfully transfer ${amount} to ${receiver}`;
			}
		} catch (error) {
			console.log(error);
		}
	}
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
		user.deposit("dave" , "10")
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

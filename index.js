const { parse } = require("dotenv");
const { Account, User } = require("./database/models");
const Database = require("./modules/Database");

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
				const userRes = await Database.accountFindall(user);
				return userRes;
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
			const targetUser = await Database.userLookup(newAccUsername)
			if (user.permission !== "banker") {
				throw new Error(
					"You do not have sufficient permissions for this action"
				);
			} else {
				//if no user found create blah
				if (targetUser == false) {
					let userRes = await Database.userCreate(newAccUsername)
					//create account
					let accountRes = await Database.accountCreate(userRes)
					if (!accountRes) return false;
					return `Account successfully created for ${newAccUsername}`;
				} else {
					//continue
					const accountUser = await Database.userLookup(newAccUsername);
					const accountRes = await Database.accountCreate(accountUser);
					if (!accountRes) return false;
					return `Account successfully created for ${newAccUsername}`;
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	//deposit
	//deposit and withdraw funds from ANY user account, and transfer money between ANY two user accounts
	async deposit(username, amount, target) {
		try {
			const user = await Database.userLookup(username);
			if (user.permission !== "banker") {
				//deposit for ur own acc
				/*
				This does not account for one to many. 
				if a user has mutliple account it would update both accounts lol
				*/

				//get the current bal
				const account = await Database.accountLookup(user);
				//https://stackoverflow.com/questions/12982128/how-to-ensure-javascript-addition-instead-of-string-concatenation-not-always-ad
				const newBal = parseFloat(account.balance) + parseFloat(amount);

				//update to db
				const res = await Database.balanceUpdate(user, newBal);
				if (!res) return false;
				return `Your new balance after deposit is ${newBal}`;
			} else {
				//deposit for any and all accounts
				/*
				This does not account for a proper implemenetation due to nature of the project...
				in a real world scenario proper access control should be implemeneted but this is just a simple
				MVC concept
				*/
				const user = await Database.userLookup(target);
				const account = await Database.accountLookup(user);
				//https://stackoverflow.com/questions/12982128/how-to-ensure-javascript-addition-instead-of-string-concatenation-not-always-ad
				const newBal = parseFloat(account.balance) + parseFloat(amount);

				//update to db
				const res = await Database.balanceUpdate(user, newBal);
				if (!res) return false;
				return `The new balance for the ${target} is ${newBal}`;
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
	async withdraw(username, amount, target) {
		try {
			const user = await Database.userLookup(username);
			//get bal
			if (user.permission !== "banker") {
				//user withdraw from his own acc and blah

				//acount lookup for the balance
				const user = await Database.userLookup(target);
				const accountRes = await Database.accountLookup(user);
				const newBal = parseFloat(accountRes.balance) - parseFloat(amount);

				const balanceRes = Database.balanceUpdate(user, newBal);
				return `Your new Balance is ${newBal} for ${username}`;
			} else {
				//banker can withdraw from any account and blah
				/*
				This does not account for a proper implemenetation due to nature of the project...
				in a real world scenario proper access control should be implemeneted but this is just a simple
				MVC concept
				*/
				const user = await Database.userLookup(target);
				const accountRes = await Database.accountLookup(user);
				const newBal = parseFloat(accountRes.balance) - parseFloat(amount);
				const balanceRes = Database.balanceUpdate(user, newBal);
				return `The new balance for the ${target} is ${newBal}`;
			}
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
			const user = await Database.userLookup(username);
			if (user.permission !== "banker") {
				//user instance
				const user = await Database.userLookup(username);
				const target = await Database.userLookup(receiver);
				//balance
				const userBal = await Database.accountLookup(user);
				const targetBal = await Database.accountLookup(target);

				//if the bal <= 0 do nothing and throw a error
				if (userBal.balance <= 0) {
					throw new Error(
						`${username} has insufficient Balance to transfer to ${receiver}`
					);
				} else {
					//get amt to transfer
					//minus the amount from the user trying to transfer
					//update the receiver balance
					const newBal = parseFloat(userBal.balance) - parseFloat(amount);
					const targetnewBal =
						parseFloat(targetBal.balance) + parseFloat(amount);
					//we need to update the user and target accounts
					const userRes = await Database.balanceUpdate(user, newBal);
					const targetRes = await Database.balanceUpdate(target, targetnewBal);

					return `${username} has successfully transfer ${amount} to ${receiver}`;
				}
			}
			//banker
			else {
				//user instance
				const user = await Database.userLookup(username);
				const target = await Database.userLookup(receiver);
				//balance
				const userBal = await Database.accountLookup(user);
				const targetBal = await Database.accountLookup(target);
				//if the bal <= 0 do nothing and throw a error
				if (userBal.balance <= 0) {
					throw new Error(
						`${username} has insufficient Balance to transfer to ${receiver}`
					);
				} else {
					//get amt to transfer
					//minus the amount from the user trying to transfer
					//update the receiver balance
					const newBal = parseFloat(userBal.balance) - parseFloat(amount);
					const targetnewBal =
						parseFloat(targetBal.balance) + parseFloat(amount);
					//we need to update the user and target accounts
					const userRes = await Database.balanceUpdate(user, newBal);
					const targetRes = await Database.balanceUpdate(target, targetnewBal);

					return `${username} has successfully transfer ${amount} to ${receiver}`;
				}
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

// // create account
// (async function () {
// 	try {
// 		let res = await user.createAccount("noot", "test");
// 		console.log(res);
// 	} catch (error) {
// 		console.log(error);
// 	}
// })();

// //deposit
// (async function(){
// 	try{
// 		let res = await user.deposit("noot" , "5" , "dave")
// 		console.log(res)
// 	}catch(error){
//         console.log(error)
// 	}
// })();

// //withdraw
// (async function () {
// 	try {
// 		let Res = await user.withdraw("noot", "1" , "dave");
// 		console.log(Res);
// 	} catch (error) {
// 		console.log(error);
// 	}
// })();

// //transfer
// (async function () {
// 	try {
// 		// let Res = await user.transfer("dave", "1", "noot");
// 		let Res = await user.transfer("noot", "1", "dave");

// 		console.log(Res);
// 	} catch (error) {
// 		console.log(error);
// 	}
// })();

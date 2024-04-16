// Step 2: Our program models We need two different classes for users - a client, and a banker.
// A client should be able to view all their accounts, deposit and withdraw funds to and from their OWN accounts,
// and transfer money from their OWN accounts to another user account.
// A banker should be able to create accounts, deposit and withdraw funds from ANY user account,
//  and transfer money between ANY two user accounts.
//  A banker should not have any accounts (no co-mingling of funds) and a person should not see the superuser options 
//that bankers have.
// How you want to design this is up to you. See inheritance

const { Account, User } = require("./database/models");
//const { Banlist, Player } = require("../database/models");

//should not see banker privileges blah
class Client {
	constructor(username, permission) {
		this.username = username;
		this.permission = permission;
	}
	// get all account of the user
	async getUserAccounts(username) {
		try {
			const userRes = await User.findOne({
				where: {
					username: username,
				},
			});
            //https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
            const AccountRes = await userRes.getAccounts()
            return AccountRes
		} catch (error) {
			console.log(error);
		}
	}

	//deposit
    async deposit(username , balance) {
        try {
            const userRes = await User.findOne({
				where: {
					username: username,
				},
			});



        

            
        } catch (error) {
            console.log(error)
        }

    }

	//withdraw
}
class Banker {
	constructor() {}
	//create for any user acc

	//deposit for any user acc

	//withdraw for any user acc

	//transfer for any user account to any user acc
}

const user = new Client("test");
//IIFE https://github.com/theta42/proxy/blob/master/nodejs/models/user_redis.js#L111
// (async function(){
// 	try{
// 		let Res = await user.getUserAccounts("dave")
//         console.log(Res)
// 	}catch(error){
//         console.log(error)
// 	}
// })();


(async function(){
	try{
		user.deposit("dave" , "10")
	}catch(error){
        console.log(error)
	}
})();
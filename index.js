// Step 2: Our program models We need two different classes for users - a client, and a banker. 
// A client should be able to view all their accounts, deposit and withdraw funds to and from their OWN accounts, 
// and transfer money from their OWN accounts to another user account. 
// A banker should be able to create accounts, deposit and withdraw funds from ANY user account,
//  and transfer money between ANY two user accounts. 
//  A banker should not have any accounts (no co-mingling of funds) and a person should not see the superuser options that bankers have. 
// How you want to design this is up to you. See inheritance

const { Account } = require("./database/models/")
//should not see banker privileges blah
class User {
    constructor(username , permission){
        this.username = username
        this.permission = this.permission
    }
    //view all account
    getUserAccounts(username){
        try {
            const res = Account.getAccounts(username)
            console.log(res)
            return res
            
        } catch (error) {
            console.log(error)
            
        }
        // console.log(username)
        //need to supply username 

    }

    //deposit

    //withdraw 
}
class Banker {
    constructor(){

    }
    //create for any user acc

    //deposit for any user acc

    //withdraw for any user acc

    //transfer for any user account to any user acc
}

const newuser = new User("test")
newuser.getUserAccounts("dave")

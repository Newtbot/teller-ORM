Your Own Private Bank
Welcome back! In this challenge you'll be creating a rich Python terminal app emulating bank software.

### Step 1: Database: Our DB schema for this challenge is simple. For now, we only need two tables - Users and accounts. A user can have many accounts. Users should have at minimum a username to log in to the app, a time when they were created, and a permissions level. An account should have a number and a balance. Design the schema in SQL designer if it helps you.

### Step 2: Our program models We need two different classes for users - a client, and a banker. A client should be able to view all their accounts, deposit and withdraw funds to and from their OWN accounts, and transfer money from their OWN accounts to another user account. A banker should be able to create accounts, deposit and withdraw funds from ANY user account, and transfer money between ANY two user accounts. A banker should not have any accounts (no co-mingling of funds) and a person should not see the superuser options that bankers have. How you want to design this is up to you. See inheritance

I also strongly recommend that you have another class (see static methods) or a module that handles only reading and writing to the database.

### Step 3: Controller and Views Stick to the MVC pattern - No spaghetti code! Keep your code dry. There's alot of user choice options which could be alot of if/else statements - can you think of a better way?

Challange link:
## https://git.theta42.com/course-work/tellers-mvc/src/branch/billy/exercises/2-bank-software

File Structure
```
├── database      // Where all database files live in 
│   ├── config // holds the sqlite config file for sequelize cli usage
│   ├── dev // holds the seqlite database file
│   ├── seeders // holds all seeding files
│   |──migration // Holds all past migration files
│   ├── model // Data interaction classed
│   │   ├── account.js // account model class to abstract User table for ORM usage
│   │   ├── user.js // User model class to abstract User table for ORM usage
│   │   ├── index.js // Sequelize Index.js to map all model class to a db var
├── Modules // Holds common JS helper functions used in the project
│   └── Database.js
── index.js //all the main code lives in here
── package.json // Holds information about the project and what packages are required
── package-lock.json // Hold what auto install packages(at version) are currently installed
```

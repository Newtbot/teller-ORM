const config = {
  "development":  {
    "username": "root",
    "password": null,
    "storage": __dirname + "/../dev/dev.sqlite",
    "dialect": "sqlite",
    "logging": false,
    "seeders-path": "../seeders",
    "define": {
      "underscored": true
    }
  },
  "test":  {
    "username": "root",
    "password": null,
    "storage": ':memory:',
    "dialect": "sqlite",
    "logging": false,
    "seeders-path": "../seeders",
    "define": {
      "underscored": true
    }
  },
  "production": {
    "username": "root",
    "password": null,
    "storage": "../prod/data.sqlite",
    "dialect": "sqlite",
    "logging": false,
    "seeders-path": "../seeders",
    "define": {
      "underscored": true
    }
  }
}
module.exports = config;
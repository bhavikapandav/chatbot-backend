'use strict';
console.log("DATABASE FILE LOADED");
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const clc = require("cli-color");
let config = require("../../config/config")
console.log("config====",config);
const mode = config.run_mode;
console.log("mode====",mode);
config = config[mode.toLowerCase()];
const db = {};
let sequelize;
console.log("config====",config);

sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.db_port,
  dialect: config.dialect,
  operatorsAliases: 0,
  logging: mode == "PROD" ? false : console.log,
  pool: config.pool,
});

sequelize
  .authenticate()
  .then((res) => {
    console.log(
      clc.green.underline("Database connected successfully:") +
        clc.yellow.underline(
          ` DB_NAME:${config.database} ${clc.yellow.underline("::")} Host:${
            config.host
          }`
        )
    );
  })
  .catch((err) => {
    console.log(clc.red.underline(`Unable to connect to the database: ${err}`));
  });

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports ={ db, sequelize };

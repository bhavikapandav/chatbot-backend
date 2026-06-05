// {
//   "development": {
//     "username": "root",
//     "password": null,
//     "database": "database_development",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "test": {
//     "username": "root",
//     "password": null,
//     "database": "database_test",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "production": {
//     "username": "root",
//     "password": null,
//     "database": "database_production",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   }
// }

require("dotenv").config();
const envMode = process.env.RUN_MODE;

const config={
     [envMode.toLowerCase()]: {
    username: process.env[`DB_USERNAME_${envMode}`],
    password: process.env[`DB_PASSWORD_${envMode}`],
    database: process.env[`DB_NAME_${envMode}`],
    host: process.env[`DB_HOSTNAME_${envMode}`],
    dialect: "postgres",
    db_port: process.env.DB_PORT,
  },
  run_mode: envMode,
}

module.exports=config;

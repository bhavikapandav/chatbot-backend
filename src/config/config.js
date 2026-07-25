require("dotenv").config();
const envMode = process.env.RUN_MODE;

const config = {
    [envMode.toLowerCase()]: {
        username: process.env[`DB_USERNAME_${envMode}`],
        password: process.env[`DB_PASSWORD_${envMode}`],
        database: process.env[`DB_NAME_${envMode}`],
        host: process.env[`DB_HOSTNAME_${envMode}`],
        dialect: "postgres",
        db_port: process.env.DB_PORT,
    },
    mongoURI: process.env[`MONGO_URI_${envMode}`],
    jwt: {
        secret_key: process.env[`JWT_SECRET_${envMode}`],
        algorithm: process.env[`JWT_ALGORITHM_${envMode}`],
        token_life: process.env[`JWT_TOKEN_LIFE_${envMode}`],
    },
    gemini_api_key:     process.env[`GEMINI_API_KEY_${envMode}`]
}
module.exports = config;
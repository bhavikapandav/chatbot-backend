require("dotenv").config();
const envMode = (process.env.RUN_MODE || 'PROD').toUpperCase();

const config = {
    [envMode.toLowerCase()]: {
        username: process.env[`DB_USERNAME_${envMode}`] || process.env.DB_USERNAME,
        password: process.env[`DB_PASSWORD_${envMode}`] || process.env.DB_PASSWORD,
        database: process.env[`DB_NAME_${envMode}`] || process.env.DB_NAME,
        host: process.env[`DB_HOSTNAME_${envMode}`] || process.env.DB_HOSTNAME,
        dialect: "postgres",
        db_port: process.env.DB_PORT,
    },
    mongoURI: process.env[`MONGO_URI_${envMode}`] || process.env.MONGO_URI,
    jwt: {
        secret_key: process.env[`JWT_SECRET_${envMode}`] || process.env.JWT_SECRET,
        algorithm: process.env[`JWT_ALGORITHM_${envMode}`] || process.env.JWT_ALGORITHM || 'HS256',
        token_life: process.env[`JWT_TOKEN_LIFE_${envMode}`] || process.env.JWT_TOKEN_LIFE || '30d',
    },
    gemini_api_key: process.env[`GEMINI_API_KEY_${envMode}`] || process.env.GEMINI_API_KEY
}
module.exports = config;
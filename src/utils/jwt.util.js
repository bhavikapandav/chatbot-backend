const jwt = require("jsonwebtoken");
const config = require("../config/config")
const { secret_key: secretKey, algorithm, token_life } = config.jwt;

const jwtSignOptions = {
    algorithm: algorithm,
    expiresIn: token_life,
};
module.exports = {
    generateToken: (payload) => {
        const token = jwt.sign(payload, secretKey, jwtSignOptions);
        return token;
    },

    verifyToken: (token) => {
        const verifyToken = jwt.verify(token, secretKey);
        return verifyToken;
    },
}
const { User } = require("../models")

class UserRepository {
    findOne = async (options) => {
        return await User.findOne(options);
    };
    create = async (requestPayload) => {
        console.log("===========", requestPayload);
        return await User.create(requestPayload);
    };
}
module.exports = new UserRepository;
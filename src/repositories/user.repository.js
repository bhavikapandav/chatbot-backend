const { User } = require("../models")

class UserRepository {
    findOne = async (options) => {
        return await User.findOne(options);
    };
    create = async (requestPayload) => {
        console.log("===========", requestPayload);
        return await User.create(requestPayload);
    };
    updateOne = async (where, updatePayload) => {
        return await User.findOneAndUpdate(where, updatePayload, { new: true });
    };
}
module.exports = new UserRepository;
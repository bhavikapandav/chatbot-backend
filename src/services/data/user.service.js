const { UserRepository } = require("../../repositories")
class userService {
    findOne = async (options) => {
        console.log("options============", options);

        return await UserRepository.findOne(options);
    }
    create = async (requestData) => {
        console.log("requestData==========", requestData);

        return await UserRepository.create(requestData);
    };
    updateOne = async (where, requestData) => {
        return await UserRepository.updateOne(where, requestData);
    };
}
module.exports = userService;
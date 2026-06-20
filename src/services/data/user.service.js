const { UserRepository } = require("../../repositories")
class userService {
    findOne = async (options) => {
        return await UserRepository.findOne(options);
    }
    create = async (requestData) => {
        console.log("requestData==========", requestData);

        return await UserRepository.create(requestData);
    };
}
module.exports = userService;
const { UserRoleRepository } = require("../../repositories")
class userRoleService {
    findOne = async (options) => {
        return await UserRoleRepository.findOne(options);
    }
    create = async (requestData) => {
        console.log("requestData==========", requestData);
        return await UserRoleRepository.create(requestData);
    };
    findUserRoleByUserId = async (userId) => {
        console.log("userId==========", userId);

        return await UserRoleRepository.findOne({
            user_fk: userId,
        }, {
            path: "role_fk",
        });
    }
}
module.exports = userRoleService;
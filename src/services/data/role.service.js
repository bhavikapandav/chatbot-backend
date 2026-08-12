const { RoleRepository } = require("../../repositories")
class RoleService {
    findOne = async (options) => {
        return await RoleRepository.findOne(options);
    }
    create = async (requestData) => {
        console.log("requestData==========", requestData);

        return await RoleRepository.create(requestData);
    };
    findRoleBySlug = async (slug) => {
        return await RoleRepository.findOne({
            slug: slug
        })
    };
    findUserRoleByUserId = async (userId) => {
        return await UserRoleRepository.findOne(
            { user_fk: userId },
            "role_fk"
        );
    };


}
module.exports = RoleService;
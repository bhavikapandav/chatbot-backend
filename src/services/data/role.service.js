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
    }

}
module.exports = RoleService;
const { Role } = require("../models")

class RoleRepository {
    findOne = async (options) => {
        return await Role.findOne(options);
    };
    create = async (requestPayload) => {
        console.log("===========", requestPayload);
        return await Role.create(requestPayload);
    };
}
module.exports = new RoleRepository;
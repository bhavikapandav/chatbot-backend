const { Role } = require("../models")

class RoleRepository {
    findOne = async (filter, populate = "") => {
        return await Role.findOne(filter).populate(populate);
    };
    create = async (requestPayload) => {
        console.log("===========", requestPayload);
        return await Role.create(requestPayload);
    };
}
module.exports = new RoleRepository;
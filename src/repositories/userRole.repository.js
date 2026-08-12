const { UserRole } = require("../models")

class UserRoleRepository {
    findOne = async (options, populate = "") => {
        console.log("options===================", options);
        console.log("populate===============", populate);

        let query = UserRole.findOne(options);
        if (populate) {
            query = query.populate(populate);
        }
        return await query;
    };
    create = async (requestPayload) => {
        console.log("===========", requestPayload);
        return await UserRole.create(requestPayload);
    };
}
module.exports = new UserRoleRepository;
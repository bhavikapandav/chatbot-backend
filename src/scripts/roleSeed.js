const { commonUtils: { generateSlug } } = require("../utils")
const { Role } = require("../models")

const seedRole = async () => {
    const roles = [
        "Admin",
        "User"
    ];

    for (let role of roles) {
        await Role.updateOne(
            {
                name: role,
                slug: generateSlug(role)
            },
            {
                $set: {
                    name: role
                }
            },
            {
                upsert: true
            }
        );
    }
}

module.exports = seedRole;

const { User, Role, UserRole } = require("../models");
const bcrypt = require("bcrypt")

const seedAdmin = async () => {
    const adminRole = await Role.findOne({
        slug: "admin"
    }) || await Role.findOne({
        slug: "user"
    });
    console.log("adminRole=======", adminRole);
    
    let admin = await User.findOne({
        email: "bhavikapandav417@gmail.com"
    });

    if (!admin) {
        const password = await bcrypt.hash("Admin@123", 10);
        const userPayload = {
            first_name: "Bhavika",
            last_name: "Admin",
            email: "bhavikapandav417@gmail.com",
            password,
        };
        admin = await User.create(userPayload);
        console.log("user============", admin);
    }

    if (adminRole && admin) {
        const existingUserRole = await UserRole.findOne({
            user_fk: admin._id,
            role_fk: adminRole._id
        });
        if (!existingUserRole) {
            const userRole = await UserRole.create({
                user_fk: admin._id,
                role_fk: adminRole._id
            });
            console.log("userRole============", userRole);
        }
    }

    console.log("Admin Created");
}
module.exports = seedAdmin;
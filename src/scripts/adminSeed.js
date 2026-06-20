const { User, Role, UserRole } = require("../models");
const bcrypt = require("bcrypt")

const seedAdmin = async () => {
    const adminRole = await Role.findOne({
        slug: "user"
    })
    console.log("adminRole=======", adminRole);
    const adminExists = await User.findOne({

        email: "bhavikapandav417@gmail.com"

    });
    if (adminExists) {
        return
    }
    const password = await bcrypt.hash("Admin@123", 10);
    const userPayload = {
        first_name: "Bhavika",
        last_name: "Admin",
        email: "bhavikapandav417@gmail.com",
        password,
    }
    const user = await User.create(userPayload);
    console.log("user============", user);


    const userRole = await UserRole.create({
        user_fk: user._id,
        role_fk: adminRole._id
    })
    console.log("userRole============", userRole);

    console.log("Admin Created");

}
module.exports = seedAdmin;
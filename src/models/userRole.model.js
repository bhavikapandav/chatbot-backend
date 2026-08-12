const mongoose = require("mongoose");


const userRoleSchema = new mongoose.Schema(
    {
        user_fk: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role_fk: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: true
        }
    },
    {
        timestamps: true,
    }
)

const UserRole = mongoose.model("UserRole", userRoleSchema);

module.exports = UserRole;


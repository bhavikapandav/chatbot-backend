const { commonUtils: { isEmpty }, jwtUtils: { verifyToken } } = require("../utils")
const { MessageResponse: m, ApiResponse: { badRequest, failAuthorization } } = require("../responses");
const {
    DataService: { UserService, RoleService, UserRoleService },
} = require("../services");


const roleService = new RoleService();
const userService = new UserService();
const userRoleService = new UserRoleService()

const checkBearerToken = async (req) => {
    const { authorization } = req.headers;
    if (isEmpty(authorization)) {
        return {
            valid: false,
            message: m.authTokenNotFound,
        };
    }
    const parts = authorization.split(" ");
    const token = parts[1];
    const tokenPart = token?.split(".");
    if (
        parts.length != 2 ||
        !/^Bearer$/i.test(parts[0]) ||
        tokenPart.length != 3
    ) {
        return {
            valid: false,
            message: "Token error.",
        };
    }
    try {
        console.log({ token: token });

        const decoded = verifyToken(token);
        console.log({ decoded: decoded });

        req.headers.userDetails = decoded;
        return {
            valid: true,
        }
    } catch (error) {
        return {
            valid: false,
            message: err.message,
        };
    }
}
const checkAuth = async (req, res, next, role) => {
    console.log("=====================");


    const checkAuthToken = await checkBearerToken(req, res);
    console.log({ checkAuthToken: checkAuthToken });

    if (checkAuthToken.valid == true) {
        const { userDetails } = req.headers;
        console.log("userDetails========================", userDetails);
        const { userId, roleId, email } = userDetails;
        const user = await userService.findOne({
            _id: userId,
            email: email,

        });

        console.log("user=========", user);

        if (!user) {
            return res.status(400).send(badRequest());
        }

        const userRole = await userRoleService.findUserRoleByUserId(userId);
        console.log("userRole==============", userRole);

        const checkRole = await roleService.findOne({ _id: userRole.role_fk });
        console.log("checkRole===============", checkRole);

        // if (
        //     isEmpty(userRole) ||
        //     userRole.role.id != roleId ||
        //     !role.includes(userRole.role.name)
        // ) {
        //     return res.status(403).send(forbidden(0, m.permissionDenied, null));
        // }
        next();

    }
    else {
        return res
            .status(401)
            .send(
                failAuthorization(
                    // checkRequestToken.message
                    //     ? checkRequestToken.message
                    checkAuthToken.message
                        ? checkAuthToken.message
                        : "Invalid token.",
                    null,
                    {}
                )
            );
    }
}
const userAuth = async (req, res, next) => {
    return checkAuth(req, res, next, ["User"]);
}

module.exports = {
    userAuth,
};

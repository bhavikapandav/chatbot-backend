// const User = require("../../../models/User.model");
// const jwt = require("jsonwebtoken");

// // Helper to generate JWT token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: "30d",
//   });
// };

// class AuthControllers {
//   // @desc    Register a new user
//   // @route   POST /users/register
//   // @access  Public
//   register = async (req, res) => {
//     try {
//       const { name, email, password } = req.body;

//       if (!name || !email || !password) {
//         return res.status(400).json({
//           success: false,
//           message: "Please fill in all fields (name, email, password)",
//         });
//       }

//       // Check if user already exists
//       const userExists = await User.findOne({ email });
//       if (userExists) {
//         return res.status(400).json({
//           success: false,
//           message: "A user with this email already exists",
//         });
//       }

//       // Create new user in MongoDB
//       const user = await User.create({
//         name,
//         email,
//         password,
//       });

//       return res.status(201).json({
//         success: true,
//         message: "Registration successful",
//         data: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           token: generateToken(user._id),
//         },
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message || "An error occurred during registration",
//       });
//     }
//   };

//   // @desc    Authenticate user & get token
//   // @route   POST /users/login
//   // @access  Public
//   login = async (req, res) => {
//     try {
//       const { email, password } = req.body;

//       if (!email || !password) {
//         return res.status(400).json({
//           success: false,
//           message: "Please provide both email and password",
//         });
//       }

//       // Find user
//       const user = await User.findOne({ email });

//       // Compare password
//       if (user && (await user.matchPassword(password))) {
//         return res.status(200).json({
//           success: true,
//           message: "Login successful",
//           data: {
//             id: user._id,
//             name: user.name,
//             email: user.email,
//             token: generateToken(user._id),
//           },
//         });
//       }

//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message || "An error occurred during login",
//       });
//     }
//   };
// }

// module.exports = new AuthControllers();
const jwt = require("jsonwebtoken");
const { ApiResponse: { successResponse, failConflict, serverError, failAuthorization, badRequest, notFound }, MessageResponse: m } = require("../../../responses")
const { commonUtils: { isEmpty }, jwtUtils: { generateToken }, bcryptUtils: { hashPassword, comparePassword } } = require("../../../utils")
const { DataService: { UserService, RoleService, UserRoleService } } = require("../../../services");
const { User } = require("../../../models");



class AuthController {
  constructor() {
    this.userService = new UserService();
    this.roleService = new RoleService();
    this.userRoleService = new UserRoleService();
  }
  register = async (req) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      console.log("====", req.body);

      const user = await this.userService.findOne({
        email
      })

      if (!isEmpty(user)) {
        return failConflict(0, "user already exist with this email id");
      }
      const userPayload = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        // password: await hashPassword(password)
        password: password
      }
      const adminRole = await this.roleService.findRoleBySlug("user");
      const userDetails = await this.userService.create(userPayload);
      console.log("---------id=======", userDetails._id);

      const userObj = userDetails.toObject();
      console.log("userDetails==============", userDetails);

      delete userDetails.password;
      const userRole = await this.userRoleService.create({
        user_fk: userDetails._id,
        role_fk: adminRole._id
      })

      console.log("userRole============", userRole);

      const tokenPayload = {
        userId: userDetails.id,
        roleId: adminRole.id,
        email: userDetails.email,
      };

      const token = generateToken(tokenPayload);

      return successResponse(1, "user register done", "api", {
        // ...userDetails,
        ...userObj,
        token
      })
    } catch (error) {
      console.log("error=============", error);
      const errMessage = typeof error == "string" ? error : error.message;
      return serverError(0, m.internalServerError, errMessage);
    }
  }

  login = async (req) => {
    try {
      const { email, password } = req.body;

      if (isEmpty(email) || isEmpty(password)) {
        return badRequest("Email and password are required");
      }

      const user = await this.userService.findOne({ email });

      if (isEmpty(user)) {
        return failAuthorization(0, "Invalid email or password");
      }
      const isMatch = await user.comparePassword(password);
      console.log("isMatch=============", isMatch);

      if (!isMatch) {
        return failAuthorization(0, "Invalid email or password");
      }
      // const isMatch = await (password, user.password);
      // if (!isMatch) {
      //   return failAuthorization(0, "Invalid email or password");
      // }

      const userDetails = user.toObject();
      delete userDetails.password;

      const userRole = await this.userRoleService.findUserRoleByUserId(
        userDetails._id
      );
      console.log("userRole----------------", userRole);

      const tokenPayload = {
        userId: userDetails._id,
        roleId: userRole.role_fk._id,
        email: userDetails.email,
      };
      console.log("---------tokenPayload-----", tokenPayload);

      const token = generateToken(tokenPayload);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return successResponse(1, "user login done", "api", {
        ...userDetails,
        token
      });
    } catch (error) {
      console.log(error);

      const errMessage = typeof error == "string" ? error : error.message;
      return serverError(0, m.internalServerError, errMessage);
    }
  }
  userDetails = async (req) => {
    try {
      const { userId } = req.params;

      if (isEmpty(userId)) {
        return badRequest("userId is required");
      }

      const user = await this.userService.findOne({ _id: userId });

      if (isEmpty(user)) {
        return notFound(0, "user not exist");
      }

      const userDetails = user.toObject();
      delete userDetails.password;

      const userRole = await this.userRoleService.findUserRoleByUserId(
        userDetails._id
      );
      console.log("userRole----------------", userRole);

      let role = null;
      if (userRole && userRole.role_fk) {
        role = userRole.role_fk;
      }

      return successResponse(1, "User details retrieved successfully", "api", {
        ...userDetails,
        role
      });
    } catch (error) {
      console.log(error);

      const errMessage = typeof error == "string" ? error : error.message;
      return serverError(0, m.internalServerError, errMessage);
    }
  }
  updateUser = async (req) => {
    try {
      const { userId } = req.params;
      const { firstName, lastName, email, password } = req.body;

      if (isEmpty(userId)) {
        return badRequest("userId is required");
      }

      const user = await this.userService.findOne({ _id: userId });

      if (isEmpty(user)) {
        return notFound(0, "user not exist");
      }

      const updatePayload = {};
      if (!isEmpty(firstName)) updatePayload.first_name = firstName;
      if (!isEmpty(lastName)) updatePayload.last_name = lastName;

      if (!isEmpty(email)) {
        if (email !== user.email) {
          const emailExists = await this.userService.findOne({ email, _id: { $ne: userId } });
          if (!isEmpty(emailExists)) {
            return failConflict(0, "user already exist with this email id");
          }
        }
        updatePayload.email = email;
      }

      if (!isEmpty(password)) {
        updatePayload.password = await hashPassword(password);
      }

      const updatedUser = await this.userService.updateOne({ _id: userId }, updatePayload);

      const userRole = await this.userRoleService.findUserRoleByUserId(userId);

      const userDetails = updatedUser.toObject();
      delete userDetails.password;

      let role = null;
      if (userRole && userRole.role_fk) {
        role = userRole.role_fk;
      }

      return successResponse(1, "User details updated successfully", "api", {
        ...userDetails,
        role
      });
    } catch (error) {
      console.log(error);
      const errMessage = typeof error == "string" ? error : error.message;
      return serverError(0, m.internalServerError, errMessage);
    }
  }
}

module.exports = AuthController
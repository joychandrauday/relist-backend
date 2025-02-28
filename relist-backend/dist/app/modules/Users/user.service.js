"use strict";
// 4.service
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.registeringUserService = void 0;
const AppError_1 = __importDefault(require("../Error/AppError"));
const user_model_1 = require("./user.model");
const http_status_1 = __importDefault(require("http-status"));
// registering user by hashed password
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const auth_utils_1 = require("../Utils/auth.utils");
const registeringUserService = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.userModel.create(newUser);
    return result;
});
exports.registeringUserService = registeringUserService;
// logging in user
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield getSingleUser(payload.email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    //checking if the password is correct
    const isPasswordCorrect = bcrypt_1.default.compare(payload.password, user.password);
    //create token and sent to the  client
    if (!isPasswordCorrect) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid password');
    }
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, parseInt(config_1.default.jwt_access_expires_in, 10));
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, parseInt(config_1.default.jwt_refresh_expires_in, 10));
    return {
        accessToken,
        refreshToken,
    };
});
// refresh token 
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the given token is valid
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { email } = decoded;
    // checking if the user is exist
    const user = yield getSingleUser(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, parseInt(config_1.default.jwt_access_expires_in, 10));
    return {
        accessToken,
    };
});
// get all users
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.userModel.find();
    return users;
});
// edit a user
const editUser = (id, updatedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findByIdAndUpdate(id, updatedUser, { new: true });
    return user;
});
// get single user by email
const getSingleUser = (identifier) => __awaiter(void 0, void 0, void 0, function* () {
    if (!identifier) {
        throw new Error('No identifier provided');
    }
    // Populate 'cart' with 'name' and 'price' fields from the Product model
    const user = yield user_model_1.userModel.findOne({ email: identifier })
        .populate('cart.productId', 'name price featuredImages quantity'); // You can specify more fields if necessary
    return user;
});
// get single user by email
const getSingleUserById = (identifier) => __awaiter(void 0, void 0, void 0, function* () {
    if (!identifier) {
        throw new Error('No identifier provided');
    }
    // Populate 'cart' with 'name' and 'price' fields from the Product model
    const user = yield user_model_1.userModel.findById(identifier)
        .populate('cart.productId', 'name price featuredImages quantity'); // You can specify more fields if necessary
    return user;
});
// de;et user by id
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findByIdAndDelete(id);
    return user;
});
// sending all to controller
exports.userService = {
    registeringUserService: exports.registeringUserService,
    loginUser,
    refreshToken,
    getUsers,
    editUser,
    deleteUser,
    getSingleUser,
    getSingleUserById,
};

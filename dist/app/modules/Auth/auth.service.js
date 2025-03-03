"use strict";
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
exports.authService = exports.refreshToken = exports.loginUser = exports.registeringUserService = void 0;
const user_service_1 = require("../Users/user.service");
const user_model_1 = require("../Users/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const auth_utils_1 = require("../Utils/auth.utils");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../Error/AppError"));
// Registering user service
const registeringUserService = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = newUser;
    // Check if the user already exists
    const existingUser = yield user_service_1.userService.getSingleUserById(email);
    if (existingUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already exists with this email");
    }
    // Hash the password
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    // Create new user object
    const userData = {
        name,
        email,
        password: hashedPassword,
        role: "user",
        status: "active",
        avatar: "",
    };
    // Save user in DB
    const user = yield user_model_1.userModel.create(userData);
    return user;
});
exports.registeringUserService = registeringUserService;
// Logging in user
const loginUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    const user = yield user_service_1.userService.getSingleUserById(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Checking if the password is correct
    const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid password");
    }
    const jwtPayload = {
        email: user.email,
        role: user.role,
        id: user._id,
        avatar: user.avatar,
        name: user.name,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
exports.loginUser = loginUser;
// Refresh access token using refresh token
const refreshToken = (authorization) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify if the provided refresh token is valid
    const decoded = (0, auth_utils_1.verifyJwtToken)(authorization, config_1.default.jwt_refresh_secret);
    const { email } = decoded;
    // Check if the user exists
    const user = yield user_service_1.userService.getSingleUser(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Check if the user is blocked
    if (user.status === "blocked") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User is blocked");
    }
    const jwtPayload = {
        email: user.email,
        role: user.role,
        id: user._id,
        avatar: user.avatar,
        name: user.name,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, parseInt(config_1.default.jwt_access_expires_in, 10));
    return {
        accessToken,
    };
});
exports.refreshToken = refreshToken;
exports.authService = {
    registeringUserService: exports.registeringUserService,
    loginUser: exports.loginUser,
    refreshToken: exports.refreshToken,
};

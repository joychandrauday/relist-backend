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
exports.authController = void 0;
const sendResponse_1 = __importDefault(require("../Utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../Utils/catchAsync"));
const auth_service_1 = require("./auth.service");
const config_1 = __importDefault(require("../../config"));
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../Error/AppError"));
// Registering user by hashed password using userService
const registeringUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        // Call service function
        const user = yield auth_service_1.authService.registeringUserService({ name, email, password });
        // Send success response
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            success: true,
            message: "User created successfully",
            data: user,
        });
    }
    catch (error) {
        next(error); // Pass error to global error handler
    }
}));
// Logging in user
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const result = yield auth_service_1.authService.loginUser({ email, password });
    const { accessToken, refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
        secure: config_1.default.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User logged in successfully!",
        data: {
            accessToken,
            refreshToken,
        },
    });
}));
// Logout user by blocking refresh token (clear cookie)
const logoutUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("refreshToken");
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User logged out successfully!",
        data: {}
    });
}));
// Refresh access token using refresh token
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Refresh token is required');
    }
    const result = yield auth_service_1.authService.refreshToken(authorization);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Access token refreshed successfully!",
        data: {
            accessToken: result.accessToken,
        },
    });
}));
exports.authController = {
    registeringUser,
    loginUser,
    logoutUser,
    refreshToken,
};

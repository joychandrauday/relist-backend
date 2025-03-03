"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../Error/AppError"));
const config_1 = __importDefault(require("../../config"));
const user_service_1 = require("../Users/user.service");
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Authorization token is required');
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(authorization, config_1.default.jwt_access_secret);
            const { email } = decoded;
            const user = yield user_service_1.userService.getSingleUserById(email);
            if (!user) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'This user is not found!');
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                return next(new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Token has expired! Please login again.'));
            }
            return next(new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid token!'));
        }
    }
    catch (error) {
        next(error);
    }
});
exports.verifyToken = verifyToken;

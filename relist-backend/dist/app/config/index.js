"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load the .env file
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
exports.default = {
    port: process.env.PORT || 3000, // Default to 3000 if not specified
    database_url: process.env.DB_URL, // Make sure DB_URL is in your .env file
    jwt_access_secret: process.env.JWT_SECRET, // Make sure DB_URL is in your .env file
    jwt_access_expires_in: process.env.JWT_EXPIRY, // Make sure DB_URL is in your .env file
    jwt_refresh_secret: process.env.JWT_REFRESH_EXPIRY, // Make sure DB_URL is in your .env file
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRY, // Make sure DB_URL is in your .env file
    sp_endpoint: process.env.SP_ENDPOINT, // Make sure DB_URL is in your .env file
    sp_username: process.env.SP_USERNAME, // Make sure DB_URL is in your .env file
    sp_password: process.env.SP_PASSWORD, // Make sure DB_URL is in your .env file
    sp_prefix: process.env.SP_PREFIX, // Make sure DB_URL is in your .env file
    return_url: process.env.SP_RETURN_URL, // Make sure DB_URL is in your .env file
    cancel_url: process.env.SP_CANCEL_URL,
};

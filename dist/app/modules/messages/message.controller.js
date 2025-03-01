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
exports.messageController = void 0;
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../Utils/sendResponse"));
const message_service_1 = __importDefault(require("./message.service"));
const authMiddleware_1 = require("../Utils/authMiddleware");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageData = req.body;
        const newMessage = yield message_service_1.default.sendMessage(messageData);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            success: true,
            message: 'Message sent successfully',
            data: newMessage
        });
    }
    catch (error) {
        let errorMessage = 'Failed to send message';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
});
const getUserMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const messages = yield message_service_1.default.getUserMessages(userId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Messages retrieved successfully',
            data: messages
        });
    }
    catch (error) {
        let errorMessage = 'Failed to retrieve message';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
});
exports.messageController = {
    getUserMessages: [authMiddleware_1.verifyToken, getUserMessages],
    sendMessage: [authMiddleware_1.verifyToken, sendMessage]
};

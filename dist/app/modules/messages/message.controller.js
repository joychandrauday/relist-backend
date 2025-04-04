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
const user_service_1 = require("../Users/user.service");
const user_model_1 = require("../Users/user.model");
const sendEmailFunc_1 = require("../Utils/sendEmailFunc");
const getUserSidebarController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, search } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        let query = { _id: { $ne: userId } };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        const filteredUsers = yield user_model_1.userModel.find(query).select("-password -wishlist");
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "Users retrieved successfully",
            data: filteredUsers,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: error instanceof Error ? error.message : "Failed to retrieve users",
            data: {},
        });
    }
});
const getUserSidebarSingleController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body; // Extract from body
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const User = yield user_service_1.userService.getSingleUser(userId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "Users retrieved successfully",
            data: User,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: error instanceof Error ? error.message : "Failed to retrieve users",
            data: {},
        });
    }
});
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageData = req.body;
        // Send email to the receiver
        const newMessage = yield message_service_1.default.sendMessage(messageData);
        const { receiverID, message } = newMessage;
        const receiver = yield user_service_1.userService.getSingleUser(receiverID.toString());
        if (!receiver)
            return;
        const receiverEmail = receiver.email;
        // Send email to the receiver
        const emailSubject = 'You have a new message!';
        const emailBody = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                color: #333;
                margin: 0;
                padding: 0;
              }
              .email-container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
              }
              .header {
                background-color: #FB8600;
                color: #fff;
                padding: 10px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .content {
                padding: 20px;
                font-size: 16px;
              }
              .footer {
                text-align: center;
                font-size: 14px;
                color: #666;
                margin-top: 20px;
              }
              .footer a {
                color: #2a9d8f;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h2>RE-LIST - Second Hand Marketplace</h2>
              </div>
              <div class="content">
                <p>Hi there,</p>
                <p>You have received a new message regarding an item on RE-LIST: <strong>"${message}"</strong></p>
                <p>Please visit <a href="https://relistshop.vercel.app/">our platform</a> to check out more details and respond accordingly.</p>
                <p>Thank you for being a part of RE-LIST!</p>
              </div>
              <div class="footer">
                <p>If you have any questions, feel free to contact us at <a href="mailto:joychandraud@gmail.com">joychandraud@gmail.com</a></p>
              </div>
            </div>
          </body>
        </html>
      `;
        yield (0, sendEmailFunc_1.sendEmail)(receiverEmail, emailSubject, emailBody);
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
        const { userId, recieverId } = req.params;
        const messages = yield message_service_1.default.getUserMessages(userId, recieverId);
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
    getUserMessages,
    sendMessage,
    getUserSidebarController,
    getUserSidebarSingleController
};

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
exports.NewsLetterController = void 0;
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../Utils/sendResponse"));
const newsletter_service_1 = require("./newsletter.service");
const sendEmailFunc_1 = require("../Utils/sendEmailFunc");
const addNewsLetter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const NewsLetterData = req.body;
        const newMessage = yield newsletter_service_1.NewsLetterService.addNewsLetter(NewsLetterData);
        const receiverEmail = NewsLetterData.email;
        // Send email to the receiver
        const emailSubject = "Subscription Successful";
        const emailBody = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Successful</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #FC8702;
            color: white;
            text-align: center;
            padding: 20px;
        }
        .header img {
            width: 150px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content h2 {
            color: #1F2937;
        }
        .content p {
            font-size: 16px;
            color: #333333;
        }
        .button {
            display: inline-block;
            padding: 12px 20px;
            background-color: #FF6E61;
            color: #fff !important;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            padding: 15px;
            background-color: #FC8702;
            color: white;
            font-size: 14px;
        }
        .footer a {
            color: #FF6E61;
            text-decoration: none;
        }
    </style>
</head>
<body>

    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <h2>RE-LIST - Second Hand Marketplace</h2>
        </div>

        <!-- Content Section -->
        <div class="content">
            <h2>Subscription Successful! 🎉</h2>
            <p>Thank you for subscribing to our newsletter! You will now receive the latest updates, exclusive deals, and insights directly in your inbox.</p>
            <a href="https://relistshop.vercel.app" class="button">Explore More</a>
        </div>

        <!-- Footer Section -->
        <div class="footer">
            &copy; 2024 RE-LIST. All rights reserved. <br>
            <a href="https://relistshop.vercel.app/unsubscribe">Unsubscribe</a>
        </div>
    </div>

</body>
</html>

        
        `;
        if (newMessage) {
            yield (0, sendEmailFunc_1.sendEmail)(receiverEmail, emailSubject, emailBody);
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            success: true,
            message: 'NewsLetter added successfully',
            data: newMessage
        });
    }
    catch (error) {
        let errorMessage = 'Failed to added NewsLetter';
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
const getNewsLetterAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield newsletter_service_1.NewsLetterService.getNewsLetter();
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'NewsLetter retrieved successfully',
            data: messages
        });
    }
    catch (error) {
        let errorMessage = 'Failed to retrieve NewsLetter';
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
const getNewsLetterEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = yield newsletter_service_1.NewsLetterService.getNewsLetterByEmail(req.params.email);
        console.log(userEmail);
        if (!userEmail.length) {
            (0, sendResponse_1.default)(res, {
                statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                success: false,
                message: 'NewsLetter Not Found',
                data: {}
            });
            return;
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'NewsLetter retrieved successfully',
            data: userEmail
        });
    }
    catch (error) {
        let errorMessage = 'Failed to retrieve NewsLetter';
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
// deleting NewsLetter using delete method
const deleteNewsLetter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.params.email;
        yield newsletter_service_1.NewsLetterService.deleteNewsLetter(email);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'NewsLetter deleted successfully',
            data: {}
        });
    }
    catch (error) {
        let errorMessage = 'Failed to delete NewsLetter';
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
const sendNewsLetterToAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subject, body } = req.body;
        if (!subject || !body) {
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                success: false,
                message: 'Subject and body are required!',
                data: {}
            });
        }
        const result = yield newsletter_service_1.NewsLetterService.sendNewsletterToAll(subject, body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: result.message,
            data: {}
        });
    }
    catch (error) {
        let errorMessage = 'Failed to send newsletter';
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
exports.NewsLetterController = {
    addNewsLetter,
    getNewsLetterAll,
    getNewsLetterEmail,
    deleteNewsLetter,
    sendNewsLetterToAll
};

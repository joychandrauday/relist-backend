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
exports.NewsLetterService = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const sendEmailFunc_1 = require("../Utils/sendEmailFunc");
const newsletter_model_1 = __importDefault(require("./newsletter.model"));
const addNewsLetter = (newsLetter) => __awaiter(void 0, void 0, void 0, function* () {
    return yield newsletter_model_1.default.create(newsLetter);
});
const getNewsLetter = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield newsletter_model_1.default.find();
});
const getNewsLetterByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield newsletter_model_1.default.find({ email: email });
});
const deleteNewsLetter = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield newsletter_model_1.default.findOneAndDelete({ email });
});
const sendNewsletterToAll = (subject, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscribers = yield newsletter_model_1.default.find({}, 'email');
        if (!subscribers.length) {
            throw new Error("No subscribers found.");
        }
        const emailPromises = subscribers.map(subscriber => {
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
                        <p>${subject}</p>
                    </div>
                    <div class="content">
                        <p>Hi there,</p>
                        <p>${body}</p>
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
            // Call sendEmail function to send the email to each subscriber
            return (0, sendEmailFunc_1.sendEmail)(subscriber.email, subject, emailBody);
        });
        yield Promise.all(emailPromises); // Send emails in parallel
        return { success: true, message: 'Newsletter sent successfully to all users' };
    }
    catch (error) {
        throw new Error('Failed to send newsletter ');
    }
});
exports.NewsLetterService = {
    addNewsLetter,
    getNewsLetter,
    getNewsLetterByEmail,
    deleteNewsLetter,
    sendNewsletterToAll
};

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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Setup the nodemailer transporter (you can use your email service here)
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    auth: {
        user: 'joychandraud@gmail.com',
        pass: 'mkhc ubfy nhwu ituu',
    }
});
// Function to send an email
const sendEmail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to, // Receiver's email address
        subject, // Subject line
        html, // HTML message body
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
});
exports.sendEmail = sendEmail;

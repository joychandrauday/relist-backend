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
exports.paymentController = void 0;
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
// ✅ Create a new payment
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paymentInfo } = req.body;
        const transactionId = crypto_1.default.randomBytes(10).toString('hex');
        const initiateData = {
            store_id: process.env.SSL_STORE_ID || '',
            store_passwd: process.env.SSL_STORE_PASS || '',
            total_amount: paymentInfo.amount || '5000',
            currency: 'BDT',
            tran_id: transactionId,
            success_url: `${process.env.SERVER_URL}/api/v1/payments/success`,
            fail_url: `${process.env.SERVER_URL}/api/v1/payments/fail`,
            cancel_url: `${process.env.SERVER_URL}/api/v1/payments/cancel`,
            cus_name: paymentInfo.name,
            cus_email: paymentInfo.email || 'premiumSubscription@mail.com',
            cus_add1: paymentInfo.address || 'Dhaka',
            cus_city: paymentInfo.city || 'Dhaka',
            cus_country: 'Bangladesh',
            cus_phone: paymentInfo.phone || '01711111111',
            shipping_method: 'NO',
            product_name: 'premiumSubscription',
            product_category: 'Subscription',
            product_profile: 'General',
            multi_card_name: 'mastercard,visacard,amexcard',
        };
        // Send request to SSLCommerz API
        const response = yield axios_1.default.post('https://sandbox.sslcommerz.com/gwprocess/v4/api.php', new URLSearchParams(initiateData).toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        if (response.status === 200) {
            res.status(200).json({
                message: 'Payment processed successfully',
                status: true,
                data: response.data.GatewayPageURL,
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: 'Payment initiation failed',
                data: response.data,
            });
        }
    }
    catch (error) {
        console.error('Error during payment initiation:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing the payment request',
            error: error.message || error,
        });
    }
});
// ✅ Handle successful payment
const successPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({
            message: 'Payment successful',
            status: true,
            data: req.body,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error processing successful payment',
            error: error.message || error,
        });
    }
});
// ✅ Handle failed payment
const failPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(400).json({
            success: false,
            message: 'Payment failed',
            data: req.body,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing failed payment',
            error: error.message || error,
        });
    }
});
// ✅ Handle canceled payment
const cancelPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({
            message: 'Payment canceled successfully',
            status: true,
            data: req.body,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing canceled payment',
            error: error.message || error,
        });
    }
});
// ✅ Export payment controller
exports.paymentController = {
    createPayment,
    successPayment,
    failPayment,
    cancelPayment,
};

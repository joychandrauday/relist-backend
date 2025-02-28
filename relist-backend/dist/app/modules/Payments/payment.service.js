"use strict";
// 4.payment.service
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
const payment_model_1 = require("./payment.model");
// Create a new payment
const addPaymentToDB = (payment) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_model_1.paymentModel.create(payment);
    return result;
});
// Retrieve all payments
const getPayments = () => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield payment_model_1.paymentModel.find();
    return payments;
});
// Get a single payment by ID
const getPaymentById = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.paymentModel.findById(paymentId).populate('user', 'name email');
    return payment;
});
// Update payment status
// Export all functions
exports.paymentService = {
    addPaymentToDB,
    getPayments,
    getPaymentById,
};

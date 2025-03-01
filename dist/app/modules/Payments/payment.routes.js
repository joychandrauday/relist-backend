"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const router = express_1.default.Router();
// ✅ Route to create a new payment
router.post('/create-payment', payment_controller_1.paymentController.createPayment);
// ✅ Route to handle successful payment
router.post('/success-payment', payment_controller_1.paymentController.successPayment);
// ✅ Route to handle failed payment
router.post('/fail-payment', payment_controller_1.paymentController.failPayment);
// ✅ Route to handle canceled payment
router.post('/cancel-payment', payment_controller_1.paymentController.cancelPayment);
exports.paymentRoutes = router;

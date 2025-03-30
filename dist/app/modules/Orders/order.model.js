"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderModel = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            productId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Listing', required: true }, // reference to the product
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            totalPrice: { type: Number, required: true },
        },
    ],
    amount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    paymentStatus: {
        type: String,
        required: true,
        default: 'Pending',
    },
    orderStatus: {
        type: String,
        required: true,
    },
    orderDate: { type: Date, default: Date.now },
    estimatedDeliveryDate: { type: Date, required: false },
    transaction: {
        id: String,
        code: Number,
        message: String,
        status: String,
        method: String,
        bank_status: String,
        date_time: String,
    },
}, { timestamps: true });
exports.orderModel = (0, mongoose_1.model)('Order', orderSchema);

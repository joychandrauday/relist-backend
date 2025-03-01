"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentModel = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who made the payment
    trx_id: { type: String, required: true, unique: true }, // Unique transaction ID
    orderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true }, // Payment amount
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Cancelled'],
        required: true,
        default: 'Pending',
    }, // Payment status
    date: { type: Date, default: Date.now }, // Payment date
}, { timestamps: true } // Automatically adds createdAt and updatedAt fields
);
exports.paymentModel = (0, mongoose_1.model)('Payment', paymentSchema);

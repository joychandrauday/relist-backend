"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionModel = void 0;
const mongoose_1 = require("mongoose");
// single product schema
const transactionSchema = new mongoose_1.Schema({
    buyerID: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerID: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User', required: true
        }],
    itemID: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Listing', required: true
        }],
    orderID: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order', required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true });
exports.transactionModel = (0, mongoose_1.model)('Transaction', transactionSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingModel = void 0;
const mongoose_1 = require("mongoose");
// single product schema
const listingSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ['available', 'sold'],
        default: 'available',
    },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    userID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    condition: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.listingModel = (0, mongoose_1.model)('Listing', listingSchema);

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.listingModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const flashSale_model_1 = require("../flashSell/flashSale.model");
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
    userID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    category: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Category', required: true },
    condition: {
        type: String,
        required: true,
        enum: ['Brand New', 'Like New', 'Excellent', 'Very Good', 'Good', 'Fair', 'Refurbished', 'For Parts / Not Working'],
    },
    location: {
        city: { type: String, required: true },
        state: { type: String }, // optional
        country: { type: String, required: true },
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    offerPrice: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
listingSchema.methods.calculateOfferPrice = function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Running calculateOfferPrice for listing: ${this._id}`);
        const flashSale = yield flashSale_model_1.FlashSale.findOne({ product: this._id });
        console.log("Found Flash Sale:", flashSale);
        if (flashSale) {
            const discount = (flashSale.discountPercentage / 100) * this.price;
            this.offerPrice = this.price - discount;
            yield this.save();
            return this.offerPrice;
        }
        return null;
    });
};
exports.listingModel = (0, mongoose_1.model)('Listing', listingSchema);

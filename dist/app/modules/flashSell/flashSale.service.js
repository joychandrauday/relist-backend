"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.FlashSaleService = void 0;
const flashSale_model_1 = require("./flashSale.model");
const QueryBuilder_1 = __importDefault(require("../Utils/QueryBuilder"));
const listing_model_1 = require("../listings/listing.model");
const createFlashSale = (flashSellData, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { products, discountPercentage } = flashSellData;
    const createdBy = authUser.userId;
    const operations = products.map((product) => ({
        updateOne: {
            filter: { product },
            update: {
                $setOnInsert: {
                    product,
                    discountPercentage,
                    createdBy,
                },
            },
            upsert: true,
        },
    }));
    const result = yield flashSale_model_1.FlashSale.bulkWrite(operations);
    // ✅ Ensure each product updates its offerPrice
    yield Promise.all(products.map((productId) => __awaiter(void 0, void 0, void 0, function* () {
        const listing = yield listing_model_1.listingModel.findById(productId);
        if (listing) {
            const newOfferPrice = yield listing.calculateOfferPrice();
            if (newOfferPrice !== null) {
                yield listing_model_1.listingModel.updateOne({ _id: productId }, { $set: { offerPrice: newOfferPrice } });
            }
        }
    })));
    return result;
});
const getActiveFlashSalesService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const flashSaleQuery = new QueryBuilder_1.default(flashSale_model_1.FlashSale.find()
        .populate({
        path: 'product',
        select: 'title price offerPrice images price status quantity', // ✅ Include offerPrice
    }), query).paginate();
    const flashSales = yield flashSaleQuery.modelQuery.lean();
    const productsWithOfferPrice = yield Promise.all(flashSales.map((flashSale) => __awaiter(void 0, void 0, void 0, function* () {
        const product = flashSale.product;
        const discountPercentage = flashSale.discountPercentage;
        if (discountPercentage) {
            const discount = (discountPercentage / 100) * product.price;
            product.offerPrice = product.price - discount;
            // ✅ Ensure offerPrice updates in DB
            yield listing_model_1.listingModel.updateOne({ _id: product._id }, { $set: { offerPrice: product.offerPrice } });
        }
        return product;
    })));
    const meta = yield flashSaleQuery.countTotal();
    return {
        meta,
        result: productsWithOfferPrice,
    };
});
const removeFromFlashSale = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Remove the product from FlashSale
    const flashSale = yield flashSale_model_1.FlashSale.findOneAndDelete({ product: productId });
    if (!flashSale) {
        throw new Error("Product not found in Flash Sale");
    }
    // Step 2: Reset the offerPrice in the Listing model
    yield listing_model_1.listingModel.updateOne({ _id: productId }, { $set: { offerPrice: 0 } });
    return { message: "Product removed from Flash Sale and offer price reset" };
});
exports.FlashSaleService = {
    createFlashSale,
    getActiveFlashSalesService,
    removeFromFlashSale
};

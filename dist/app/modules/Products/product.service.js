"use strict";
// 4. Service
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
exports.productService = void 0;
const product_model_1 = require("./product.model");
const addProductToDB = (product) => __awaiter(void 0, void 0, void 0, function* () {
    // Push new product to the database
    const result = yield product_model_1.productModel.create(product);
    return result;
});
// Assuming you're using Mongoose for MongoDB
const getAllProducts = (filter, skip, limit, sort) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch products based on filter, skip, and limit: Record<string, any>
        const products = yield product_model_1.productModel.find(filter) // Apply filter
            .skip(skip) // Skip the number of products based on pagination
            .limit(limit) // Limit the number of products per page
            .sort(sort) // Sort the results based on sort criteria
            .exec(); // Execute the query
        return products;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error("Error fetching products: " + error.message);
        }
        else {
            throw new Error("Error fetching products: " + String(error));
        }
    }
});
const getTotalCount = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalCount = yield product_model_1.productModel.countDocuments(filter); // Count products based on the filter
        return totalCount;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error("Error fetching products: " + error.message);
        }
        else {
            throw new Error("Error fetching products: " + String(error));
        }
    }
});
const getSingleProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve a single product from the database by ID
    const product = yield product_model_1.productModel.findById(id).populate('reviews.userId', 'name avatar');
    return product;
});
const updateProductInDB = (id, updatedProduct) => __awaiter(void 0, void 0, void 0, function* () {
    // Update a product in the database by ID
    const result = yield product_model_1.productModel.findByIdAndUpdate(id, updatedProduct, { new: true });
    return result;
});
const deleteProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete a product from the database by ID
    const result = yield product_model_1.productModel.findByIdAndDelete(id);
    return result;
});
exports.productService = {
    addProductToDB,
    getAllProducts,
    getSingleProduct,
    updateProductInDB,
    deleteProductFromDB,
    getTotalCount
};

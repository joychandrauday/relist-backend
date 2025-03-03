"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// services/listingService.ts
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
exports.listingService = void 0;
const listing_model_1 = require("./listing.model");
const createListingService = (listingData) => __awaiter(void 0, void 0, void 0, function* () {
    const newListing = new listing_model_1.listingModel(listingData);
    return yield newListing.save();
});
const getAllListingsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { minPrice, maxPrice, search, status, page = 1, limit } = query;
    const filters = {};
    if (status) {
        filters.status = status;
    }
    if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) {
            filters.price.$gte = Number(minPrice);
        }
        if (maxPrice) {
            filters.price.$lte = Number(maxPrice);
        }
    }
    if (search) {
        const searchRegex = new RegExp(search, "i"); // Case-insensitive search
        filters.$or = [
            { title: searchRegex },
            { description: searchRegex }
        ];
    }
    // Pagination setup
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 10;
    const skip = (pageNumber - 1) * limitNumber;
    const totalListings = yield listing_model_1.listingModel.countDocuments(filters).populate('userID', 'name avatar email _id');
    const listingsQuery = listing_model_1.listingModel.find(filters);
    if (limitNumber > 0) {
        listingsQuery.skip(skip).limit(limitNumber);
    }
    const listings = yield listingsQuery;
    const meta = {
        total: totalListings,
        page: pageNumber,
        limit: limitNumber > 0 ? limitNumber : totalListings,
        totalPages: limitNumber > 0 ? Math.ceil(totalListings / limitNumber) : 1,
    };
    return { listings, meta };
});
const getListingByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield listing_model_1.listingModel.findById(id);
});
const updateListingService = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield listing_model_1.listingModel.findByIdAndUpdate(id, updateData, { new: true });
});
const deleteListingService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield listing_model_1.listingModel.findByIdAndDelete(id);
});
// get listing by user email
const getListingByUserIdService = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { minPrice, maxPrice, search, status, page = 1, limit } = query;
    const filters = { userID: userId }; // First filter by userId
    if (status) {
        filters.status = status;
    }
    if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice)
            filters.price.$gte = Number(minPrice);
        if (maxPrice)
            filters.price.$lte = Number(maxPrice);
    }
    if (search) {
        const searchRegex = new RegExp(search, "i"); // Case-insensitive search
        filters.$or = [{ title: searchRegex }, { description: searchRegex }];
    }
    // Pagination setup
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = limit ? Number(limit) : 10;
    const skip = (pageNumber - 1) * limitNumber;
    const totalListings = yield listing_model_1.listingModel.countDocuments(filters);
    const listingsQuery = listing_model_1.listingModel.find(filters).populate('userID', 'name avatar email _id');
    if (limitNumber > 0) {
        listingsQuery.skip(skip).limit(limitNumber);
    }
    const listings = yield listingsQuery;
    const meta = {
        total: totalListings,
        page: pageNumber,
        limit: limitNumber > 0 ? limitNumber : totalListings,
        totalPages: limitNumber > 0 ? Math.ceil(totalListings / limitNumber) : 1,
    };
    return { listings, meta };
});
exports.listingService = {
    createListingService,
    getAllListingsService,
    getListingByIdService,
    updateListingService,
    deleteListingService,
    getListingByUserIdService
};

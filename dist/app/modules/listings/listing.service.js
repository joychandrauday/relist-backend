"use strict";
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
const getAllListingsService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield listing_model_1.listingModel.find({ status: 'available' });
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
const getListingByUserIdService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield listing_model_1.listingModel.find({ userID: userId });
});
exports.listingService = {
    createListingService,
    getAllListingsService,
    getListingByIdService,
    updateListingService,
    deleteListingService,
    getListingByUserIdService
};

"use strict";
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
exports.listingController = void 0;
const listing_service_1 = require("./listing.service");
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../Utils/sendResponse"));
const AppError_1 = __importDefault(require("../Error/AppError"));
const authMiddleware_1 = require("../Utils/authMiddleware");
const user_service_1 = require("../Users/user.service");
// 1. Add a new listing to the database
const addingListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listing = req.body;
        if (!req.user) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        const userdb = yield user_service_1.userService.getSingleUser(req.user.email);
        if (!userdb) {
            throw new Error("Unauthorized request");
        }
        listing.userID = userdb._id;
        // Create the listing with the added userId
        const newListing = yield listing_service_1.listingService.createListingService(listing);
        // Send response
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            success: true,
            message: 'Listing added successfully',
            data: newListing
        });
    }
    catch (error) {
        let errorMessage = "Failed to add listing";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
});
// 2. Get all listings from the database
const gettingListings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listings = yield listing_service_1.listingService.getAllListingsService();
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Listings retrieved successfully',
            data: listings
        });
    }
    catch (error) {
        let errorMessage = 'Failed to retrieve listings';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
});
// 3. Get a single listing from the database
const gettingListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listingId = req.params.listingId;
        const listing = yield listing_service_1.listingService.getListingByIdService(listingId);
        if (!listing) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Listing not found');
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Listing retrieved successfully',
            data: listing
        });
    }
    catch (error) {
        let errorMessage = 'Failed to retrieve listing';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
});
// 4. Update a listing
const updatingListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listingId = req.params.listingId;
        // Fetch the existing listing
        const existingListing = yield listing_service_1.listingService.getListingByIdService(listingId);
        if (!existingListing) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Listing not found');
        }
        if (!req.user) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        // Fetch user details
        const user = yield user_service_1.userService.getSingleUser(req.user.email);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        // Ensure the user is authorized to update the listing
        if (existingListing.userID.toString() !== user._id.toString()) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'You are not authorized to update this listing');
        }
        // Update the listing
        const updatedListing = req.body;
        const updatedListingData = yield listing_service_1.listingService.updateListingService(listingId, updatedListing);
        // Send success response
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Listing updated successfully',
            data: updatedListingData
        });
    }
    catch (error) {
        let errorMessage = 'Failed to update listing';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
});
// 5. Delete a listing from the database
const deletingListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listingId = req.params.listingId;
        // Fetch the existing listing
        const existingListing = yield listing_service_1.listingService.getListingByIdService(listingId);
        if (!existingListing) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Listing not found');
        }
        if (!req.user) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        // Fetch user details
        const user = yield user_service_1.userService.getSingleUser(req.user.email);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'user not found');
        }
        console.log(existingListing.userID.toString(), user._id.toString(), user.email);
        // Ensure the user is authorized to update the listing
        if (existingListing.userID.toString() !== user._id.toString()) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'You are not authorized to update this listing');
        }
        const deletedListing = yield listing_service_1.listingService.deleteListingService(listingId);
        if (!deletedListing) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Listing not found');
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Listing deleted successfully',
            data: {}
        });
    }
    catch (error) {
        let errorMessage = 'Failed to delete listing';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
});
// 6. get listings by user email
const gettingListingsByUserEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        const userEmail = req.user.email;
        const user = yield user_service_1.userService.getSingleUserById(userEmail);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        const listings = yield listing_service_1.listingService.getListingByUserIdService(user._id.toString());
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Listings retrieved successfully',
            data: listings
        });
    }
    catch (error) {
        let errorMessage = 'Failed to retrieve listings';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
});
// Applying the verifyToken middleware to protect routes that need authentication
exports.listingController = {
    addingListing: [authMiddleware_1.verifyToken, addingListing],
    gettingListings: [gettingListings],
    gettingListing,
    updatingListing: [authMiddleware_1.verifyToken, updatingListing],
    deletingListing: [authMiddleware_1.verifyToken, deletingListing],
    gettingListingsByUserEmail: [authMiddleware_1.verifyToken, gettingListingsByUserEmail]
};

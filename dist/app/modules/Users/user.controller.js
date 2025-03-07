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
exports.userController = void 0;
const sendResponse_1 = __importDefault(require("../Utils/sendResponse"));
const user_service_1 = require("./user.service");
// getting user from database
const gettingUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Save the new user to the database
        const user = yield user_service_1.userService.getUsers(req.query);
        // Send success response
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: 'User retrive successfully',
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
//get single user
const gettingSingleUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield user_service_1.userService.getSingleUser(userId);
        // Send success response
        res.status(200).json({
            message: 'User retrieved successfully',
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
//get single user
const gettingSingleUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield user_service_1.userService.getSingleUserById(userId);
        // Send success response
        res.status(200).json({
            message: 'User retrieved successfully',
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const updatedData = req.body;
        const updatedUser = yield user_service_1.userService.editUser(userId, updatedData);
        if (!updatedUser) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: 'User not found!',
                data: null,
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'User updated successfully!',
            data: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
});
// delete user
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const deletedUser = yield user_service_1.userService.deleteUser(userId);
        if (!deletedUser) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: 'User not found!',
                data: null,
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'User deleted successfully!',
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
const addToWishlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const listingId = req.body.listingId;
        console.log(userId, listingId);
        // Add the listing to the user's wishlist
        const updatedUser = yield user_service_1.userService.addItemToWishlist(userId, listingId);
        if (!updatedUser) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: 'User not found or Listing not found!',
                data: null,
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Item added to wishlist successfully!',
            data: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
});
// Remove item from wishlist
const removeFromWishlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const listingId = req.body.listingId;
        // Remove the listing from the user's wishlist
        const updatedUser = yield user_service_1.userService.removeItemFromWishlist(userId, listingId);
        if (!updatedUser) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: 'User or Listing not found!',
                data: null,
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Item removed from wishlist successfully!',
            data: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
});
// sending to routes
exports.userController = {
    updateUser,
    gettingUsers,
    gettingSingleUser,
    gettingSingleUserById,
    deleteUser,
    addToWishlist,
    removeFromWishlist,
};
